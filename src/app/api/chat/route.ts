import { streamText } from 'ai';
import { z } from 'zod';
import { getModel } from '@/lib/ai/provider';
import { MODELS, calculateCost } from '@/lib/ai/models';
import { checkUsageLimit, logUsage } from '@/lib/ai/usage';
import { reportUsageToStripe } from '@/lib/billing/usage-reporting';
import { DEFAULT_SYSTEM_PROMPT } from '@/lib/ai/prompts';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/db';
import { conversations, messages } from '@/db/schema';
import { and, eq, sql } from 'drizzle-orm';

/** AI SDK sends the active chat id as `id`; we also accept `conversationId` in the body. */
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function resolveConversationId(
  conversationId: string | null | undefined,
  requestId: string | undefined,
): string | null {
  if (conversationId) return conversationId;
  if (requestId && UUID_RE.test(requestId)) return requestId;
  return null;
}

// Zod schema for request validation
// AI SDK v4 sends messages as { role, parts: [{ type, text }] } with optional content
const chatRequestSchema = z.object({
  id: z.string().optional(),
  messages: z.array(
    z.object({
      id: z.string().optional(),
      role: z.enum(['user', 'assistant', 'system']),
      content: z.string().optional(),
      parts: z
        .array(
          z.object({
            type: z.string(),
            text: z.string().optional(),
          }),
        )
        .optional(),
    }),
  ),
  conversationId: z.string().uuid().nullable().optional(),
  model: z.string().optional(),
  trigger: z.string().optional(),
});

/** Extract plain text content from an AI SDK message */
function getMessageContent(msg: { content?: string; parts?: { type: string; text?: string }[] }): string {
  if (msg.content) return msg.content;
  if (msg.parts) {
    return msg.parts
      .filter((p) => p.type === 'text' && p.text)
      .map((p) => p.text!)
      .join('');
  }
  return '';
}

export async function POST(req: Request) {
  try {
    // 1. Auth check
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse and validate request
    const body = await req.json();
    const parsed = chatRequestSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { messages: userMessages, conversationId, model: requestedModel, id: requestChatId } =
      parsed.data;
    const modelId = requestedModel || process.env.AI_MODEL || MODELS.GPT_4O_MINI;

    // 3. Check usage limits
    const usageCheck = await checkUsageLimit(user.id);
    if (!usageCheck.allowed) {
      return Response.json(
        {
          error: 'Daily token limit reached',
          limit: usageCheck.limit,
          used: usageCheck.used,
        },
        { status: 429 },
      );
    }

    // 4. Get or create conversation (client sends chat UUID as `id`, not `conversationId`)
    let convId = resolveConversationId(conversationId, requestChatId);

    if (convId) {
      const [existing] = await db
        .select({ id: conversations.id })
        .from(conversations)
        .where(and(eq(conversations.id, convId), eq(conversations.userId, user.id)))
        .limit(1);

      if (!existing) {
        return Response.json({ error: 'Conversation not found' }, { status: 404 });
      }
    } else {
      const title =
        getMessageContent(userMessages[userMessages.length - 1])?.slice(0, 100) || 'New conversation';

      const [newConv] = await db
        .insert(conversations)
        .values({
          userId: user.id,
          title,
          model: modelId,
        })
        .returning({ id: conversations.id });

      convId = newConv.id;
    }

    // 5. Build messages array with system prompt (normalize parts → content)
    const normalizedMessages = userMessages.map((m) => ({
      role: m.role,
      content: getMessageContent(m),
    }));
    const fullMessages = [
      { role: 'system' as const, content: DEFAULT_SYSTEM_PROMPT },
      ...normalizedMessages,
    ];

    // 6. Stream response
    const model = getModel();
    const result = streamText({
      model,
      messages: fullMessages,
      onFinish: async (event) => {
        const usage = event.usage;
        const inputTokens = usage?.inputTokens ?? 0;
        const outputTokens = usage?.outputTokens ?? 0;
        const costUsd = calculateCost(modelId, inputTokens, outputTokens);

        // 7. Log usage
        await logUsage({
          userId: user.id,
          conversationId: convId!,
          model: modelId,
          inputTokens,
          outputTokens,
          costUsd,
        });

        // 8. Check if user crossed 80% usage threshold — send warning email
        const totalAfter = usageCheck.used + inputTokens + outputTokens;
        const wasBelow80 = usageCheck.used / usageCheck.limit < 0.8;
        const isAbove80 = totalAfter / usageCheck.limit >= 0.8;

        if (wasBelow80 && isAbove80 && user.email) {
          import('@/lib/email/resend').then(({ sendEmail }) =>
            import('@/lib/email/templates/usage-warning').then(({ usageWarningEmailHtml }) =>
              sendEmail({
                to: user.email!,
                subject: 'You have used 80% of your daily tokens',
                html: usageWarningEmailHtml({
                  userName: user.user_metadata?.full_name ?? 'there',
                  tokensUsed: totalAfter,
                  tokenLimit: usageCheck.limit,
                  planName: usageCheck.planSlug,
                }),
              }),
            ),
          );
        }

        // 9. Save user message + assistant response to DB
        const userMsg = normalizedMessages[normalizedMessages.length - 1];
        const assistantText = event.text;

        await db.insert(messages).values([
          {
            conversationId: convId!,
            role: 'user',
            content: userMsg.content,
          },
          {
            conversationId: convId!,
            role: 'assistant',
            content: assistantText,
            model: modelId,
            inputTokens,
            outputTokens,
            costUsd: costUsd.toFixed(6),
          },
        ]);

        // 9. Report usage to Stripe (Business plan only)
        await reportUsageToStripe(user.id, inputTokens + outputTokens);

        // 10. Update conversation stats
        await db
          .update(conversations)
          .set({
            messageCount: sql`${conversations.messageCount} + 2`,
            totalTokens: sql`${conversations.totalTokens} + ${inputTokens + outputTokens}`,
            updatedAt: new Date(),
          })
          .where(eq(conversations.id, convId!));
      },
    });

    // Return streaming response (header lets the client sync URL after first message on /dashboard/chat)
    return result.toUIMessageStreamResponse({
      headers: {
        'X-Conversation-Id': convId!,
      },
    });
  } catch (error) {
    console.error('[chat] AI provider error:', error);
    return Response.json(
      { error: 'AI provider error', details: 'Something went wrong. Please try again.' },
      { status: 500 },
    );
  }
}

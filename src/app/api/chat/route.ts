import { streamText } from 'ai';
import { z } from 'zod';
import { getModel } from '@/lib/ai/provider';
import { MODELS } from '@/lib/ai/models';
import { calculateCost } from '@/lib/ai/models';
import { checkUsageLimit, logUsage } from '@/lib/ai/usage';
import { reportUsageToStripe } from '@/lib/billing/usage-reporting';
import { DEFAULT_SYSTEM_PROMPT } from '@/lib/ai/prompts';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/db';
import { conversations, messages } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

// Zod schema for request validation
const chatRequestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant', 'system']),
      content: z.string(),
    }),
  ),
  conversationId: z.string().uuid().nullable().optional(),
  model: z.string().optional(),
});

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

    const { messages: userMessages, conversationId, model: requestedModel } = parsed.data;
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

    // 4. Get or create conversation
    let convId = conversationId ?? null;
    if (!convId) {
      const title =
        userMessages[userMessages.length - 1]?.content?.slice(0, 100) || 'New conversation';

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

    // 5. Build messages array with system prompt
    const fullMessages = [
      { role: 'system' as const, content: DEFAULT_SYSTEM_PROMPT },
      ...userMessages,
    ];

    // 6. Stream response
    const model = getModel();
    const result = streamText({
      model,
      messages: fullMessages,
      onFinish: async ({ usage }) => {
        const inputTokens = usage?.inputTokens || 0;
        const outputTokens = usage?.outputTokens || 0;
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

        // 8. Save user message + assistant response to DB
        const userMsg = userMessages[userMessages.length - 1];
        const assistantText = await result.text;

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

    // Return streaming response
    return result.toTextStreamResponse();
  } catch (error) {
    console.error('[chat] AI provider error:', error);
    return Response.json(
      { error: 'AI provider error', details: 'Something went wrong. Please try again.' },
      { status: 500 },
    );
  }
}

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/db';
import { conversations } from '@/db/schema';
import { eq, desc, count } from 'drizzle-orm';

// GET /api/conversations — list user's conversations (paginated, newest first)
export async function GET(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
  const offset = (page - 1) * limit;

  const [items, totalResult] = await Promise.all([
    db
      .select({
        id: conversations.id,
        title: conversations.title,
        model: conversations.model,
        messageCount: conversations.messageCount,
        totalTokens: conversations.totalTokens,
        updatedAt: conversations.updatedAt,
      })
      .from(conversations)
      .where(eq(conversations.userId, user.id))
      .orderBy(desc(conversations.updatedAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ total: count() })
      .from(conversations)
      .where(eq(conversations.userId, user.id)),
  ]);

  return Response.json({
    conversations: items,
    total: totalResult[0]?.total ?? 0,
    page,
    limit,
  });
}

const createSchema = z.object({
  title: z.string().optional(),
  model: z.string().optional(),
  systemPrompt: z.string().optional(),
});

// POST /api/conversations — create a new conversation
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 });
  }

  const [conv] = await db
    .insert(conversations)
    .values({
      userId: user.id,
      title: parsed.data.title || 'New conversation',
      model: parsed.data.model || 'gpt-4o-mini',
      systemPrompt: parsed.data.systemPrompt,
    })
    .returning();

  return Response.json(conv, { status: 201 });
}

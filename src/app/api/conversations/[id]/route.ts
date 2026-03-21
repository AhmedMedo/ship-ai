import { createClient } from '@/lib/supabase/server';
import { db } from '@/db';
import { conversations, messages } from '@/db/schema';
import { eq, and, asc } from 'drizzle-orm';

// GET /api/conversations/[id] — get conversation with all messages
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  const [conv] = await db
    .select()
    .from(conversations)
    .where(and(eq(conversations.id, id), eq(conversations.userId, user.id)))
    .limit(1);

  if (!conv) {
    return Response.json({ error: 'Conversation not found' }, { status: 404 });
  }

  const msgs = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, id))
    .orderBy(asc(messages.createdAt));

  return Response.json({ conversation: conv, messages: msgs });
}

// DELETE /api/conversations/[id] — delete conversation and all messages
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  // Verify ownership before deleting
  const [conv] = await db
    .select({ id: conversations.id })
    .from(conversations)
    .where(and(eq(conversations.id, id), eq(conversations.userId, user.id)))
    .limit(1);

  if (!conv) {
    return Response.json({ error: 'Conversation not found' }, { status: 404 });
  }

  // Messages cascade-delete via FK constraint
  await db.delete(conversations).where(eq(conversations.id, id));

  return Response.json({ deleted: true });
}

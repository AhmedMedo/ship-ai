import { createClient } from '@/lib/supabase/server';
import { db } from '@/db';
import { conversations, messages } from '@/db/schema';
import { eq, and, asc } from 'drizzle-orm';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  try {
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
  } catch (error) {
    console.error('[conversations/id] GET error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;

    const [conv] = await db
      .select({ id: conversations.id })
      .from(conversations)
      .where(and(eq(conversations.id, id), eq(conversations.userId, user.id)))
      .limit(1);

    if (!conv) {
      return Response.json({ error: 'Conversation not found' }, { status: 404 });
    }

    await db.delete(conversations).where(eq(conversations.id, id));
    return Response.json({ deleted: true });
  } catch (error) {
    console.error('[conversations/id] DELETE error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

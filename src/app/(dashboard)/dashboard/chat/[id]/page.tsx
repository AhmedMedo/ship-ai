import { notFound, redirect } from 'next/navigation';
import { and, asc, eq } from 'drizzle-orm';
import { ChatContainer } from '@/components/chat/chat-container';
import { createClient } from '@/lib/supabase/server';
import { dbMessagesToUIMessages } from '@/lib/chat/ui-messages';
import { db } from '@/db';
import { conversations, messages } from '@/db/schema';

interface ChatPageProps {
  params: Promise<{ id: string }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const [conv] = await db
    .select()
    .from(conversations)
    .where(and(eq(conversations.id, id), eq(conversations.userId, user.id)))
    .limit(1);

  if (!conv) {
    notFound();
  }

  const rows = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, id))
    .orderBy(asc(messages.createdAt));

  const initialMessages = dbMessagesToUIMessages(rows);

  return (
    <ChatContainer
      conversationId={id}
      title={conv.title}
      model={conv.model}
      initialMessages={initialMessages}
    />
  );
}

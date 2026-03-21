import { ChatContainer } from '@/components/chat/chat-container';

interface ChatPageProps {
  params: Promise<{ id: string }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { id } = await params;

  // TODO: Fetch conversation title and model from DB in Task 9
  return <ChatContainer conversationId={id} />;
}

import { ChatContainer } from '@/components/chat/chat-container';

interface ChatPageProps {
  params: Promise<{ id: string }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { id } = await params;

  return <ChatContainer conversationId={id} />;
}

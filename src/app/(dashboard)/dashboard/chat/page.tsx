import { ChatContainer } from '@/components/chat/chat-container';
import { aiConfig } from '@/config/ai';

export default function NewChatPage() {
  return <ChatContainer model={aiConfig.model} />;
}

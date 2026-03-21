import { ConversationList } from '@/components/chat/conversation-list';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="-m-6 flex h-[calc(100vh-56px)]">
      {/* Conversation list — hidden on mobile */}
      <div className="hidden md:block">
        <ConversationList />
      </div>

      {/* Chat area */}
      <div className="flex-1">{children}</div>
    </div>
  );
}

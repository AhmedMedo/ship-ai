import type { UIMessage } from 'ai';
import type { Message } from '@/db/schema';

/** Map persisted rows to AI SDK UI messages for `useChat({ messages })`. */
export function dbMessagesToUIMessages(rows: Message[]): UIMessage[] {
  return rows.map((m) => ({
    id: m.id,
    role: m.role as 'user' | 'assistant' | 'system',
    parts: [{ type: 'text' as const, text: m.content }],
  }));
}

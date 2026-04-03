'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import type { UIMessage } from 'ai';
import { useRouter, usePathname } from 'next/navigation';
import { ChatHeader } from './chat-header';
import { ChatInput } from './chat-input';
import { MessageBubble } from './message-bubble';
import { EmptyState } from './empty-state';

interface ChatContainerProps {
  conversationId?: string;
  title?: string;
  model?: string;
  /** Loaded on the server for existing threads; must match AI SDK `UIMessage` shape. */
  initialMessages?: UIMessage[];
}

export function ChatContainer({
  conversationId,
  title,
  model,
  initialMessages,
}: ChatContainerProps) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const conversationIdFromResponse = useRef<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/chat',
        body: {
          conversationId: conversationId ?? undefined,
        },
        fetch: async (input, init) => {
          const res = await fetch(input, init);
          const cid = res.headers.get('X-Conversation-Id');
          if (cid) conversationIdFromResponse.current = cid;
          return res;
        },
      }),
    [conversationId],
  );

  const { messages, sendMessage, stop, status, error } = useChat({
    id: conversationId,
    messages: initialMessages,
    transport,
    onFinish: () => {
      const cid = conversationIdFromResponse.current;
      if (cid && !conversationId && pathname === '/dashboard/chat') {
        router.replace(`/dashboard/chat/${cid}`);
      }
      router.refresh();
    },
  });

  const [pendingSend, setPendingSend] = useState(false);
  const isLoading = status === 'streaming' || status === 'submitted' || pendingSend;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Clear pendingSend once useChat status catches up
  useEffect(() => {
    if (status === 'streaming' || status === 'submitted') {
      setPendingSend(false);
    }
  }, [status]);

  function handleSelectPrompt(prompt: string) {
    if (isLoading) return;
    setPendingSend(true);
    void sendMessage({ text: prompt });
  }

  function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    setPendingSend(true);
    void sendMessage({ text: input });
    setInput('');
  }

  function getMessageText(msg: UIMessage): string {
    if (!msg.parts?.length) return '';
    return msg.parts
      .filter((p): p is Extract<(typeof msg.parts)[number], { type: 'text' }> => p.type === 'text')
      .map((p) => p.text)
      .join('');
  }

  const headerTitle =
    title ||
    (messages[0] ? getMessageText(messages[0]).slice(0, 60) : 'New chat');

  return (
    <div className="flex h-full flex-col bg-card">
      <ChatHeader title={headerTitle} model={model} />

      <div ref={scrollRef} className="flex flex-1 flex-col gap-4 overflow-y-auto p-6">
        {messages.length === 0 && !isLoading ? (
          <EmptyState onSelectPrompt={handleSelectPrompt} />
        ) : (
          messages.map((msg: UIMessage, i: number) => (
            <MessageBubble
              key={msg.id || String(i)}
              role={msg.role as 'user' | 'assistant'}
              content={getMessageText(msg)}
              isStreaming={isLoading && i === messages.length - 1 && msg.role === 'assistant'}
            />
          ))
        )}

        {/* Thinking indicator while waiting for first token */}
        {status === 'submitted' && (
          <div className="flex max-w-[720px] gap-3 self-start">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border bg-muted">
              <span className="text-xs font-bold">A</span>
            </div>
            <div className="rounded-2xl rounded-bl-md bg-muted px-4 py-3.5 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <span className="animate-pulse">Thinking</span>
                <span className="inline-flex gap-0.5">
                  <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
                  <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
                  <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
                </span>
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="mx-auto max-w-md rounded-lg bg-destructive/10 px-4 py-3 text-center text-sm text-destructive">
            {error.message || 'Something went wrong. Please try again.'}
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => void stop()}
              className="rounded-lg border border-border px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted"
            >
              Stop generating
            </button>
          </div>
        )}
      </div>

      <ChatInput
        input={input}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        model={model}
      />
    </div>
  );
}

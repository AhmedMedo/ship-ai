'use client';

import { useState, useEffect, useRef } from 'react';
import { useChat } from '@ai-sdk/react';
import { ChatHeader } from './chat-header';
import { ChatInput } from './chat-input';
import { MessageBubble } from './message-bubble';
import { EmptyState } from './empty-state';

interface ChatContainerProps {
  conversationId?: string;
  title?: string;
  model?: string;
}

export function ChatContainer({ conversationId, title, model }: ChatContainerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState('');

  const { messages, sendMessage, stop, status, error } = useChat({
    id: conversationId,
  });

  const isLoading = status === 'streaming' || status === 'submitted';

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  function handleSelectPrompt(prompt: string) {
    setInput(prompt);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    sendMessage({ text: input });
    setInput('');
  }

  // Extract text content from message parts
  function getMessageText(msg: (typeof messages)[number]): string {
    return msg.parts
      .filter((p): p is Extract<typeof p, { type: 'text' }> => p.type === 'text')
      .map((p) => p.text)
      .join('');
  }

  return (
    <div className="flex h-full flex-col" style={{ background: 'var(--card)' }}>
      <ChatHeader
        title={title || (messages[0] ? getMessageText(messages[0]).slice(0, 60) : 'New chat')}
        model={model}
      />

      {/* Messages area */}
      <div ref={scrollRef} className="flex flex-1 flex-col gap-4 overflow-y-auto p-6">
        {messages.length === 0 ? (
          <EmptyState onSelectPrompt={handleSelectPrompt} />
        ) : (
          messages.map((msg, i) => (
            <MessageBubble
              key={msg.id || i}
              role={msg.role as 'user' | 'assistant'}
              content={getMessageText(msg)}
              isStreaming={isLoading && i === messages.length - 1 && msg.role === 'assistant'}
            />
          ))
        )}

        {/* Error display */}
        {error && (
          <div
            className="mx-auto max-w-md rounded-lg px-4 py-3 text-center text-sm"
            style={{ background: '#FEE2E2', color: '#DC2626' }}
          >
            {error.message || 'Something went wrong. Please try again.'}
          </div>
        )}

        {/* Stop button during streaming */}
        {isLoading && (
          <div className="flex justify-center">
            <button
              onClick={stop}
              className="rounded-lg border px-4 py-2 text-xs font-medium transition-colors hover:bg-[var(--muted)]"
              style={{ borderColor: 'var(--border)', color: '#475569' }}
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

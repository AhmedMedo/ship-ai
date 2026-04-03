'use client';

import { useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  input: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  model?: string;
  tokensUsed?: number;
  tokenLimit?: number;
}

export function ChatInput({
  input,
  onInputChange,
  onSubmit,
  isLoading,
  model,
  tokensUsed = 0,
  tokenLimit = 100000,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = '48px';
      el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
    }
  }, [input]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        onSubmit(e as unknown as React.FormEvent);
      }
    }
  }

  return (
    <div className="flex-shrink-0 border-t px-5 py-4">
      <form onSubmit={onSubmit}>
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={onInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Send a message..."
            disabled={isLoading}
            rows={1}
            className="w-full resize-none rounded-[14px] border-[1.5px] py-3.5 pl-5 pr-14 text-sm outline-none transition-colors"
            style={{
              minHeight: '48px',
              maxHeight: '160px',
              background: 'var(--color-card)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-foreground)',
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute bottom-2.5 right-2.5 flex h-[34px] w-[34px] items-center justify-center rounded-[10px] bg-primary transition-all hover:scale-105 disabled:opacity-50"
          >
            <Send className="h-4 w-4 text-white" />
          </button>
        </div>
      </form>
      <div className="flex justify-between px-1 pt-1.5 text-[11px] text-muted-foreground">
        <span>Model: {model}</span>
        <span>{tokensUsed.toLocaleString()} / {tokenLimit.toLocaleString()} tokens today</span>
      </div>
    </div>
  );
}

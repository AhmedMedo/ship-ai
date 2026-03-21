'use client';

import { MessageSquare } from 'lucide-react';

interface EmptyStateProps {
  onSelectPrompt: (prompt: string) => void;
}

const suggestedPrompts = [
  'Explain React hooks',
  'Write a Python script',
  'Help me debug this code',
  'Design a database schema',
];

export function EmptyState({ onSelectPrompt }: EmptyStateProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <MessageSquare className="h-12 w-12 text-muted-foreground/50" />
      <h3 className="mt-4 text-lg font-semibold">Start a conversation</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Ask anything — code, ideas, debugging, or explanations.
      </p>
      <div className="mt-6 flex max-w-[480px] flex-wrap justify-center gap-2">
        {suggestedPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onSelectPrompt(prompt)}
            className="rounded-full border px-4 py-2 text-sm transition-colors hover:border-[#0F4C75]/30 hover:bg-[var(--muted)]"
            style={{ borderColor: 'var(--border)' }}
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}

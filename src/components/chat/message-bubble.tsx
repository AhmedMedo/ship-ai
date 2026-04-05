'use client';

import dynamic from 'next/dynamic';
import { Logo } from '@/components/shared/logo';

interface MarkdownProps { content: string }

// react-markdown v10 + remark-gfm v4 are pure ESM and crash Turbopack at
// module-evaluation time. Loading them dynamically pushes the import to the
// browser runtime where native ESM is fully supported.
const MarkdownContent = dynamic<MarkdownProps>(
  () => import('./markdown-content').then((m) => m.MarkdownContent),
  {
    ssr: false,
    loading: () => <span className="animate-pulse text-muted-foreground">…</span>,
  },
);

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

export function MessageBubble({ role, content, isStreaming }: MessageBubbleProps) {
  if (role === 'user') {
    return (
      <div className="flex max-w-[720px] gap-3 self-end flex-row-reverse">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
          U
        </div>
        <div className="rounded-2xl rounded-br-md bg-primary px-4 py-3 text-sm leading-relaxed text-white">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex max-w-[720px] gap-3 self-start">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border bg-muted">
        <Logo variant="icon" size="sm" />
      </div>
      <div className="min-w-0 rounded-2xl rounded-bl-md bg-muted px-4 py-3.5 text-sm leading-relaxed">
        <MarkdownContent content={content} />
        {isStreaming && (
          <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse rounded-sm bg-primary align-middle" />
        )}
      </div>
    </div>
  );
}

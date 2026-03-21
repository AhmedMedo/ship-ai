'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './code-block';
import { Logo } from '@/components/shared/logo';

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
        <div
          className="rounded-2xl rounded-br-md bg-primary px-4 py-3 text-sm leading-relaxed text-white"
        >
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
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              const codeString = String(children).replace(/\n$/, '');

              if (match) {
                return <CodeBlock language={match[1]}>{codeString}</CodeBlock>;
              }

              return (
                <code
                  className="rounded bg-border px-1.5 py-0.5 font-mono text-xs"
                  {...props}
                >
                  {children}
                </code>
              );
            },
            a({ href, children }) {
              return (
                <a href={href} target="_blank" rel="noopener noreferrer" className="underline text-primary">
                  {children}
                </a>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
        {isStreaming && (
          <span
            className="ml-0.5 inline-block h-4 w-0.5 animate-pulse rounded-sm bg-primary align-middle"
          />
        )}
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';

interface CodeBlockProps {
  language?: string;
  children: string;
}

export function CodeBlock({ language, children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="my-2 overflow-hidden rounded-[10px]" style={{ background: '#1e1e2e' }}>
      <div
        className="flex items-center justify-between px-3.5 py-2"
        style={{ background: '#181825' }}
      >
        <span className="font-mono text-[11px]" style={{ color: '#6c7086' }}>
          {language || 'code'}
        </span>
        <button
          onClick={handleCopy}
          className="rounded px-2 py-0.5 text-[11px] transition-colors hover:bg-[#313244]"
          style={{ color: copied ? '#a6e3a1' : '#6c7086' }}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto px-3.5 py-3.5 font-mono text-[12.5px] leading-relaxed" style={{ color: '#cdd6f4' }}>
        <code>{children}</code>
      </pre>
    </div>
  );
}

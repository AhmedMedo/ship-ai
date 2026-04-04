import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import { DocsShell } from '@/components/docs/docs-shell';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Ignitra Docs',
    default: 'Documentation',
  },
  description: 'Documentation for Ignitra — the AI-native Next.js SaaS boilerplate.',
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return <div className={jetbrainsMono.variable}><DocsShell>{children}</DocsShell></div>;
}

import type { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MarketingDocLayout } from '@/components/marketing/marketing-doc-layout';

export const metadata: Metadata = {
  title: 'License',
  description: 'Ignitra License Agreement — terms of use for the Ignitra SaaS boilerplate.',
  alternates: { canonical: '/license' },
  openGraph: {
    title: 'License Agreement | Ignitra',
    description: 'License terms for the Ignitra source code.',
    url: '/license',
  },
};

const section =
  'mt-12 scroll-mt-28 border-b border-white/10 pb-2 text-xl font-semibold text-[#F1F5F9] first:mt-0';

export default function LicensePage() {
  const raw = fs.readFileSync(path.join(process.cwd(), 'LICENSE.md'), 'utf-8');
  const md = raw.replace(/^#[^\n]+\n+/, '').replace(/^Last Updated:[^\n]+\n+/, '');

  return (
    <MarketingDocLayout title="Ignitra License Agreement" lastUpdated="April 4, 2026">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => <h2 className={section}>{children}</h2>,
          p: ({ children }) => <p className="my-3">{children}</p>,
          ul: ({ children }) => (
            <ul className="my-4 list-disc space-y-2 pl-5">{children}</ul>
          ),
          li: ({ children }) => <li className="py-0.5">{children}</li>,
          strong: ({ children }) => (
            <strong className="font-semibold text-[#E2E8F0]">{children}</strong>
          ),
          hr: () => <hr className="my-10 border-white/10" />,
        }}
      >
        {md}
      </ReactMarkdown>
    </MarketingDocLayout>
  );
}

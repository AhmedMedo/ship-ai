import type { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import { Navbar } from '@/components/marketing/navbar';
import { Footer } from '@/components/marketing/footer';

export const metadata: Metadata = {
  title: 'License — Ignitra',
  description: 'Ignitra License Agreement — terms of use for the Ignitra SaaS boilerplate.',
  alternates: { canonical: '/license' },
};

export default function LicensePage() {
  const content = fs.readFileSync(path.join(process.cwd(), 'LICENSE.md'), 'utf-8');

  // Simple markdown-to-HTML conversion for the license
  const html = content
    .replace(/^# (.+)$/gm, '<h1 class="mb-4 text-3xl font-black" style="color:#F1F5F9">$1</h1>')
    .replace(/^## (.+)$/gm, '<h2 class="mt-10 mb-3 text-xl font-bold" style="color:#F1F5F9">$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#F1F5F9">$1</strong>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 py-0.5">$1</li>')
    .replace(/^(?!<[hl]|<li|<str|<hr|---)(.*\S.*)$/gm, '<p class="my-2">$1</p>')
    .replace(/^---$/gm, '<hr class="my-8 border-white/10" />');

  return (
    <>
      <Navbar />
      <main
        className="mx-auto max-w-[720px] px-6 pb-20 pt-32 text-[15px] leading-[1.8]"
        style={{ color: '#94A3B8' }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <Footer />
    </>
  );
}

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/marketing/navbar';
import { Footer } from '@/components/marketing/footer';

interface MarketingDocLayoutProps {
  title: string;
  lastUpdated?: string;
  children: React.ReactNode;
}

/**
 * Shared shell for legal / about pages: dark #030014 context, nav, footer,
 * centered prose column, back link, optional last-updated line.
 */
export function MarketingDocLayout({ title, lastUpdated, children }: MarketingDocLayoutProps) {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-[768px] px-6 pb-24 pt-24 sm:pt-28">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-[14px] font-medium transition-colors"
          style={{ color: '#94A3B8' }}
        >
          <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
          Back to home
        </Link>

        <header className="mb-10 border-b border-white/10 pb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: '#F1F5F9' }}>
            {title}
          </h1>
          {lastUpdated ? (
            <p className="mt-3 text-[14px]" style={{ color: '#64748B' }}>
              Last updated: {lastUpdated}
            </p>
          ) : null}
        </header>

        <article
          className="legal-doc text-[15px] leading-[1.85] [&_a]:text-sky-400 [&_a]:underline-offset-2 hover:[&_a]:text-sky-300 [&_strong]:font-semibold [&_strong]:text-[#E2E8F0]"
          style={{ color: '#94A3B8' }}
        >
          {children}
        </article>
      </main>
      <Footer />
    </>
  );
}

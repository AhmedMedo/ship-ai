'use client';

import { useState } from 'react';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

interface LeadCaptureFormProps {
  ctaText?: string;
  source?: string;
  variant?: 'inline' | 'stacked';
}

export function LeadCaptureForm({
  ctaText = 'Get Free Starter Kit',
  source = 'hero',
  variant = 'inline',
}: LeadCaptureFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      });

      if (!res.ok) throw new Error('Failed');

      setStatus('success');
      setEmail('');

      window.fbq?.('track', 'Lead');
      window.gtag?.('event', 'generate_lead', { event_category: 'engagement', value: 1 });
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="flex items-center justify-center gap-2.5 rounded-xl border border-green-500/20 bg-green-500/5 px-6 py-4">
        <svg className="h-5 w-5 flex-shrink-0 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span className="text-[15px] font-medium text-green-300">
          You&apos;re in! Check your email for the starter kit.
        </span>
      </div>
    );
  }

  const isInline = variant === 'inline';

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex w-full max-w-[480px] gap-2.5 ${isInline ? 'flex-col sm:flex-row' : 'flex-col'}`}
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="min-w-0 flex-1 rounded-xl border border-white/[0.1] bg-white/[0.05] px-5 py-3.5 text-[15px] text-white placeholder:text-gray-500 transition-all focus:border-[#3498DB]/50 focus:outline-none focus:ring-1 focus:ring-[#3498DB]/30"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="whitespace-nowrap rounded-xl px-7 py-3.5 text-[15px] font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
        style={{
          background: 'linear-gradient(135deg, #0F4C75, #3498DB)',
          boxShadow: '0 0 40px rgba(15,76,117,0.3)',
        }}
      >
        {status === 'loading' ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Sending...
          </span>
        ) : (
          ctaText
        )}
      </button>
      {status === 'error' && (
        <p className="text-sm text-red-400 sm:col-span-2">Something went wrong. Try again.</p>
      )}
    </form>
  );
}

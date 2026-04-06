'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';

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
  /** Email input placeholder — emphasize instant access, not a fake address */
  placeholder?: string;
  /** Short value bullets shown under the email row (hero / high-intent placements) */
  bullets?: string[];
  /** Microcopy under the button — trust / friction reduction */
  trustLine?: string;
}

export function LeadCaptureForm({
  ctaText = 'Get instant access',
  source = 'hero',
  variant = 'inline',
  placeholder = 'Enter your email to get instant access',
  bullets,
  trustLine = 'Free for early users — limited access',
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
          You&apos;re in — check your email for instant access to the starter.
        </span>
      </div>
    );
  }

  const isInline = variant === 'inline';
  const showBullets = bullets && bullets.length > 0;

  return (
    <div className="w-full max-w-[520px]">
      <form
        onSubmit={handleSubmit}
        className={`flex w-full flex-col gap-2.5 ${isInline ? 'sm:flex-row sm:items-stretch' : ''}`}
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 rounded-xl border border-white/[0.1] bg-white/[0.05] px-5 py-3.5 text-[15px] text-white placeholder:text-gray-500 transition-all focus:border-[#3498DB]/50 focus:outline-none focus:ring-1 focus:ring-[#3498DB]/30"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="shrink-0 rounded-xl px-5 py-3.5 text-[14px] font-bold leading-tight text-white transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 sm:px-7 sm:text-[15px]"
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
      </form>

      {showBullets && (
        <p className="mt-3 text-center text-[12px] font-medium tracking-wide uppercase" style={{ color: '#64748B', letterSpacing: '0.06em' }}>
          Includes real production-ready code
        </p>
      )}

      {showBullets && (
        <ul
          className="mt-2 grid gap-2 text-left text-[13px] leading-snug sm:grid-cols-2 sm:gap-x-4 sm:gap-y-2"
          style={{ color: '#94A3B8' }}
        >
          {bullets!.map((line) => (
            <li key={line} className="flex gap-2">
              <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-cyan-400/90" strokeWidth={2.5} aria-hidden />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      )}

      {trustLine ? (
        <p className="mt-3 text-center text-[13px]" style={{ color: '#64748B' }}>
          {trustLine}
        </p>
      ) : null}

      {status === 'error' && (
        <p className="mt-2 text-center text-sm text-red-400">Something went wrong. Try again.</p>
      )}
    </div>
  );
}

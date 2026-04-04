'use client';

import { useEffect, useRef } from 'react';

const features = [
  {
    icon: '⚡',
    iconStyle: { background: 'rgba(124,58,237,0.12)', color: '#a78bfa' },
    title: 'AI streaming chat',
    desc: 'Production-ready chat with real-time token streaming, markdown, and syntax-highlighted code blocks.',
    span: 2,
    code: "const { messages } = useChat({ api: '/api/chat' });",
    codeHighlight: 'useChat',
  },
  {
    icon: '🔄',
    iconStyle: { background: 'rgba(6,182,212,0.12)', color: '#22d3ee' },
    title: 'Multi-provider AI',
    desc: 'OpenAI, Claude, Gemini. Switch with one env var.',
    span: 1,
    code: 'AI_PROVIDER=anthropic',
    codeHighlight: 'AI_PROVIDER',
  },
  {
    icon: '🔐',
    iconStyle: { background: 'rgba(232,89,60,0.12)', color: '#fb923c' },
    title: 'Authentication',
    desc: 'Google, GitHub OAuth, magic link, email/password. Supabase Auth + RLS.',
    span: 1,
  },
  {
    icon: '💳',
    iconStyle: { background: 'rgba(52,152,219,0.12)', color: '#60a5fa' },
    title: 'Stripe billing',
    desc: 'Subscriptions, one-time, usage-based metering. Checkout + Portal + Webhooks.',
    span: 1,
  },
  {
    icon: '📊',
    iconStyle: { background: 'rgba(34,197,94,0.12)', color: '#4ade80' },
    title: 'Token tracking + usage billing',
    desc: 'Per-user daily/monthly limits. Dashboard with model breakdown and cost analytics.',
    span: 2,
    codeMulti: [
      { label: 'Today:', value: '4,520', suffix: ' / 100K' },
      { label: 'Cost:', value: '$0.07', suffix: '' },
      { label: 'Model:', value: 'gpt-4o-mini', suffix: '' },
    ],
  },
];

export function FeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('reveal-visible');
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    sectionRef.current?.querySelectorAll('.reveal-item').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" className="relative z-[1] py-20" ref={sectionRef}>
      <div className="mx-auto max-w-[1200px] px-6">
        <div
          className="reveal-item mb-3 text-center text-[15px] font-bold uppercase tracking-[2px]"
          style={{
            background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Features
        </div>
        <h2
          className="reveal-item mb-4 text-center font-black"
          style={{ fontSize: 'clamp(30px,4vw,46px)', letterSpacing: '-0.03em', color: '#F1F5F9' }}
        >
          Everything you need.<br />Nothing you don&apos;t.
        </h2>
        <p
          className="reveal-item mx-auto mb-[60px] max-w-[560px] text-center text-[16px] leading-[1.7]"
          style={{ color: '#94A3B8' }}
        >
          Stop rebuilding auth, payments, and chat UIs. Start with a production-ready AI stack.
        </p>

        {/* Bento grid */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className={`reveal-item group relative overflow-hidden rounded-2xl p-7 transition-all duration-[400ms] ${f.span === 2 ? 'md:col-span-2' : ''}`}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.transform = 'none';
              }}
            >
              {/* Top shine on hover */}
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-[400ms] group-hover:opacity-100"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.3), transparent)' }}
              />

              <div
                className="mb-4 flex h-11 w-11 items-center justify-center rounded-[12px] text-xl"
                style={f.iconStyle}
              >
                {f.icon}
              </div>
              <h3 className="mb-2 text-[17px] font-bold" style={{ color: '#F1F5F9' }}>{f.title}</h3>
              <p className="text-[14px] leading-[1.6]" style={{ color: '#94A3B8' }}>{f.desc}</p>

              {/* Single-line code snippet */}
              {f.code && !f.codeMulti && (
                <div
                  className="mt-4 rounded-[10px] border px-3 py-3 text-[11px] leading-[1.6]"
                  style={{
                    background: 'rgba(0,0,0,0.3)',
                    borderColor: 'rgba(255,255,255,0.06)',
                    fontFamily: "'JetBrains Mono', monospace",
                    color: '#94A3B8',
                  }}
                >
                  {f.code.split(f.codeHighlight!).map((part, i, arr) => (
                    <span key={i}>
                      {part}
                      {i < arr.length - 1 && (
                        <span style={{ color: '#06B6D4' }}>{f.codeHighlight}</span>
                      )}
                    </span>
                  ))}
                </div>
              )}

              {/* Multi-stat row */}
              {f.codeMulti && (
                <div
                  className="mt-4 flex flex-wrap gap-6 rounded-[10px] border px-3 py-3 text-[11px]"
                  style={{
                    background: 'rgba(0,0,0,0.3)',
                    borderColor: 'rgba(255,255,255,0.06)',
                    fontFamily: "'JetBrains Mono', monospace",
                    color: '#94A3B8',
                  }}
                >
                  {f.codeMulti.map((s) => (
                    <span key={s.label}>
                      {s.label} <span style={{ color: '#06B6D4' }}>{s.value}</span>{s.suffix}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .reveal-item { opacity: 0; transform: translateY(30px); transition: opacity 0.8s cubic-bezier(.16,1,.3,1), transform 0.8s cubic-bezier(.16,1,.3,1); }
        .reveal-visible { opacity: 1; transform: translateY(0); }
      `}</style>
    </section>
  );
}

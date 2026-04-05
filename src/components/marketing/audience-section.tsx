'use client';

import { useEffect, useRef } from 'react';

const audiences = [
  {
    icon: '🚀',
    iconStyle: { background: 'rgba(124,58,237,0.12)', color: '#a78bfa' },
    title: 'Indie Hackers',
    desc: 'Ship your AI product before the competition. Stop rebuilding boilerplate and start validating your idea.',
  },
  {
    icon: '💼',
    iconStyle: { background: 'rgba(52,152,219,0.12)', color: '#60a5fa' },
    title: 'SaaS Founders',
    desc: 'Go from idea to paying customers in days, not months. Auth, payments, and billing — done.',
  },
  {
    icon: '🤖',
    iconStyle: { background: 'rgba(6,182,212,0.12)', color: '#22d3ee' },
    title: 'AI Developers',
    desc: 'Focus on your model and prompts, not auth flows, billing integrations, and token tracking.',
  },
];

export function AudienceSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('reveal-visible')),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    );
    sectionRef.current?.querySelectorAll('.reveal-item').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative z-[1] py-20" ref={sectionRef}>
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
          Who is this for
        </div>
        <h2
          className="reveal-item mb-4 text-center font-black"
          style={{ fontSize: 'clamp(30px,4vw,46px)', letterSpacing: '-0.03em', color: '#F1F5F9' }}
        >
          Built for builders like you
        </h2>
        <p
          className="reveal-item mx-auto mb-[60px] max-w-[560px] text-center text-[16px] leading-[1.7]"
          style={{ color: '#94A3B8' }}
        >
          Whether you&apos;re shipping your first product or your tenth, Ignitra gets you to launch faster.
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {audiences.map((a) => (
            <div
              key={a.title}
              className="reveal-item group relative overflow-hidden rounded-2xl p-8 text-center transition-all duration-[400ms]"
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
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-[400ms] group-hover:opacity-100"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.3), transparent)' }}
              />
              <div
                className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl"
                style={a.iconStyle}
              >
                {a.icon}
              </div>
              <h3 className="mb-2 text-[18px] font-bold" style={{ color: '#F1F5F9' }}>{a.title}</h3>
              <p className="text-[14px] leading-[1.7]" style={{ color: '#94A3B8' }}>{a.desc}</p>
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

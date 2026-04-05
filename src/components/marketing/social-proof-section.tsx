'use client';

import { useEffect, useRef } from 'react';

const testimonials = [
  {
    quote: 'Saved me 3 weeks of boilerplate. The AI chat streaming + usage tracking was exactly what I needed to launch my product.',
    name: 'Marcus T.',
    role: 'Indie Hacker',
    initials: 'MT',
    gradient: 'linear-gradient(135deg, #7C3AED, #3498DB)',
  },
  {
    quote: 'I had my SaaS live and accepting payments in 2 days. The Stripe integration alone was worth the price.',
    name: 'Sarah K.',
    role: 'SaaS Founder',
    initials: 'SK',
    gradient: 'linear-gradient(135deg, #0F4C75, #06B6D4)',
  },
  {
    quote: 'Finally a boilerplate that actually handles multi-provider AI properly. Switched from OpenAI to Claude with one env var.',
    name: 'Dev R.',
    role: 'AI Developer',
    initials: 'DR',
    gradient: 'linear-gradient(135deg, #E8593C, #F9E2AF)',
  },
];

const stats = [
  { value: '2 days', label: 'Average time to launch' },
  { value: '40+', label: 'Hours saved per project' },
  { value: '100%', label: 'Code ownership' },
];

export function SocialProofSection() {
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
          Trusted by builders
        </div>
        <h2
          className="reveal-item mb-4 text-center font-black"
          style={{ fontSize: 'clamp(30px,4vw,46px)', letterSpacing: '-0.03em', color: '#F1F5F9' }}
        >
          Developers ship faster with Ignitra
        </h2>
        <p
          className="reveal-item mx-auto mb-[60px] max-w-[560px] text-center text-[16px] leading-[1.7]"
          style={{ color: '#94A3B8' }}
        >
          See why builders choose Ignitra to launch their AI SaaS products.
        </p>

        {/* Stats bar */}
        <div className="reveal-item mx-auto mb-14 grid max-w-[700px] grid-cols-3 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div
                className="mb-1 text-[28px] font-black sm:text-[36px]"
                style={{
                  background: 'linear-gradient(135deg, #F1F5F9, #94A3B8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  letterSpacing: '-0.03em',
                }}
              >
                {s.value}
              </div>
              <div className="text-[12px] font-medium sm:text-[13px]" style={{ color: '#64748B' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="reveal-item relative overflow-hidden rounded-2xl p-7 transition-all duration-[400ms]"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
              }}
            >
              {/* Quote mark */}
              <div
                className="mb-4 text-[32px] font-black leading-none"
                style={{ color: 'rgba(124,58,237,0.3)' }}
              >
                &ldquo;
              </div>
              <p className="mb-6 text-[14px] leading-[1.7]" style={{ color: '#CBD5E1' }}>
                {t.quote}
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-bold text-white"
                  style={{ background: t.gradient }}
                >
                  {t.initials}
                </div>
                <div>
                  <div className="text-[13px] font-semibold" style={{ color: '#F1F5F9' }}>{t.name}</div>
                  <div className="text-[12px]" style={{ color: '#64748B' }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="reveal-item mt-6 text-center text-[12px]" style={{ color: '#475569' }}>
          From early adopters and beta users
        </p>
      </div>

      <style>{`
        .reveal-item { opacity: 0; transform: translateY(30px); transition: opacity 0.8s cubic-bezier(.16,1,.3,1), transform 0.8s cubic-bezier(.16,1,.3,1); }
        .reveal-visible { opacity: 1; transform: translateY(0); }
      `}</style>
    </section>
  );
}

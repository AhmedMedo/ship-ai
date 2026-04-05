'use client';

import { useEffect, useRef } from 'react';
import { LeadCaptureForm } from '@/components/landing/lead-capture-form';

export function CtaSection() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('reveal-visible')),
      { threshold: 0.1 },
    );
    ref.current?.querySelectorAll('.reveal-item').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="cta" className="relative z-[1] px-6 pb-20 pt-4" ref={ref}>
      <div
        className="reveal-item relative mx-auto max-w-[1200px] overflow-hidden rounded-3xl border px-10 py-20 text-center"
        style={{
          background: 'linear-gradient(135deg, rgba(124,58,237,0.06), rgba(15,76,117,0.12), rgba(6,182,212,0.06))',
          borderColor: 'rgba(255,255,255,0.06)',
        }}
      >
        {/* Center glow */}
        <div
          className="pointer-events-none absolute"
          style={{
            top: '50%',
            left: '50%',
            width: 600,
            height: 600,
            transform: 'translate(-50%,-50%)',
            background: 'radial-gradient(circle, rgba(15,76,117,0.15), transparent 70%)',
          }}
        />

        <h2
          className="relative mb-4 font-black"
          style={{ fontSize: 'clamp(28px,4vw,42px)', letterSpacing: '-0.03em', color: '#F1F5F9' }}
        >
          Ready to launch your AI SaaS?
        </h2>
        <p className="relative mb-8 text-[16px]" style={{ color: '#94A3B8' }}>
          Get the free starter kit and launch checklist. Start building today.
        </p>

        <div className="relative mx-auto flex max-w-[480px] justify-center">
          <LeadCaptureForm
            ctaText="Get Free Starter Kit"
            source="bottom-cta"
            variant="inline"
          />
        </div>

        <p className="relative mt-6 text-[13px]" style={{ color: '#64748B' }}>
          Early adopters get priority access to V2 features. No spam, ever.
        </p>
      </div>

      <style>{`
        .reveal-item { opacity: 0; transform: translateY(30px); transition: opacity 0.8s cubic-bezier(.16,1,.3,1), transform 0.8s cubic-bezier(.16,1,.3,1); }
        .reveal-visible { opacity: 1; transform: translateY(0); }
      `}</style>
    </section>
  );
}

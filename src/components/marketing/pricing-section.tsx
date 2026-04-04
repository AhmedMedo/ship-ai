'use client';

import { useEffect, useRef } from 'react';
import { usePurchaseModal } from '@/components/landing/purchase-modal-provider';

const plans = [
  {
    name: 'Starter',
    desc: 'Launch your first AI SaaS',
    price: '$149',
    note: 'Yours forever.',
    featured: false,
    features: [
      'Complete SaaS foundation',
      'AI streaming chat',
      'Multi-provider abstraction',
      'Token tracking',
      'Landing page + blog',
      'Email templates',
      'Dark mode',
    ],
  },
  {
    name: 'Pro',
    desc: 'For serious builders',
    price: '$249',
    note: 'Everything in Starter, plus:',
    featured: true,
    badge: 'Most popular',
    features: [
      'Everything in Starter',
      'Usage-based billing',
      'Admin dashboard',
      'RAG pipeline (V2)',
      'Multi-tenancy (V2)',
      'Priority support',
      'Lifetime updates',
    ],
  },
  {
    name: 'Enterprise',
    desc: 'White-glove setup',
    price: '$499',
    note: 'Everything in Pro, plus:',
    featured: false,
    features: [
      'Everything in Pro',
      '1-hour setup call',
      'Branding removal',
      'Priority GitHub issues',
      'Custom integration',
      'Architecture review',
      'Lifetime updates',
    ],
  },
];

export function PricingSection() {
  const { openModal } = usePurchaseModal();
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('reveal-visible')),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    sectionRef.current?.querySelectorAll('.reveal-item').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="pricing" className="relative z-[1] py-20" ref={sectionRef}>
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
          Pricing
        </div>
        <h2
          className="reveal-item mb-4 text-center font-black"
          style={{ fontSize: 'clamp(30px,4vw,46px)', letterSpacing: '-0.03em', color: '#F1F5F9' }}
        >
          Invest once, ship forever
        </h2>
        <p
          className="reveal-item mx-auto mb-[60px] max-w-[560px] text-center text-[16px] leading-[1.7]"
          style={{ color: '#94A3B8' }}
        >
          One-time purchase. Lifetime updates. Unlimited projects.
        </p>

        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="reveal-item relative rounded-2xl p-9 transition-all duration-300"
              style={
                plan.featured
                  ? {
                      background: 'linear-gradient(#030014, #030014) padding-box, linear-gradient(135deg, #7C3AED, #3498DB, #06B6D4) border-box',
                      border: '1.5px solid transparent',
                      transform: 'scale(1.03)',
                    }
                  : {
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }
              }
              onMouseEnter={(e) => {
                if (!plan.featured) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
              }}
              onMouseLeave={(e) => {
                if (!plan.featured) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
              }}
            >
              {plan.badge && (
                <div
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-[12px] font-bold whitespace-nowrap text-white"
                  style={{ background: 'linear-gradient(135deg, #7C3AED, #3498DB)' }}
                >
                  {plan.badge}
                </div>
              )}

              <div className="mb-1 text-[20px] font-bold" style={{ color: '#F1F5F9' }}>{plan.name}</div>
              <div className="mb-5 text-[13px]" style={{ color: '#4B5563' }}>{plan.desc}</div>

              <div className="mb-1 font-black leading-none" style={{ fontSize: 52, letterSpacing: '-0.04em', color: '#F1F5F9' }}>
                {plan.price}
                <span className="ml-1 text-[16px] font-medium" style={{ color: '#4B5563' }}>one-time</span>
              </div>
              <div className="mb-6 text-[12px]" style={{ color: '#4B5563' }}>{plan.note}</div>

              <ul className="mb-7 space-y-0">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-2.5 py-1.5 text-[14px]" style={{ color: '#94A3B8' }}>
                    <span
                      className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                      style={{ background: 'rgba(34,197,94,0.1)', color: '#4ade80' }}
                    >
                      ✓
                    </span>
                    {feat}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => openModal(plan.name.toLowerCase() as 'starter' | 'pro' | 'enterprise')}
                className="block w-full rounded-[10px] py-3 text-center text-[15px] font-bold transition-all"
                style={
                  plan.featured
                    ? { background: 'linear-gradient(135deg, #0F4C75, #3498DB)', color: '#fff' }
                    : { background: 'transparent', color: '#F1F5F9', border: '1.5px solid rgba(255,255,255,0.08)' }
                }
                onMouseEnter={(e) => {
                  if (plan.featured) {
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(15,76,117,0.4)';
                  } else {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (plan.featured) {
                    e.currentTarget.style.boxShadow = 'none';
                  } else {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                Get {plan.name}
              </button>
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

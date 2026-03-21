import type { Metadata } from 'next';
import { Navbar } from '@/components/marketing/navbar';
import { HeroSection } from '@/components/marketing/hero-section';
import { DemoSection } from '@/components/marketing/demo-section';
import { FeaturesSection } from '@/components/marketing/features-section';
import { PricingSection } from '@/components/marketing/pricing-section';
import { CtaSection } from '@/components/marketing/cta-section';
import { Footer } from '@/components/marketing/footer';

export const metadata: Metadata = {
  title: 'Ignitra — Launch your AI SaaS in days, not months',
  description:
    'The Next.js boilerplate with auth, payments, streaming AI chat, token tracking, and usage-based billing. Clone. Customize. Deploy.',
  openGraph: {
    title: 'Ignitra — Launch your AI SaaS in days, not months',
    description:
      'The Next.js boilerplate with auth, payments, streaming AI chat, token tracking, and usage-based billing.',
    type: 'website',
  },
};

export default function HomePage() {
  return (
    <>
      {/* Fixed grid background */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      <Navbar />

      <main>
        <HeroSection />
        <DemoSection />
        <FeaturesSection />
        <PricingSection />
        <CtaSection />
      </main>

      <Footer />
    </>
  );
}

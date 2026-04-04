import type { Metadata } from 'next';
import { Navbar } from '@/components/marketing/navbar';
import { HeroSection } from '@/components/marketing/hero-section';
import { DemoSection } from '@/components/marketing/demo-section';
import { FeaturesSection } from '@/components/marketing/features-section';
import { PricingSection } from '@/components/marketing/pricing-section';
import { CtaSection } from '@/components/marketing/cta-section';
import { ContactSection } from '@/components/landing/contact-section';
import { Footer } from '@/components/marketing/footer';

export const metadata: Metadata = {
  title: 'Ignitra — Launch your AI SaaS in days, not months',
  description:
    'The Next.js boilerplate with auth, payments, streaming AI chat, token tracking, and usage-based billing. Clone. Customize. Deploy.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Ignitra — Launch your AI SaaS in days, not months',
    description:
      'The Next.js boilerplate with auth, payments, streaming AI chat, token tracking, and usage-based billing.',
    type: 'website',
    url: '/',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Ignitra — The AI-Native SaaS Boilerplate' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ignitra — Launch your AI SaaS in days, not months',
    description:
      'The Next.js boilerplate with auth, payments, streaming AI chat, token tracking, and usage-based billing.',
    images: ['/opengraph-image'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Ignitra',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://ignitra.dev',
  description:
    'The Next.js boilerplate with auth, payments, streaming AI chat, token tracking, and usage-based billing.',
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
        <ContactSection />
      </main>

      <Footer />
    </>
  );
}

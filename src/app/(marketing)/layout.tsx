// Marketing layout — dark theme only, no light/dark toggle
// Dashboard has its own theme system; landing page is always dark

import { PurchaseModalProvider } from '@/components/landing/purchase-modal-provider';
import { KofiButton } from '@/components/marketing/kofi-button';
import { GoogleAnalytics } from '@next/third-parties/google';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dark min-h-screen scroll-smooth" style={{ background: '#030014', color: '#F1F5F9' }}>
      <PurchaseModalProvider>
        {children}
        <KofiButton />
      </PurchaseModalProvider>
      {/*
       * GoogleAnalytics injects a <link rel="preconnect" href="https://www.googletagmanager.com">
       * Only render it when the GA ID is actually configured — keeps the preconnect out of the
       * critical path on environments without GA (local dev, PageSpeed runs without the env var).
       */}
      {GA_ID ? <GoogleAnalytics gaId={GA_ID} /> : null}
    </div>
  );
}

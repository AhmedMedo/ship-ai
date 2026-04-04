// Marketing layout — dark theme only, no light/dark toggle
// Dashboard has its own theme system; landing page is always dark

import { GoogleAnalytics } from '@next/third-parties/google';
import { PurchaseModalProvider } from '@/components/landing/purchase-modal-provider';
import { KofiButton } from '@/components/marketing/kofi-button';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dark min-h-screen scroll-smooth" style={{ background: '#030014', color: '#F1F5F9' }}>
      <PurchaseModalProvider>
        {children}
        <KofiButton />
      </PurchaseModalProvider>
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
    </div>
  );
}

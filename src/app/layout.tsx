import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { ThemeProvider } from '@/components/shared/theme-provider';
import '@/app/globals.css';

/** Only Vercel Production sets this — skips local, preview, and self-hosted builds without skewing dashboards. */
const isVercelProduction = process.env.VERCEL_ENV === 'production';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

// Force dynamic rendering — ThemeProvider (client component) causes
// useContext errors during static prerendering
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://ignitra.dev'),
  title: {
    default: 'Ignitra — The AI-Native SaaS Boilerplate',
    template: '%s | Ignitra',
  },
  description:
    'Launch your AI SaaS in days, not months. Next.js boilerplate with auth, payments, streaming AI chat, token tracking, and usage-based billing.',
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    siteName: 'Ignitra',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} min-h-screen font-sans antialiased`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          {isVercelProduction ? <Analytics /> : null}
        </ThemeProvider>
      </body>
    </html>
  );
}

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


export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://ignitra.dev'),
  title: {
    default: 'Ignitra — The AI-Native SaaS Boilerplate',
    template: '%s | Ignitra',
  },
  description:
    'Launch your AI SaaS in days, not months. Next.js boilerplate with auth, payments, streaming AI chat, token tracking, and usage-based billing.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    siteName: 'Ignitra',
    locale: 'en_US',
    type: 'website',
    url: 'https://ignitra.dev',
    title: 'Ignitra — Launch your AI SaaS in days, not months',
    description:
      'The Next.js boilerplate with auth, payments, streaming AI chat, token tracking, and usage-based billing.',
    images: [
      {
        url: 'https://ignitra.dev/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Ignitra — The AI-Native SaaS Boilerplate',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ignitra — Launch your AI SaaS in days, not months',
    description:
      'Next.js boilerplate with auth, payments, AI chat, token tracking.',
    images: ['https://ignitra.dev/og-image.png'],
    creator: '@AhmedAlaa707',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Ignitra',
  url: 'https://ignitra.dev',
  description:
    'AI-native Next.js SaaS boilerplate with auth, payments, streaming chat, token tracking, and usage-based billing.',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'AggregateOffer',
    lowPrice: '149',
    highPrice: '499',
    priceCurrency: 'USD',
  },
  author: {
    '@type': 'Person',
    name: 'Ahmed Alaa',
    url: 'https://twitter.com/AhmedAlaa707',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      <body className={`${inter.variable} min-h-screen font-sans antialiased`} suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          {isVercelProduction ? <Analytics /> : null}
        </ThemeProvider>
      </body>
    </html>
  );
}

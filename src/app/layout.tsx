import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/shared/theme-provider';
import '@/app/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

// Force dynamic rendering — ThemeProvider (client component) causes
// useContext errors during static prerendering
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} min-h-screen font-sans antialiased`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

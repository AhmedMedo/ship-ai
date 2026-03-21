import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/shared/theme-provider';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: {
    default: 'ShipAI — AI-Powered SaaS Boilerplate',
    template: '%s | ShipAI',
  },
  description:
    'Launch your AI SaaS in days, not months. Production-ready Next.js boilerplate with streaming chat, multi-provider AI, usage tracking, and Stripe billing.',
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

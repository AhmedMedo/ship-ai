'use client';

import Link from 'next/link';
import { Logo } from '@/components/shared/logo';

const columns = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Demo', href: '/login' },
      { label: 'Blog', href: '/blog' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'License', href: '/license' },
      { label: 'Sign up', href: '/signup' },
      { label: 'Log in', href: '/login' },
    ],
  },
  {
    title: 'Connect',
    links: [
      { label: 'Twitter/X', href: 'https://x.com/AhmedAlaa707', external: true },
      { label: 'Email', href: 'mailto:info@ignitra.dev' },
    ],
  },
];

export function Footer() {
  return (
    <footer
      className="relative z-[1]"
      style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="mx-auto max-w-[1200px] flex flex-wrap justify-between gap-12 px-6 py-12">
        {/* Brand */}
        <div className="max-w-[280px]">
          <Logo size="md" className="mb-1" />
          <p className="mt-2 text-[13px] leading-[1.6]" style={{ color: '#4B5563' }}>
            The AI-native SaaS boilerplate for developers who ship fast.
          </p>
        </div>

        {/* Link columns */}
        {columns.map((col) => (
          <div key={col.title}>
            <h4
              className="mb-3.5 text-[12px] font-bold uppercase tracking-[1px]"
              style={{ color: '#4B5563' }}
            >
              {col.title}
            </h4>
            {col.links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block py-1 text-[14px] transition-colors"
                style={{ color: '#94A3B8' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#F1F5F9')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
              >
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div
        className="mx-auto max-w-[1200px] border-t px-6 py-6 text-[13px]"
        style={{ borderColor: 'rgba(255,255,255,0.06)', color: '#4B5563' }}
      >
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <span>© 2026 Ignitra. All rights reserved.</span>
          <a
            href="https://ko-fi.com/ahmedalaa20194"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 transition-colors"
            style={{ color: 'rgba(255,255,255,0.5)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#F1F5F9')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
          >
            <svg className="h-3.5 w-3.5 text-red-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            Support this project
          </a>
        </div>
      </div>
    </footer>
  );
}

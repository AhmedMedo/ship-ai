'use client';

import Link from 'next/link';
import { Logo } from '@/components/shared/logo';

const columns = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Demo', href: '/dashboard/chat' },
      { label: 'Changelog', href: '#' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Docs', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Support', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Twitter/X', href: '#' },
      { label: 'GitHub', href: '#' },
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
        className="mx-auto max-w-[1200px] border-t px-6 py-6 text-center text-[13px]"
        style={{ borderColor: 'rgba(255,255,255,0.06)', color: '#4B5563' }}
      >
        © 2026 Ignitra. All rights reserved.
      </div>
    </footer>
  );
}

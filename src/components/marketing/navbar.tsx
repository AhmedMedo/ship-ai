'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Logo } from '@/components/shared/logo';
import { usePurchaseModal } from '@/components/landing/purchase-modal-provider';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Contact', href: '#contact' },
  { label: 'Docs', href: '/docs/getting-started' },
  { label: 'Blog', href: '/blog' },
];

function scrollTo(href: string) {
  if (!href.startsWith('#')) return;
  const id = href.slice(1);
  const el = document.getElementById(id);
  if (el) {
    const offset = 72; // navbar height
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { openModal } = usePurchaseModal();

  return (
    <nav
      className="fixed left-0 right-0 top-0 z-[100]"
      style={{
        background: 'rgba(3,0,20,0.5)',
        backdropFilter: 'blur(20px) saturate(1.5)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5" aria-label="Ignitra — home">
          <Logo size="md" />
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) =>
            link.href.startsWith('#') ? (
              <button
                type="button"
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className="text-[14px] font-medium transition-colors"
                style={{ color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#F1F5F9')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
              >
                {link.label}
              </button>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="text-[14px] font-medium transition-colors"
                style={{ color: '#94A3B8' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#F1F5F9')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
              >
                {link.label}
              </Link>
            ),
          )}
        </div>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-2.5 md:flex">
          <Link
            href="/login"
            className="rounded-lg border px-4 py-2 text-[13px] font-medium transition-all"
            style={{
              borderColor: 'rgba(255,255,255,0.08)',
              color: '#94A3B8',
              background: 'transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)';
              e.currentTarget.style.color = '#F1F5F9';
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.color = '#94A3B8';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            Log in
          </Link>
          <button
            onClick={() => openModal('pro')}
            className="rounded-lg px-5 py-2 text-[13px] font-semibold text-white transition-all"
            style={{ background: '#0F4C75' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 30px rgba(15,76,117,0.4)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'none';
            }}
          >
            Get Ignitra
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="flex items-center justify-center md:hidden"
          onClick={() => setOpen(!open)}
          style={{ color: '#94A3B8' }}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="border-t px-6 py-4 md:hidden"
          style={{
            borderColor: 'rgba(255,255,255,0.06)',
            background: 'rgba(3,0,20,0.95)',
          }}
        >
          {navLinks.map((link) =>
            link.href.startsWith('#') ? (
              <button
                type="button"
                key={link.label}
                onClick={() => { scrollTo(link.href); setOpen(false); }}
                className="block w-full py-2.5 text-left text-sm font-medium"
                style={{ color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {link.label}
              </button>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="block py-2.5 text-sm font-medium"
                style={{ color: '#94A3B8' }}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ),
          )}
          <div className="mt-4 flex flex-col gap-2">
            <Link
              href="/login"
              className="rounded-lg border px-4 py-2.5 text-center text-sm font-medium"
              style={{ borderColor: 'rgba(255,255,255,0.08)', color: '#94A3B8' }}
            >
              Log in
            </Link>
            <button
              onClick={() => { openModal('pro'); setOpen(false); }}
              className="rounded-lg px-4 py-2.5 text-center text-sm font-semibold text-white"
              style={{ background: '#0F4C75' }}
            >
              Get Ignitra
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

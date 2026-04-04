'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Navbar } from '@/components/marketing/navbar';
import { DocsSidebar } from '@/components/docs/docs-sidebar';

export function DocsShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-16" style={{ background: '#030014' }}>
        <div
          className="sticky top-16 z-40 flex h-12 items-center gap-3 border-b border-white/[0.06] px-4 lg:hidden"
          style={{ background: '#030014' }}
        >
          <button
            type="button"
            aria-expanded={mobileOpen}
            aria-controls="docs-sidebar"
            onClick={() => setMobileOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">{mobileOpen ? 'Close documentation menu' : 'Open documentation menu'}</span>
          </button>
          <span className="text-sm font-medium text-gray-400">Documentation</span>
        </div>

        <div className="flex">
          {mobileOpen ? (
            <div
              role="presentation"
              className="fixed inset-x-0 bottom-0 top-[7rem] z-40 bg-black/60 lg:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden
            />
          ) : null}

          <aside
            id="docs-sidebar"
            className={cn(
              'w-[240px] shrink-0 overflow-y-auto border-r border-white/[0.06] bg-white/[0.02] transition-transform duration-200 ease-out',
              'max-lg:fixed max-lg:bottom-0 max-lg:left-0 max-lg:top-[7rem] max-lg:z-50 max-lg:h-[calc(100vh-7rem)]',
              mobileOpen ? 'max-lg:translate-x-0' : 'max-lg:-translate-x-full',
              'lg:sticky lg:top-20 lg:z-auto lg:h-[calc(100vh-5rem)] lg:translate-x-0',
            )}
          >
            <DocsSidebar onNavigate={() => setMobileOpen(false)} />
          </aside>

          <div className="min-w-0 flex-1">
            <main className="mx-auto max-w-[720px] px-6 py-8 lg:py-10">{children}</main>
          </div>
        </div>
      </div>
    </>
  );
}

'use client';

import Link from 'next/link';
import { Logo } from '@/components/shared/logo';
import { LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

// Admin layout — role guard is handled by middleware (src/lib/supabase/middleware.ts).
// Non-admins are redirected to /dashboard before reaching this layout.

const adminNav = [
  { label: 'Overview', href: '/admin' },
  { label: 'Users', href: '/admin/users' },
  { label: 'Leads', href: '/admin/leads' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-muted">
      {/* Sidebar */}
      <aside className="flex w-56 flex-shrink-0 flex-col border-r bg-card">
        <div className="px-5 py-5">
          <Logo size="md" />
        </div>
        <div className="mb-2 px-5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          Admin
        </div>
        <nav className="flex-1 px-3">
          {adminNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="my-0.5 block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="space-y-2 border-t px-4 py-4">
          <Link
            href="/dashboard"
            className="block text-xs font-semibold text-primary"
          >
            ← Back to Dashboard
          </Link>
          <button
            type="button"
            onClick={async () => {
              const supabase = createClient();
              await supabase.auth.signOut();
              window.location.href = '/login';
            }}
            className="flex items-center gap-1.5 text-xs font-medium text-destructive"
          >
            <LogOut className="h-3 w-3" />
            Log out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-[1024px]">{children}</div>
      </main>
    </div>
  );
}

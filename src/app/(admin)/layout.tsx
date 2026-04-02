import Link from 'next/link';
import { Logo } from '@/components/shared/logo';

// Admin layout — role guard is handled by middleware (src/lib/supabase/middleware.ts).
// Non-admins are redirected to /dashboard before reaching this layout.

const adminNav = [
  { label: 'Overview', href: '/admin' },
  { label: 'Users', href: '/admin/users' },
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
        <div className="border-t px-4 py-4">
          <Link
            href="/dashboard"
            className="text-xs font-semibold text-primary"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-[1024px]">{children}</div>
      </main>
    </div>
  );
}

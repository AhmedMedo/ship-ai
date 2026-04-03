'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, MessageSquare, BarChart3, Settings, CreditCard, Users, PieChart } from 'lucide-react';
import { Logo } from '@/components/shared/logo';
import { cn } from '@/lib/utils';

interface SidebarProps {
  userEmail?: string;
  userRole?: string;
  planName?: string;
}

const mainNav = [
  { label: 'Overview', href: '/dashboard', icon: LayoutGrid },
  { label: 'Chat', href: '/dashboard/chat', icon: MessageSquare },
  { label: 'Usage', href: '/dashboard/usage', icon: BarChart3 },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  { label: 'Billing', href: '/dashboard/billing', icon: CreditCard },
];

const adminNav = [
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Analytics', href: '/admin/analytics', icon: PieChart },
];

export function Sidebar({ userEmail, userRole, planName = 'Free' }: SidebarProps) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname?.startsWith(href) ?? false;
  }

  return (
    <aside className="flex h-full w-64 flex-shrink-0 flex-col border-r bg-card">
      <div className="px-5 py-5">
        <Logo size="md" />
      </div>

      <nav className="flex-1 px-3 py-1">
        {mainNav.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'my-0.5 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-primary text-white'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <item.icon className="h-[18px] w-[18px]" />
              {item.label}
            </Link>
          );
        })}

        {userRole === 'admin' && (
          <>
            <div className="mx-3 my-2 h-px bg-border" />
            <div className="px-3 pb-1.5 pt-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Admin
            </div>
            {adminNav.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'my-0.5 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    active
                      ? 'bg-primary text-white'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  <item.icon className="h-[18px] w-[18px]" />
                  {item.label}
                </Link>
              );
            })}
          </>
        )}
      </nav>

      <div className="border-t px-4 py-4">
        <div className="mb-2 inline-flex rounded-md bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
          {planName} plan
        </div>
        <div className="truncate text-xs text-muted-foreground">
          {userEmail || 'user@example.com'}
        </div>
      </div>
    </aside>
  );
}

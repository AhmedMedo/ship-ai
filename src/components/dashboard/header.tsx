'use client';

import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Sidebar } from './sidebar';

interface HeaderProps {
  userEmail?: string;
  userRole?: string;
  planName?: string;
}

const pageTitles: Record<string, string> = {
  '/dashboard': 'Overview',
  '/dashboard/chat': 'Chat',
  '/dashboard/usage': 'Usage',
  '/dashboard/settings': 'Settings',
  '/dashboard/billing': 'Billing',
  '/admin': 'Admin',
  '/admin/users': 'Users',
  '/admin/analytics': 'Analytics',
};

export function Header({ userEmail, userRole, planName }: HeaderProps) {
  const pathname = usePathname();
  const title = pageTitles[pathname] || 'Dashboard';

  return (
    <header
      className="flex h-14 flex-shrink-0 items-center justify-between border-b bg-card px-6"
    >
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <Sidebar userEmail={userEmail} userRole={userRole} planName={planName} />
          </SheetContent>
        </Sheet>

        <h1 className="text-lg font-bold">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
          {userEmail ? userEmail[0].toUpperCase() : 'A'}
        </div>
      </div>
    </header>
  );
}

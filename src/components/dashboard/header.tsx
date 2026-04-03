'use client';

import { usePathname } from 'next/navigation';
import { Menu, LogOut } from 'lucide-react';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sidebar } from './sidebar';
import { createClient } from '@/lib/supabase/client';

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
  const title = (pathname && pageTitles[pathname]) || 'Dashboard';

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/login';
  }

  return (
    <header className="flex h-14 flex-shrink-0 items-center justify-between border-b bg-card px-6">
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white outline-none">
              {userEmail ? userEmail[0].toUpperCase() : 'A'}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-3 py-2 text-xs text-muted-foreground">
              {userEmail || 'user@example.com'}
            </div>
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

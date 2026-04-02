'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { User, Mail, Shield } from 'lucide-react';

export default function SettingsPage() {
  const [user, setUser] = useState<{ email: string; fullName: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        setUser({
          email: authUser.email ?? '',
          fullName: authUser.user_metadata?.full_name ?? '',
          role: authUser.app_metadata?.role ?? 'user',
        });
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/login';
  }

  if (loading) {
    return (
      <>
        <h2 className="mb-4 text-lg font-bold">Settings</h2>
        <div className="h-48 animate-pulse rounded-xl border bg-card" />
      </>
    );
  }

  return (
    <>
      <h2 className="mb-4 text-lg font-bold">Settings</h2>

      {/* Profile card */}
      <div className="mb-4 rounded-xl border bg-card p-6">
        <h3 className="mb-4 text-base font-bold">Profile</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <User className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-xs text-muted-foreground">Name</div>
              <div className="text-sm font-medium">{user?.fullName || '—'}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-xs text-muted-foreground">Email</div>
              <div className="text-sm font-medium">{user?.email || '—'}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-xs text-muted-foreground">Role</div>
              <div className="text-sm font-medium capitalize">{user?.role}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="rounded-xl border border-destructive/20 bg-card p-6">
        <h3 className="mb-2 text-base font-bold">Account</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Sign out of your account on this device.
        </p>
        <Button variant="destructive" size="sm" onClick={handleLogout}>
          Log out
        </Button>
      </div>
    </>
  );
}

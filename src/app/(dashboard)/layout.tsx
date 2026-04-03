import { Sidebar } from '@/components/dashboard/sidebar';
import { Header } from '@/components/dashboard/header';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/db';
import { profiles, plans } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let userEmail = '';
  let userRole = 'user';
  let planName = 'Free';

  if (user) {
    const [profile] = await db
      .select({ email: profiles.email, role: profiles.role, planName: plans.name })
      .from(profiles)
      .leftJoin(plans, eq(profiles.planId, plans.id))
      .where(eq(profiles.id, user.id))
      .limit(1);

    userEmail = profile?.email ?? user.email ?? '';
    userRole = profile?.role ?? 'user';
    planName = profile?.planName ?? 'Free';
  }

  return (
    <div className="flex h-screen overflow-hidden bg-muted">
      <div className="hidden md:flex">
        <Sidebar userEmail={userEmail} userRole={userRole} planName={planName} />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header userEmail={userEmail} userRole={userRole} planName={planName} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-[1024px]">{children}</div>
        </main>
      </div>
    </div>
  );
}

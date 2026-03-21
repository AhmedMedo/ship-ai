import { Sidebar } from '@/components/dashboard/sidebar';
import { Header } from '@/components/dashboard/header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // TODO: Fetch real user data server-side once auth is wired
  const userEmail = 'alex@ignitra.dev';
  const userRole = 'admin';
  const planName = 'Pro';

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--muted)' }}>
      {/* Sidebar — hidden on mobile, visible on md+ */}
      <div className="hidden md:flex">
        <Sidebar userEmail={userEmail} userRole={userRole} planName={planName} />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header userEmail={userEmail} userRole={userRole} planName={planName} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-[1024px]">{children}</div>
        </main>
      </div>
    </div>
  );
}

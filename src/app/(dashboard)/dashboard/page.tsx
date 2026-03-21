import Link from 'next/link';
import { MessageSquare, Zap, CreditCard, DollarSign } from 'lucide-react';

// TODO: Wire to real data from DB in later tasks
const stats = {
  conversations: 24,
  tokensToday: 4520,
  tokenLimit: 100000,
  plan: 'Pro',
  renewDate: 'Apr 20, 2026',
  costToday: '$0.07',
  costMonth: '$2.34',
};

export default function DashboardPage() {
  const usagePercent = (stats.tokensToday / stats.tokenLimit) * 100;

  return (
    <>
      {/* Stat Cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {/* Conversations */}
        <div className="rounded-xl border p-[18px]" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="mb-2 flex items-center gap-2 text-[13px] font-medium" style={{ color: '#475569' }}>
            <MessageSquare className="h-4 w-4 opacity-60" />
            Conversations
          </div>
          <div className="text-[28px] font-extrabold tracking-tight">{stats.conversations}</div>
          <div className="mt-1 text-xs" style={{ color: '#22C55E' }}>+3 today</div>
        </div>

        {/* Tokens today */}
        <div className="rounded-xl border p-[18px]" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="mb-2 flex items-center gap-2 text-[13px] font-medium" style={{ color: '#475569' }}>
            <Zap className="h-4 w-4 opacity-60" />
            Tokens today
          </div>
          <div className="text-[28px] font-extrabold tracking-tight">{stats.tokensToday.toLocaleString()}</div>
          <div className="mt-1 text-xs" style={{ color: '#94A3B8' }}>of {stats.tokenLimit.toLocaleString()} daily limit</div>
          <div className="mt-2">
            <div className="h-2 w-full overflow-hidden rounded-full" style={{ background: 'var(--muted)' }}>
              <div
                className="h-full rounded-full"
                style={{ width: `${usagePercent}%`, background: '#0F4C75' }}
              />
            </div>
          </div>
        </div>

        {/* Current plan */}
        <div className="rounded-xl border p-[18px]" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="mb-2 flex items-center gap-2 text-[13px] font-medium" style={{ color: '#475569' }}>
            <CreditCard className="h-4 w-4 opacity-60" />
            Current plan
          </div>
          <div className="mt-2">
            <span
              className="inline-flex rounded-md px-2 py-[3px] text-xs font-bold"
              style={{ background: '#E8F4FD', color: '#0F4C75' }}
            >
              {stats.plan}
            </span>
          </div>
          <div className="mt-1 text-xs" style={{ color: '#94A3B8' }}>Renews {stats.renewDate}</div>
        </div>

        {/* AI cost */}
        <div className="rounded-xl border p-[18px]" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="mb-2 flex items-center gap-2 text-[13px] font-medium" style={{ color: '#475569' }}>
            <DollarSign className="h-4 w-4 opacity-60" />
            AI cost today
          </div>
          <div className="text-[28px] font-extrabold tracking-tight">{stats.costToday}</div>
          <div className="mt-1 text-xs" style={{ color: '#94A3B8' }}>{stats.costMonth} this month</div>
        </div>
      </div>

      {/* Usage breakdown */}
      <h2 className="mb-3.5 text-base font-bold">Usage breakdown</h2>
      <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2">
        {/* Daily usage */}
        <div className="rounded-xl border p-5" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold">Daily usage</span>
            <span className="text-[13px]" style={{ color: '#475569' }}>4,520 / 100,000</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full" style={{ background: 'var(--muted)' }}>
            <div className="h-full rounded-full" style={{ width: '4.5%', background: '#0F4C75' }} />
          </div>
          <div className="mt-2 flex justify-between text-xs" style={{ color: '#94A3B8' }}>
            <span>4.5% used</span>
            <span>95,480 remaining</span>
          </div>
        </div>

        {/* Monthly usage */}
        <div className="rounded-xl border p-5" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold">Monthly usage</span>
            <span className="text-[13px]" style={{ color: '#475569' }}>145,200 / 3,000,000</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full" style={{ background: 'var(--muted)' }}>
            <div className="h-full rounded-full" style={{ width: '4.8%', background: '#0F4C75' }} />
          </div>
          <div className="mt-2 flex justify-between text-xs" style={{ color: '#94A3B8' }}>
            <span>4.8% used</span>
            <span>2,854,800 remaining</span>
          </div>
        </div>
      </div>

      {/* Model breakdown */}
      <h2 className="mb-3.5 text-base font-bold">Usage by model</h2>
      <div className="mb-6 overflow-hidden rounded-xl border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <table className="w-full border-collapse">
          <thead>
            <tr style={{ background: 'var(--muted)' }}>
              <th className="border-b px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#94A3B8', borderColor: 'var(--border)' }}>Model</th>
              <th className="border-b px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#94A3B8', borderColor: 'var(--border)' }}>Requests</th>
              <th className="border-b px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#94A3B8', borderColor: 'var(--border)' }}>Tokens</th>
              <th className="border-b px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#94A3B8', borderColor: 'var(--border)' }}>Cost</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border-b px-4 py-3 text-[13px]" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2 font-semibold">
                  <div className="h-2 w-2 rounded-full" style={{ background: '#22C55E' }} />
                  gpt-4o-mini
                </div>
              </td>
              <td className="border-b px-4 py-3 text-[13px]" style={{ borderColor: 'var(--border)' }}>18</td>
              <td className="border-b px-4 py-3 text-[13px]" style={{ borderColor: 'var(--border)' }}>3,200</td>
              <td className="border-b px-4 py-3 text-[13px]" style={{ borderColor: 'var(--border)' }}>$0.003</td>
            </tr>
            <tr>
              <td className="border-b px-4 py-3 text-[13px]" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2 font-semibold">
                  <div className="h-2 w-2 rounded-full" style={{ background: '#3498DB' }} />
                  claude-3-haiku
                </div>
              </td>
              <td className="border-b px-4 py-3 text-[13px]" style={{ borderColor: 'var(--border)' }}>4</td>
              <td className="border-b px-4 py-3 text-[13px]" style={{ borderColor: 'var(--border)' }}>1,120</td>
              <td className="border-b px-4 py-3 text-[13px]" style={{ borderColor: 'var(--border)' }}>$0.006</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-[13px]">
                <div className="flex items-center gap-2 font-semibold">
                  <div className="h-2 w-2 rounded-full" style={{ background: '#EAB308' }} />
                  gpt-4o
                </div>
              </td>
              <td className="px-4 py-3 text-[13px]">2</td>
              <td className="px-4 py-3 text-[13px]">200</td>
              <td className="px-4 py-3 text-[13px]">$0.061</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Recent conversations */}
      <h2 className="mb-3.5 text-base font-bold">Recent conversations</h2>
      <div className="overflow-hidden rounded-xl border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between border-b px-4 py-4" style={{ borderColor: 'var(--border)' }}>
          <h3 className="text-[15px] font-bold">Today</h3>
          <Link href="/dashboard/chat" className="text-[13px] font-semibold" style={{ color: '#0F4C75' }}>View all</Link>
        </div>
        {[
          { title: 'Explain React hooks', meta: '12 messages · gpt-4o-mini · 2 min ago', tokens: '1,234 tokens' },
          { title: 'Python FastAPI authentication setup', meta: '8 messages · claude-3-haiku · 1 hour ago', tokens: '890 tokens' },
          { title: 'Docker multi-stage builds', meta: '5 messages · gpt-4o-mini · 3 hours ago', tokens: '652 tokens' },
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 border-b px-4 py-3.5 last:border-b-0"
            style={{ borderColor: 'var(--border)' }}
          >
            <div
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg"
              style={{ background: '#E8F4FD' }}
            >
              <MessageSquare className="h-[18px] w-[18px]" style={{ color: '#0F4C75' }} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-semibold">{item.title}</div>
              <div className="mt-0.5 text-[11px]" style={{ color: '#94A3B8' }}>{item.meta}</div>
            </div>
            <div className="flex-shrink-0 text-xs font-semibold" style={{ color: '#475569' }}>{item.tokens}</div>
          </div>
        ))}
      </div>
    </>
  );
}

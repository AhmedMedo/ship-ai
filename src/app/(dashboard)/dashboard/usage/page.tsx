'use client';

import { useState, useEffect } from 'react';
import { Zap, Activity } from 'lucide-react';
import { MODEL_COLORS } from '@/lib/ai/models';

interface UsageData {
  period: string;
  tokensUsed: number;
  tokenLimit: number;
  percentUsed: number;
  costUsd: number;
  requestCount: number;
  plan: { name: string; slug: string };
  byModel: Record<string, { tokens: number; cost: number; requests: number }>;
}

// Color based on usage percentage — matches DESIGN.md spec
function barColor(percent: number) {
  if (percent >= 90) return 'bg-red-500';
  if (percent >= 70) return 'bg-yellow-500';
  return 'bg-primary';
}


export default function UsagePage() {
  const [daily, setDaily] = useState<UsageData | null>(null);
  const [monthly, setMonthly] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [d, m] = await Promise.all([
          fetch('/api/usage?period=today').then((r) => r.json()),
          fetch('/api/usage?period=month').then((r) => r.json()),
        ]);
        setDaily(d);
        setMonthly(m);
      } catch {
        // Silently fail — skeleton stays
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <>
        <h2 className="mb-4 text-lg font-bold">Usage</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-xl border bg-card" />
          ))}
        </div>
        <div className="mt-4 h-60 animate-pulse rounded-xl border bg-card" />
      </>
    );
  }

  return (
    <>
      <h2 className="mb-4 text-lg font-bold">Usage</h2>

      {/* Usage cards — daily + monthly */}
      <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2">
        <UsageCard
          label="Daily usage"
          icon={<Zap className="h-4 w-4 text-muted-foreground" />}
          used={daily?.tokensUsed ?? 0}
          limit={daily?.tokenLimit ?? 5000}
          percent={daily?.percentUsed ?? 0}
          cost={daily?.costUsd ?? 0}
          requests={daily?.requestCount ?? 0}
        />
        <UsageCard
          label="Monthly usage"
          icon={<Activity className="h-4 w-4 text-muted-foreground" />}
          used={monthly?.tokensUsed ?? 0}
          limit={monthly?.tokenLimit ?? 50000}
          percent={monthly?.percentUsed ?? 0}
          cost={monthly?.costUsd ?? 0}
          requests={monthly?.requestCount ?? 0}
        />
      </div>

      {/* Model breakdown table */}
      <h3 className="mb-3 text-base font-bold">Usage by model</h3>
      <div className="overflow-hidden rounded-xl border bg-card">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="border-b px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Model
              </th>
              <th className="border-b px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Requests
              </th>
              <th className="border-b px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Tokens
              </th>
              <th className="border-b px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Cost
              </th>
            </tr>
          </thead>
          <tbody>
            {daily?.byModel && Object.keys(daily.byModel).length > 0 ? (
              Object.entries(daily.byModel).map(([model, data]) => (
                <tr key={model}>
                  <td className="border-b px-4 py-3 text-[13px]">
                    <div className="flex items-center gap-2 font-semibold">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ background: MODEL_COLORS[model] ?? 'var(--color-muted-foreground)' }}
                      />
                      {model}
                    </div>
                  </td>
                  <td className="border-b px-4 py-3 text-[13px]">{data.requests}</td>
                  <td className="border-b px-4 py-3 text-[13px]">{data.tokens.toLocaleString()}</td>
                  <td className="border-b px-4 py-3 text-[13px]">${data.cost.toFixed(4)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-sm text-muted-foreground"
                >
                  No usage data yet. Start a conversation to see model breakdown.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Cost summary */}
      <div className="mt-4 rounded-xl border bg-card p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold">Total cost today</div>
            <div className="mt-1 text-2xl font-extrabold">${(daily?.costUsd ?? 0).toFixed(4)}</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold">This month</div>
            <div className="mt-1 text-2xl font-extrabold">${(monthly?.costUsd ?? 0).toFixed(4)}</div>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Plan: {daily?.plan?.name ?? 'Free'} · Costs are estimates based on model pricing.
        </p>
      </div>
    </>
  );
}

function UsageCard({
  label,
  icon,
  used,
  limit,
  percent,
  cost,
  requests,
}: {
  label: string;
  icon: React.ReactNode;
  used: number;
  limit: number;
  percent: number;
  cost: number;
  requests: number;
}) {
  const remaining = Math.max(0, limit - used);

  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold">
          {icon}
          {label}
        </div>
        <span className="text-[13px] text-muted-foreground">
          {used.toLocaleString()} / {limit.toLocaleString()}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor(percent)}`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>

      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        <span>{percent.toFixed(1)}% used</span>
        <span>{remaining.toLocaleString()} remaining</span>
      </div>

      <div className="mt-3 flex gap-4 border-t pt-3 text-xs text-muted-foreground">
        <span>{requests} request{requests !== 1 ? 's' : ''}</span>
        <span>${cost.toFixed(4)} cost</span>
      </div>
    </div>
  );
}

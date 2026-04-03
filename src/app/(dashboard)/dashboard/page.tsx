'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageSquare, Zap, CreditCard, DollarSign } from 'lucide-react';
import { MODEL_COLORS } from '@/lib/ai/models';

interface UsageData {
  tokensUsed: number;
  tokenLimit: number;
  percentUsed: number;
  costUsd: number;
  requestCount: number;
  conversationCount: number;
  plan: { name: string; slug: string };
  byModel: Record<string, { tokens: number; cost: number; requests: number }>;
}


// Progress bar color based on DESIGN.md spec
function barColor(percent: number) {
  if (percent >= 90) return 'bg-red-500';
  if (percent >= 70) return 'bg-yellow-500';
  return 'bg-primary';
}

export default function DashboardPage() {
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
        // Silently fail — show zeros
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const dailyPercent = daily?.percentUsed ?? 0;
  const monthlyPercent = monthly?.percentUsed ?? 0;

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl border bg-card" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl border bg-card" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Stat Cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {/* Conversations */}
        <div className="rounded-xl border bg-card p-[18px]">
          <div className="mb-2 flex items-center gap-2 text-[13px] font-medium text-muted-foreground">
            <MessageSquare className="h-4 w-4 opacity-60" />
            Conversations
          </div>
          <div className="text-[28px] font-extrabold tracking-tight">
            {daily?.conversationCount ?? 0}
          </div>
        </div>

        {/* Tokens today */}
        <div className="rounded-xl border bg-card p-[18px]">
          <div className="mb-2 flex items-center gap-2 text-[13px] font-medium text-muted-foreground">
            <Zap className="h-4 w-4 opacity-60" />
            Tokens today
          </div>
          <div className="text-[28px] font-extrabold tracking-tight">
            {(daily?.tokensUsed ?? 0).toLocaleString()}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            of {(daily?.tokenLimit ?? 5000).toLocaleString()} daily limit
          </div>
          <div className="mt-2">
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full transition-all duration-500 ${barColor(dailyPercent)}`}
                style={{ width: `${Math.min(dailyPercent, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Current plan */}
        <div className="rounded-xl border bg-card p-[18px]">
          <div className="mb-2 flex items-center gap-2 text-[13px] font-medium text-muted-foreground">
            <CreditCard className="h-4 w-4 opacity-60" />
            Current plan
          </div>
          <div className="mt-2">
            <span className="inline-flex rounded-md bg-primary/10 px-2 py-[3px] text-xs font-bold text-primary">
              {daily?.plan?.name ?? 'Free'}
            </span>
          </div>
        </div>

        {/* AI cost */}
        <div className="rounded-xl border bg-card p-[18px]">
          <div className="mb-2 flex items-center gap-2 text-[13px] font-medium text-muted-foreground">
            <DollarSign className="h-4 w-4 opacity-60" />
            AI cost today
          </div>
          <div className="text-[28px] font-extrabold tracking-tight">
            ${(daily?.costUsd ?? 0).toFixed(2)}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            ${(monthly?.costUsd ?? 0).toFixed(2)} this month
          </div>
        </div>
      </div>

      {/* Usage breakdown */}
      <h2 className="mb-3.5 text-base font-bold">Usage breakdown</h2>
      <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2">
        {/* Daily usage */}
        <div className="rounded-xl border bg-card p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold">Daily usage</span>
            <span className="text-[13px] text-muted-foreground">
              {(daily?.tokensUsed ?? 0).toLocaleString()} / {(daily?.tokenLimit ?? 5000).toLocaleString()}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full transition-all duration-500 ${barColor(dailyPercent)}`}
              style={{ width: `${Math.min(dailyPercent, 100)}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>{dailyPercent.toFixed(1)}% used</span>
            <span>{Math.max(0, (daily?.tokenLimit ?? 5000) - (daily?.tokensUsed ?? 0)).toLocaleString()} remaining</span>
          </div>
        </div>

        {/* Monthly usage */}
        <div className="rounded-xl border bg-card p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold">Monthly usage</span>
            <span className="text-[13px] text-muted-foreground">
              {(monthly?.tokensUsed ?? 0).toLocaleString()} / {(monthly?.tokenLimit ?? 50000).toLocaleString()}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full transition-all duration-500 ${barColor(monthlyPercent)}`}
              style={{ width: `${Math.min(monthlyPercent, 100)}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>{monthlyPercent.toFixed(1)}% used</span>
            <span>{Math.max(0, (monthly?.tokenLimit ?? 50000) - (monthly?.tokensUsed ?? 0)).toLocaleString()} remaining</span>
          </div>
        </div>
      </div>

      {/* Model breakdown */}
      <h2 className="mb-3.5 text-base font-bold">Usage by model</h2>
      <div className="mb-6 overflow-hidden rounded-xl border bg-card">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="border-b px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Model</th>
              <th className="border-b px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Requests</th>
              <th className="border-b px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tokens</th>
              <th className="border-b px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cost</th>
            </tr>
          </thead>
          <tbody>
            {daily?.byModel && Object.keys(daily.byModel).length > 0 ? (
              Object.entries(daily.byModel).map(([model, data], i, arr) => (
                <tr key={model}>
                  <td className={`px-4 py-3 text-[13px] ${i < arr.length - 1 ? 'border-b' : ''}`}>
                    <div className="flex items-center gap-2 font-semibold">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ background: MODEL_COLORS[model] ?? 'var(--color-muted-foreground)' }}
                      />
                      {model}
                    </div>
                  </td>
                  <td className={`px-4 py-3 text-[13px] ${i < arr.length - 1 ? 'border-b' : ''}`}>{data.requests}</td>
                  <td className={`px-4 py-3 text-[13px] ${i < arr.length - 1 ? 'border-b' : ''}`}>{data.tokens.toLocaleString()}</td>
                  <td className={`px-4 py-3 text-[13px] ${i < arr.length - 1 ? 'border-b' : ''}`}>${data.cost.toFixed(4)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No usage data yet. Start chatting to see model breakdown.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Quick link to full usage page */}
      <div className="text-center">
        <Link href="/dashboard/usage" className="text-sm font-semibold text-primary">
          View detailed usage →
        </Link>
      </div>
    </>
  );
}

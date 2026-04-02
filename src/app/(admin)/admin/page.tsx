'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, CreditCard, DollarSign, Zap } from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  activeSubscriptions: number;
  mrr: number;
  aiCostToday: number;
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <>
        <h1 className="mb-6 text-xl font-bold">Admin Overview</h1>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl border bg-card" />
          ))}
        </div>
      </>
    );
  }

  const cards = [
    {
      label: 'Total Users',
      value: stats?.totalUsers ?? 0,
      icon: Users,
      format: (v: number) => v.toString(),
    },
    {
      label: 'Active Subscriptions',
      value: stats?.activeSubscriptions ?? 0,
      icon: CreditCard,
      format: (v: number) => v.toString(),
    },
    {
      label: 'MRR',
      value: stats?.mrr ?? 0,
      icon: DollarSign,
      format: (v: number) => `$${v}`,
    },
    {
      label: 'AI Cost Today',
      value: stats?.aiCostToday ?? 0,
      icon: Zap,
      format: (v: number) => `$${v.toFixed(2)}`,
    },
  ];

  return (
    <>
      <h1 className="mb-6 text-xl font-bold">Admin Overview</h1>

      {/* Stats cards */}
      <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl border bg-card p-5">
            <div className="mb-2 flex items-center gap-2 text-[13px] font-medium text-muted-foreground">
              <card.icon className="h-4 w-4 opacity-60" />
              {card.label}
            </div>
            <div className="text-3xl font-extrabold tracking-tight">
              {card.format(card.value)}
            </div>
          </div>
        ))}
      </div>

      <Link
        href="/admin/users"
        className="text-sm font-semibold text-primary"
      >
        Manage users →
      </Link>
    </>
  );
}

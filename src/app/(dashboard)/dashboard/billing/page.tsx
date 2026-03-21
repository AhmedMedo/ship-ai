'use client';

import { useState } from 'react';
import { CreditCard, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BillingPage() {
  const [loading, setLoading] = useState(false);

  // TODO: Fetch real plan data from profile once auth is wired
  const currentPlan = 'Pro';
  const hasSubscription = true;

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planSlug: 'pro', interval: 'monthly' }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      // Handle error
    } finally {
      setLoading(false);
    }
  }

  async function handlePortal() {
    setLoading(true);
    try {
      const res = await fetch('/api/billing/portal', { method: 'POST' });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      // Handle error
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h2 className="mb-4 text-lg font-bold">Billing</h2>

      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-base font-bold">Current plan</h3>
            </div>
            <div className="mt-3">
              <span
                className="inline-flex rounded-md bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary"
              >
                {currentPlan}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {hasSubscription ? 'Your subscription renews automatically.' : 'Upgrade to unlock more features.'}
            </p>
          </div>

          <div>
            {hasSubscription ? (
              <Button
                onClick={handlePortal}
                disabled={loading}
                variant="outline"
                className="gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Manage Subscription
              </Button>
            ) : (
              <Button
                onClick={handleCheckout}
                disabled={loading}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Upgrade to Pro
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

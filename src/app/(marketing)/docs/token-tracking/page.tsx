import type { Metadata } from 'next';
import { DocsProse } from '@/components/docs/docs-prose';

export const metadata: Metadata = {
  title: 'Token Tracking',
  description: 'Per-user AI usage, limits, and the usage dashboard in Ignitra.',
  alternates: { canonical: '/docs/token-tracking' },
};

export default function TokenTrackingPage() {
  return (
    <DocsProse>
      <h1>Token Tracking</h1>
      <p>Ignitra tracks every AI API call per user — token counts, costs, and enforces daily/monthly limits.</p>

      <h2>How It Works</h2>
      <ol>
        <li>User sends a message</li>
        <li>Usage limits are checked (daily + monthly)</li>
        <li>If within limits → AI generates response</li>
        <li>After response → tokens are recorded in the database</li>
        <li>Cost is calculated based on the model&apos;s pricing</li>
      </ol>

      <h2>Plan Limits</h2>
      <p>
        Configure limits in <code>src/config/plans.ts</code>:
      </p>
      <ul>
        <li>Free: 10,000 tokens/day, 100,000/month</li>
        <li>Starter: 100,000 tokens/day, 1,000,000/month</li>
        <li>Pro: 500,000 tokens/day, 5,000,000/month</li>
        <li>Enterprise: Unlimited</li>
      </ul>

      <h2>Usage Dashboard</h2>
      <p>
        Users can view their usage at <code>/dashboard/usage</code>:
      </p>
      <ul>
        <li>Today&apos;s token count and cost</li>
        <li>Monthly token count and cost</li>
        <li>30-day usage chart</li>
        <li>Model breakdown</li>
      </ul>

      <h2>Customizing Limits</h2>
      <p>
        To change limits for a specific plan, edit <code>src/config/plans.ts</code>. When a user&apos;s Stripe
        subscription changes, their limits are automatically updated via the webhook handler.
      </p>
    </DocsProse>
  );
}

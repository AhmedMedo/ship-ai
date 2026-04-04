import type { Metadata } from 'next';
import { DocsProse } from '@/components/docs/docs-prose';

export const metadata: Metadata = {
  title: 'Payments & Billing',
  description: 'Stripe subscriptions, webhooks, and usage-based billing in Ignitra.',
  alternates: { canonical: '/docs/payments' },
};

export default function PaymentsPage() {
  return (
    <DocsProse>
      <h1>Payments &amp; Billing</h1>
      <p>
        Ignitra includes a complete Stripe integration with subscriptions, one-time payments, and usage-based
        billing.
      </p>

      <h2>Setup</h2>
      <ol>
        <li>Create a Stripe account at stripe.com</li>
        <li>Get your API keys from the Stripe Dashboard</li>
        <li>Add keys to your <code>.env</code> file (see below)</li>
      </ol>
      <pre>
        <code>{`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...`}</code>
      </pre>

      <h2>Creating Products</h2>
      <p>In the Stripe Dashboard, create products matching your plans:</p>
      <ul>
        <li>Free (no Stripe product needed)</li>
        <li>Starter ($X/month)</li>
        <li>Pro ($X/month)</li>
        <li>Enterprise ($X/month or custom)</li>
      </ul>
      <p>
        Copy each product&apos;s Price ID into <code>src/config/plans.ts</code>.
      </p>

      <h2>Webhook Setup</h2>
      <p>Stripe webhooks notify your app when payments succeed, subscriptions change, etc.</p>
      <p>
        <strong>For local development:</strong>
      </p>
      <pre>
        <code>stripe listen --forward-to localhost:3000/api/webhooks/stripe</code>
      </pre>
      <p>
        <strong>For production:</strong>
      </p>
      <ol>
        <li>Stripe Dashboard → Developers → Webhooks</li>
        <li>
          Add endpoint: <code>https://yourdomain.com/api/webhooks/stripe</code>
        </li>
        <li>
          Select events: <code>checkout.session.completed</code>, <code>customer.subscription.updated</code>,{' '}
          <code>customer.subscription.deleted</code>, <code>invoice.payment_succeeded</code>
        </li>
        <li>
          Copy the webhook signing secret to <code>STRIPE_WEBHOOK_SECRET</code>
        </li>
      </ol>

      <h2>Usage-Based Billing</h2>
      <p>For metered billing (charge per API usage):</p>
      <ol>
        <li>Create a metered price in Stripe</li>
        <li>
          Configure in <code>src/config/plans.ts</code>
        </li>
        <li>The token tracking system automatically reports usage to Stripe</li>
      </ol>
    </DocsProse>
  );
}

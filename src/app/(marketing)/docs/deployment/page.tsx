import type { Metadata } from 'next';
import { DocsProse } from '@/components/docs/docs-prose';

export const metadata: Metadata = {
  title: 'Deployment',
  description: 'Deploy Ignitra to Vercel with production environment variables and custom domains.',
  alternates: { canonical: '/docs/deployment' },
};

export default function DeploymentPage() {
  return (
    <DocsProse>
      <h1>Deployment</h1>
      <p>Deploy Ignitra to Vercel in minutes.</p>

      <h2>Prerequisites</h2>
      <ul>
        <li>A Vercel account (free tier works)</li>
        <li>A Supabase project (production)</li>
        <li>Stripe account with live keys</li>
        <li>AI provider API key</li>
      </ul>

      <h2>Deploy to Vercel</h2>
      <ol>
        <li>Push your code to GitHub</li>
        <li>Go to vercel.com/new</li>
        <li>Import your repository</li>
        <li>Add all environment variables (see Configuration page)</li>
        <li>Deploy</li>
      </ol>

      <h2>Environment Variables for Production</h2>
      <p>Make sure to update these for production:</p>
      <ul>
        <li>
          <code>NEXT_PUBLIC_APP_URL</code> → your domain (<code>https://yourdomain.com</code>)
        </li>
        <li>
          <code>NEXT_PUBLIC_SUPABASE_URL</code> → production Supabase URL
        </li>
        <li>
          <code>STRIPE_SECRET_KEY</code> → live key (<code>sk_live_...</code>)
        </li>
        <li>
          <code>STRIPE_WEBHOOK_SECRET</code> → production webhook secret
        </li>
      </ul>

      <h2>Custom Domain</h2>
      <ol>
        <li>In Vercel → Settings → Domains → Add your domain</li>
        <li>
          Update DNS records at your registrar:
          <ul>
            <li>A record: 76.76.21.21</li>
            <li>CNAME: cname.vercel-dns.com (for www)</li>
          </ul>
        </li>
        <li>Wait for DNS propagation (usually 5–30 minutes)</li>
        <li>Vercel automatically provisions SSL</li>
      </ol>

      <h2>Post-Deployment Checklist</h2>
      <ul>
        <li>Sign up and test login flow</li>
        <li>Send a test AI message</li>
        <li>Test Stripe checkout (use test mode first)</li>
        <li>Verify webhook is receiving events</li>
        <li>Check email delivery (if using Resend)</li>
        <li>Set up Stripe live mode and switch keys</li>
      </ul>
    </DocsProse>
  );
}

import type { Metadata } from 'next';
import { DocsProse } from '@/components/docs/docs-prose';

export const metadata: Metadata = {
  title: 'API Reference',
  description: 'HTTP API routes exposed by Ignitra — chat, usage, webhooks, and health.',
  alternates: { canonical: '/docs/api-reference' },
};

export default function ApiReferencePage() {
  return (
    <DocsProse>
      <h1>API Reference</h1>
      <p>Ignitra exposes these API routes.</p>

      <h2>POST /api/chat</h2>
      <p>Send a message and receive a streaming AI response.</p>
      <p>Request body:</p>
      <pre>
        <code>{`{
  "messages": [{ "role": "user", "content": "Hello" }],
  "conversationId": "uuid" // optional
}`}</code>
      </pre>
      <p>
        <strong>Response:</strong> Server-Sent Events (streaming)
      </p>
      <p>
        <strong>Auth:</strong> Required (session cookie)
      </p>

      <h2>GET /api/usage</h2>
      <p>Get the authenticated user&apos;s token usage statistics.</p>
      <p>Response (shape may vary by implementation):</p>
      <pre>
        <code>{`{
  "today": { "tokens": 4520, "cost": 0.07, "messages": 12 },
  "month": { "tokens": 142300, "cost": 2.14, "messages": 89 },
  "dailyBreakdown": [],
  "modelBreakdown": [],
  "limits": { "daily": 100000, "monthly": 1000000 }
}`}</code>
      </pre>
      <p>
        <strong>Auth:</strong> Required
      </p>

      <h2>POST /api/webhooks/stripe</h2>
      <p>
        Stripe webhook handler. Processes subscription changes, payment events, and updates user plans
        accordingly.
      </p>
      <p>
        <strong>Auth:</strong> Stripe signature verification
      </p>

      <h2>Auth callback</h2>
      <p>
        Supabase OAuth flows use the callback route configured in your Supabase project (typically under{' '}
        <code>/auth/callback</code> or similar — match your app&apos;s auth setup).
      </p>

      <h2>GET /api/health</h2>
      <p>Health check endpoint. Returns </p>
      <pre>
        <code>{`{ "status": "ok" }`}</code>
      </pre>
      <p>
        <em>Note:</em> If this route is not present in your fork, add it or use Vercel&apos;s deployment
        checks instead.
      </p>
    </DocsProse>
  );
}

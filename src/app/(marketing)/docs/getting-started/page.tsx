import type { Metadata } from 'next';
import Link from 'next/link';
import { DocsProse } from '@/components/docs/docs-prose';

export const metadata: Metadata = {
  title: 'Getting Started',
  description: 'Get Ignitra running locally in under 10 minutes.',
  alternates: { canonical: '/docs/getting-started' },
};

export default function GettingStartedPage() {
  return (
    <DocsProse>
      <h1>Getting Started</h1>
      <p>Get Ignitra running locally in under 10 minutes.</p>

      <h2>Prerequisites</h2>
      <ul>
        <li>Node.js 18+ (recommended: 20+)</li>
        <li>pnpm (recommended) or npm</li>
        <li>Docker Desktop (for local database)</li>
        <li>A code editor (VS Code recommended)</li>
      </ul>

      <h2>Quick Start</h2>
      <p>
        <strong>1. Clone the repository</strong>
      </p>
      <pre>
        <code>{`git clone https://github.com/your-username/ignitra.git
cd ignitra`}</code>
      </pre>
      <p>
        <strong>2. Install dependencies</strong>
      </p>
      <pre>
        <code>pnpm install</code>
      </pre>
      <p>
        <strong>3. Start local services</strong>
      </p>
      <pre>
        <code>docker compose up -d</code>
      </pre>
      <p>
        <strong>4. Copy environment variables</strong>
      </p>
      <pre>
        <code>cp .env.example .env</code>
      </pre>
      <p>
        <strong>5. Start the dev server</strong>
      </p>
      <pre>
        <code>pnpm dev</code>
      </pre>
      <p>
        <strong>6. Open</strong>{' '}
        <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer">
          http://localhost:3000
        </a>
      </p>

      <p>
        That&apos;s it! You should see the Ignitra landing page. The dashboard is at{' '}
        <code>/dashboard</code> (sign up first).
      </p>

      <h2>Next Steps</h2>
      <ul>
        <li>
          <Link href="/docs/configuration">Configuration</Link> — Set up your environment variables
        </li>
        <li>
          <Link href="/docs/authentication">Authentication</Link> — Configure OAuth providers
        </li>
        <li>
          <Link href="/docs/ai-providers">AI Providers</Link> — Choose your AI backend
        </li>
      </ul>
    </DocsProse>
  );
}

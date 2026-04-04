import type { Metadata } from 'next';
import { DocsProse } from '@/components/docs/docs-prose';

export const metadata: Metadata = {
  title: 'Installation',
  description: 'Detailed installation instructions for Ignitra.',
  alternates: { canonical: '/docs/installation' },
};

export default function InstallationPage() {
  return (
    <DocsProse>
      <h1>Installation</h1>
      <p>Detailed installation instructions for Ignitra.</p>

      <h2>System Requirements</h2>
      <ul>
        <li>Node.js: 18.0+ (20+ recommended for best performance)</li>
        <li>Package manager: pnpm 8+ (recommended), npm 9+, or yarn 1.22+</li>
        <li>Database: PostgreSQL 14+ (provided via Docker or Supabase)</li>
        <li>OS: macOS, Linux, or Windows (WSL2 recommended)</li>
      </ul>

      <h2>Clone the Repository</h2>
      <p>After purchasing, you&apos;ll receive access to the private GitHub repository.</p>
      <pre>
        <code>{`git clone https://github.com/your-username/ignitra.git
cd ignitra`}</code>
      </pre>

      <h2>Install Dependencies</h2>
      <pre>
        <code>pnpm install</code>
      </pre>

      <h2>Docker Setup (Local Development)</h2>
      <p>Ignitra includes a Docker Compose file that starts:</p>
      <ul>
        <li>PostgreSQL 15 (database)</li>
        <li>Supabase Studio (database GUI at localhost:54323)</li>
        <li>Inbucket (email catcher at localhost:54324)</li>
      </ul>
      <pre>
        <code>docker compose up -d</code>
      </pre>
      <p>To stop:</p>
      <pre>
        <code>docker compose down</code>
      </pre>
      <p>To reset the database:</p>
      <pre>
        <code>{`docker compose down -v
docker compose up -d`}</code>
      </pre>

      <h2>Without Docker</h2>
      <p>If you prefer not to use Docker, you need:</p>
      <ol>
        <li>A Supabase project (free tier works)</li>
        <li>Set <code>DATABASE_URL</code> and <code>SUPABASE_*</code> variables to point to your Supabase project</li>
        <li>
          Run migrations: <code>pnpm drizzle-kit migrate</code>
        </li>
      </ol>

      <h2>Verify Installation</h2>
      <p>Run the development server:</p>
      <pre>
        <code>pnpm dev</code>
      </pre>
      <p>
        Visit <a href="http://localhost:3000">http://localhost:3000</a>. You should see the landing page. Visit{' '}
        <a href="http://localhost:3000/login">http://localhost:3000/login</a> to create an account.
      </p>
    </DocsProse>
  );
}

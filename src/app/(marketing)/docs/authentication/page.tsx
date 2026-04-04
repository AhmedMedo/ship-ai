import type { Metadata } from 'next';
import { DocsProse } from '@/components/docs/docs-prose';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Supabase Auth setup — OAuth, magic link, and Row Level Security.',
  alternates: { canonical: '/docs/authentication' },
};

export default function AuthenticationPage() {
  return (
    <DocsProse>
      <h1>Authentication</h1>
      <p>Ignitra uses Supabase Auth with multiple sign-in methods.</p>

      <h2>Supported Methods</h2>
      <ul>
        <li>Email + Password</li>
        <li>Magic Link (passwordless email)</li>
        <li>Google OAuth</li>
        <li>GitHub OAuth</li>
      </ul>

      <h2>Setting Up Google OAuth</h2>
      <ol>
        <li>Go to Google Cloud Console → APIs &amp; Services → Credentials</li>
        <li>Create an OAuth 2.0 Client ID</li>
        <li>
          Set authorized redirect URI:{' '}
          <code>https://your-supabase-url.supabase.co/auth/v1/callback</code>
        </li>
        <li>Copy the Client ID and Client Secret</li>
        <li>In Supabase Dashboard → Authentication → Providers → Google</li>
        <li>Enable Google and paste the credentials</li>
      </ol>

      <h2>Setting Up GitHub OAuth</h2>
      <ol>
        <li>Go to GitHub → Settings → Developer Settings → OAuth Apps</li>
        <li>Create a new OAuth app</li>
        <li>
          Set authorization callback URL:{' '}
          <code>https://your-supabase-url.supabase.co/auth/v1/callback</code>
        </li>
        <li>Copy the Client ID and Client Secret</li>
        <li>In Supabase Dashboard → Authentication → Providers → GitHub</li>
        <li>Enable GitHub and paste the credentials</li>
      </ol>

      <h2>Row Level Security (RLS)</h2>
      <p>
        Every database table has RLS policies enabled. Users can only access their own data. This is enforced
        at the database level — not just application code — making it impossible to access another user&apos;s
        data even if there&apos;s a bug in your API routes.
      </p>
    </DocsProse>
  );
}

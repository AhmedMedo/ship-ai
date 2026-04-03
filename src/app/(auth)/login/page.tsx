'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/shared/logo';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const supabase = createClient();

  async function handleOAuth(provider: 'google' | 'github') {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/callback` },
    });
  }

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error, data } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Role is in app_metadata (set via GoTrue Admin API, included in JWT)
    // Use window.location for a full page navigation so middleware picks up the new session
    const role = data?.user?.app_metadata?.role;
    window.location.href = role === 'admin' ? '/admin' : '/dashboard';
  }

  async function handleMagicLink() {
    if (!email) {
      setError('Enter your email first');
      return;
    }
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/callback` },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setMagicLinkSent(true);
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <div className="w-full max-w-[420px] rounded-2xl border bg-card p-10">
        <div className="mb-7 flex justify-center">
          <Link href="/">
            <Logo variant="icon" size="lg" />
          </Link>
        </div>

        <h1 className="text-center text-2xl font-extrabold">Welcome back</h1>
        <p className="mb-7 mt-1.5 text-center text-sm text-muted-foreground">
          Sign in to your Ignitra account
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {magicLinkSent && (
          <div className="mb-4 rounded-lg bg-primary/10 px-4 py-3 text-sm text-primary">
            Check your email for a magic link to sign in.
          </div>
        )}

        <div className="mb-5 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => handleOAuth('google')}
            className="flex w-full items-center justify-center gap-3 rounded-[10px] border-[1.5px] bg-card px-4 py-3 text-sm font-semibold transition-colors hover:bg-muted"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>
          <button
            type="button"
            onClick={() => handleOAuth('github')}
            className="flex w-full items-center justify-center gap-3 rounded-[10px] border-[1.5px] bg-card px-4 py-3 text-sm font-semibold transition-colors hover:bg-muted"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            Continue with GitHub
          </button>
        </div>

        <div className="my-6 flex items-center gap-3.5 text-xs font-medium text-muted-foreground">
          <div className="h-px flex-1 bg-border" />
          or continue with email
          <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleEmailLogin}>
          <div className="mb-4">
            <label className="mb-1.5 block text-[13px] font-semibold">Email</label>
            <input
              type="email"
              placeholder="alex@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-[10px] border-[1.5px] bg-card px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
            />
          </div>
          <div className="mb-2">
            <label className="mb-1.5 block text-[13px] font-semibold">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-[10px] border-[1.5px] bg-card px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
            />
          </div>
          <div className="mb-4 text-right">
            <Link href="#" className="text-xs font-semibold text-primary">
              Forgot password?
            </Link>
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="mt-1 w-full rounded-[10px] bg-primary py-3 text-[15px] font-bold text-primary-foreground hover:bg-primary/90"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <button
          type="button"
          onClick={handleMagicLink}
          disabled={loading}
          className="mt-4 block w-full cursor-pointer text-center text-[13px] font-semibold text-primary disabled:opacity-50"
        >
          Send me a magic link instead
        </button>

        {/* Demo accounts — quick fill for testing */}
        <div className="mt-5 border-t pt-5">
          <p className="mb-2.5 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Demo accounts
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setEmail('admin@ignitra.dev'); setPassword('admin123'); }}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border bg-muted/50 px-3 py-2 text-[12px] font-medium transition-colors hover:bg-muted"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded bg-primary/10 text-[9px] font-bold text-primary">A</span>
              Admin
            </button>
            <button
              type="button"
              onClick={() => { setEmail('user@ignitra.dev'); setPassword('user123'); }}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border bg-muted/50 px-3 py-2 text-[12px] font-medium transition-colors hover:bg-muted"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded bg-muted text-[9px] font-bold text-muted-foreground">U</span>
              User
            </button>
          </div>
        </div>

        <div className="mt-5 border-t pt-5 text-center text-[13px] text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-semibold text-primary underline">
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
}

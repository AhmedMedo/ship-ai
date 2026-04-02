import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Handles the OAuth redirect callback from Supabase Auth
// Exchanges the auth code for a session, then redirects to dashboard
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Send welcome email for new signups (created within the last 60 seconds)
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email && user.created_at) {
        const createdAt = new Date(user.created_at).getTime();
        const isNewUser = Date.now() - createdAt < 60_000;
        if (isNewUser) {
          import('@/lib/email/resend').then(({ sendEmail }) =>
            import('@/lib/email/templates/welcome').then(({ welcomeEmailHtml }) =>
              sendEmail({
                to: user.email!,
                subject: 'Welcome to Ignitra!',
                html: welcomeEmailHtml({
                  userName: user.user_metadata?.full_name ?? 'there',
                }),
              }),
            ),
          );
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Auth code exchange failed — redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}

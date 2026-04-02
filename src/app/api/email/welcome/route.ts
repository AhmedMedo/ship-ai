import { createClient } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/email/resend';
import { welcomeEmailHtml } from '@/lib/email/templates/welcome';

export async function POST(req: Request) {
  // Auth check — only send to the currently logged-in user
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { userName } = await req.json();

  await sendEmail({
    to: user.email!,
    subject: 'Welcome to Ignitra!',
    html: welcomeEmailHtml({ userName: userName || 'there' }),
  });

  return Response.json({ ok: true });
}

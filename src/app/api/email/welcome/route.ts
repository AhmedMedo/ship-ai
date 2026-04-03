import { createClient } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/email/resend';
import { welcomeEmailHtml } from '@/lib/email/templates/welcome';

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { userName } = await req.json();

    await sendEmail({
      to: user.email!,
      subject: 'Welcome to Ignitra!',
      html: welcomeEmailHtml({ userName: userName || 'there' }),
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error('[email/welcome] Error:', error);
    return Response.json({ error: 'Failed to send email' }, { status: 500 });
  }
}

import { Resend } from 'resend';

// Resend client for transactional email.
// Set RESEND_API_KEY in your env. In development, emails are caught by Inbucket.
const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.EMAIL_FROM ?? 'Ignitra <noreply@ignitra.dev>';

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });

    if (error) {
      console.error('[email] Resend error:', error);
      return { success: false, error };
    }

    return { success: true, id: data?.id };
  } catch (err) {
    console.error('[email] Failed to send:', err);
    return { success: false, error: err };
  }
}

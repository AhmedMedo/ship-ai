import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { contacts } from '@/db/schema';
import { sendEmail } from '@/lib/email/resend';
import { escapeHtml } from '@/lib/html-escape';

const NOTIFY_TO = 'ahmed.alaa.eldin.hamdy@gmail.com';

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(5000),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = contactSchema.parse(body);

    try {
      await db.insert(contacts).values({
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
      });
    } catch (dbError) {
      console.error('DB error:', dbError);
      return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
    }

    const safeName = escapeHtml(data.name);
    const safeEmail = escapeHtml(data.email);
    const safeSubject = escapeHtml(data.subject);
    const safeMessage = escapeHtml(data.message);

    try {
      await sendEmail({
        to: NOTIFY_TO,
        subject: `[Contact Form] ${data.subject}`,
        html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0F4C75;">New Contact Form Submission</h2>
          <hr style="border: 1px solid #eee;" />
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
          <p><strong>Subject:</strong> ${safeSubject}</p>
          <p><strong>Message:</strong></p>
          <div style="background: #f9f9f9; padding: 16px; border-radius: 8px; white-space: pre-wrap;">${safeMessage}</div>
          <hr style="border: 1px solid #eee; margin-top: 24px;" />
          <p style="color: #999; font-size: 12px;">Sent from ignitra.dev contact form</p>
        </div>
      `,
      });

      await sendEmail({
        to: data.email,
        subject: `Thanks for reaching out — ${data.subject}`,
        html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0F4C75;">Thanks for contacting us, ${safeName}!</h2>
          <p>We received your message and will get back to you within 24-48 hours.</p>
          <p><strong>Your message:</strong></p>
          <div style="background: #f9f9f9; padding: 16px; border-radius: 8px; white-space: pre-wrap;">${safeMessage}</div>
          <hr style="border: 1px solid #eee; margin-top: 24px;" />
          <p>Best regards,<br />Ahmed Alaa<br />Ignitra — <a href="https://ignitra.dev">ignitra.dev</a></p>
        </div>
      `,
      });
    } catch (emailErr) {
      console.error('Contact notification email failed:', emailErr);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 },
      );
    }
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

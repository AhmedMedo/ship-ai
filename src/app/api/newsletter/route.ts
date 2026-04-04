import { NextResponse } from 'next/server';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { newsletterSubscribers } from '@/db/schema';
import { sendEmail } from '@/lib/email/resend';
import { escapeHtml } from '@/lib/html-escape';

const NOTIFY_TO = 'info@ignitra.dev';

const newsletterSchema = z.object({
  email: z.string().email(),
  source: z.string().optional().default('footer'),
});

function siteBaseUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://ignitra.dev';
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = newsletterSchema.parse(body);

    const [existing] = await db
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, data.email))
      .limit(1);

    if (existing) {
      if (existing.status === 'active') {
        return NextResponse.json({ message: 'Already subscribed!' });
      }
      try {
        await db
          .update(newsletterSubscribers)
          .set({ status: 'active', unsubscribedAt: null })
          .where(eq(newsletterSubscribers.id, existing.id));
      } catch (dbError) {
        console.error('DB error (reactivate):', dbError);
        return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
      }
    } else {
      try {
        await db.insert(newsletterSubscribers).values({
          email: data.email,
          source: data.source,
        });
      } catch (dbError) {
        console.error('DB error:', dbError);
        return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
      }
    }

    const safeEmail = escapeHtml(data.email);
    const safeSource = escapeHtml(data.source);
    const unsubscribeUrl = `${siteBaseUrl()}/api/newsletter/unsubscribe?email=${encodeURIComponent(data.email)}`;

    try {
      await sendEmail({
        to: data.email,
        subject: 'Welcome to the Ignitra newsletter!',
        html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0F4C75;">Welcome to Ignitra!</h2>
          <p>Thanks for subscribing. You'll receive updates about:</p>
          <ul>
            <li>New features and releases</li>
            <li>AI SaaS development tips</li>
            <li>Special offers and early access</li>
          </ul>
          <p>No spam, unsubscribe anytime.</p>
          <hr style="border: 1px solid #eee; margin-top: 24px;" />
          <p>Best regards,<br />Ahmed Alaa<br /><a href="https://ignitra.dev">ignitra.dev</a></p>
          <p style="color: #999; font-size: 11px;">
            <a href="${unsubscribeUrl}">Unsubscribe</a>
          </p>
        </div>
      `,
      });

      await sendEmail({
        to: NOTIFY_TO,
        subject: `[Newsletter] New subscriber: ${data.email}`,
        html: `<p>New newsletter subscriber: <strong>${safeEmail}</strong> (source: ${safeSource})</p>`,
      });
    } catch (emailErr) {
      console.error('Newsletter email failed:', emailErr);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }
    console.error('Newsletter error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

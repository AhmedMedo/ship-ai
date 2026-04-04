import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { newsletterSubscribers } from '@/db/schema';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://ignitra.dev';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return new Response('Missing email', { status: 400 });
  }

  try {
    await db
      .update(newsletterSubscribers)
      .set({
        status: 'unsubscribed',
        unsubscribedAt: new Date(),
      })
      .where(eq(newsletterSubscribers.email, email));
  } catch (e) {
    console.error('Unsubscribe DB error:', e);
  }

  return new Response(
    `<html><body style="font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#030014;color:#fff;">
      <div style="text-align:center;">
        <h2>Unsubscribed</h2>
        <p style="color:#94A3B8;">You've been unsubscribed from the Ignitra newsletter.</p>
        <a href="${siteUrl}" style="color:#3498DB;">Back to Ignitra</a>
      </div>
    </body></html>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } },
  );
}

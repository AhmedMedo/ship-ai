// DEV ONLY — preview email templates in the browser.
// Visit: http://localhost:3000/api/email/preview?template=welcome
// Visit: http://localhost:3000/api/email/preview?template=usage-warning
// Visit: http://localhost:3000/api/email/preview?template=payment-failed

import { NextRequest } from 'next/server';
import { welcomeEmailHtml } from '@/lib/email/templates/welcome';
import { usageWarningEmailHtml } from '@/lib/email/templates/usage-warning';
import { paymentFailedEmailHtml } from '@/lib/email/templates/payment-failed';

export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return Response.json({ error: 'Not available in production' }, { status: 404 });
  }

  const template = req.nextUrl.searchParams.get('template') ?? 'welcome';

  let html: string;

  switch (template) {
    case 'welcome':
      html = welcomeEmailHtml({ userName: 'Ahmed' });
      break;
    case 'usage-warning':
      html = usageWarningEmailHtml({
        userName: 'Ahmed',
        tokensUsed: 82000,
        tokenLimit: 100000,
        planName: 'Pro',
      });
      break;
    case 'payment-failed':
      html = paymentFailedEmailHtml({
        userName: 'Ahmed',
        planName: 'Pro',
      });
      break;
    default:
      return Response.json({ error: 'Unknown template. Use: welcome, usage-warning, payment-failed' }, { status: 400 });
  }

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}

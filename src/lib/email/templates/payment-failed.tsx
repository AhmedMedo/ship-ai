// Payment failed email — sent when a Stripe invoice payment fails.
// Prompts user to update their payment method.

interface PaymentFailedEmailProps {
  userName: string;
  planName: string;
}

export function paymentFailedEmailHtml({
  userName,
  planName,
}: PaymentFailedEmailProps): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Inter',system-ui,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
    <!-- Header -->
    <div style="background:#EF4444;padding:28px 40px;text-align:center;">
      <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:800;">Payment Failed</h1>
    </div>

    <!-- Body -->
    <div style="padding:32px 40px;">
      <p style="margin:0 0 16px;font-size:16px;color:#0f172a;line-height:1.6;">
        Hey ${userName},
      </p>
      <p style="margin:0 0 16px;font-size:15px;color:#475569;line-height:1.7;">
        We weren't able to process your payment for the <strong style="color:#0f172a;">${planName}</strong> plan. This usually happens when your card has expired or has insufficient funds.
      </p>
      <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.7;">
        Please update your payment method to keep your subscription active. If we can't collect payment, your account will be downgraded to the Free plan.
      </p>

      <!-- CTA -->
      <div style="text-align:center;margin:28px 0;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/dashboard/billing"
           style="display:inline-block;background:#0F4C75;color:#ffffff;padding:14px 32px;border-radius:10px;font-size:15px;font-weight:700;text-decoration:none;">
          Update Payment Method
        </a>
      </div>

      <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.6;">
        If you believe this is an error, please reply to this email and we'll help you sort it out.
      </p>
    </div>

    <!-- Footer -->
    <div style="padding:20px 40px;border-top:1px solid #e2e8f0;text-align:center;">
      <p style="margin:0;font-size:12px;color:#94a3b8;">
        © ${new Date().getFullYear()} Ignitra. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>`;
}

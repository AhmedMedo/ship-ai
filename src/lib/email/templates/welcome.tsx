// Welcome email — sent when a user signs up for the first time.
// Uses inline HTML because Resend accepts raw HTML strings.

interface WelcomeEmailProps {
  userName: string;
}

export function welcomeEmailHtml({ userName }: WelcomeEmailProps): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Inter',system-ui,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
    <!-- Header -->
    <div style="background:#0F4C75;padding:32px 40px;text-align:center;">
      <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:800;letter-spacing:-0.02em;">Welcome to Ignitra</h1>
    </div>

    <!-- Body -->
    <div style="padding:32px 40px;">
      <p style="margin:0 0 16px;font-size:16px;color:#0f172a;line-height:1.6;">
        Hey ${userName},
      </p>
      <p style="margin:0 0 16px;font-size:15px;color:#475569;line-height:1.7;">
        Thanks for signing up! You now have access to Ignitra's AI-powered chat, token tracking, and all the tools you need to build your product.
      </p>
      <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.7;">
        Here's what you can do next:
      </p>

      <ul style="margin:0 0 24px;padding-left:20px;font-size:15px;color:#475569;line-height:2;">
        <li>Start a conversation with the AI chat</li>
        <li>Explore the usage dashboard</li>
        <li>Upgrade your plan for higher limits</li>
      </ul>

      <!-- CTA -->
      <div style="text-align:center;margin:32px 0;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/dashboard"
           style="display:inline-block;background:#0F4C75;color:#ffffff;padding:14px 32px;border-radius:10px;font-size:15px;font-weight:700;text-decoration:none;">
          Go to Dashboard
        </a>
      </div>

      <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.6;">
        If you have any questions, just reply to this email — we're here to help.
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

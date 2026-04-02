// Usage warning email — sent when a user hits 80% of their daily token limit.
// Encourages upgrading or pacing their usage.

interface UsageWarningEmailProps {
  userName: string;
  tokensUsed: number;
  tokenLimit: number;
  planName: string;
}

export function usageWarningEmailHtml({
  userName,
  tokensUsed,
  tokenLimit,
  planName,
}: UsageWarningEmailProps): string {
  const percentUsed = Math.round((tokensUsed / tokenLimit) * 100);
  const remaining = Math.max(0, tokenLimit - tokensUsed);

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Inter',system-ui,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
    <!-- Header -->
    <div style="background:#EAB308;padding:28px 40px;text-align:center;">
      <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:800;">⚠️ Usage Warning</h1>
    </div>

    <!-- Body -->
    <div style="padding:32px 40px;">
      <p style="margin:0 0 16px;font-size:16px;color:#0f172a;line-height:1.6;">
        Hey ${userName},
      </p>
      <p style="margin:0 0 20px;font-size:15px;color:#475569;line-height:1.7;">
        You've used <strong style="color:#0f172a;">${percentUsed}%</strong> of your daily token limit on your <strong style="color:#0f172a;">${planName}</strong> plan.
      </p>

      <!-- Usage bar -->
      <div style="margin:0 0 20px;">
        <div style="display:flex;justify-content:space-between;font-size:13px;color:#64748b;margin-bottom:6px;">
          <span>${tokensUsed.toLocaleString()} used</span>
          <span>${remaining.toLocaleString()} remaining</span>
        </div>
        <div style="background:#e2e8f0;border-radius:8px;height:10px;overflow:hidden;">
          <div style="background:#EAB308;height:100%;width:${percentUsed}%;border-radius:8px;"></div>
        </div>
        <div style="text-align:right;font-size:12px;color:#94a3b8;margin-top:4px;">
          Limit: ${tokenLimit.toLocaleString()} tokens/day
        </div>
      </div>

      <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.7;">
        Once you hit your limit, AI chat will be unavailable until tomorrow. You can upgrade your plan for higher limits.
      </p>

      <!-- CTA -->
      <div style="text-align:center;margin:28px 0;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/dashboard/billing"
           style="display:inline-block;background:#0F4C75;color:#ffffff;padding:14px 32px;border-radius:10px;font-size:15px;font-weight:700;text-decoration:none;">
          Upgrade Plan
        </a>
      </div>
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

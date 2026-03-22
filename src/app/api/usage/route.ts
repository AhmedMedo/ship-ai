import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/db';
import { usageLogs, conversations } from '@/db/schema';
import { eq, and, gte, sql, count } from 'drizzle-orm';
import { getUserPlan } from '@/lib/ai/usage';

export async function GET(req: NextRequest) {
  // Auth check
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const period = req.nextUrl.searchParams.get('period') ?? 'today';

  // Date filter based on period
  const dateFilter =
    period === 'month'
      ? gte(usageLogs.createdAt, sql`date_trunc('month', CURRENT_DATE)`)
      : gte(usageLogs.createdAt, sql`CURRENT_DATE`);

  // Run queries in parallel
  const [plan, totals, byModel, conversationCount] = await Promise.all([
    getUserPlan(user.id),

    // Aggregate usage totals
    db
      .select({
        tokensUsed: sql<number>`COALESCE(SUM(input_tokens + output_tokens), 0)`,
        totalCost: sql<number>`COALESCE(SUM(cost_usd::numeric), 0)`,
        requestCount: count(),
      })
      .from(usageLogs)
      .where(and(eq(usageLogs.userId, user.id), dateFilter)),

    // Usage grouped by model
    db
      .select({
        model: usageLogs.model,
        tokens: sql<number>`COALESCE(SUM(input_tokens + output_tokens), 0)`,
        cost: sql<number>`COALESCE(SUM(cost_usd::numeric), 0)`,
        requests: count(),
      })
      .from(usageLogs)
      .where(and(eq(usageLogs.userId, user.id), dateFilter))
      .groupBy(usageLogs.model)
      .orderBy(sql`SUM(input_tokens + output_tokens) DESC`),

    // Total conversation count
    db
      .select({ count: count() })
      .from(conversations)
      .where(eq(conversations.userId, user.id)),
  ]);

  const tokensUsed = Number(totals[0]?.tokensUsed ?? 0);
  const tokenLimit =
    period === 'month'
      ? (plan.tokenLimitMonthly ?? 50000)
      : (plan.tokenLimitDaily ?? 5000);
  const percentUsed = tokenLimit > 0 ? (tokensUsed / tokenLimit) * 100 : 0;

  // Build model breakdown
  const modelBreakdown: Record<string, { tokens: number; cost: number; requests: number }> = {};
  for (const row of byModel) {
    modelBreakdown[row.model] = {
      tokens: Number(row.tokens),
      cost: Number(row.cost),
      requests: Number(row.requests),
    };
  }

  return Response.json({
    period,
    tokensUsed,
    tokenLimit,
    percentUsed: Math.round(percentUsed * 100) / 100,
    costUsd: Number(Number(totals[0]?.totalCost ?? 0).toFixed(4)),
    requestCount: Number(totals[0]?.requestCount ?? 0),
    conversationCount: Number(conversationCount[0]?.count ?? 0),
    plan: {
      name: plan.planName,
      slug: plan.planSlug,
    },
    byModel: modelBreakdown,
  });
}

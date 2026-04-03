import { createClient } from '@/lib/supabase/server';
import { db } from '@/db';
import { profiles, subscriptions, usageLogs, plans } from '@/db/schema';
import { eq, sql, count, gte } from 'drizzle-orm';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const [profile] = await db
    .select({ role: profiles.role })
    .from(profiles)
    .where(eq(profiles.id, user.id))
    .limit(1);

  if (profile?.role !== 'admin') {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const [totalUsers, activeSubscriptions, mrrResult, aiCostToday, recentUsers] = await Promise.all([
      db.select({ count: count() }).from(profiles),

      db.select({ count: count() }).from(subscriptions).where(eq(subscriptions.status, 'active')),

      // MRR: use Drizzle column ref instead of raw alias
      db
        .select({
          total: sql<number>`COALESCE(SUM(
            CASE WHEN ${plans.slug} = 'pro' THEN 19
                 WHEN ${plans.slug} = 'business' THEN 49
                 ELSE 0 END
          ), 0)`,
        })
        .from(subscriptions)
        .leftJoin(plans, eq(subscriptions.planId, plans.id))
        .where(eq(subscriptions.status, 'active')),

      db
        .select({ total: sql<number>`COALESCE(SUM(cost_usd::numeric), 0)` })
        .from(usageLogs)
        .where(gte(usageLogs.createdAt, sql`CURRENT_DATE`)),

      // Users list — simple query without correlated subquery
      db
        .select({
          id: profiles.id,
          fullName: profiles.fullName,
          email: profiles.email,
          role: profiles.role,
          planName: plans.name,
          planSlug: plans.slug,
          createdAt: profiles.createdAt,
        })
        .from(profiles)
        .leftJoin(plans, eq(profiles.planId, plans.id))
        .orderBy(sql`${profiles.createdAt} DESC`)
        .limit(50),
    ]);

    // Get today's token usage per user in a separate simple query
    const usageByUser = await db
      .select({
        userId: usageLogs.userId,
        tokens: sql<number>`COALESCE(SUM(input_tokens + output_tokens), 0)`,
      })
      .from(usageLogs)
      .where(gte(usageLogs.createdAt, sql`CURRENT_DATE`))
      .groupBy(usageLogs.userId);

    const usageMap = new Map(usageByUser.map((u) => [u.userId, Number(u.tokens)]));

    return Response.json({
      totalUsers: Number(totalUsers[0]?.count ?? 0),
      activeSubscriptions: Number(activeSubscriptions[0]?.count ?? 0),
      mrr: Number(mrrResult[0]?.total ?? 0),
      aiCostToday: Number(Number(aiCostToday[0]?.total ?? 0).toFixed(4)),
      users: recentUsers.map((u) => ({
        id: u.id,
        fullName: u.fullName,
        email: u.email,
        role: u.role,
        plan: u.planName ?? 'Free',
        planSlug: u.planSlug ?? 'free',
        tokensToday: usageMap.get(u.id) ?? 0,
        createdAt: u.createdAt,
      })),
    });
  } catch (error) {
    console.error('[admin/stats] GET error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { createClient } from '@/lib/supabase/server';
import { db } from '@/db';
import { profiles, subscriptions, usageLogs, plans } from '@/db/schema';
import { eq, sql, count, gte, and } from 'drizzle-orm';

export async function GET() {
  // Auth + role check
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check admin role
  const [profile] = await db
    .select({ role: profiles.role })
    .from(profiles)
    .where(eq(profiles.id, user.id))
    .limit(1);

  if (profile?.role !== 'admin') {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Run all queries in parallel
  const [totalUsers, activeSubscriptions, mrr, aiCostToday, recentUsers] = await Promise.all([
    // Total users
    db.select({ count: count() }).from(profiles),

    // Active subscriptions
    db
      .select({ count: count() })
      .from(subscriptions)
      .where(eq(subscriptions.status, 'active')),

    // MRR — sum of active subscription plan prices (monthly)
    db
      .select({
        total: sql<number>`COALESCE(SUM(
          CASE WHEN p.slug = 'pro' THEN 19
               WHEN p.slug = 'business' THEN 49
               ELSE 0 END
        ), 0)`,
      })
      .from(subscriptions)
      .leftJoin(plans, eq(subscriptions.planId, plans.id))
      .where(eq(subscriptions.status, 'active')),

    // AI cost today
    db
      .select({
        total: sql<number>`COALESCE(SUM(cost_usd::numeric), 0)`,
      })
      .from(usageLogs)
      .where(gte(usageLogs.createdAt, sql`CURRENT_DATE`)),

    // Recent users with plan + usage
    db
      .select({
        id: profiles.id,
        fullName: profiles.fullName,
        email: profiles.email,
        role: profiles.role,
        planName: plans.name,
        planSlug: plans.slug,
        createdAt: profiles.createdAt,
        tokensToday: sql<number>`COALESCE((
          SELECT SUM(input_tokens + output_tokens)
          FROM usage_logs
          WHERE usage_logs.user_id = ${profiles.id}
            AND usage_logs.created_at >= CURRENT_DATE
        ), 0)`,
      })
      .from(profiles)
      .leftJoin(plans, eq(profiles.planId, plans.id))
      .orderBy(sql`${profiles.createdAt} DESC`)
      .limit(50),
  ]);

  return Response.json({
    totalUsers: Number(totalUsers[0]?.count ?? 0),
    activeSubscriptions: Number(activeSubscriptions[0]?.count ?? 0),
    mrr: Number(mrr[0]?.total ?? 0),
    aiCostToday: Number(Number(aiCostToday[0]?.total ?? 0).toFixed(4)),
    users: recentUsers.map((u) => ({
      id: u.id,
      fullName: u.fullName,
      email: u.email,
      role: u.role,
      plan: u.planName ?? 'Free',
      planSlug: u.planSlug ?? 'free',
      tokensToday: Number(u.tokensToday),
      createdAt: u.createdAt,
    })),
  });
}

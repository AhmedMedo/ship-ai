import { db } from '@/db';
import { usageLogs, profiles, plans } from '@/db/schema';
import { eq, sql, and, gte } from 'drizzle-orm';

// Get the user's current plan with token limits
export async function getUserPlan(userId: string) {
  const result = await db
    .select({
      tokenLimitDaily: plans.tokenLimitDaily,
      tokenLimitMonthly: plans.tokenLimitMonthly,
      maxConversations: plans.maxConversations,
      planSlug: plans.slug,
      planName: plans.name,
    })
    .from(profiles)
    .leftJoin(plans, eq(profiles.planId, plans.id))
    .where(eq(profiles.id, userId))
    .limit(1);

  // Default to free plan limits if no plan is set
  return result[0] ?? {
    tokenLimitDaily: 5000,
    tokenLimitMonthly: 50000,
    maxConversations: 3,
    planSlug: 'free',
    planName: 'Free',
  };
}

// Get total tokens used today for a user
export async function getTodayTokens(userId: string): Promise<number> {
  const result = await db
    .select({
      total: sql<number>`COALESCE(SUM(input_tokens + output_tokens), 0)`,
    })
    .from(usageLogs)
    .where(
      and(
        eq(usageLogs.userId, userId),
        gte(usageLogs.createdAt, sql`CURRENT_DATE`),
      ),
    );

  return Number(result[0]?.total ?? 0);
}

// Get total tokens used this month for a user
export async function getMonthTokens(userId: string): Promise<number> {
  const result = await db
    .select({
      total: sql<number>`COALESCE(SUM(input_tokens + output_tokens), 0)`,
    })
    .from(usageLogs)
    .where(
      and(
        eq(usageLogs.userId, userId),
        gte(usageLogs.createdAt, sql`date_trunc('month', CURRENT_DATE)`),
      ),
    );

  return Number(result[0]?.total ?? 0);
}

// Check if the user is within their daily token limit
export async function checkUsageLimit(userId: string) {
  const [plan, todayUsage] = await Promise.all([
    getUserPlan(userId),
    getTodayTokens(userId),
  ]);

  const dailyLimit = plan.tokenLimitDaily ?? 5000;

  return {
    allowed: todayUsage < dailyLimit,
    limit: dailyLimit,
    used: todayUsage,
    remaining: Math.max(0, dailyLimit - todayUsage),
    planSlug: plan.planSlug ?? 'free',
  };
}

// Log a usage record after an AI request completes
export async function logUsage(params: {
  userId: string;
  conversationId: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
}) {
  await db.insert(usageLogs).values({
    userId: params.userId,
    conversationId: params.conversationId,
    model: params.model,
    inputTokens: params.inputTokens,
    outputTokens: params.outputTokens,
    costUsd: params.costUsd.toFixed(6),
  });
}

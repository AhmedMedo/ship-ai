import { stripe } from './stripe';
import { db } from '@/db';
import { profiles, plans } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Report token usage to Stripe metering for Business plan users.
// Called after each AI request in the chat API route's onFinish callback.
export async function reportUsageToStripe(userId: string, totalTokens: number) {
  try {
    // Only Business plan users have Stripe metering enabled
    const result = await db
      .select({
        stripeCustomerId: profiles.stripeCustomerId,
        planSlug: plans.slug,
      })
      .from(profiles)
      .leftJoin(plans, eq(profiles.planId, plans.id))
      .where(eq(profiles.id, userId))
      .limit(1);

    const profile = result[0];
    if (!profile?.stripeCustomerId || profile.planSlug !== 'business') {
      return; // Skip — only meter for Business plan with Stripe customer
    }

    // Report usage event to Stripe Billing Meter.
    // Requires a Billing Meter named "ai_tokens" configured in Stripe Dashboard.
    await stripe.billing.meterEvents.create({
      event_name: 'ai_tokens',
      payload: {
        stripe_customer_id: profile.stripeCustomerId,
        value: String(totalTokens),
      },
    });
  } catch (error) {
    // Log but don't throw — usage reporting failure shouldn't break the AI response
    console.error('[usage-reporting] Failed to report to Stripe:', error);
  }
}

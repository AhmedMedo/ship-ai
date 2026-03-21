import Stripe from 'stripe';
import { stripe } from './stripe';
import { db } from '@/db';
import { profiles, subscriptions, plans } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Verify and construct the Stripe webhook event
export function verifyWebhook(body: string, signature: string) {
  return stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!,
  );
}

// checkout.session.completed — user completed payment
export async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const planSlug = session.metadata?.planSlug;
  if (!userId || !planSlug) return;

  const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id;
  const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id;
  if (!customerId || !subscriptionId) return;

  // Store stripe_customer_id on the profile
  await db
    .update(profiles)
    .set({ stripeCustomerId: customerId })
    .where(eq(profiles.id, userId));

  // Find the plan
  const [plan] = await db
    .select({ id: plans.id })
    .from(plans)
    .where(eq(plans.slug, planSlug))
    .limit(1);

  if (!plan) return;

  // Update user's plan_id
  await db
    .update(profiles)
    .set({ planId: plan.id })
    .where(eq(profiles.id, userId));

  // Create subscription record (idempotent)
  const [existing] = await db
    .select({ id: subscriptions.id })
    .from(subscriptions)
    .where(eq(subscriptions.stripeSubscriptionId, subscriptionId))
    .limit(1);

  if (!existing) {
    await db.insert(subscriptions).values({
      userId,
      planId: plan.id,
      stripeSubscriptionId: subscriptionId,
      status: 'active',
    });
  }
}

// invoice.paid — subscription period renewed
export async function handleInvoicePaid(invoice: Stripe.Invoice) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawSub = (invoice as any).subscription;
  const subscriptionId = typeof rawSub === 'string' ? rawSub : rawSub?.id;
  if (!subscriptionId) return;

  // Retrieve full subscription to get period dates
  const sub = await stripe.subscriptions.retrieve(subscriptionId);
  const subData = sub as unknown as { current_period_start: number; current_period_end: number };

  await db
    .update(subscriptions)
    .set({
      currentPeriodStart: new Date(subData.current_period_start * 1000),
      currentPeriodEnd: new Date(subData.current_period_end * 1000),
      status: 'active',
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.stripeSubscriptionId, subscriptionId));
}

// customer.subscription.updated — status or plan changed
export async function handleSubscriptionUpdated(sub: Stripe.Subscription) {
  const subData = sub as unknown as {
    id: string;
    cancel_at_period_end: boolean;
    status: string;
    current_period_start: number;
    current_period_end: number;
  };

  const status = subData.cancel_at_period_end ? 'canceled' : subData.status;

  await db
    .update(subscriptions)
    .set({
      status: status === 'active' ? 'active' : status === 'past_due' ? 'past_due' : 'canceled',
      cancelAtPeriodEnd: subData.cancel_at_period_end,
      currentPeriodStart: new Date(subData.current_period_start * 1000),
      currentPeriodEnd: new Date(subData.current_period_end * 1000),
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.stripeSubscriptionId, subData.id));
}

// customer.subscription.deleted — subscription fully canceled
export async function handleSubscriptionDeleted(sub: Stripe.Subscription) {
  // Mark subscription as canceled
  await db
    .update(subscriptions)
    .set({ status: 'canceled', updatedAt: new Date() })
    .where(eq(subscriptions.stripeSubscriptionId, sub.id));

  // Downgrade user to free plan
  const [subRecord] = await db
    .select({ userId: subscriptions.userId })
    .from(subscriptions)
    .where(eq(subscriptions.stripeSubscriptionId, sub.id))
    .limit(1);

  if (subRecord) {
    await db
      .update(profiles)
      .set({ planId: null })
      .where(eq(profiles.id, subRecord.userId));
  }
}

// invoice.payment_failed — payment didn't go through
export async function handlePaymentFailed(invoice: Stripe.Invoice) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawSub = (invoice as any).subscription;
  const subscriptionId = typeof rawSub === 'string' ? rawSub : rawSub?.id;
  if (!subscriptionId) return;

  await db
    .update(subscriptions)
    .set({ status: 'past_due', updatedAt: new Date() })
    .where(eq(subscriptions.stripeSubscriptionId, subscriptionId));

  // TODO: Send payment failed email via Resend (Task 14)
}

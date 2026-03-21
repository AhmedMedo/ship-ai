import Stripe from 'stripe';
import { stripe } from './stripe';
import { db } from '@/db';
import { profiles, subscriptions, plans } from '@/db/schema';
import { eq } from 'drizzle-orm';

// ─── Helpers ─────────────────────────────────────────────────────────────────

// Extract subscription ID from invoice (Stripe v20: nested under parent.subscription_details)
function getSubscriptionIdFromInvoice(invoice: Stripe.Invoice): string | null {
  const subDetails = invoice.parent?.subscription_details;
  if (!subDetails) return null;
  return typeof subDetails.subscription === 'string'
    ? subDetails.subscription
    : subDetails.subscription.id;
}

// Get period dates from the first subscription item (Stripe v20 moved these off Subscription)
function getPeriodDates(sub: Stripe.Subscription) {
  const item = sub.items.data[0];
  if (!item) return null;
  return {
    start: new Date(item.current_period_start * 1000),
    end: new Date(item.current_period_end * 1000),
  };
}

// ─── Webhook verification ────────────────────────────────────────────────────

export function verifyWebhook(body: string, signature: string) {
  return stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!,
  );
}

// ─── Event handlers ──────────────────────────────────────────────────────────

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
  const subscriptionId = getSubscriptionIdFromInvoice(invoice);
  if (!subscriptionId) return;

  const sub = await stripe.subscriptions.retrieve(subscriptionId);
  const period = getPeriodDates(sub);

  await db
    .update(subscriptions)
    .set({
      ...(period && { currentPeriodStart: period.start, currentPeriodEnd: period.end }),
      status: 'active',
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.stripeSubscriptionId, subscriptionId));
}

// customer.subscription.updated — status or plan changed
export async function handleSubscriptionUpdated(sub: Stripe.Subscription) {
  const status = sub.cancel_at_period_end ? 'canceled' : sub.status;
  const period = getPeriodDates(sub);

  await db
    .update(subscriptions)
    .set({
      status: status === 'active' ? 'active' : status === 'past_due' ? 'past_due' : 'canceled',
      cancelAtPeriodEnd: sub.cancel_at_period_end,
      ...(period && { currentPeriodStart: period.start, currentPeriodEnd: period.end }),
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.stripeSubscriptionId, sub.id));
}

// customer.subscription.deleted — subscription fully canceled
export async function handleSubscriptionDeleted(sub: Stripe.Subscription) {
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
  const subscriptionId = getSubscriptionIdFromInvoice(invoice);
  if (!subscriptionId) return;

  await db
    .update(subscriptions)
    .set({ status: 'past_due', updatedAt: new Date() })
    .where(eq(subscriptions.stripeSubscriptionId, subscriptionId));

  // TODO: Send payment failed email via Resend (Task 14)
}

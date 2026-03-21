import { stripe } from './stripe';
import { getPlanBySlug } from '@/config/plans';

interface CreateCheckoutParams {
  userId: string;
  email: string;
  planSlug: string;
  interval: 'monthly' | 'yearly';
  stripeCustomerId?: string | null;
}

// Creates a Stripe Checkout session for subscribing to a plan
export async function createCheckoutSession({
  userId,
  email,
  planSlug,
  interval,
  stripeCustomerId,
}: CreateCheckoutParams) {
  const plan = getPlanBySlug(planSlug);
  const priceId = interval === 'yearly' ? plan.stripePriceId.yearly : plan.stripePriceId.monthly;

  if (!priceId) {
    throw new Error(`No Stripe price ID configured for ${planSlug} ${interval}`);
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/dashboard?upgrade=success`,
    cancel_url: `${appUrl}/pricing`,
    customer_email: stripeCustomerId ? undefined : email,
    customer: stripeCustomerId || undefined,
    metadata: { userId, planSlug },
  });

  return session;
}

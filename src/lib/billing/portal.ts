import { stripe } from './stripe';

// Creates a Stripe Customer Portal session for managing subscriptions
export async function createPortalSession(stripeCustomerId: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${appUrl}/dashboard/billing`,
  });

  return session;
}

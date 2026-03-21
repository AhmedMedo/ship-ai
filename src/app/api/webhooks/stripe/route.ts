import Stripe from 'stripe';
import {
  verifyWebhook,
  handleCheckoutCompleted,
  handleInvoicePaid,
  handleSubscriptionUpdated,
  handleSubscriptionDeleted,
  handlePaymentFailed,
} from '@/lib/billing/webhooks';

// Stripe webhook handler — NO auth check, verified via signature
export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return Response.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = verifyWebhook(body, signature);
  } catch (err) {
    console.error('[webhook] Signature verification failed:', err);
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case 'invoice.paid':
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      default:
        // Unhandled event type — log but don't error
        console.log(`[webhook] Unhandled event: ${event.type}`);
    }
  } catch (error) {
    console.error(`[webhook] Error handling ${event.type}:`, error);
    return Response.json({ error: 'Webhook handler failed' }, { status: 500 });
  }

  return Response.json({ received: true });
}

// TODO: Stripe webhook handler (no auth — verified via signature)
export async function POST() {
  return Response.json({ received: true });
}

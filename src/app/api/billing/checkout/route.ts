import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { createCheckoutSession } from '@/lib/billing/checkout';
import { db } from '@/db';
import { profiles } from '@/db/schema';
import { eq } from 'drizzle-orm';

const checkoutSchema = z.object({
  planSlug: z.enum(['pro', 'business']),
  interval: z.enum(['monthly', 'yearly']),
});

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }

  try {
    const [profile] = await db
      .select({ stripeCustomerId: profiles.stripeCustomerId })
      .from(profiles)
      .where(eq(profiles.id, user.id))
      .limit(1);
    const session = await createCheckoutSession({
      userId: user.id,
      email: user.email!,
      planSlug: parsed.data.planSlug,
      interval: parsed.data.interval,
      stripeCustomerId: profile?.stripeCustomerId,
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error('[billing/checkout] Error:', error);
    return Response.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}

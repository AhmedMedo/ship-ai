import { createClient } from '@/lib/supabase/server';
import { createPortalSession } from '@/lib/billing/portal';
import { db } from '@/db';
import { profiles } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const [profile] = await db
    .select({ stripeCustomerId: profiles.stripeCustomerId })
    .from(profiles)
    .where(eq(profiles.id, user.id))
    .limit(1);

  if (!profile?.stripeCustomerId) {
    return Response.json({ error: 'No billing account found' }, { status: 400 });
  }

  try {
    const session = await createPortalSession(profile.stripeCustomerId);
    return Response.json({ url: session.url });
  } catch (error) {
    console.error('[billing/portal] Error:', error);
    return Response.json({ error: 'Failed to create portal session' }, { status: 500 });
  }
}

import { db } from '../src/db';
import { plans } from '../src/db/schema';
import { sql } from 'drizzle-orm';

async function seed() {
  console.log('Seeding database...');

  // Seed plans
  await db
    .insert(plans)
    .values([
      {
        name: 'Free',
        slug: 'free',
        description: 'Get started with AI chat — no credit card required.',
        priceMonthly: 0,
        priceYearly: 0,
        tokenLimitDaily: 5000,
        tokenLimitMonthly: 50000,
        maxConversations: 3,
        features: ['5K tokens/day', '3 conversations', 'GPT-4o-mini only'],
        sortOrder: 0,
      },
      {
        name: 'Pro',
        slug: 'pro',
        description: 'For power users who need more AI access and all models.',
        priceMonthly: 1900,
        priceYearly: 19000,
        tokenLimitDaily: 100000,
        tokenLimitMonthly: 3000000,
        maxConversations: 100,
        features: ['100K tokens/day', '100 conversations', 'All models', 'Priority support'],
        sortOrder: 1,
      },
      {
        name: 'Business',
        slug: 'business',
        description: 'For teams and heavy usage with usage-based billing.',
        priceMonthly: 4900,
        priceYearly: 49000,
        tokenLimitDaily: 500000,
        tokenLimitMonthly: 15000000,
        maxConversations: -1,
        features: [
          '500K tokens/day',
          'Unlimited conversations',
          'All models',
          'Usage-based billing',
          'Priority support',
        ],
        sortOrder: 2,
      },
    ])
    .onConflictDoNothing({ target: plans.slug });

  console.log('Plans seeded.');

  // Verify
  const result = await db.execute(sql`SELECT slug, name FROM plans ORDER BY sort_order`);
  console.log('Plans in database:', result);

  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});

// Plan definitions matching DATABASE.md seed data.
// Buyers update stripePriceId values after creating Stripe products.
export const PLANS = {
  free: {
    name: 'Free',
    slug: 'free',
    price: { monthly: 0, yearly: 0 },
    limits: { tokensDaily: 5000, tokensMonthly: 50000, conversations: 3 },
    features: ['5K tokens/day', '3 conversations', 'GPT-4o-mini only'],
    stripePriceId: { monthly: null as string | null, yearly: null as string | null },
  },
  pro: {
    name: 'Pro',
    slug: 'pro',
    price: { monthly: 19, yearly: 190 },
    limits: { tokensDaily: 100000, tokensMonthly: 3000000, conversations: 100 },
    features: ['100K tokens/day', '100 conversations', 'All models', 'Priority support'],
    stripePriceId: { monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID ?? 'price_xxx', yearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID ?? 'price_yyy' },
  },
  business: {
    name: 'Business',
    slug: 'business',
    price: { monthly: 49, yearly: 490 },
    limits: { tokensDaily: 500000, tokensMonthly: 15000000, conversations: -1 },
    features: ['500K tokens/day', 'Unlimited conversations', 'All models', 'Usage-based billing'],
    stripePriceId: { monthly: process.env.STRIPE_BIZ_MONTHLY_PRICE_ID ?? 'price_xxx', yearly: process.env.STRIPE_BIZ_YEARLY_PRICE_ID ?? 'price_yyy' },
  },
} as const;

export type PlanSlug = keyof typeof PLANS;

export function getPlanBySlug(slug: string) {
  return PLANS[slug as PlanSlug] ?? PLANS.free;
}

export function getPlanLimits(slug: string) {
  return getPlanBySlug(slug).limits;
}

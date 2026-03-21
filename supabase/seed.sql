-- ═══════════════════════════════════════════════════════════
-- Ignitra — Seed data
-- Run after schema is pushed: docker compose exec app pnpm db:seed
-- This file is also mounted into Docker for auto-run on first start.
-- ═══════════════════════════════════════════════════════════

-- Seed plans (skip if tables don't exist yet — first boot before schema push)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'plans') THEN
    INSERT INTO plans (name, slug, description, price_monthly, price_yearly, token_limit_daily, token_limit_monthly, max_conversations, features, sort_order) VALUES
    (
      'Free', 'free',
      'Get started with AI chat — no credit card required.',
      0, 0,
      5000, 50000, 3,
      '["5K tokens/day", "3 conversations", "GPT-4o-mini only"]',
      0
    ),
    (
      'Pro', 'pro',
      'For power users who need more AI access and all models.',
      1900, 19000,
      100000, 3000000, 100,
      '["100K tokens/day", "100 conversations", "All models", "Priority support"]',
      1
    ),
    (
      'Business', 'business',
      'For teams and heavy usage with usage-based billing.',
      4900, 49000,
      500000, 15000000, -1,
      '["500K tokens/day", "Unlimited conversations", "All models", "Usage-based billing", "Priority support"]',
      2
    )
    ON CONFLICT (slug) DO NOTHING;

    RAISE NOTICE 'Plans seeded successfully.';
  ELSE
    RAISE NOTICE 'Plans table does not exist yet. Run drizzle-kit push first.';
  END IF;
END
$$;

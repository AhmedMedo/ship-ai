-- Seed data for ShipAI
-- This file runs automatically on first docker compose up
-- The plans table is created by Drizzle migrations (Task 2)
-- Until then, this file is a no-op

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'plans') THEN
    INSERT INTO plans (name, slug, price_monthly, price_yearly, token_limit_daily, token_limit_monthly, max_conversations, features) VALUES
    ('Free', 'free', 0, 0, 5000, 50000, 3, '["5K tokens/day", "3 conversations", "GPT-4o-mini only"]'),
    ('Pro', 'pro', 1900, 19000, 100000, 3000000, 100, '["100K tokens/day", "100 conversations", "All models", "Priority support"]'),
    ('Business', 'business', 4900, 49000, 500000, 15000000, -1, '["500K tokens/day", "Unlimited conversations", "All models", "Usage-based billing", "Priority support"]')
    ON CONFLICT (slug) DO NOTHING;
  END IF;
END
$$;

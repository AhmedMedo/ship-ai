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

-- ═══════════════════════════════════════════════════════════
-- Demo users for testing
-- Admin:  admin@ignitra.dev / admin123
-- User:   user@ignitra.dev  / user123
--
-- The profile trigger (handle_new_user) auto-creates profiles.
-- After insert, we upgrade the admin user's role.
-- Password hashes are bcrypt of the plaintext passwords above.
-- ═══════════════════════════════════════════════════════════

DO $$
DECLARE
  admin_uid uuid := 'a0000000-0000-0000-0000-000000000001';
  user_uid  uuid := 'a0000000-0000-0000-0000-000000000002';
  pro_plan_id uuid;
BEGIN
  -- Only seed if auth schema exists and users don't already exist
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'users') THEN
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@ignitra.dev') THEN

      -- Insert admin user into auth.users
      INSERT INTO auth.users (
        id, instance_id, aud, role, email,
        encrypted_password,
        email_confirmed_at, confirmation_sent_at,
        raw_app_meta_data, raw_user_meta_data,
        created_at, updated_at
      ) VALUES (
        admin_uid,
        '00000000-0000-0000-0000-000000000000',
        'authenticated', 'authenticated', 'admin@ignitra.dev',
        '$2a$10$4XtqwZ6HbrDv/qiDXNXVl.BdA9nEpcex2HqB1XrMRP3J2pj/YJFIC', -- admin123
        now(), now(),
        '{"provider":"email","providers":["email"]}',
        '{"full_name":"Admin User"}',
        now(), now()
      );

      -- Insert into auth.identities (required for email login)
      INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
      VALUES (
        admin_uid, admin_uid, 'admin@ignitra.dev',
        jsonb_build_object('sub', admin_uid::text, 'email', 'admin@ignitra.dev', 'full_name', 'Admin User'),
        'email', now(), now(), now()
      );

      -- Set admin role (profile was created by trigger)
      UPDATE profiles SET role = 'admin' WHERE id = admin_uid;

      -- Assign Pro plan to admin
      SELECT id INTO pro_plan_id FROM plans WHERE slug = 'pro' LIMIT 1;
      IF pro_plan_id IS NOT NULL THEN
        UPDATE profiles SET plan_id = pro_plan_id WHERE id = admin_uid;
      END IF;

      RAISE NOTICE 'Admin user seeded: admin@ignitra.dev / admin123';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'user@ignitra.dev') THEN

      -- Insert regular user into auth.users
      INSERT INTO auth.users (
        id, instance_id, aud, role, email,
        encrypted_password,
        email_confirmed_at, confirmation_sent_at,
        raw_app_meta_data, raw_user_meta_data,
        created_at, updated_at
      ) VALUES (
        user_uid,
        '00000000-0000-0000-0000-000000000000',
        'authenticated', 'authenticated', 'user@ignitra.dev',
        '$2a$10$.WN8gvWkrRFAOBjnIj9v5.OLdb/4CtXiGlj8tmdgSFkkQc6R9.Ztq', -- user123
        now(), now(),
        '{"provider":"email","providers":["email"]}',
        '{"full_name":"Demo User"}',
        now(), now()
      );

      INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
      VALUES (
        user_uid, user_uid, 'user@ignitra.dev',
        jsonb_build_object('sub', user_uid::text, 'email', 'user@ignitra.dev', 'full_name', 'Demo User'),
        'email', now(), now(), now()
      );

      RAISE NOTICE 'Demo user seeded: user@ignitra.dev / user123';
    END IF;
  END IF;
END
$$;

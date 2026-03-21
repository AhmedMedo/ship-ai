-- ═══════════════════════════════════════════════════════════
-- Ignitra — Row Level Security policies and triggers
-- Run after Drizzle schema is pushed (drizzle-kit push)
-- ═══════════════════════════════════════════════════════════

-- ── Enable RLS on all tables ──
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

-- ── Plans: readable by everyone (public pricing) ──
CREATE POLICY "Plans are publicly readable"
  ON plans FOR SELECT USING (true);

-- ── Profiles: users see/edit their own ──
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- ── Admins can view all profiles ──
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ── Subscriptions: users see their own ──
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT USING (auth.uid() = user_id);

-- ── Conversations: users CRUD their own ──
CREATE POLICY "Users can view own conversations"
  ON conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own conversations"
  ON conversations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own conversations"
  ON conversations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own conversations"
  ON conversations FOR DELETE USING (auth.uid() = user_id);

-- ── Admins can view all conversations ──
CREATE POLICY "Admins can view all conversations"
  ON conversations FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ── Messages: users see messages in their own conversations ──
CREATE POLICY "Users can view messages in own conversations"
  ON messages FOR SELECT USING (
    EXISTS (SELECT 1 FROM conversations WHERE id = conversation_id AND user_id = auth.uid())
  );
CREATE POLICY "Users can insert messages in own conversations"
  ON messages FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM conversations WHERE id = conversation_id AND user_id = auth.uid())
  );

-- ── Usage logs: users see their own ──
CREATE POLICY "Users can view own usage"
  ON usage_logs FOR SELECT USING (auth.uid() = user_id);

-- ── Admins can view all usage ──
CREATE POLICY "Admins can view all usage"
  ON usage_logs FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ═══════════════════════════════════════════════════════════
-- Auto-create profile on signup
-- When a user registers via Supabase Auth, this trigger
-- inserts a matching row in the profiles table.
-- ═══════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if it exists (idempotent)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

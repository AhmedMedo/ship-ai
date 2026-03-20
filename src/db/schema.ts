import { relations, type SQL } from 'drizzle-orm';
import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  numeric,
  jsonb,
  index,
  check,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// ─── Plans ───────────────────────────────────────────────────────────────────
// Subscription plan definitions with AI usage limits.
// Buyers customize these for their product's pricing tiers.

export const plans = pgTable('plans', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  stripePriceIdMonthly: text('stripe_price_id_monthly'),
  stripePriceIdYearly: text('stripe_price_id_yearly'),
  priceMonthly: integer('price_monthly').notNull(), // cents
  priceYearly: integer('price_yearly').notNull(), // cents
  tokenLimitDaily: integer('token_limit_daily').notNull().default(10000),
  tokenLimitMonthly: integer('token_limit_monthly').notNull().default(300000),
  maxConversations: integer('max_conversations').notNull().default(10),
  features: jsonb('features').notNull().default(sql`'[]'::jsonb`),
  isActive: boolean('is_active').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
});

// ─── Profiles ────────────────────────────────────────────────────────────────
// Extended user data, linked 1:1 to Supabase auth.users.
// Auto-created via a DB trigger when a user signs up.

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(), // References auth.users(id) — FK added via raw SQL migration
  fullName: text('full_name'),
  avatarUrl: text('avatar_url'),
  email: text('email').notNull(),
  role: text('role').notNull().default('user'),
  planId: uuid('plan_id').references(() => plans.id),
  stripeCustomerId: text('stripe_customer_id').unique(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
}, (table) => [
  check('role_check', sql`${table.role} IN ('user', 'admin')`),
]);

// ─── Subscriptions ───────────────────────────────────────────────────────────
// Active Stripe subscriptions linked to users and plans.

export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  planId: uuid('plan_id').notNull().references(() => plans.id),
  stripeSubscriptionId: text('stripe_subscription_id').unique(),
  status: text('status').notNull().default('active'),
  currentPeriodStart: timestamp('current_period_start', { withTimezone: true, mode: 'date' }),
  currentPeriodEnd: timestamp('current_period_end', { withTimezone: true, mode: 'date' }),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
}, (table) => [
  index('idx_subscriptions_user').on(table.userId),
  index('idx_subscriptions_stripe').on(table.stripeSubscriptionId),
  check('status_check', sql`${table.status} IN ('active', 'canceled', 'past_due', 'trialing', 'incomplete')`),
]);

// ─── Conversations ───────────────────────────────────────────────────────────
// Chat conversation threads. Each user can have multiple conversations.

export const conversations = pgTable('conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  title: text('title').notNull().default('New conversation'),
  model: text('model').notNull().default('gpt-4o-mini'),
  systemPrompt: text('system_prompt'),
  messageCount: integer('message_count').notNull().default(0),
  totalTokens: integer('total_tokens').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
}, (table) => [
  index('idx_conversations_user').on(table.userId),
  index('idx_conversations_updated').on(table.userId, table.updatedAt),
]);

// ─── Messages ────────────────────────────────────────────────────────────────
// Individual messages within a conversation (user, assistant, or system).

export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id').notNull().references(() => conversations.id, { onDelete: 'cascade' }),
  role: text('role').notNull(),
  content: text('content').notNull(),
  model: text('model'),
  inputTokens: integer('input_tokens').default(0),
  outputTokens: integer('output_tokens').default(0),
  costUsd: numeric('cost_usd', { precision: 10, scale: 6 }).default('0'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
}, (table) => [
  index('idx_messages_conversation').on(table.conversationId, table.createdAt),
  check('role_check', sql`${table.role} IN ('user', 'assistant', 'system')`),
]);

// ─── Usage Logs ──────────────────────────────────────────────────────────────
// Per-request AI usage tracking for billing and analytics.
// total_tokens is a generated column (input + output) added via raw SQL.

export const usageLogs = pgTable('usage_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  conversationId: uuid('conversation_id').references(() => conversations.id, { onDelete: 'set null' }),
  model: text('model').notNull(),
  inputTokens: integer('input_tokens').notNull().default(0),
  outputTokens: integer('output_tokens').notNull().default(0),
  totalTokens: integer('total_tokens').generatedAlwaysAs(sql`input_tokens + output_tokens`),
  costUsd: numeric('cost_usd', { precision: 10, scale: 6 }).notNull().default('0'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
}, (table) => [
  index('idx_usage_user_date').on(table.userId, table.createdAt),
]);

// ─── Relations ───────────────────────────────────────────────────────────────

export const plansRelations = relations(plans, ({ many }) => ({
  profiles: many(profiles),
  subscriptions: many(subscriptions),
}));

export const profilesRelations = relations(profiles, ({ one, many }) => ({
  plan: one(plans, { fields: [profiles.planId], references: [plans.id] }),
  subscriptions: many(subscriptions),
  conversations: many(conversations),
  usageLogs: many(usageLogs),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(profiles, { fields: [subscriptions.userId], references: [profiles.id] }),
  plan: one(plans, { fields: [subscriptions.planId], references: [plans.id] }),
}));

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  user: one(profiles, { fields: [conversations.userId], references: [profiles.id] }),
  messages: many(messages),
  usageLogs: many(usageLogs),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, { fields: [messages.conversationId], references: [conversations.id] }),
}));

export const usageLogsRelations = relations(usageLogs, ({ one }) => ({
  user: one(profiles, { fields: [usageLogs.userId], references: [profiles.id] }),
  conversation: one(conversations, { fields: [usageLogs.conversationId], references: [conversations.id] }),
}));

// ─── Type Exports ────────────────────────────────────────────────────────────

export type Plan = typeof plans.$inferSelect;
export type NewPlan = typeof plans.$inferInsert;

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;

export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;

export type Conversation = typeof conversations.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;

export type UsageLog = typeof usageLogs.$inferSelect;
export type NewUsageLog = typeof usageLogs.$inferInsert;

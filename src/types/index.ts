// Shared TypeScript types used across the application.
// These mirror the DB schema and API response shapes.

export interface UserProfile {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  role: 'user' | 'admin';
  planId: string | null;
  stripeCustomerId: string | null;
  createdAt: Date;
}

export interface Plan {
  id: string;
  name: string;
  slug: 'free' | 'pro' | 'business';
  priceMonthly: number;
  priceYearly: number;
  tokenLimitDaily: number;
  tokenLimitMonthly: number;
  maxConversations: number;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  model: string;
  messageCount: number;
  totalTokens: number;
  updatedAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  model?: string;
  inputTokens?: number;
  outputTokens?: number;
  costUsd?: string;
  createdAt: Date;
}

export interface UsageResponse {
  period: 'today' | 'month';
  tokensUsed: number;
  tokenLimit: number;
  percentUsed: number;
  costUsd: number;
  requestCount: number;
  conversationCount: number;
  plan: { name: string; slug: string };
  byModel: Record<string, { tokens: number; cost: number; requests: number }>;
}

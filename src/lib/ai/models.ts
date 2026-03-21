// ─── Model ID Constants ─────────────────────────────────────────────────────
// Use these instead of raw strings to avoid typos and enable autocomplete.

export const MODELS = {
  // OpenAI
  GPT_4O: 'gpt-4o',
  GPT_4O_MINI: 'gpt-4o-mini',
  GPT_35_TURBO: 'gpt-3.5-turbo',
  // Anthropic
  CLAUDE_SONNET: 'claude-sonnet-4-20250514',
  CLAUDE_HAIKU: 'claude-haiku-4-5-20251001',
  // Google
  GEMINI_FLASH: 'gemini-2.0-flash',
  GEMINI_PRO: 'gemini-1.5-pro',
} as const;

export type ModelId = (typeof MODELS)[keyof typeof MODELS];

// ─── Model Pricing ──────────────────────────────────────────────────────────
// Cost per 1M tokens — used to calculate cost per AI request.
// Buyers can add new models here as providers release them.

export const MODEL_PRICING: Record<string, { input: number; output: number }> = {
  [MODELS.GPT_4O]: { input: 2.50, output: 10.00 },
  [MODELS.GPT_4O_MINI]: { input: 0.15, output: 0.60 },
  [MODELS.GPT_35_TURBO]: { input: 0.50, output: 1.50 },
  [MODELS.CLAUDE_SONNET]: { input: 3.00, output: 15.00 },
  [MODELS.CLAUDE_HAIKU]: { input: 1.00, output: 5.00 },
  [MODELS.GEMINI_FLASH]: { input: 0.10, output: 0.40 },
  [MODELS.GEMINI_PRO]: { input: 1.25, output: 5.00 },
};

// ─── Default fallback pricing for unknown models ────────────────────────────
const FALLBACK_PRICING = { input: 0.15, output: 0.60 };

// Calculate USD cost for a single AI request based on token counts
export function calculateCost(model: string, inputTokens: number, outputTokens: number): number {
  const pricing = MODEL_PRICING[model] || FALLBACK_PRICING;
  return (inputTokens * pricing.input + outputTokens * pricing.output) / 1_000_000;
}

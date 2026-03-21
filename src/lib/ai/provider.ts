import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { MODELS } from './models';

// ─── Provider Constants ─────────────────────────────────────────────────────
export const PROVIDERS = {
  OPENAI: 'openai',
  ANTHROPIC: 'anthropic',
  GOOGLE: 'google',
} as const;

export type ProviderId = (typeof PROVIDERS)[keyof typeof PROVIDERS];

// Returns the AI provider instance based on AI_PROVIDER env var.
// Buyers switch providers by changing one env var — no code changes needed.
export function getAIProvider() {
  const provider = process.env.AI_PROVIDER || PROVIDERS.OPENAI;

  switch (provider) {
    case PROVIDERS.OPENAI:
      return createOpenAI({ apiKey: process.env.OPENAI_API_KEY });
    case PROVIDERS.ANTHROPIC:
      return createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    case PROVIDERS.GOOGLE:
      return createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY });
    default:
      throw new Error(`Unknown AI provider: ${provider}. Use '${PROVIDERS.OPENAI}', '${PROVIDERS.ANTHROPIC}', or '${PROVIDERS.GOOGLE}'.`);
  }
}

// Returns the configured model instance ready for streamText()
export function getModel() {
  const provider = getAIProvider();
  const modelId = process.env.AI_MODEL || MODELS.GPT_4O_MINI;
  return provider(modelId);
}

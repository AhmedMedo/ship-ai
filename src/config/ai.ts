// AI configuration — read from env with sensible defaults.
// Buyers only need to set AI_PROVIDER and the corresponding API key.
export const aiConfig = {
  provider: process.env.AI_PROVIDER || 'openai',
  model: process.env.AI_MODEL || 'gpt-4o-mini',
  maxTokens: parseInt(process.env.AI_MAX_TOKENS || '4096', 10),
  temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
} as const;

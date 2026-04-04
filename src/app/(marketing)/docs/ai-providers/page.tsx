import type { Metadata } from 'next';
import { DocsProse } from '@/components/docs/docs-prose';

export const metadata: Metadata = {
  title: 'AI Providers',
  description: 'Configure OpenAI, Anthropic, and Google AI with the Vercel AI SDK.',
  alternates: { canonical: '/docs/ai-providers' },
};

export default function AiProvidersPage() {
  return (
    <DocsProse>
      <h1>AI Providers</h1>
      <p>
        Ignitra supports multiple AI providers. Switch between them by changing one environment variable — zero
        code changes.
      </p>

      <h2>Supported Providers</h2>

      <h3>OpenAI</h3>
      <p>
        Models: <code>gpt-4o</code>, <code>gpt-4o-mini</code>, <code>gpt-4-turbo</code>
      </p>
      <p>
        Set: <code>AI_PROVIDER=openai</code>, <code>AI_MODEL=gpt-4o-mini</code>
      </p>

      <h3>Anthropic (Claude)</h3>
      <p>
        Models: <code>claude-sonnet-4-20250514</code>, <code>claude-haiku-4-5-20251001</code>
      </p>
      <p>
        Set: <code>AI_PROVIDER=anthropic</code>, <code>AI_MODEL=claude-sonnet-4-20250514</code>
      </p>

      <h3>Google (Gemini)</h3>
      <p>
        Models: <code>gemini-2.0-flash</code>, <code>gemini-1.5-pro</code>
      </p>
      <p>
        Set: <code>AI_PROVIDER=google</code>, <code>AI_MODEL=gemini-2.0-flash</code>
      </p>

      <h2>How It Works</h2>
      <p>
        Ignitra uses the Vercel AI SDK which provides a unified interface across providers. The provider
        selection happens in <code>src/lib/ai/provider.ts</code>:
      </p>
      <p>
        The <code>getModel()</code> function reads <code>AI_PROVIDER</code> and <code>AI_MODEL</code> from
        environment variables and returns the correct provider instance. Your chat API route calls this function
        — so switching providers requires zero code changes.
      </p>

      <h2>Recommended Setup</h2>
      <p>
        <strong>Development:</strong> <code>gpt-4o-mini</code> (cheapest, fast)
      </p>
      <p>
        <strong>Production:</strong> depends on your use case
      </p>
      <ul>
        <li>Best quality: <code>claude-sonnet-4-20250514</code> or <code>gpt-4o</code></li>
        <li>Best speed: <code>gemini-2.0-flash</code></li>
        <li>Best value: <code>gpt-4o-mini</code></li>
      </ul>
    </DocsProse>
  );
}

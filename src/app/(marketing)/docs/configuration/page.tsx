import type { Metadata } from 'next';
import { DocsProse } from '@/components/docs/docs-prose';

export const metadata: Metadata = {
  title: 'Configuration',
  description: 'Environment variables and configuration for Ignitra.',
  alternates: { canonical: '/docs/configuration' },
};

export default function ConfigurationPage() {
  return (
    <DocsProse>
      <h1>Configuration</h1>
      <p>All configuration is done through environment variables in the <code>.env</code> file.</p>

      <h2>Environment Variables</h2>
      <p>Copy the example file:</p>
      <pre>
        <code>cp .env.example .env</code>
      </pre>

      <h3>Required Variables</h3>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Variable</th>
              <th>Description</th>
              <th>Where to get it</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>NEXT_PUBLIC_SUPABASE_URL</code>
              </td>
              <td>Supabase project URL</td>
              <td>Supabase Dashboard → Settings → API</td>
            </tr>
            <tr>
              <td>
                <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
              </td>
              <td>Supabase anonymous key</td>
              <td>Same location</td>
            </tr>
            <tr>
              <td>
                <code>SUPABASE_SERVICE_ROLE_KEY</code>
              </td>
              <td>Supabase service key (server-side only)</td>
              <td>Same location</td>
            </tr>
            <tr>
              <td>
                <code>DATABASE_URL</code>
              </td>
              <td>PostgreSQL connection string</td>
              <td>Supabase → Settings → Database</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>AI Provider Variables</h3>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Variable</th>
              <th>Description</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>AI_PROVIDER</code>
              </td>
              <td>Which AI provider to use</td>
              <td>
                <code>openai</code>, <code>anthropic</code>, <code>google</code>
              </td>
            </tr>
            <tr>
              <td>
                <code>AI_MODEL</code>
              </td>
              <td>Which model to use</td>
              <td>
                <code>gpt-4o-mini</code>, <code>claude-sonnet-4-20250514</code>, etc.
              </td>
            </tr>
            <tr>
              <td>
                <code>OPENAI_API_KEY</code>
              </td>
              <td>OpenAI API key</td>
              <td>platform.openai.com</td>
            </tr>
            <tr>
              <td>
                <code>ANTHROPIC_API_KEY</code>
              </td>
              <td>Anthropic API key</td>
              <td>console.anthropic.com</td>
            </tr>
            <tr>
              <td>
                <code>GOOGLE_GENERATIVE_AI_API_KEY</code>
              </td>
              <td>Google AI (Gemini) API key</td>
              <td>aistudio.google.com</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>Only set the API key for the provider you&apos;re using.</p>

      <h3>Stripe Variables</h3>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Variable</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code>
              </td>
              <td>Stripe publishable key</td>
            </tr>
            <tr>
              <td>
                <code>STRIPE_SECRET_KEY</code>
              </td>
              <td>Stripe secret key</td>
            </tr>
            <tr>
              <td>
                <code>STRIPE_WEBHOOK_SECRET</code>
              </td>
              <td>Stripe webhook signing secret</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Optional Variables</h3>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Variable</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>NEXT_PUBLIC_APP_URL</code>
              </td>
              <td>http://localhost:3000</td>
              <td>Your app&apos;s public URL</td>
            </tr>
            <tr>
              <td>
                <code>SYSTEM_PROMPT</code>
              </td>
              <td>&quot;You are a helpful assistant.&quot;</td>
              <td>The AI system prompt</td>
            </tr>
            <tr>
              <td>
                <code>RESEND_API_KEY</code>
              </td>
              <td>—</td>
              <td>Resend email API key</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Customizing the System Prompt</h2>
      <p>The system prompt defines your AI&apos;s personality. Change it in <code>.env</code>:</p>
      <pre>
        <code>{`SYSTEM_PROMPT="You are a professional copywriter. Help users write engaging blog posts, social media captions, and marketing copy."`}</code>
      </pre>
      <p>This single change transforms Ignitra from a generic AI chat into a specialized product.</p>
    </DocsProse>
  );
}

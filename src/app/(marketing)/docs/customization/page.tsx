import type { Metadata } from 'next';
import { DocsProse } from '@/components/docs/docs-prose';

export const metadata: Metadata = {
  title: 'Customization',
  description: 'Branding, system prompt, landing page, and plans configuration.',
  alternates: { canonical: '/docs/customization' },
};

export default function CustomizationPage() {
  return (
    <DocsProse>
      <h1>Customization</h1>
      <p>Make Ignitra your own product.</p>

      <h2>Branding</h2>

      <h3>Logo</h3>
      <p>
        Replace the logo in <code>src/components/shared/logo.tsx</code>. The current logo is an inline SVG —
        replace it with your own.
      </p>

      <h3>Colors</h3>
      <p>
        Update colors in <code>tailwind.config.ts</code> and <code>src/app/globals.css</code>. The main brand
        colors are defined as CSS variables.
      </p>

      <h3>Fonts</h3>
      <p>
        Change fonts in <code>src/app/layout.tsx</code>. Ignitra uses Inter by default. Import your font from
        Google Fonts or load locally.
      </p>

      <h3>Favicon</h3>
      <p>
        Replace <code>public/favicon.svg</code> with your favicon.
      </p>

      <h2>System Prompt</h2>
      <p>The most important customization — this defines what your AI does.</p>
      <p>In .env:</p>
      <pre>
        <code>{`SYSTEM_PROMPT="You are an expert fitness coach. Create personalized workout plans, answer nutrition questions, and motivate users to reach their fitness goals."`}</code>
      </pre>
      <p>Tips for great system prompts:</p>
      <ul>
        <li>Be specific about the AI&apos;s role and expertise</li>
        <li>Define what it should and shouldn&apos;t do</li>
        <li>Include formatting preferences</li>
        <li>Add domain-specific knowledge or rules</li>
      </ul>

      <h2>Landing Page</h2>
      <p>
        Edit the marketing page at <code>src/app/(marketing)/page.tsx</code>. Each section is a separate
        component in <code>src/components/marketing/</code> (or <code>src/components/landing/</code> depending on
        your structure). Change text, images, pricing, and feature descriptions.
      </p>

      <h2>Plan Configuration</h2>
      <p>
        Edit <code>src/config/plans.ts</code> to define your pricing tiers, features, token limits, and Stripe
        price IDs.
      </p>
    </DocsProse>
  );
}

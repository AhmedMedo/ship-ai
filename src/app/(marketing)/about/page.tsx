import type { Metadata } from 'next';
import { MarketingDocLayout } from '@/components/marketing/marketing-doc-layout';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Why Ignitra exists, who it is for, the tech stack, and about creator Ahmed Alaa — senior full-stack developer in Cairo, Egypt.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Ignitra',
    description: 'The story behind the AI-native Next.js SaaS boilerplate.',
    url: '/about',
  },
};

const section =
  'mt-12 scroll-mt-28 border-b border-white/10 pb-2 text-xl font-semibold text-[#F1F5F9] first:mt-0';

export default function AboutPage() {
  return (
    <MarketingDocLayout title="About Ignitra">
      <h2 className={section}>The Problem</h2>
      <p>
        Every time a developer wants to build an AI-powered SaaS product, they face the same 2–3 month grind:
        setting up authentication, payment processing, database schemas, chat UI with streaming, token tracking,
        and usage-based billing — before writing a single line of actual product code.
      </p>
      <p>
        I know this because I&apos;ve lived it. As a senior full-stack developer, I&apos;ve built AI features
        professionally and watched the same foundational work repeat itself across every project.
      </p>

      <h2 className={section}>The Solution</h2>
      <p>
        Ignitra is an AI-native Next.js boilerplate that eliminates those months of setup. Clone the repo, change
        your environment variables, deploy to Vercel — and you have a production-ready AI SaaS product.
      </p>
      <p>
        What makes Ignitra different from other boilerplates is that it&apos;s built specifically for AI
        products. Multi-provider AI support (OpenAI, Claude, Gemini), streaming chat with code blocks, per-user
        token tracking, and usage-based billing are all built in from day one — not bolted on as afterthoughts.
      </p>

      <h2 className={section}>Who It&apos;s For</h2>
      <p>Ignitra is built for:</p>
      <ul className="my-4 list-disc space-y-2 pl-5">
        <li>Solo developers who want to ship an AI product fast</li>
        <li>Indie hackers validating AI SaaS ideas over a weekend</li>
        <li>Small dev teams (2–5 people) building their next product</li>
        <li>Freelancers who build AI products for clients</li>
      </ul>

      <h2 className={section}>The Tech Stack</h2>
      <p>Ignitra uses the tools modern developers already know and love:</p>
      <ul className="my-4 list-disc space-y-2 pl-5">
        <li>Next.js 15 (App Router) with TypeScript</li>
        <li>Tailwind CSS and shadcn/ui</li>
        <li>Supabase for auth and PostgreSQL</li>
        <li>Drizzle ORM for type-safe queries</li>
        <li>Stripe for subscriptions and usage billing</li>
        <li>Vercel AI SDK for streaming responses</li>
        <li>Resend for transactional emails</li>
        <li>Docker Compose for local development</li>
      </ul>

      <h2 className={section}>About the Creator</h2>
      <p>
        I&apos;m Ahmed Alaa, a senior full-stack developer based in Cairo, Egypt. I build software professionally
        and created Ignitra as a side project to solve a problem I kept running into: spending months on
        boilerplate before building the actual product.
      </p>
      <p>
        I&apos;m building Ignitra in public — sharing progress, revenue, and lessons learned along the way.
      </p>

      <h2 className={section}>Get in Touch</h2>
      <ul className="my-4 list-none space-y-2 pl-0">
        <li>
          Website:{' '}
          <a href="https://ignitra.dev" target="_blank" rel="noopener noreferrer">
            ignitra.dev
          </a>
        </li>
        <li>
          Twitter:{' '}
          <a href="https://x.com/AhmedAlaa707" target="_blank" rel="noopener noreferrer">
            @AhmedAlaa707
          </a>
        </li>
        <li>
          Email:{' '}
          <a href="mailto:info@ignitra.dev">info@ignitra.dev</a>
        </li>
        <li>
          Support the project:{' '}
          <a href="https://ko-fi.com/ahmedalaa20194" target="_blank" rel="noopener noreferrer">
            ko-fi.com/ahmedalaa20194
          </a>
        </li>
      </ul>
    </MarketingDocLayout>
  );
}

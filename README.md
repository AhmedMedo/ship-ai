# Ignitra

The AI-native SaaS boilerplate for developers who ship fast. Launch your AI SaaS product in days, not months.

**Next.js 15 + TypeScript + Supabase + Stripe + Vercel AI SDK + Tailwind CSS**

---

## What's Included

- **Authentication** — Email/password, magic link, Google & GitHub OAuth (Supabase Auth)
- **AI Streaming Chat** — Multi-turn conversations with real-time token streaming, markdown, syntax-highlighted code blocks
- **Multi-Provider AI** — OpenAI, Anthropic, Google. Switch with one env var, zero code changes
- **Stripe Billing** — Subscriptions (monthly/yearly), checkout, customer portal, webhook handling
- **Token Tracking** — Per-user daily/monthly limits, per-request cost calculation, usage dashboard
- **Admin Panel** — User management, stats cards, role-based access control
- **Blog** — MDX-based with frontmatter, auto-generated sitemap + RSS feed
- **Email** — Transactional emails via Resend (welcome, usage warning, payment failed)
- **Dark Mode** — Full theme support across every page
- **3D Landing Page** — Framer Motion animations + CSS 3D hero with mouse parallax

---

## Quick Start

### Prerequisites

- [Node.js 20+](https://nodejs.org/) and [pnpm](https://pnpm.io/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- API key for at least one AI provider ([OpenAI](https://platform.openai.com/), [Anthropic](https://console.anthropic.com/), or [Google AI](https://aistudio.google.com/))

### 1. Clone and install

```bash
git clone <your-repo-url> my-ai-saas
cd my-ai-saas
pnpm install
```

### 2. Configure environment

```bash
cp .env.docker.example .env.local
```

Open `.env.local` and set your AI provider key:

```env
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...
```

### 3. Start Docker services

```bash
docker compose up -d
```

This starts PostgreSQL, Supabase Auth, Studio, Storage, Kong gateway, and Inbucket (email catcher).

### 4. Push the database schema

```bash
docker compose exec app pnpm db:push
```

### 5. Seed initial data

```bash
docker compose exec app pnpm db:seed
```

This creates the Free, Pro, and Business plans.

### 6. Seed demo users (optional)

```bash
bash scripts/seed-demo-users.sh
```

Creates two test accounts:
- **Admin**: `admin@ignitra.dev` / `admin123`
- **User**: `user@ignitra.dev` / `user123`

### 7. Open the app

- **App**: [http://localhost:3000](http://localhost:3000)
- **Supabase Studio**: [http://localhost:54323](http://localhost:54323)
- **Inbucket (emails)**: [http://localhost:54328](http://localhost:54328)

---

## Environment Variables

### Required

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase API URL | `http://localhost:54325` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (public, safe for browser) | `eyJ...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only) | `eyJ...` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@db:5432/postgres` |
| `AI_PROVIDER` | AI provider: `openai`, `anthropic`, or `google` | `openai` |
| `OPENAI_API_KEY` | OpenAI API key (if using OpenAI) | `sk-...` |

### Optional

| Variable | Description | Default |
|----------|-------------|---------|
| `SUPABASE_URL` | Internal Supabase URL (Docker networking) | `http://kong:8000` |
| `ANTHROPIC_API_KEY` | Anthropic API key | — |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google AI API key | — |
| `AI_MODEL` | Model ID | `gpt-4o-mini` |
| `AI_MAX_TOKENS` | Max tokens per response | `4096` |
| `AI_TEMPERATURE` | Sampling temperature | `0.7` |
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | `whsec_...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | `pk_test_...` |
| `STRIPE_PRO_MONTHLY_PRICE_ID` | Stripe price ID for Pro monthly | `price_...` |
| `STRIPE_PRO_YEARLY_PRICE_ID` | Stripe price ID for Pro yearly | `price_...` |
| `STRIPE_BIZ_MONTHLY_PRICE_ID` | Stripe price ID for Business monthly | `price_...` |
| `STRIPE_BIZ_YEARLY_PRICE_ID` | Stripe price ID for Business yearly | `price_...` |
| `RESEND_API_KEY` | Resend email API key | `re_...` |
| `EMAIL_FROM` | Sender email | `Ignitra <noreply@ignitra.dev>` |
| `DEV_SKIP_AUTH` | Skip auth in development (never works in production) | `true` |
| `NEXT_PUBLIC_APP_URL` | Public app URL | `http://localhost:3000` |
| `NEXT_PUBLIC_APP_NAME` | App display name | `Ignitra` |

---

## Stripe Setup

### 1. Create products in Stripe Dashboard

Create two products with these prices:

| Product | Monthly | Yearly |
|---------|---------|--------|
| **Pro** | $19/month | $190/year |
| **Business** | $49/month | $490/year |

### 2. Copy price IDs to env

```env
STRIPE_PRO_MONTHLY_PRICE_ID=price_xxx
STRIPE_PRO_YEARLY_PRICE_ID=price_yyy
STRIPE_BIZ_MONTHLY_PRICE_ID=price_xxx
STRIPE_BIZ_YEARLY_PRICE_ID=price_yyy
```

### 3. Set up webhooks

**Production**: In Stripe Dashboard → Webhooks → Add endpoint:
- URL: `https://your-domain.com/api/webhooks/stripe`
- Events: `checkout.session.completed`, `invoice.paid`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`

**Local development**: Use the Stripe CLI container:

```bash
docker compose --profile stripe up -d
```

This auto-forwards webhook events to `http://app:3000/api/webhooks/stripe`.

---

## AI Provider Setup

Switch AI providers by changing one env var — no code changes:

```env
# OpenAI (default)
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...

# Anthropic
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Google
AI_PROVIDER=google
GOOGLE_GENERATIVE_AI_API_KEY=AI...
```

### Supported Models

| Provider | Models |
|----------|--------|
| OpenAI | `gpt-4o`, `gpt-4o-mini`, `gpt-3.5-turbo` |
| Anthropic | `claude-sonnet-4-20250514`, `claude-haiku-4-5-20251001` |
| Google | `gemini-2.0-flash`, `gemini-1.5-pro` |

Set the model with `AI_MODEL=gpt-4o` in your env.

---

## Customization Guide

### Change branding

1. **Logo**: Edit `src/components/shared/logo.tsx` — replace the SVG
2. **Colors**: Edit `src/app/globals.css` — change `--color-primary` and related tokens
3. **Name**: Set `NEXT_PUBLIC_APP_NAME` in your env
4. **Favicon**: Replace `public/favicon.svg`

### Modify plans

Edit `src/config/plans.ts` to change plan names, prices, limits, and features. Update the Stripe price IDs to match.

### Add AI models

Edit `src/lib/ai/models.ts` to add new models with their pricing. The provider factory in `src/lib/ai/provider.ts` handles the rest.

### Customize the system prompt

Edit `src/lib/ai/prompts.ts` — this is the system prompt sent with every AI request.

### Add new pages

Follow Next.js App Router conventions:
- Marketing pages: `src/app/(marketing)/your-page/page.tsx`
- Dashboard pages: `src/app/(dashboard)/dashboard/your-page/page.tsx`
- API routes: `src/app/api/your-route/route.ts`

---

## Deployment (Vercel)

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Import in Vercel

1. Go to [vercel.com](https://vercel.com) → Import Project
2. Select your GitHub repo
3. Add all environment variables from `.env.example`
4. Deploy

### 3. Set up Supabase (cloud)

1. Create a project at [supabase.com](https://supabase.com)
2. Run the schema: `pnpm db:push` (point `DATABASE_URL` to your Supabase project)
3. Run the seed: `pnpm db:seed`
4. Enable Google and/or GitHub OAuth in Supabase Dashboard → Authentication → Providers
5. Set the site URL and redirect URLs in Supabase Dashboard → Authentication → URL Configuration

---

## Docker Services Reference

| Service | Port | URL |
|---------|------|-----|
| Next.js app | 3000 | http://localhost:3000 |
| Supabase Auth (GoTrue) | 54321 | http://localhost:54321 |
| PostgreSQL | 54322 | `psql -h localhost -p 54322 -U postgres` |
| Supabase Studio | 54323 | http://localhost:54323 |
| PostgREST | 54324 | http://localhost:54324 |
| Kong (API Gateway) | 54325 | http://localhost:54325 |
| Postgres Meta | 54326 | http://localhost:54326 |
| Storage | 54327 | http://localhost:54327 |
| Inbucket (email) | 54328 | http://localhost:54328 |

---

## Available Scripts

```bash
pnpm dev              # Start dev server (Turbopack)
pnpm build            # Production build
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm type-check       # TypeScript type checking
pnpm format           # Format with Prettier
pnpm test             # Run tests (watch mode)
pnpm test:run         # Run tests once
pnpm db:generate      # Generate migration from schema
pnpm db:push          # Push schema to database
pnpm db:seed          # Seed plans + demo data
pnpm db:studio        # Open Drizzle Studio
```

---

## Project Structure

```
src/
├── app/
│   ├── (marketing)/     # Landing page, blog (dark theme)
│   ├── (auth)/          # Login, signup, callback
│   ├── (dashboard)/     # Dashboard, chat, usage, billing, settings
│   ├── (admin)/         # Admin panel (role-guarded)
│   └── api/             # API routes (chat, billing, webhooks, usage)
├── components/
│   ├── chat/            # Chat UI (container, bubbles, input, code blocks)
│   ├── dashboard/       # Sidebar, header
│   ├── marketing/       # Landing page sections
│   ├── shared/          # Logo, theme toggle
│   └── ui/              # shadcn/ui primitives
├── lib/
│   ├── ai/              # Provider factory, models, usage tracking, prompts
│   ├── billing/         # Stripe client, checkout, portal, webhooks
│   ├── email/           # Resend client + email templates
│   └── supabase/        # Browser client, server client, middleware
├── db/                  # Drizzle schema, migrations, connection
├── config/              # Plans, AI config, site config
└── types/               # Shared TypeScript types
```

---

## FAQ

**Can I use this for multiple projects?**
Yes. One purchase, unlimited projects. No license server or activation required.

**Do I need Docker?**
Docker is recommended for local development (runs Supabase locally). For production, deploy to Vercel + Supabase Cloud.

**Can I remove Stripe?**
Yes. Delete the billing routes and remove the Stripe env vars. The chat and auth work independently.

**How do I add a new AI model?**
Add it to `src/lib/ai/models.ts` with its pricing, then set `AI_MODEL` in your env.

**How do I change the token limits?**
Edit `src/config/plans.ts` and update the `limits` object for each plan. Then update the matching row in the `plans` database table.

**Where are emails caught in development?**
Inbucket at [http://localhost:54328](http://localhost:54328). No real emails are sent in dev mode.

---

## Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 15 | React framework (App Router) |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 4 | Styling |
| shadcn/ui | latest | UI component primitives |
| Supabase | local/cloud | Auth, database, storage |
| PostgreSQL | 15 | Database |
| Drizzle ORM | latest | Type-safe database queries |
| Stripe | latest | Payments and subscriptions |
| Vercel AI SDK | latest | AI provider abstraction |
| Resend | latest | Transactional email |
| Framer Motion | latest | Animations |
| Three.js | latest | 3D landing page elements |

---

## License

This is a commercial product. See LICENSE file for terms.

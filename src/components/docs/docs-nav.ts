export type DocsNavLink = { label: string; href: string };

export type DocsNavSection = {
  title: string;
  links: DocsNavLink[];
};

export const docsNavSections: DocsNavSection[] = [
  {
    title: 'Getting Started',
    links: [
      { label: 'Quick Start', href: '/docs/getting-started' },
      { label: 'Installation', href: '/docs/installation' },
      { label: 'Configuration', href: '/docs/configuration' },
    ],
  },
  {
    title: 'Features',
    links: [
      { label: 'Authentication', href: '/docs/authentication' },
      { label: 'AI Providers', href: '/docs/ai-providers' },
      { label: 'Payments & Billing', href: '/docs/payments' },
      { label: 'Token Tracking', href: '/docs/token-tracking' },
    ],
  },
  {
    title: 'Going Live',
    links: [
      { label: 'Deployment', href: '/docs/deployment' },
      { label: 'Customization', href: '/docs/customization' },
    ],
  },
  {
    title: 'Reference',
    links: [{ label: 'API Reference', href: '/docs/api-reference' }],
  },
];

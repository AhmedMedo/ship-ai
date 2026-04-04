import type { MetadataRoute } from 'next';
import { getAllSlugs } from '@/lib/blog';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ignitra.dev';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/license`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/signup`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/docs`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/docs/getting-started`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/docs/installation`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.65 },
    { url: `${BASE_URL}/docs/configuration`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.65 },
    { url: `${BASE_URL}/docs/authentication`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/docs/ai-providers`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/docs/payments`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/docs/token-tracking`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/docs/deployment`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${BASE_URL}/docs/customization`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.55 },
    { url: `${BASE_URL}/docs/api-reference`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.55 },
  ];

  const blogPages: MetadataRoute.Sitemap = getAllSlugs().map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...blogPages];
}

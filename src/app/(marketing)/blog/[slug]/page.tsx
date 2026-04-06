import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { getAllSlugs, getPostBySlug } from '@/lib/blog';
import { MDXRemote } from 'next-mdx-remote/rsc';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: 'Post Not Found' };

  return {
    title: `${post.title} — Ignitra Blog`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: `/blog/${slug}`,
      publishedTime: post.date,
      authors: [post.author],
      images: [
        {
          url: '/opengraph-image',
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: ['/opengraph-image'],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ignitra.dev';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { '@type': 'Person', name: post.author },
    url: `${baseUrl}/blog/${slug}`,
  };

  return (
    <article className="mx-auto max-w-[720px] px-6 pb-20 pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Back links */}
      <div className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] font-medium">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 transition-colors hover:opacity-90"
          style={{ color: '#64748B' }}
        >
          <ArrowLeft className="h-3.5 w-3.5 shrink-0" aria-hidden />
          Back to blog
        </Link>
        <span className="select-none text-white/10" aria-hidden>
          |
        </span>
        <Link href="/" className="transition-colors hover:opacity-90" style={{ color: '#64748B' }} aria-label="Ignitra home">
          Home
        </Link>
      </div>

      {/* Header */}
      <h1
        className="mb-4 font-black"
        style={{ fontSize: 'clamp(28px, 5vw, 42px)', letterSpacing: '-0.03em', color: '#F1F5F9', lineHeight: 1.15 }}
      >
        {post.title}
      </h1>

      <div className="mb-10 flex items-center gap-4 text-[13px]" style={{ color: '#64748B' }}>
        <span className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          {new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </span>
        <span className="flex items-center gap-1.5">
          <User className="h-3.5 w-3.5" />
          {post.author}
        </span>
      </div>

      {/* MDX content */}
      <div className="blog-prose">
        <MDXRemote source={post.content} />
      </div>

      <style>{`
        .blog-prose { color: #CBD5E1; line-height: 1.8; font-size: 16px; }
        .blog-prose h1 { font-size: 32px; font-weight: 900; color: #F1F5F9; margin: 2em 0 0.5em; letter-spacing: -0.02em; }
        .blog-prose h2 { font-size: 24px; font-weight: 800; color: #F1F5F9; margin: 1.8em 0 0.5em; letter-spacing: -0.02em; }
        .blog-prose h3 { font-size: 20px; font-weight: 700; color: #F1F5F9; margin: 1.5em 0 0.4em; }
        .blog-prose p { margin: 1em 0; }
        .blog-prose a { color: #3498DB; text-decoration: underline; }
        .blog-prose a:hover { color: #60A5FA; }
        .blog-prose strong { color: #F1F5F9; font-weight: 600; }
        .blog-prose ul, .blog-prose ol { margin: 1em 0; padding-left: 1.5em; }
        .blog-prose li { margin: 0.4em 0; }
        .blog-prose code {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 4px;
          padding: 2px 6px;
          font-size: 14px;
          font-family: 'JetBrains Mono', monospace;
          color: #06B6D4;
        }
        .blog-prose pre {
          background: #1e1e2e;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          padding: 16px 20px;
          overflow-x: auto;
          margin: 1.5em 0;
          font-size: 13px;
          line-height: 1.7;
        }
        .blog-prose pre code {
          background: none;
          border: none;
          padding: 0;
          color: #cdd6f4;
          font-size: 13px;
        }
        .blog-prose table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5em 0;
          font-size: 14px;
        }
        .blog-prose th {
          text-align: left;
          padding: 10px 12px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          color: #94A3B8;
          font-weight: 600;
          font-size: 13px;
        }
        .blog-prose td {
          padding: 10px 12px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .blog-prose hr { border-color: rgba(255,255,255,0.08); margin: 2em 0; }
        .blog-prose blockquote {
          border-left: 3px solid rgba(124,58,237,0.4);
          padding-left: 16px;
          margin: 1.5em 0;
          color: #94A3B8;
          font-style: italic;
        }
      `}</style>
    </article>
  );
}

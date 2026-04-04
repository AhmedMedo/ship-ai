import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';
import { Calendar, User } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog — Ignitra',
  description: 'Tutorials, updates, and insights on building AI SaaS products with Ignitra.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Blog — Ignitra',
    description: 'Tutorials, updates, and insights on building AI SaaS products with Ignitra.',
    url: '/blog',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Ignitra Blog' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog — Ignitra',
    description: 'Tutorials, updates, and insights on building AI SaaS products with Ignitra.',
    images: ['/opengraph-image'],
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-[880px] px-6 pb-20 pt-32">
      <h1
        className="mb-3 text-center font-black"
        style={{ fontSize: 'clamp(32px, 5vw, 48px)', letterSpacing: '-0.03em', color: '#F1F5F9' }}
      >
        Blog
      </h1>
      <p className="mx-auto mb-12 max-w-[500px] text-center text-[16px] leading-[1.7]" style={{ color: '#94A3B8' }}>
        Tutorials, updates, and insights on building AI SaaS products.
      </p>

      {posts.length === 0 ? (
        <p className="text-center text-sm" style={{ color: '#64748B' }}>
          No posts yet. Check back soon!
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 lg:gap-5">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="blog-card group block rounded-2xl p-6 transition-all duration-300"
            >
              <h2 className="mb-2 text-[20px] font-bold" style={{ color: '#F1F5F9' }}>
                {post.title}
              </h2>
              <p className="mb-4 text-[14px] leading-[1.6]" style={{ color: '#94A3B8' }}>
                {post.excerpt}
              </p>
              <div className="flex items-center gap-4 text-[12px]" style={{ color: '#64748B' }}>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3 w-3" />
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                <span className="flex items-center gap-1.5">
                  <User className="h-3 w-3" />
                  {post.author}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <style>{`
        .blog-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
        }
        .blog-card:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.12);
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}

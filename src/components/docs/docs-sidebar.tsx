'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { docsNavSections } from '@/components/docs/docs-nav';

export function DocsSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="p-4 pb-8 pt-6" aria-label="Documentation">
      {docsNavSections.map((section) => (
        <div key={section.title} className="mb-8 last:mb-0">
          <p
            className="mb-3 px-3 text-xs font-semibold uppercase tracking-wide"
            style={{ color: '#6B7280' }}
          >
            {section.title}
          </p>
          <ul className="space-y-0.5">
            {section.links.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={onNavigate}
                    className={cn(
                      'block rounded-md px-3 py-2 text-[14px] transition-colors',
                      active
                        ? 'border-l-2 border-[#3498DB] bg-white/[0.04] font-medium text-white'
                        : 'border-l-2 border-transparent text-gray-400 hover:text-white',
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

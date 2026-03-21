'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Plus, Search, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Conversation {
  id: string;
  title: string;
  messageCount: number;
  updatedAt: string;
}

export function ConversationList() {
  const pathname = usePathname();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  async function fetchConversations() {
    try {
      const res = await fetch('/api/conversations');
      const data = await res.json();
      setConversations(data.conversations || []);
    } catch {
      // Silently fail — empty list shown
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this conversation?')) return;

    await fetch(`/api/conversations/${id}`, { method: 'DELETE' });
    setConversations((prev) => prev.filter((c) => c.id !== id));

    // Navigate away if we deleted the active conversation
    if (pathname.includes(id)) {
      router.push('/dashboard/chat');
    }
  }

  function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins} min ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  }

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div
      className="flex h-full w-[280px] flex-shrink-0 flex-col border-r"
      style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
    >
      {/* Header */}
      <div className="p-4">
        <Link
          href="/dashboard/chat"
          className="flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
          style={{ background: '#0F4C75' }}
        >
          <Plus className="h-4 w-4" />
          New chat
        </Link>
        <div className="relative mt-2.5">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: '#94A3B8' }} />
          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border py-2 pl-9 pr-3 text-[13px] outline-none transition-colors focus:border-[#0F4C75]"
            style={{ background: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
          />
        </div>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto px-2 py-1">
        {loading ? (
          <div className="space-y-2 p-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 animate-pulse rounded-lg" style={{ background: 'var(--muted)' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm" style={{ color: '#94A3B8' }}>
            {search ? 'No conversations found' : 'No conversations yet'}
          </div>
        ) : (
          filtered.map((conv) => {
            const isActive = pathname === `/dashboard/chat/${conv.id}`;
            return (
              <div
                key={conv.id}
                className={cn(
                  'group my-0.5 flex items-start justify-between rounded-lg px-3 py-3 transition-colors',
                  isActive ? '' : 'hover:bg-[var(--muted)]',
                )}
                style={isActive ? { background: '#E8F4FD' } : {}}
              >
                <Link href={`/dashboard/chat/${conv.id}`} className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-semibold">{conv.title}</div>
                  <div className="mt-0.5 flex gap-2 text-[11px]" style={{ color: '#94A3B8' }}>
                    <span>{conv.messageCount} msgs</span>
                    <span>{timeAgo(conv.updatedAt)}</span>
                  </div>
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete(conv.id);
                  }}
                  className="ml-2 mt-1 hidden flex-shrink-0 rounded p-1 transition-colors hover:bg-red-100 group-hover:block"
                  style={{ color: '#EF4444' }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

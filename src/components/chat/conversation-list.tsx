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
    <div className="flex h-full w-[280px] flex-shrink-0 flex-col border-r bg-card">
      <div className="p-4">
        <Link
          href="/dashboard/chat"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          New chat
        </Link>
        <div className="relative mt-2.5">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border bg-muted py-2 pl-9 pr-3 text-[13px] outline-none transition-colors focus:border-primary"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-1">
        {loading ? (
          <div className="space-y-2 p-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            {search ? 'No conversations found' : 'No conversations yet'}
          </div>
        ) : (
          filtered.map((conv) => {
            const active = pathname === `/dashboard/chat/${conv.id}`;
            return (
              <div
                key={conv.id}
                className={cn(
                  'group my-0.5 flex items-start justify-between rounded-lg px-3 py-3 transition-colors',
                  active ? 'bg-primary/10' : 'hover:bg-muted',
                )}
              >
                <Link href={`/dashboard/chat/${conv.id}`} className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-semibold">{conv.title}</div>
                  <div className="mt-0.5 flex gap-2 text-[11px] text-muted-foreground">
                    <span>{conv.messageCount} msgs</span>
                    <span>{timeAgo(conv.updatedAt)}</span>
                  </div>
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete(conv.id);
                  }}
                  className="ml-2 mt-1 hidden flex-shrink-0 rounded p-1 text-destructive transition-colors hover:bg-red-100 group-hover:block"
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

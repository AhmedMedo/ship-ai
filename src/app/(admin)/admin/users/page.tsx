'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search } from 'lucide-react';

interface UserRow {
  id: string;
  fullName: string | null;
  email: string | null;
  role: string;
  plan: string;
  planSlug: string;
  tokensToday: number;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const pageSize = 15;

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((data) => setUsers(data.users ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        u.fullName?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.plan.toLowerCase().includes(q),
    );
  }, [users, search]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);

  if (loading) {
    return (
      <>
        <h1 className="mb-6 text-xl font-bold">User Management</h1>
        <div className="h-80 animate-pulse rounded-xl border bg-card" />
      </>
    );
  }

  return (
    <>
      <h1 className="mb-4 text-xl font-bold">User Management</h1>

      {/* Search */}
      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          placeholder="Search by name, email, or plan..."
          className="w-full rounded-lg border bg-card py-2.5 pl-9 pr-4 text-sm outline-none focus:border-primary"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border bg-card">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="border-b px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Name
              </th>
              <th className="border-b px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Email
              </th>
              <th className="border-b px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Plan
              </th>
              <th className="border-b px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Tokens Today
              </th>
              <th className="border-b px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Joined
              </th>
            </tr>
          </thead>
          <tbody>
            {paged.length > 0 ? (
              paged.map((user, i) => (
                <tr key={user.id}>
                  <td className={`px-4 py-3 text-[13px] font-semibold ${i < paged.length - 1 ? 'border-b' : ''}`}>
                    <div className="flex items-center gap-2">
                      {user.fullName ?? '—'}
                      {user.role === 'admin' && (
                        <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                          Admin
                        </span>
                      )}
                    </div>
                  </td>
                  <td className={`px-4 py-3 text-[13px] text-muted-foreground ${i < paged.length - 1 ? 'border-b' : ''}`}>
                    {user.email ?? '—'}
                  </td>
                  <td className={`px-4 py-3 text-[13px] ${i < paged.length - 1 ? 'border-b' : ''}`}>
                    <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                      {user.plan}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-[13px] ${i < paged.length - 1 ? 'border-b' : ''}`}>
                    {user.tokensToday.toLocaleString()}
                  </td>
                  <td className={`px-4 py-3 text-[13px] text-muted-foreground ${i < paged.length - 1 ? 'border-b' : ''}`}>
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  {search ? 'No users match your search.' : 'No users yet.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {filtered.length} user{filtered.length !== 1 ? 's' : ''} total
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="rounded-lg border bg-card px-3 py-1.5 text-xs font-medium disabled:opacity-40"
            >
              Previous
            </button>
            <span className="flex items-center px-2 text-xs text-muted-foreground">
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="rounded-lg border bg-card px-3 py-1.5 text-xs font-medium disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
}

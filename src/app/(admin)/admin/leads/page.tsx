'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, Mail, Github } from 'lucide-react';

interface LeadRow {
  id: string;
  name: string;
  email: string;
  githubUsername: string | null;
  plan: string;
  message: string | null;
  createdAt: string;
}

const planColors: Record<string, string> = {
  starter: 'bg-gray-500/10 text-gray-400',
  pro: 'bg-primary/10 text-primary',
  enterprise: 'bg-purple-500/10 text-purple-400',
};

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const pageSize = 15;

  useEffect(() => {
    fetch('/api/admin/leads')
      .then((r) => r.json())
      .then((data) => setLeads(data.leads ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return leads;
    const q = search.toLowerCase();
    return leads.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.plan.toLowerCase().includes(q) ||
        l.githubUsername?.toLowerCase().includes(q),
    );
  }, [leads, search]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);

  if (loading) {
    return (
      <>
        <h1 className="mb-6 text-xl font-bold">Leads</h1>
        <div className="h-80 animate-pulse rounded-xl border bg-card" />
      </>
    );
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Leads</h1>
        <span className="rounded-lg bg-primary/10 px-3 py-1 text-sm font-bold text-primary">
          {leads.length} total
        </span>
      </div>

      {/* Search */}
      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          placeholder="Search by name, email, plan, or GitHub..."
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
                GitHub
              </th>
              <th className="border-b px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Plan
              </th>
              <th className="border-b px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Message
              </th>
              <th className="border-b px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {paged.length > 0 ? (
              paged.map((lead, i) => (
                <tr key={lead.id} className="hover:bg-muted/50">
                  <td className={`px-4 py-3 text-[13px] font-semibold ${i < paged.length - 1 ? 'border-b' : ''}`}>
                    {lead.name}
                  </td>
                  <td className={`px-4 py-3 text-[13px] ${i < paged.length - 1 ? 'border-b' : ''}`}>
                    <a
                      href={`mailto:${lead.email}`}
                      className="flex items-center gap-1.5 text-primary hover:underline"
                    >
                      <Mail className="h-3 w-3" />
                      {lead.email}
                    </a>
                  </td>
                  <td className={`px-4 py-3 text-[13px] text-muted-foreground ${i < paged.length - 1 ? 'border-b' : ''}`}>
                    {lead.githubUsername ? (
                      <a
                        href={`https://github.com/${lead.githubUsername}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 hover:text-foreground"
                      >
                        <Github className="h-3 w-3" />
                        {lead.githubUsername}
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className={`px-4 py-3 text-[13px] ${i < paged.length - 1 ? 'border-b' : ''}`}>
                    <span className={`rounded-md px-2 py-0.5 text-xs font-bold capitalize ${planColors[lead.plan] ?? 'bg-muted text-muted-foreground'}`}>
                      {lead.plan}
                    </span>
                  </td>
                  <td className={`max-w-[200px] truncate px-4 py-3 text-[13px] text-muted-foreground ${i < paged.length - 1 ? 'border-b' : ''}`} title={lead.message ?? ''}>
                    {lead.message || '—'}
                  </td>
                  <td className={`px-4 py-3 text-[13px] text-muted-foreground ${i < paged.length - 1 ? 'border-b' : ''}`}>
                    {new Date(lead.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  {search ? 'No leads match your search.' : 'No leads yet.'}
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
            {filtered.length} lead{filtered.length !== 1 ? 's' : ''} total
          </span>
          <div className="flex gap-2">
            <button
              type="button"
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
              type="button"
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

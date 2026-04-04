'use client';

import { Fragment, useState, useEffect, useCallback } from 'react';
import { Mail, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ContactRow {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

const statusStyles: Record<string, string> = {
  new: 'bg-amber-500/15 text-amber-400',
  read: 'bg-sky-500/15 text-sky-400',
  replied: 'bg-emerald-500/15 text-emerald-400',
};

function truncate(s: string, n: number) {
  if (s.length <= n) return s;
  return `${s.slice(0, n)}…`;
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<ContactRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = useCallback(() => {
    fetch('/api/admin/contacts')
      .then((r) => r.json())
      .then((data) => setContacts(data.contacts ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function setStatus(id: string, status: 'new' | 'read' | 'replied') {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/contacts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.contact) {
        setContacts((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: data.contact.status } : c)),
        );
      }
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading) {
    return (
      <>
        <h1 className="mb-6 text-xl font-bold">Contact messages</h1>
        <div className="h-80 animate-pulse rounded-xl border bg-card" />
      </>
    );
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Contact messages</h1>
        <span className="rounded-lg bg-primary/10 px-3 py-1 text-sm font-bold text-primary">
          {contacts.length} shown
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b bg-muted/80">
                <th className="w-8 px-2 py-3" aria-label="Expand" />
                <th className="px-3 py-3 font-semibold text-muted-foreground">Date</th>
                <th className="px-3 py-3 font-semibold text-muted-foreground">Name</th>
                <th className="px-3 py-3 font-semibold text-muted-foreground">Email</th>
                <th className="px-3 py-3 font-semibold text-muted-foreground">Subject</th>
                <th className="px-3 py-3 font-semibold text-muted-foreground">Status</th>
                <th className="px-3 py-3 font-semibold text-muted-foreground">Message</th>
                <th className="px-3 py-3 font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                    No contact submissions yet.
                  </td>
                </tr>
              ) : (
                contacts.map((c) => (
                  <Fragment key={c.id}>
                    <tr
                      className="cursor-pointer border-b border-border/60 hover:bg-muted/40"
                      onClick={() => setExpandedId((id) => (id === c.id ? null : c.id))}
                    >
                      <td className="px-2 py-3 align-middle text-muted-foreground">
                        {expandedId === c.id ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">
                        {new Date(c.createdAt).toLocaleString()}
                      </td>
                      <td className="px-3 py-3 font-medium">{c.name}</td>
                      <td className="px-3 py-3">
                        <a
                          href={`mailto:${c.email}`}
                          className="inline-flex items-center gap-1 text-primary hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Mail className="h-3 w-3" />
                          {c.email}
                        </a>
                      </td>
                      <td className="max-w-[140px] truncate px-3 py-3" title={c.subject}>
                        {c.subject}
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={`rounded-md px-2 py-0.5 text-xs font-medium ${statusStyles[c.status] ?? 'bg-muted text-muted-foreground'}`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="max-w-[180px] truncate px-3 py-3 text-muted-foreground" title={c.message}>
                        {truncate(c.message, 80)}
                      </td>
                      <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex flex-wrap gap-1">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs"
                            disabled={updatingId === c.id || c.status === 'read'}
                            onClick={() => setStatus(c.id, 'read')}
                          >
                            Read
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs"
                            disabled={updatingId === c.id || c.status === 'replied'}
                            onClick={() => setStatus(c.id, 'replied')}
                          >
                            Replied
                          </Button>
                        </div>
                      </td>
                    </tr>
                    {expandedId === c.id ? (
                      <tr className="border-b border-border/60 bg-muted/20">
                        <td colSpan={8} className="px-6 py-4">
                          <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">
                            Full message
                          </p>
                          <p className="whitespace-pre-wrap text-sm leading-relaxed">{c.message}</p>
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

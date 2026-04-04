'use client';

import { useState } from 'react';

export function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(typeof data.error === 'string' ? data.error : 'Failed to send');
      }

      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err: unknown) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  return (
    <section id="contact" className="relative z-[1] px-6 py-24">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid items-start gap-12 md:grid-cols-2">
          <div>
            <p
              className="mb-3 bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] bg-clip-text text-xs font-bold uppercase tracking-[2px] text-transparent"
            >
              Contact
            </p>
            <h2 className="mb-4 text-3xl font-black tracking-[-0.03em] text-white md:text-4xl">
              Got a question?
              <br />
              Let&apos;s talk.
            </h2>
            <p className="mb-8 max-w-md leading-relaxed text-gray-400">
              Whether you have a question about features, pricing, or anything else — we&apos;re here to
              help. Drop us a message and we&apos;ll get back within 24 hours.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0F4C75]/20 text-[#3498DB]">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Email us</p>
                  <p className="text-sm text-gray-400">info@ignitra.dev</p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#7C3AED]/20 text-[#a78bfa]">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Follow us</p>
                  <p className="text-sm text-gray-400">@AhmedAlaa707 on Twitter/X</p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#06B6D4]/20 text-[#22d3ee]">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Response time</p>
                  <p className="text-sm text-gray-400">Usually within 24 hours</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 backdrop-blur-sm">
            {status === 'success' ? (
              <div className="py-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                  <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">Message sent!</h3>
                <p className="mb-6 text-gray-400">
                  Thanks for reaching out. We&apos;ll get back to you within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="text-sm text-[#3498DB] hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-300">Name</label>
                    <input
                      type="text"
                      required
                      minLength={2}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name"
                      className="w-full rounded-lg border border-white/[0.08] bg-white/[0.05] px-4 py-2.5 text-sm text-white placeholder:text-gray-500 transition-all focus:border-[#3498DB]/50 focus:outline-none focus:ring-1 focus:ring-[#3498DB]/20"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-300">Email</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full rounded-lg border border-white/[0.08] bg-white/[0.05] px-4 py-2.5 text-sm text-white placeholder:text-gray-500 transition-all focus:border-[#3498DB]/50 focus:outline-none focus:ring-1 focus:ring-[#3498DB]/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-300">Subject</label>
                  <select
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full cursor-pointer appearance-none rounded-lg border border-white/[0.08] bg-white/[0.05] px-4 py-2.5 text-sm text-white transition-all focus:border-[#3498DB]/50 focus:outline-none focus:ring-1 focus:ring-[#3498DB]/20"
                  >
                    <option value="" disabled className="bg-[#0a0a1a]">
                      Select a topic
                    </option>
                    <option value="Pre-purchase question" className="bg-[#0a0a1a]">
                      Pre-purchase question
                    </option>
                    <option value="Technical support" className="bg-[#0a0a1a]">
                      Technical support
                    </option>
                    <option value="Feature request" className="bg-[#0a0a1a]">
                      Feature request
                    </option>
                    <option value="Bug report" className="bg-[#0a0a1a]">
                      Bug report
                    </option>
                    <option value="Partnership / Collaboration" className="bg-[#0a0a1a]">
                      Partnership / Collaboration
                    </option>
                    <option value="Other" className="bg-[#0a0a1a]">
                      Other
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-300">Message</label>
                  <textarea
                    required
                    minLength={10}
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us what's on your mind..."
                    className="w-full resize-none rounded-lg border border-white/[0.08] bg-white/[0.05] px-4 py-2.5 text-sm text-white placeholder:text-gray-500 transition-all focus:border-[#3498DB]/50 focus:outline-none focus:ring-1 focus:ring-[#3498DB]/20"
                  />
                </div>

                {status === 'error' ? <p className="text-sm text-red-400">{errorMsg}</p> : null}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full rounded-xl bg-gradient-to-r from-[#0F4C75] to-[#3498DB] px-6 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(15,76,117,0.4)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                >
                  {status === 'loading' ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    'Send message'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

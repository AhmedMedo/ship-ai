// TODO: Replace this modal with Lemon Squeezy checkout redirect after store approval
// Change: openModal('pro') → window.open('https://ignitra.lemonsqueezy.com/buy/xxx', '_blank')

'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPlan?: 'starter' | 'pro' | 'enterprise';
}

const plans = {
  starter: { name: 'Starter', price: '$149' },
  pro: { name: 'Pro', price: '$249' },
  enterprise: { name: 'Enterprise', price: '$499' },
};

export function PurchaseModal({ isOpen, onClose, defaultPlan = 'pro' }: PurchaseModalProps) {
  const [plan, setPlan] = useState(defaultPlan);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [github, setGithub] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Reset form when modal opens with a new plan
  useEffect(() => {
    if (isOpen) {
      setPlan(defaultPlan);
      setStatus('idle');
    }
  }, [isOpen, defaultPlan]);

  // Close on ESC
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, githubUsername: github, plan, message }),
      });
      if (!res.ok) throw new Error('Failed');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#0A0A1B]/95 backdrop-blur-xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 transition-colors hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {status === 'success' ? (
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-green-500/20 bg-green-500/10">
              <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-white">You&apos;re on the list!</h3>
            <p className="text-sm leading-relaxed text-gray-400">
              We&apos;ll reach out to you at <span className="text-white">{email}</span> within 24 hours with payment details and access instructions.
            </p>
            <button
              onClick={onClose}
              className="mt-6 rounded-lg border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h2 className="mb-1 text-2xl font-bold text-white">Get Ignitra</h2>
            <p className="mb-6 text-sm text-gray-400">Fill in your details and we&apos;ll send you access within 24 hours.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Plan selector */}
              <div className="grid grid-cols-3 gap-2">
                {(Object.entries(plans) as [string, { name: string; price: string }][]).map(([key, p]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setPlan(key as 'starter' | 'pro' | 'enterprise')}
                    className={`rounded-lg px-3 py-2.5 text-center text-sm transition-all ${
                      plan === key
                        ? 'border border-[#3498DB] bg-[#0F4C75] font-semibold text-white shadow-[0_0_20px_rgba(15,76,117,0.3)]'
                        : 'border border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    <div className="font-semibold">{p.name}</div>
                    <div className={`text-xs ${plan === key ? 'text-blue-200' : 'text-gray-500'}`}>{p.price}</div>
                  </button>
                ))}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-300">Full name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ahmed Alaa"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 transition-colors focus:border-[#3498DB] focus:outline-none focus:ring-1 focus:ring-[#3498DB]/50"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-300">Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 transition-colors focus:border-[#3498DB] focus:outline-none focus:ring-1 focus:ring-[#3498DB]/50"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-300">GitHub username</label>
                <input
                  type="text"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="yourusername"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 transition-colors focus:border-[#3498DB] focus:outline-none focus:ring-1 focus:ring-[#3498DB]/50"
                />
                <p className="mt-1 text-xs text-gray-500">We&apos;ll invite you to the private repo after payment</p>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-300">What will you build? (optional)</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="AI writing tool, customer support bot, code assistant..."
                  rows={2}
                  className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 transition-colors focus:border-[#3498DB] focus:outline-none focus:ring-1 focus:ring-[#3498DB]/50"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full rounded-xl bg-gradient-to-r from-[#0F4C75] to-[#3498DB] py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_0_40px_rgba(15,76,117,0.4)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {status === 'loading' ? 'Submitting...' : `Reserve Ignitra ${plans[plan].name} — ${plans[plan].price}`}
              </button>

              {status === 'error' && (
                <p className="text-center text-sm text-red-400">Something went wrong. Please try again or email info@ignitra.dev</p>
              )}

              <p className="text-center text-xs text-gray-500">
                We&apos;ll email you within 24 hours with payment instructions.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

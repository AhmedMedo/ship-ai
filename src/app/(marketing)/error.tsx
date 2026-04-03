'use client';

export default function MarketingError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4" style={{ background: '#030014', color: '#F1F5F9' }}>
      <h2 className="text-lg font-bold">Something went wrong</h2>
      <p className="text-sm" style={{ color: '#94A3B8' }}>{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="rounded-lg px-4 py-2 text-sm font-semibold text-white"
        style={{ background: '#0F4C75' }}
      >
        Try again
      </button>
    </div>
  );
}

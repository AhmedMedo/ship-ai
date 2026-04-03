import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <h1 className="text-6xl font-extrabold tracking-tight">404</h1>
      <p className="mt-2 text-lg text-muted-foreground">This page doesn&apos;t exist.</p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground"
      >
        Go home
      </Link>
    </div>
  );
}

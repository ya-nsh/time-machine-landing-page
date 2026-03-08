import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <div className="text-center">
        <h1 className="mb-2 font-mono text-6xl font-bold text-primary">404</h1>
        <p className="mb-6 font-mono text-lg text-muted-foreground">Page not found</p>
        <Link
          href="/"
          className="inline-flex items-center rounded-lg bg-primary px-6 py-2.5 font-mono text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}

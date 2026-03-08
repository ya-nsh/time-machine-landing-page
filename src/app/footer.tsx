import Link from 'next/link';
import { DASHBOARD_URL } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="border-t border-border/30 bg-card/50">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          {/* Branding */}
          <div className="flex items-center gap-2 font-mono text-sm">
            <span className="text-primary">$</span>
            <span className="text-muted-foreground">timemachine</span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6">
            <Link
              href="/docs"
              className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Docs
            </Link>
            <a
              href={DASHBOARD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Dashboard
            </a>
            <a
              href="https://github.com/timemachine-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              GitHub
            </a>
          </nav>
        </div>

        {/* Bottom row */}
        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-border/20 pt-6 sm:flex-row">
          <p className="font-mono text-xs text-muted-foreground/60">&copy; 2025 Time Machine</p>
          <p className="font-mono text-xs text-muted-foreground/40">
            Built for developers who debug AI agents
          </p>
        </div>
      </div>
    </footer>
  );
}

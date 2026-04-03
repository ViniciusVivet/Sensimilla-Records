import Link from "next/link";
import type { ReactNode } from "react";

export function SiteShell({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <div className="relative min-h-full bg-bg text-fg">
      <header className="border-b border-white/10 px-6 py-4 md:px-10">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <Link
            href="/"
            className="text-sm font-medium text-muted transition hover:text-accent"
          >
            ← Início
          </Link>
          <span className="font-display text-lg tracking-wide text-accent">
            Sensimilla
          </span>
        </div>
      </header>
      <main id="main-content" className="mx-auto max-w-3xl px-6 py-12 md:px-10 md:py-16">
        <h1 className="font-display text-4xl md:text-5xl">{title}</h1>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-fg/85 md:text-base">
          {children}
        </div>
      </main>
    </div>
  );
}

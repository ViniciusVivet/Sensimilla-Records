import Link from "next/link";
import Image from "next/image";
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
          <div className="relative h-8 w-8 overflow-hidden rounded-full">
            <Image src="/logo-sensi.jpg" alt="Sensimilla Records" fill className="object-cover" sizes="32px" />
          </div>
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

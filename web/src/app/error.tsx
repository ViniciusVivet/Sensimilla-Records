"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      id="main-content"
      className="flex min-h-[60vh] flex-col items-center justify-center gap-6 bg-bg px-6 text-center text-fg"
    >
      <h1 className="font-display text-4xl">Algo saiu do ritmo</h1>
      <p className="max-w-md text-sm text-muted">
        Não foi possível carregar esta parte do site. Tente de novo ou volte ao
        início.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <button
          type="button"
          onClick={reset}
          className="rounded-full border border-accent bg-accent px-6 py-3 text-sm font-semibold text-bg transition hover:opacity-90"
        >
          Tentar novamente
        </button>
        <Link
          href="/"
          className="rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-fg transition hover:border-accent hover:text-accent"
        >
          Ir ao início
        </Link>
      </div>
    </div>
  );
}

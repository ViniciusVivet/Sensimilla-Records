"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "sensi_cookie_consent";

export function LgpdBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let show = false;
    try {
      show = !localStorage.getItem(STORAGE_KEY);
    } catch {
      // localStorage blocked (private mode) — keep hidden
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(show);
  }, []);

  function accept() {
    try {
      localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {
      // ignore
    }
    setVisible(false);
  }

  function decline() {
    try {
      localStorage.setItem(STORAGE_KEY, "declined");
    } catch {
      // ignore
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Aviso de cookies"
      className="fixed bottom-0 left-0 right-0 z-[150] border-t border-white/10 bg-panel/95 px-6 py-5 backdrop-blur-md md:bottom-6 md:left-6 md:right-auto md:max-w-sm md:rounded-2xl md:border"
    >
      <p className="text-sm leading-relaxed text-fg/80">
        Usamos cookies para melhorar sua experiência. Confira nossa{" "}
        <a
          href="/privacidade"
          className="underline underline-offset-2 hover:text-accent"
        >
          Política de Privacidade
        </a>
        .
      </p>
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={accept}
          className="rounded-full bg-accent px-5 py-2 text-xs font-semibold uppercase tracking-wider text-bg transition hover:opacity-90"
        >
          Aceitar
        </button>
        <button
          type="button"
          onClick={decline}
          className="rounded-full border border-white/20 px-5 py-2 text-xs uppercase tracking-wider text-muted transition hover:border-white/40 hover:text-fg"
        >
          Recusar
        </button>
      </div>
    </div>
  );
}

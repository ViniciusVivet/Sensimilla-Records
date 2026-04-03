"use client";

import { socialLinks, footerLinks } from "@/data/site";

function SocialIcon({ name }: { name: string }) {
  const common = "h-5 w-5";
  if (name === "Instagram")
    return (
      <svg className={common} fill="none" viewBox="0 0 24 24" aria-hidden>
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  if (name === "Spotify")
    return (
      <svg className={common} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02z" />
      </svg>
    );
  if (name === "YouTube")
    return (
      <svg className={common} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    );
  return (
    <svg className={common} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M1.175 12.225c-.096 1.514.056 3.14.56 4.758.56 1.68 1.44 3.12 2.64 4.32 1.2 1.2 2.64 2.04 4.32 2.64 1.68.56 3.36.84 5.04.84s3.36-.28 5.04-.84c1.68-.6 3.12-1.44 4.32-2.64 1.2-1.2 2.04-2.64 2.64-4.32.56-1.68.84-3.36.84-5.04s-.28-3.36-.84-5.04c-.6-1.68-1.44-3.12-2.64-4.32C20.64 3.84 19.2 3 17.52 2.4 15.84 1.84 14.16 1.56 12.48 1.56c-1.68 0-3.36.28-5.04.84C5.76 3 4.32 3.84 3.12 5.04 1.92 6.24 1.08 7.68.48 9.36c-.56 1.68-.84 3.36-.84 5.04v.825z" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-black px-6 py-16 md:px-12 md:py-20">
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <p className="font-display text-4xl tracking-wide text-accent md:text-5xl">
          SENSIMILLA
        </p>
        <p className="mt-1 text-xs uppercase tracking-[0.4em] text-muted">
          Records
        </p>

        <nav
          className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-fg/70"
          aria-label="Rodapé"
        >
          {footerLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="transition hover:text-accent"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="mt-10 flex gap-6 text-muted">
          {socialLinks.map((s) => (
            <a
              key={s.name}
              href={s.href}
              aria-label={s.name}
              className="transition hover:text-accent"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SocialIcon name={s.name} />
            </a>
          ))}
        </div>

        <p className="mt-12 text-xs text-muted/60">
          © {new Date().getFullYear()} Sensimilla Records. Todos os direitos
          reservados.
        </p>
      </div>
    </footer>
  );
}

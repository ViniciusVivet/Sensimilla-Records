"use client";

import { useRef, useLayoutEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { catalogReleases } from "@/data/site";
import { useReducedMotion } from "@/components/reduced-motion-provider";
import { useMiniPlayer } from "@/components/mini-player-context";
import { buildWhatsAppUrl } from "@/lib/constants";
import type { CmsRelease } from "@/lib/cms-types";

gsap.registerPlugin(ScrollTrigger);

export function OutNowSection({
  releases = catalogReleases,
  whatsappNumber,
}: {
  releases?: CmsRelease[];
  whatsappNumber?: string;
}) {
  const root = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { currentIndex, open, close } = useMiniPlayer();
  const items = releases.length ? releases : catalogReleases;

  useLayoutEffect(() => {
    const section = root.current;
    if (!section) return;

    const rows = section.querySelectorAll<HTMLElement>("[data-release-row]");

    if (reducedMotion) {
      gsap.set(rows, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from(rows, {
        opacity: 0,
        y: 36,
        duration: 0.85,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 78%",
          toggleActions: "play none none reverse",
        },
      });
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={root}
      id="catalogo"
      className="relative bg-bg px-6 py-24 md:px-12 md:py-32"
    >
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h2 className="font-display text-5xl md:text-7xl">Ouça Agora</h2>
            <p className="mt-2 max-w-sm text-sm text-muted">
              Lançamentos recentes do catálogo — rap, trap e o som da Zona Leste.
            </p>
          </div>
        </div>

        <ul className="mt-14 space-y-4">
          {items.map((r, i) => {
            const isActive = currentIndex === i;
            return (
              <li key={r.title} data-release-row>
                <article
                  className={`group rounded-2xl border bg-panel/80 transition ${
                    isActive
                      ? "border-accent/40"
                      : "border-white/10 hover:border-accent/30"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => (isActive ? close() : open(i))}
                    className="flex min-h-[72px] w-full gap-4 p-4 text-left md:min-h-0 md:gap-8 md:p-5"
                  >
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl md:h-28 md:w-28">
                      <Image
                        src={r.cover}
                        alt={r.title}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                        sizes="112px"
                      />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col justify-center">
                      <h3 className="font-display text-2xl text-fg md:text-3xl">
                        {r.title}
                      </h3>
                      <p className="text-sm text-muted">{r.artist}</p>
                      <p className="mt-1 text-xs uppercase tracking-wider text-muted/80">
                        {r.meta}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border px-3 text-xs uppercase tracking-wider transition ${
                          isActive
                            ? "border-accent bg-accent/10 text-accent"
                            : "border-white/20 text-fg/80 group-hover:border-accent group-hover:text-accent"
                        }`}
                      >
                        {isActive ? "✕" : "▶"}
                      </span>
                    </div>
                  </button>

                  {/* Links de plataformas — sempre visíveis ao expandir */}
                  {isActive && (
                    <div className="px-4 pb-4 md:px-5 md:pb-5">
                      <p className="mb-3 text-xs text-muted">
                        ▶ Tocando no mini player — arraste-o para qualquer canto da tela
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <a
                          href={`https://open.spotify.com/${r.spotifyEmbed}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-wider text-muted transition hover:border-accent hover:text-accent"
                        >
                          Abrir no Spotify
                        </a>
                        <a
                          href={`https://www.deezer.com/search/${encodeURIComponent(r.title + " " + r.artist)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-wider text-muted transition hover:border-white/40 hover:text-fg"
                        >
                          Deezer
                        </a>
                        <a
                          href={`https://music.apple.com/search?term=${encodeURIComponent(r.title + " " + r.artist)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-wider text-muted transition hover:border-white/40 hover:text-fg"
                        >
                          Apple Music
                        </a>
                        <a
                          href={`https://music.youtube.com/search?q=${encodeURIComponent(r.title + " " + r.artist)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-wider text-muted transition hover:border-white/40 hover:text-fg"
                        >
                          YouTube Music
                        </a>
                      </div>
                    </div>
                  )}
                </article>
              </li>
            );
          })}
        </ul>

        {/* CTA — Grave com a gente */}
        <div className="mt-16 overflow-hidden rounded-2xl border border-accent/15 bg-accent/[0.04] px-6 py-10 text-center md:mt-20 md:px-12 md:py-14">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent/70">
            Sensimilla Records · Estúdio
          </p>
          <h3 className="font-display mt-3 text-3xl text-white md:text-5xl">
            GRAVE COM A GENTE
          </h3>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-fg/50">
            A mesma estrutura que produz os lançamentos do selo — aberta pra
            você. Gravação, mix & master, clipes e distribuição digital.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/servicos"
              className="rounded-full bg-accent px-8 py-3 text-sm font-bold uppercase tracking-widest text-bg transition hover:bg-accent/90 hover:shadow-[0_0_20px_rgba(200,242,74,0.15)]"
            >
              Ver planos e preços
            </Link>
            <a
              href={buildWhatsAppUrl("Oi, vim pelo site da Sensimilla Records e quero saber sobre gravar com vocês", whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/15 px-8 py-3 text-sm text-fg/70 transition hover:border-accent/40 hover:text-accent"
            >
              Chamar no WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

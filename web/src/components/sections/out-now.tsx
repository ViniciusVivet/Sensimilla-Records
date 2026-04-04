"use client";

import { useRef, useLayoutEffect, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { catalogReleases } from "@/data/site";
import { useReducedMotion } from "@/components/reduced-motion-provider";

gsap.registerPlugin(ScrollTrigger);

export function OutNowSection() {
  const root = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

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
      id="out-now"
      className="relative bg-bg px-6 py-24 md:px-12 md:py-32"
    >
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h2 className="font-display text-5xl md:text-7xl">Out Now</h2>
            <p className="mt-2 max-w-sm text-sm text-muted">
              Lançamentos recentes do catálogo — rap, trap e o som da Zona Leste.
            </p>
          </div>
          <button
            type="button"
            className="hidden h-14 w-14 shrink-0 rounded-full border border-white/15 text-xs uppercase tracking-wider text-muted transition hover:border-accent hover:text-accent md:flex md:items-center md:justify-center"
            aria-label="Ver mais lançamentos"
          >
            →
          </button>
        </div>

        <ul className="mt-14 space-y-4">
          {catalogReleases.map((r, i) => {
            const isExpanded = expandedIndex === i;
            return (
              <li key={r.title} data-release-row>
                <article
                  className={`group rounded-2xl border bg-panel/80 transition ${
                    isExpanded
                      ? "border-accent/40"
                      : "border-white/10 hover:border-accent/30"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setExpandedIndex(isExpanded ? null : i)}
                    className="flex w-full gap-4 p-4 text-left md:gap-8 md:p-5"
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
                        className={`rounded-full border px-4 py-2 text-xs uppercase tracking-wider transition ${
                          isExpanded
                            ? "border-accent bg-accent/10 text-accent"
                            : "border-white/20 text-fg/80 group-hover:border-accent group-hover:text-accent"
                        }`}
                      >
                        {isExpanded ? "✕" : "▶"}
                      </span>
                    </div>
                  </button>

                  {isExpanded && r.spotifyEmbed && (
                    <div className="px-4 pb-4 md:px-5 md:pb-5">
                      <iframe
                        className="w-full rounded-xl"
                        src={`https://open.spotify.com/embed/${r.spotifyEmbed}?utm_source=generator&theme=0`}
                        width="100%"
                        height="152"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                        title={`Spotify — ${r.title}`}
                      />
                    </div>
                  )}
                </article>
              </li>
            );
          })}
        </ul>
      </div>

      <button
        type="button"
        className="fixed bottom-8 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-bg/90 text-lg text-fg shadow-lg backdrop-blur-md transition hover:border-accent hover:text-accent md:hidden"
        aria-label="Rolar"
      >
        ↓
      </button>
    </section>
  );
}

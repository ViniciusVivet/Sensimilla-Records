"use client";

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/components/reduced-motion-provider";
import { selo } from "@/data/dossie";
import type { CmsVideo } from "@/lib/cms-types";

gsap.registerPlugin(ScrollTrigger);

const videos = [
  {
    id: "C9Eyy_hnxvs",
    title: "COGU FT. 270Jet — Alta Voltagem",
  },
  {
    id: "iv7MXFYxWMI",
    title: "LOUCURA — COGU FT. DAZDIH",
  },
  {
    id: "8N117Oo5KmE",
    title: "Festa Da SEN$I",
  },
];

export function YoutubeHubSection({ videos: cmsVideos }: { videos?: CmsVideo[] }) {
  const root = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const items = cmsVideos?.length ? cmsVideos : videos;

  useLayoutEffect(() => {
    const section = root.current;
    if (!section || reducedMotion) return;

    const cards = section.querySelectorAll<HTMLElement>("[data-yt-card]");
    const ctx = gsap.context(() => {
      gsap.from(cards, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={root}
      id="youtube"
      className="bg-panel px-6 py-24 md:px-12 md:py-32"
    >
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted">
              Canal oficial
            </p>
            <h2 className="font-display mt-2 text-5xl md:text-7xl">YouTube</h2>
            <p className="mt-3 max-w-sm text-sm text-muted">
              Clipes e lançamentos do selo — direto do canal oficial.
            </p>
          </div>
          <a
            href={selo.youtube.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-3 rounded-full border border-red-500/40 bg-red-600/10 px-6 py-3 text-sm font-semibold text-red-400 transition hover:border-red-500 hover:bg-red-600/20"
          >
            <span className="text-base">▶</span>
            Ver canal no YouTube
          </a>
        </div>

        {/* Video embeds */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((v) => (
            <div key={v.id} data-yt-card className="flex flex-col gap-3">
              <div className="relative w-full overflow-hidden rounded-2xl" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  src={`https://www.youtube.com/embed/${v.id}`}
                  title={v.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full border-0"
                  loading="lazy"
                />
              </div>
              <p className="text-sm font-medium text-fg/80 leading-snug">{v.title}</p>
            </div>
          ))}
        </div>

        {/* Subscribe bar */}
        <div
          data-yt-card
          className="mt-10 flex items-center justify-between rounded-2xl border border-white/10 bg-bg/40 px-6 py-5"
        >
          <div>
            <p className="text-sm font-semibold text-fg">{selo.youtube.handle}</p>
            <p className="mt-1 text-xs text-muted">
              Inscreva-se para acompanhar todos os lançamentos
            </p>
          </div>
          <a
            href={selo.youtube.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-red-600 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-red-700"
          >
            Inscrever-se
          </a>
        </div>
      </div>
    </section>
  );
}

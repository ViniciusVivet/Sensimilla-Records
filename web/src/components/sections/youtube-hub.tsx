"use client";

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/components/reduced-motion-provider";
import { youtubeUrls, selo } from "@/data/dossie";

gsap.registerPlugin(ScrollTrigger);

const artistChannels = [
  { name: "Vivet", url: youtubeUrls.vivet },
  { name: "Cico", url: youtubeUrls.cico },
  { name: "Bright", url: youtubeUrls.brightTopic },
  { name: "C13Prod", url: youtubeUrls.c13prodTopic },
];

export function YoutubeHubSection() {
  const root = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const section = root.current;
    if (!section || reducedMotion) return;

    const cards = section.querySelectorAll<HTMLElement>("[data-yt-card]");
    const ctx = gsap.context(() => {
      gsap.from(cards, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.1,
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
              Clipes, bastidores e lançamentos do selo no canal oficial.
            </p>
          </div>
          <a
            data-yt-card
            href={selo.youtube.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-3 rounded-full border border-red-500/40 bg-red-600/10 px-6 py-3 text-sm font-semibold text-red-400 transition hover:border-red-500 hover:bg-red-600/20"
          >
            <span className="text-base">▶</span>
            Ver canal no YouTube
          </a>
        </div>

        {/* Artist channels grid */}
        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {artistChannels.map((ch) => (
            <a
              key={ch.name}
              data-yt-card
              href={ch.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-bg/60 p-6 transition hover:border-red-500/40 hover:bg-bg/80"
            >
              <span className="text-2xl text-red-500 transition group-hover:scale-110">
                ▶
              </span>
              <span className="text-sm font-semibold text-fg">{ch.name}</span>
              <span className="text-xs text-muted">Canal</span>
            </a>
          ))}
        </div>

        {/* Selo channel embed prompt */}
        <div
          data-yt-card
          className="mt-8 flex items-center justify-between rounded-2xl border border-white/10 bg-bg/40 px-6 py-5"
        >
          <div>
            <p className="text-sm font-semibold text-fg">
              {selo.youtube.handle}
            </p>
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

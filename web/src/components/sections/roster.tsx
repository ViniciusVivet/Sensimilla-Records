"use client";

import { useRef, useLayoutEffect, useMemo } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { roster } from "@/data/site";
import { useReducedMotion } from "@/components/reduced-motion-provider";

gsap.registerPlugin(ScrollTrigger);

export function RosterSection() {
  const root = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  const featuredIndex = useMemo(() => {
    const i = roster.members.findIndex((m) => m.id === roster.featuredMemberId);
    return i >= 0 ? i : 1;
  }, []);

  useLayoutEffect(() => {
    const section = root.current;
    if (!section) return;

    const cards = section.querySelectorAll<HTMLElement>("[data-roster-card]");

    if (reducedMotion) {
      gsap.set(cards, { opacity: 1, x: 0, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from(cards, {
        opacity: 0,
        y: 48,
        x: (_i, el) => {
          const i = Number(el.getAttribute("data-index") ?? 0);
          const fi = featuredIndex;
          if (i === fi) return 0;
          return i < fi ? -28 : 28;
        },
        duration: 0.95,
        stagger: 0.06,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });
    }, section);

    return () => ctx.revert();
  }, [featuredIndex, reducedMotion]);

  return (
    <section
      ref={root}
      id="equipe"
      className="bg-bg px-6 py-24 text-fg md:px-12 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <p className="text-xs uppercase tracking-[0.3em] text-muted">
          {roster.eyebrow}
        </p>
        <h2 className="font-display mt-3 max-w-3xl text-4xl md:text-6xl">
          {roster.title}
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
          Quem está por trás dos lançamentos, do som e da cena.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {roster.members.map((a, i) => {
            const isFeatured = i === featuredIndex;
            return (
              <article
                key={a.id}
                data-roster-card
                data-index={i}
                className={`group relative overflow-hidden rounded-2xl bg-zinc-900 ${
                  isFeatured
                    ? "ring-2 ring-accent/80 ring-offset-2 ring-offset-bg sm:col-span-2 sm:row-span-1 lg:col-span-1 xl:col-span-2 xl:row-span-2"
                    : "opacity-90 md:opacity-85 md:transition md:duration-500 md:hover:opacity-100"
                }`}
              >
                <div
                  className={`relative w-full overflow-hidden ${
                    isFeatured
                      ? "aspect-[4/3] min-h-[280px] xl:aspect-auto xl:min-h-[min(520px,55vh)]"
                      : "aspect-[3/4]"
                  }`}
                >
                  {a.image ? (
                    <Image
                      src={a.image}
                      alt={a.name}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-[1.03]"
                      sizes={
                        isFeatured
                          ? "(max-width:1280px) 100vw, 50vw"
                          : "(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
                      }
                    />
                  ) : (
                    <div className="flex h-full min-h-[240px] flex-col items-center justify-center bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-950">
                      <span className="font-display text-5xl text-white/25 md:text-6xl">
                        ?
                      </span>
                      <span className="mt-2 text-xs uppercase tracking-[0.25em] text-white/40">
                        Vaga reservada
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 space-y-2 bg-gradient-to-t from-black/90 to-transparent px-4 pb-4 pt-12 md:px-5 md:pb-5 md:pt-16">
                  <div>
                    <h3 className="font-display text-2xl text-white md:text-3xl">
                      {a.name}
                    </h3>
                    {a.role && !a.isPlaceholder && (
                      <p className="mt-1 text-xs uppercase tracking-wider text-white/60">
                        {a.role}
                      </p>
                    )}
                    {a.bio && !a.isPlaceholder && (
                      <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-white/55">
                        {a.bio}
                      </p>
                    )}
                    {a.isPlaceholder && (
                      <p className="mt-1 text-xs text-white/50">
                        Nome e foto quando fechar o lineup
                      </p>
                    )}
                  </div>
                  {(a.spotifyUrl || a.youtubeUrl || a.instagramUrl) && (
                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                      {a.spotifyUrl && (
                        <a
                          href={a.spotifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex text-xs font-medium uppercase tracking-wider text-accent transition hover:text-white"
                        >
                          Spotify →
                        </a>
                      )}
                      {a.instagramUrl && (
                        <a
                          href={a.instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex text-xs font-medium uppercase tracking-wider text-rose-300/90 transition hover:text-rose-100"
                        >
                          Instagram →
                        </a>
                      )}
                      {a.youtubeUrl && (
                        <a
                          href={a.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex text-xs font-medium uppercase tracking-wider text-white/70 transition hover:text-white"
                        >
                          YouTube →
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

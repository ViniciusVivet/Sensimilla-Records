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
    return i >= 0 ? i : 0;
  }, []);

  useLayoutEffect(() => {
    const section = root.current;
    if (!section) return;
    const cards = section.querySelectorAll<HTMLElement>("[data-roster-card]");

    if (reducedMotion) {
      gsap.set(cards, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from(cards, {
        opacity: 0,
        y: 40,
        duration: 0.9,
        stagger: 0.07,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          toggleActions: "play none none none",
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

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
          {roster.members.map((a, i) => {
            const isFeatured = i === featuredIndex;
            return (
              <article
                key={a.id}
                data-roster-card
                className={`group overflow-hidden rounded-2xl border border-white/15 bg-zinc-800 transition hover:border-accent/40 ${
                  isFeatured ? "col-span-2 sm:col-span-1" : ""
                }`}
              >
                {/* Imagem */}
                <div className={`relative w-full overflow-hidden ${isFeatured ? "aspect-[3/4]" : "aspect-[3/4]"}`}>
                  {a.image ? (
                    <Image
                      src={a.image}
                      alt={a.name}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-zinc-800">
                      <span className="font-display text-4xl text-muted/60">?</span>
                    </div>
                  )}
                </div>

                {/* Texto abaixo da imagem */}
                <div className="p-3 md:p-4">
                  <h3 className="font-display text-lg text-fg md:text-xl">
                    {a.name}
                  </h3>
                  {a.role && (
                    <p className="mt-0.5 text-[11px] uppercase tracking-wider text-muted line-clamp-1">
                      {a.role}
                    </p>
                  )}
                  {(a.spotifyUrl || a.instagramUrl || a.youtubeUrl) && (
                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                      {a.spotifyUrl && (
                        <a
                          href={a.spotifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-medium uppercase tracking-wider text-accent hover:underline"
                        >
                          Spotify
                        </a>
                      )}
                      {a.instagramUrl && (
                        <a
                          href={a.instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-medium uppercase tracking-wider text-rose-300/80 hover:underline"
                        >
                          Insta
                        </a>
                      )}
                      {a.youtubeUrl && (
                        <a
                          href={a.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-medium uppercase tracking-wider text-muted hover:text-fg hover:underline"
                        >
                          YouTube
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

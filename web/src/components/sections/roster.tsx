"use client";

import { useMemo } from "react";
import Image from "next/image";
import { roster } from "@/data/site";

export function RosterSection() {
  const featuredIndex = useMemo(() => {
    const i = roster.members.findIndex((m) => m.id === roster.featuredMemberId);
    return i >= 0 ? i : 0;
  }, []);

  return (
    <section
      id="equipe"
      className="bg-panel px-6 py-24 text-fg md:px-12 md:py-32"
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

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {roster.members.map((a, i) => {
            const isFeatured = i === featuredIndex;
            return (
              <article
                key={a.id}
                className={`group relative overflow-hidden rounded-2xl border transition-all duration-500 hover:scale-[1.02] ${
                  isFeatured
                    ? "border-accent/40 ring-1 ring-accent/30"
                    : "border-white/10"
                }`}
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  {a.image ? (
                    <Image
                      src={a.image}
                      alt={a.name}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-[1.03]"
                      sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
                    />
                  ) : (
                    <div className="flex h-full min-h-[240px] flex-col items-center justify-center bg-gradient-to-br from-bg/10 via-bg/5 to-accent/20">
                      <span className="font-display text-5xl text-fg/25 md:text-6xl">
                        ?
                      </span>
                      <span className="mt-2 text-xs uppercase tracking-[0.25em] text-fg/40">
                        Em breve
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 space-y-1.5 p-3 md:p-4">
                  <div>
                    <h3 className="font-display text-xl text-white md:text-2xl">
                      {a.name}
                    </h3>
                    {a.role && (
                      <p className="mt-0.5 text-[10px] uppercase tracking-wider text-white/60 line-clamp-1">
                        {a.role}
                      </p>
                    )}
                    {a.bio && (
                      <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-white/50 md:line-clamp-3">
                        {a.bio}
                      </p>
                    )}
                  </div>
                  {(a.spotifyUrl || a.youtubeUrl || a.instagramUrl) && (
                    <div className="flex flex-wrap gap-x-3 gap-y-1">
                      {a.spotifyUrl && (
                        <a
                          href={a.spotifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-medium uppercase tracking-wider text-accent transition hover:text-white"
                        >
                          Spotify
                        </a>
                      )}
                      {a.instagramUrl && (
                        <a
                          href={a.instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-medium uppercase tracking-wider text-rose-300/80 transition hover:text-rose-100"
                        >
                          Insta
                        </a>
                      )}
                      {a.youtubeUrl && (
                        <a
                          href={a.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-medium uppercase tracking-wider text-white/60 transition hover:text-white"
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

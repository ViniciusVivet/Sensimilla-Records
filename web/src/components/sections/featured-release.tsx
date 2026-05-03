"use client";

import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { featuredRelease } from "@/data/site";
import type { CmsFeaturedRelease } from "@/lib/cms-types";

export function FeaturedReleaseSection({
  release = featuredRelease,
}: {
  release?: CmsFeaturedRelease;
}) {
  const platforms = "platforms" in release ? release.platforms : [];

  return (
    <section
      id="destaque"
      className="bg-sage px-6 py-24 text-bg md:px-16 md:py-32"
    >
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:items-center md:gap-16">
        <Reveal className="relative aspect-square w-full max-w-md md:max-w-none">
          <div className="relative h-full min-h-[280px] w-full overflow-hidden rounded-3xl shadow-2xl shadow-black/15 md:min-h-[420px]">
            <Image
              src={release.cover}
              alt={release.title}
              fill
              className="object-cover"
              sizes="(max-width:768px) 100vw, 50vw"
              priority
            />
          </div>
        </Reveal>
        <div>
          <Reveal>
            <p className="text-xs uppercase tracking-[0.3em] text-bg/50">
              {release.subtitle}
            </p>
            <h2 className="font-display mt-4 text-5xl leading-[0.95] md:text-7xl">
              {release.title}
            </h2>
          </Reveal>
          <Reveal delay={0.12} className="mt-8">
            <p className="max-w-md text-base leading-relaxed text-bg/75 md:text-lg">
              {release.description}
            </p>
          </Reveal>

          {release.spotifyEmbed && (
            <Reveal delay={0.16} className="mt-8">
              <div className="max-w-full overflow-hidden rounded-xl">
                <iframe
                  className="w-full rounded-xl"
                  src={`https://open.spotify.com/embed/${release.spotifyEmbed}?utm_source=generator&theme=0`}
                  width="100%"
                  height="152"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  title={`Spotify - ${release.title}`}
                />
              </div>
            </Reveal>
          )}

          <Reveal delay={0.2} className="mt-10">
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={release.href}
                className="inline-flex rounded-full bg-bg px-8 py-4 text-sm font-semibold uppercase tracking-wider text-fg transition hover:bg-panel hover:text-accent"
              >
                {release.cta}
              </a>
              {platforms.slice(1).map((p) => (
                <a
                  key={p.name}
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-full border border-bg/30 px-5 py-4 text-xs uppercase tracking-wider text-bg/70 transition hover:border-bg/60 hover:text-bg"
                >
                  {p.name}
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { featuredRelease } from "@/data/site";

export function FeaturedReleaseSection() {
  return (
    <section
      id="destaque"
      className="bg-sage px-6 py-24 text-bg md:px-16 md:py-32"
    >
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:items-center md:gap-16">
        <Reveal className="relative aspect-square w-full max-w-md md:max-w-none">
          <div className="relative h-full min-h-[280px] w-full overflow-hidden rounded-3xl shadow-2xl shadow-black/15 md:min-h-[420px]">
            <Image
              src={featuredRelease.cover}
              alt={featuredRelease.title}
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
              {featuredRelease.subtitle}
            </p>
            <h2 className="font-display mt-4 text-5xl leading-[0.95] md:text-7xl">
              {featuredRelease.title}
            </h2>
          </Reveal>
          <Reveal delay={0.12} className="mt-8">
            <p className="max-w-md text-base leading-relaxed text-bg/75 md:text-lg">
              {featuredRelease.description}
            </p>
          </Reveal>

          {featuredRelease.spotifyEmbed && (
            <Reveal delay={0.16} className="mt-8">
              <iframe
                className="w-full rounded-xl"
                src={`https://open.spotify.com/embed/${featuredRelease.spotifyEmbed}?utm_source=generator&theme=0`}
                width="100%"
                height="152"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title={`Spotify — ${featuredRelease.title}`}
              />
            </Reveal>
          )}

          <Reveal delay={0.2} className="mt-10">
            <a
              href={featuredRelease.href}
              className="inline-flex rounded-full bg-bg px-8 py-4 text-sm font-semibold uppercase tracking-wider text-fg transition hover:bg-panel hover:text-accent"
            >
              {featuredRelease.cta}
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

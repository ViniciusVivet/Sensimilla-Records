"use client";

import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { reelPoster } from "@/data/site";
import { useReducedMotion } from "@/components/reduced-motion-provider";

export function VerticalReelSection() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="bg-bg px-6 py-24 md:py-32">
      <div className="mx-auto flex max-w-4xl flex-col items-center">
        <Reveal className="w-full text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-muted">
            Bastidores em movimento
          </p>
          <h2 className="font-display mt-3 text-4xl md:text-5xl">
            Clipe vertical
          </h2>
        </Reveal>

        <Reveal delay={0.12} className="mt-12">
          <div
            className="relative mx-auto aspect-[9/16] w-[min(100%,280px)] overflow-hidden rounded-3xl border border-white/10 bg-panel shadow-2xl shadow-black/50 md:w-[320px]"
            style={{ maxHeight: "min(70dvh, 560px)" }}
          >
            {reducedMotion ? (
              <Image
                src={reelPoster}
                alt="Teaser visual da gravadora (estático — movimento reduzido)"
                fill
                className="object-cover"
                sizes="320px"
                priority={false}
              />
            ) : (
              <video
                className="h-full w-full object-cover"
                poster={reelPoster}
                muted
                loop
                playsInline
                autoPlay
                preload="metadata"
                aria-label="Teaser vertical da gravadora"
              >
                <source
                  src="https://videos.pexels.com/video-files/3045163/3045163-hd_1080_1920_25fps.mp4"
                  type="video/mp4"
                />
              </video>
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

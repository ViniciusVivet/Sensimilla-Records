"use client";

import { Reveal } from "@/components/reveal";

const REEL_VIDEO_ID = "C9Eyy_hnxvs";

export function VerticalReelSection() {
  return (
    <section className="bg-bg px-6 py-24 md:py-32">
      <div className="mx-auto flex max-w-4xl flex-col items-center">
        <Reveal className="w-full text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-muted">
            Direto do canal
          </p>
          <h2 className="font-display mt-3 text-4xl md:text-5xl">
            Clipe em destaque
          </h2>
        </Reveal>

        <Reveal delay={0.12} className="mt-12 w-full max-w-sm">
          <div
            className="relative mx-auto aspect-[9/16] w-full overflow-hidden rounded-3xl border border-white/10 bg-panel shadow-2xl shadow-black/50"
            style={{ maxHeight: "min(70dvh, 560px)" }}
          >
            <iframe
              src={`https://www.youtube.com/embed/${REEL_VIDEO_ID}?autoplay=0&modestbranding=1&rel=0`}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Clipe — Sensimilla Records"
              loading="lazy"
              style={{ border: 0 }}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

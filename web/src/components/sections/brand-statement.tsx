"use client";

import { Reveal } from "@/components/reveal";
import { manifesto } from "@/data/site";

export function BrandStatementSection() {
  return (
    <section
      id="manifesto"
      className="relative min-h-[75dvh] bg-sage px-6 py-24 text-bg md:px-16 md:py-32"
    >
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-center text-center">
        <Reveal>
          <p className="font-display text-[clamp(3.5rem,16vw,12rem)] leading-[0.85] text-bg/15">
            SEN$I
          </p>
        </Reveal>
        <Reveal delay={0.15} className="mt-8 md:mt-12">
          <p className="max-w-xl text-lg leading-relaxed text-bg/80 md:text-xl">
            {manifesto.line}
          </p>
        </Reveal>
        <Reveal delay={0.2} className="mt-8 max-w-lg text-sm leading-relaxed text-bg/55 md:text-base">
          {manifesto.stats}
        </Reveal>
        <Reveal delay={0.28} className="mt-10">
          <span className="text-xs uppercase tracking-[0.35em] text-bg/50">
            @sensi.rec · manifesto
          </span>
        </Reveal>
      </div>
    </section>
  );
}

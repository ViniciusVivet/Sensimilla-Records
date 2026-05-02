"use client";

import { Reveal } from "@/components/reveal";
import { manifesto, members, catalogReleases } from "@/data/site";

const stats = [
  { value: `${members.length}`, label: "Artistas no selo" },
  { value: `${catalogReleases.length}+`, label: "Releases" },
  { value: "100k+", label: "Streams combinados" },
  { value: "Estúdio", label: "Próprio · ZL SP" },
];

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

        {/* Social proof */}
        <Reveal delay={0.2} className="mt-10 grid w-full max-w-lg grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center">
              <span className="font-display text-3xl text-bg md:text-4xl">
                {s.value}
              </span>
              <span className="mt-1 text-[10px] uppercase tracking-[0.2em] text-bg/50">
                {s.label}
              </span>
            </div>
          ))}
        </Reveal>

        <Reveal delay={0.25} className="mt-8 max-w-lg text-sm leading-relaxed text-bg/55 md:text-base">
          {manifesto.stats}
        </Reveal>
        <Reveal delay={0.3} className="mt-10">
          <span className="text-xs uppercase tracking-[0.35em] text-bg/50">
            @sensi.rec · manifesto
          </span>
        </Reveal>
      </div>
    </section>
  );
}

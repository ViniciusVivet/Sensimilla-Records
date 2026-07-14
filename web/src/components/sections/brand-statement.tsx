"use client";

import { useRef, useEffect, useState } from "react";
import { Reveal } from "@/components/reveal";
import { manifesto, members, catalogReleases } from "@/data/site";
import { useReducedMotion } from "@/components/reduced-motion-provider";

const stats = [
  { value: members.length, suffix: "", label: "Artistas no selo" },
  { value: catalogReleases.length, suffix: "+", label: "Releases" },
  { value: 1, suffix: "M+", label: "Streams combinados" },
  { value: 0, suffix: "Estúdio", label: "Próprio · ZL SP", isText: true },
];

function AnimatedStat({
  value,
  suffix,
  label,
  isText,
}: {
  value: number;
  suffix: string;
  label: string;
  isText?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(isText ? suffix : "0");
  const counted = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || isText) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          const dur = 1600;
          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min((now - start) / dur, 1);
            // ease-out cubic
            const ease = 1 - Math.pow(1 - t, 3);
            const current = Math.round(ease * value);
            setDisplay(`${current}${suffix}`);
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [value, suffix, isText]);

  return (
    <div
      ref={ref}
      className="flex flex-col items-center rounded-2xl border border-bg/10 bg-bg/[0.06] px-2.5 py-4 backdrop-blur-sm transition-all duration-300 hover:border-bg/20 hover:bg-bg/[0.1] sm:px-4 sm:py-5"
    >
      <span className="font-display text-3xl tabular-nums text-bg md:text-4xl">
        {display}
      </span>
      <span className="mt-1.5 text-[10px] uppercase tracking-[0.2em] text-bg/50">
        {label}
      </span>
    </div>
  );
}

export function BrandStatementSection({
  manifestoLine,
  manifestoStats,
}: {
  manifestoLine?: string;
  manifestoStats?: string;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <section
      id="manifesto"
      className="relative min-h-[45dvh] overflow-hidden bg-sage px-6 py-14 text-bg md:px-16 md:py-20"
    >
      {/* Background video — silhuetas */}
      {!reducedMotion && (
        <video
          src="/videos/silhuetas.mp4"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.07]"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
      )}
      <div className="relative mx-auto flex max-w-4xl flex-col items-center justify-center text-center">
        <Reveal>
          <p className="font-display text-[clamp(3rem,12vw,8rem)] leading-[0.85] text-bg/15">
            SEN$I
          </p>
        </Reveal>
        <Reveal delay={0.15} className="mt-5 md:mt-7">
          <p className="max-w-xl text-base leading-relaxed text-bg/80 sm:text-lg md:text-xl">
            {manifestoLine || manifesto.line}
          </p>
        </Reveal>

        {/* Stats animados com glass */}
        <Reveal
          delay={0.2}
          className="mt-7 grid w-full max-w-lg grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {stats.map((s) => (
            <AnimatedStat key={s.label} {...s} />
          ))}
        </Reveal>

        <Reveal
          delay={0.25}
          className="mt-5 max-w-lg text-sm leading-relaxed text-bg/55 md:text-base"
        >
          {manifestoStats || manifesto.stats}
        </Reveal>
        <Reveal delay={0.3} className="mt-6">
          <span className="text-xs uppercase tracking-[0.35em] text-bg/50">
            @sensi.rec · manifesto
          </span>
        </Reveal>
      </div>
    </section>
  );
}

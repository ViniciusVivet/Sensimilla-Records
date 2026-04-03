"use client";

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/components/reduced-motion-provider";

gsap.registerPlugin(ScrollTrigger);

export function TypeOutlineSection() {
  const root = useRef<HTMLElement>(null);
  const word = useRef<HTMLHeadingElement>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const section = root.current;
    const h = word.current;
    if (!section || !h) return;

    if (reducedMotion) {
      gsap.set(h, { xPercent: 0, opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        h,
        { xPercent: -8, opacity: 0.3 },
        {
          xPercent: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        },
      );
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={root}
      className="relative flex min-h-[55dvh] items-center overflow-hidden bg-black py-16 md:min-h-[65dvh]"
      aria-hidden
    >
      <h2
        ref={word}
        className="font-display text-outline whitespace-nowrap text-[28vw] leading-none md:text-[22vw]"
      >
        FREQUÊNCIA
      </h2>
    </section>
  );
}

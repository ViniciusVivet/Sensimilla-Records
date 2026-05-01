"use client";

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/components/reduced-motion-provider";

gsap.registerPlugin(ScrollTrigger);

export function TypographySplash() {
  const wrap = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const el = wrap.current;
    const t = text.current;
    if (!el || !t) return;

    if (reducedMotion) {
      gsap.set(t, { scale: 1, opacity: 1, filter: "none" });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        t,
        { scale: 0.85, opacity: 0.4, filter: "blur(12px)" },
        {
          scale: 1,
          opacity: 1,
          filter: "blur(0px)",
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div
      ref={wrap}
      className="relative flex min-h-[35dvh] items-center justify-center overflow-hidden bg-black py-10"
      aria-hidden
    >
      <div
        ref={text}
        className="font-display pointer-events-none select-none text-[22vw] leading-none text-white/10 md:text-[18vw]"
      >
        SENSIMILLA
      </div>
    </div>
  );
}

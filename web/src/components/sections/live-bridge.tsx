"use client";

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/components/reduced-motion-provider";

gsap.registerPlugin(ScrollTrigger);

export function LiveBridgeSection() {
  const root = useRef<HTMLElement>(null);
  const label = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const section = root.current;
    const el = label.current;
    if (!section || !el) return;

    if (reducedMotion) {
      gsap.set(el, { scale: 1, opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { scale: 1.15, opacity: 0.35 },
        {
          scale: 1,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 90%",
            end: "center center",
            scrub: 0.8,
          },
        },
      );
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={root}
      className="relative flex min-h-[50dvh] items-center justify-center overflow-hidden bg-gradient-to-br from-[#1a0f0a] via-bg to-[#2a1810]"
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 40%, rgba(200,100,60,0.25), transparent 50%)",
        }}
      />
      <div
        ref={label}
        className="font-display relative z-10 text-[20vw] leading-none text-white/[0.07] md:text-[14vw]"
      >
        LIVE
      </div>
    </section>
  );
}

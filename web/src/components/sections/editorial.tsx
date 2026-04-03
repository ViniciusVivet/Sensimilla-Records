"use client";

import { useRef, useLayoutEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { editorialCollage } from "@/data/site";
import { useReducedMotion } from "@/components/reduced-motion-provider";

gsap.registerPlugin(ScrollTrigger);

export function EditorialSection() {
  const root = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const section = root.current;
    if (!section) return;

    const photos = section.querySelectorAll<HTMLElement>("[data-editorial-photo]");

    if (reducedMotion) {
      gsap.set(photos, { opacity: 1, y: 0, rotation: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from(photos, {
        opacity: 0,
        y: 80,
        rotation: (i) => (i % 2 === 0 ? -6 : 8),
        duration: 1.1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={root}
      id="visuais"
      className="relative overflow-hidden bg-lime-field px-6 py-28 md:px-12 md:py-36"
    >
      <h2
        className="font-display text-outline pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[40vw] leading-none opacity-40 md:text-[32vw]"
        aria-hidden
      >
        SENSI
      </h2>

      <div className="relative z-10 mx-auto max-w-5xl">
        <p className="text-xs uppercase tracking-[0.35em] text-fg/55">
          Editorial · bastidores
        </p>
        <h2 className="font-display mt-2 max-w-lg text-4xl md:text-5xl">
          Colagens do que acontece fora do streaming
        </h2>

        <div className="relative mt-16 min-h-[420px] md:min-h-[520px]">
          <div
            data-editorial-photo
            className="absolute left-[2%] top-[8%] w-[42%] rotate-[-7deg] shadow-2xl shadow-black/40 md:left-[5%] md:w-[38%]"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-fg/10">
              <Image
                src={editorialCollage[0].src}
                alt={editorialCollage[0].alt}
                fill
                className="object-cover"
                sizes="40vw"
              />
            </div>
          </div>
          <div
            data-editorial-photo
            className="absolute right-[4%] top-0 w-[48%] rotate-[5deg] shadow-2xl shadow-black/40 md:right-[8%] md:w-[42%]"
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg border border-fg/10">
              <Image
                src={editorialCollage[1].src}
                alt={editorialCollage[1].alt}
                fill
                className="object-cover"
                sizes="45vw"
              />
            </div>
          </div>
          <div
            data-editorial-photo
            className="absolute bottom-0 left-[18%] w-[52%] rotate-[-3deg] shadow-2xl shadow-black/40 md:left-[22%] md:w-[45%]"
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-fg/10">
              <Image
                src={editorialCollage[2].src}
                alt={editorialCollage[2].alt}
                fill
                className="object-cover"
                sizes="48vw"
              />
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="absolute bottom-8 right-8 z-20 hidden h-14 w-14 items-center justify-center rounded-full border border-fg/25 bg-black/20 text-fg backdrop-blur-sm transition hover:border-accent hover:text-accent md:flex"
        aria-label="Explorar galeria"
      >
        ◎
      </button>
    </section>
  );
}

"use client";

import { useRef, useLayoutEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { merchProducts } from "@/data/site";
import { useReducedMotion } from "@/components/reduced-motion-provider";

gsap.registerPlugin(ScrollTrigger);

export function MerchSection() {
  const root = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const section = root.current;
    if (!section) return;

    const items = section.querySelectorAll<HTMLElement>("[data-merch-item]");

    if (reducedMotion) {
      gsap.set(items, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from(items, {
        opacity: 0,
        y: 50,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 72%",
          toggleActions: "play none none reverse",
        },
      });
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={root}
      id="merch"
      className="bg-lime-field px-6 py-24 text-fg md:px-12 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-fg/50">
              Loja · equipamento & wear
            </p>
            <h2 className="font-display mt-2 text-5xl md:text-7xl">Merch</h2>
          </div>
          <p className="max-w-sm text-sm text-fg/65">
            Peças limitadas e parcerias com estúdio. Som limpo, estética crua.
          </p>
        </div>

        <div className="mt-6 inline-block rounded-full border border-fg/20 bg-black/10 px-4 py-2 font-display text-xl tracking-[0.2em] text-fg/90">
          WAAW
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          {merchProducts.map((p) => (
            <article
              key={p.name}
              data-merch-item
              className="group flex flex-col rounded-2xl border border-fg/10 bg-black/15 p-4 transition hover:border-accent/50"
            >
              <div className="relative aspect-square overflow-hidden rounded-xl bg-black/40">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  className="object-contain p-3 transition duration-500 group-hover:scale-105"
                  sizes="(max-width:768px) 50vw, 33vw"
                />
              </div>
              <p className="mt-3 text-xs uppercase tracking-wider text-fg/50">
                {p.tag}
              </p>
              <h3 className="font-display text-xl">{p.name}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

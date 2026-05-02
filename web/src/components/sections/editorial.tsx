"use client";

import { useRef, useLayoutEffect, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { editorialCollage } from "@/data/site";
import { useReducedMotion } from "@/components/reduced-motion-provider";

gsap.registerPlugin(ScrollTrigger);

function Lightbox({
  images,
  startIndex,
  onClose,
}: {
  images: typeof editorialCollage;
  startIndex: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(startIndex);
  const img = images[idx];

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[85vh] max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-[3/4] h-[70vh] overflow-hidden rounded-2xl">
          <Image
            src={img.src}
            alt={img.alt}
            fill
            className="object-cover"
            sizes="90vw"
          />
        </div>
        <p className="mt-3 text-center text-sm text-white/60">{img.alt}</p>

        {images.length > 1 && (
          <div className="mt-4 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() =>
                setIdx((i) => (i - 1 + images.length) % images.length)
              }
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/60 transition hover:border-accent hover:text-accent"
            >
              ‹
            </button>
            <span className="text-xs text-white/40">
              {idx + 1} / {images.length}
            </span>
            <button
              type="button"
              onClick={() => setIdx((i) => (i + 1) % images.length)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/60 transition hover:border-accent hover:text-accent"
            >
              ›
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-sm text-white/60 transition hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export function EditorialSection() {
  const root = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useLayoutEffect(() => {
    const section = root.current;
    if (!section) return;

    const photos = section.querySelectorAll<HTMLElement>(
      "[data-editorial-photo]",
    );

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
    <>
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
            {editorialCollage.map((photo, i) => {
              const positions = [
                "left-[2%] top-[8%] w-[42%] rotate-[-7deg] md:left-[5%] md:w-[38%]",
                "right-[4%] top-0 w-[48%] rotate-[5deg] md:right-[8%] md:w-[42%]",
                "bottom-0 left-[18%] w-[52%] rotate-[-3deg] md:left-[22%] md:w-[45%]",
              ];
              const aspects = [
                "aspect-[4/5]",
                "aspect-[3/4]",
                "aspect-[16/10]",
              ];
              return (
                <button
                  key={photo.alt}
                  type="button"
                  data-editorial-photo
                  className={`absolute cursor-pointer shadow-2xl shadow-black/40 transition hover:scale-105 hover:z-20 ${positions[i]}`}
                  onClick={() => setLightboxIndex(i)}
                >
                  <div
                    className={`relative ${aspects[i]} overflow-hidden rounded-lg border border-fg/10`}
                  >
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      className="object-cover"
                      sizes="48vw"
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setLightboxIndex(0)}
          className="absolute bottom-8 right-8 z-20 hidden h-14 w-14 items-center justify-center rounded-full border border-fg/25 bg-black/20 text-fg backdrop-blur-sm transition hover:border-accent hover:text-accent md:flex"
          aria-label="Explorar galeria"
        >
          ◎
        </button>
      </section>

      {lightboxIndex !== null && (
        <Lightbox
          images={editorialCollage}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}

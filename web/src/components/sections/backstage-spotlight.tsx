"use client";

import { useRef, useLayoutEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/components/reduced-motion-provider";

gsap.registerPlugin(ScrollTrigger);

export function BackstageSpotlightSection() {
  const root = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotion();
  const [isMuted, setIsMuted] = useState(true);

  useLayoutEffect(() => {
    const section = root.current;
    const video = videoRef.current;
    if (!section || !video) return;

    if (reducedMotion) {
      gsap.set("[data-bs-reveal]", { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      // Reveal text elements
      gsap.from("[data-bs-reveal]", {
        opacity: 0,
        y: 40,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 65%",
          toggleActions: "play none none reverse",
        },
      });

      // Parallax on the video container
      gsap.to("[data-bs-video]", {
        yPercent: -6,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Play/pause video based on visibility
      ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        end: "bottom 20%",
        onEnter: () => video.play(),
        onLeave: () => video.pause(),
        onEnterBack: () => video.play(),
        onLeaveBack: () => video.pause(),
      });
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={root}
      id="backstage"
      className="relative overflow-hidden bg-bg"
    >
      {/* Top fade from previous section */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-24 bg-gradient-to-b from-sage to-transparent"
      />

      {/* Video block */}
      <div className="relative mx-auto max-w-[1400px] px-4 pb-20 pt-28 md:px-8 md:pb-28 md:pt-36">
        {/* Eyebrow + title */}
        <div className="mb-8 md:mb-12" data-bs-reveal>
          <p className="text-[10px] uppercase tracking-[0.4em] text-accent/70">
            Backstage
          </p>
          <h2 className="font-display mt-2 text-3xl text-white md:text-5xl lg:text-6xl">
            DIRETO DO ESTÚDIO
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-fg/45">
            Freestyle exclusivo — COGU e Derek, dois pesos da cena paulista,
            no improviso dentro do ecossistema Sensimilla.
          </p>
        </div>

        {/* Video container — cinematic aspect */}
        <div
          data-bs-video
          className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-black shadow-[0_8px_80px_rgba(0,0,0,0.6)] md:rounded-3xl"
        >
          {/* Aspect ratio wrapper */}
          <div className="relative aspect-video w-full">
            <video
              ref={videoRef}
              src="/videos/derek-e-cogu.mp4"
              className="h-full w-full object-cover"
              muted={isMuted}
              playsInline
              loop
              preload="metadata"
              poster=""
            />

            {/* Gradient overlays for text legibility */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20"
            />

            {/* Bottom info bar */}
            <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 p-4 md:p-6">
              <div data-bs-reveal>
                <p className="font-display text-lg text-white drop-shadow-lg md:text-2xl">
                  COGU × DEREK
                </p>
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">
                  Freestyle Session · Sensimilla Records
                </p>
              </div>

              {/* Unmute button */}
              <button
                type="button"
                onClick={() => {
                  setIsMuted((m) => !m);
                  if (videoRef.current) {
                    videoRef.current.muted = !videoRef.current.muted;
                  }
                }}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white/70 backdrop-blur-sm transition hover:border-accent hover:text-accent md:h-12 md:w-12"
                aria-label={isMuted ? "Ativar som" : "Silenciar"}
              >
                {isMuted ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-3.15a.75.75 0 011.28.53v13.74a.75.75 0 01-1.28.53L6.75 16.5H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-3.15a.75.75 0 011.28.53v12.74a.75.75 0 01-1.28.53l-4.72-3.15H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Corner badge */}
            <div
              data-bs-reveal
              className="absolute right-4 top-4 z-10 rounded-full border border-white/10 bg-black/50 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.25em] text-accent backdrop-blur-sm md:right-6 md:top-6"
            >
              Exclusivo
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade to next section */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-20 bg-gradient-to-t from-bg to-transparent"
      />
    </section>
  );
}

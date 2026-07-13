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
  const [isPlaying, setIsPlaying] = useState(false);

  useLayoutEffect(() => {
    const section = root.current;
    const video = videoRef.current;
    if (!section || !video) return;

    if (reducedMotion) {
      gsap.set("[data-bs-reveal]", { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from("[data-bs-reveal]", {
        opacity: 0,
        y: 50,
        duration: 1.2,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 60%",
          toggleActions: "play none none reverse",
        },
      });

      // Play/pause video based on visibility
      ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        end: "bottom 20%",
        onEnter: () => {
          video.play();
          setIsPlaying(true);
        },
        onLeave: () => {
          video.pause();
          setIsPlaying(false);
        },
        onEnterBack: () => {
          video.play();
          setIsPlaying(true);
        },
        onLeaveBack: () => {
          video.pause();
          setIsPlaying(false);
        },
      });
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  function toggleMute() {
    setIsMuted((m) => !m);
    if (videoRef.current) videoRef.current.muted = !videoRef.current.muted;
  }

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setIsPlaying(true);
    } else {
      v.pause();
      setIsPlaying(false);
    }
  }

  return (
    <section
      ref={root}
      id="backstage"
      className="relative overflow-hidden bg-bg py-24 md:py-32"
    >
      {/* Background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 50% at 50% 60%, rgba(200,242,74,0.06), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 md:px-10">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div data-bs-reveal>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-accent/60" />
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent">
                Backstage
              </p>
            </div>
            <h2 className="font-display mt-3 text-5xl leading-[0.9] text-white md:text-7xl lg:text-8xl">
              DIRETO DO
              <br />
              <span className="text-accent">ESTÚDIO</span>
            </h2>
          </div>
          <p
            data-bs-reveal
            className="max-w-sm text-sm leading-relaxed text-fg/50 md:text-right"
          >
            Freestyle exclusivo — COGU e Derek, dois pesos pesados da cena
            paulista, no improviso bruto dentro do ecossistema Sensimilla.
          </p>
        </div>

        {/* Video */}
        <div data-bs-reveal className="relative">
          {/* Glow ring behind video */}
          <div
            aria-hidden
            className="absolute -inset-1 rounded-[1.25rem] bg-gradient-to-br from-accent/20 via-accent/5 to-transparent blur-sm md:-inset-1.5 md:rounded-[1.75rem]"
          />

          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_16px_80px_rgba(0,0,0,0.7)] md:rounded-3xl">
            {/* Video wrapper */}
            <div className="relative aspect-video w-full">
              <video
                ref={videoRef}
                src="/videos/derek-e-cogu.mp4"
                className="h-full w-full object-cover"
                muted={isMuted}
                playsInline
                loop
                preload="metadata"
              />

              {/* Cinematic gradient overlays */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent"
              />

              {/* Top bar */}
              <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between p-4 md:p-6">
                {/* Live-style indicator */}
                <div
                  data-bs-reveal
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 backdrop-blur-md"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">
                    Exclusivo Sensi
                  </span>
                </div>

                {/* Sensi watermark */}
                <p
                  data-bs-reveal
                  className="font-display text-lg text-white/10 md:text-2xl"
                >
                  SEN$I
                </p>
              </div>

              {/* Bottom bar */}
              <div className="absolute inset-x-0 bottom-0 z-10 p-4 md:p-6">
                <div className="flex items-end justify-between gap-4">
                  {/* Info */}
                  <div data-bs-reveal>
                    <h3 className="font-display text-2xl text-white drop-shadow-lg md:text-4xl">
                      COGU <span className="text-accent">x</span> DEREK
                    </h3>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/45">
                      Freestyle Session
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white/60 backdrop-blur-sm">
                        Trap
                      </span>
                      <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white/60 backdrop-blur-sm">
                        Freestyle
                      </span>
                      <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-accent/80 backdrop-blur-sm">
                        Sensimilla Records
                      </span>
                    </div>
                  </div>

                  {/* Controls */}
                  <div data-bs-reveal className="flex items-center gap-2">
                    {/* Play/Pause */}
                    <button
                      type="button"
                      onClick={togglePlay}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white/80 backdrop-blur-md transition hover:border-accent hover:text-accent md:h-12 md:w-12"
                      aria-label={isPlaying ? "Pausar" : "Reproduzir"}
                    >
                      {isPlaying ? (
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                    </button>

                    {/* Mute/Unmute */}
                    <button
                      type="button"
                      onClick={toggleMute}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white/80 backdrop-blur-md transition hover:border-accent hover:text-accent md:h-12 md:w-12"
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
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom caption */}
        <div
          data-bs-reveal
          className="mt-6 flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-fg/25 md:mt-8"
        >
          <span>@sensi.rec</span>
          <span>Zona Leste, SP</span>
        </div>
      </div>
    </section>
  );
}

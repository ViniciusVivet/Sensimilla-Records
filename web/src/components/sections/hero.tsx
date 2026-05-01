"use client";

import { useRef, useLayoutEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  navPills,
  socialLinks,
  heroSpotlight,
  heroTagline,
} from "@/data/site";
import { useReducedMotion } from "@/components/reduced-motion-provider";

gsap.registerPlugin(ScrollTrigger);

function SocialIcon({ name }: { name: string }) {
  const common = "h-4 w-4 stroke-current";
  if (name === "Instagram")
    return (
      <svg className={common} fill="none" viewBox="0 0 24 24" aria-hidden>
        <rect x="3" y="3" width="18" height="18" rx="5" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="4" strokeWidth="1.5" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
      </svg>
    );
  if (name === "Spotify")
    return (
      <svg className={common} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
      </svg>
    );
  if (name === "YouTube")
    return (
      <svg className={common} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    );
  return (
    <svg className={common} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M1.175 12.225c-.096 1.514.056 3.14.56 4.758.56 1.68 1.44 3.12 2.64 4.32 1.2 1.2 2.64 2.04 4.32 2.64 1.68.56 3.36.84 5.04.84s3.36-.28 5.04-.84c1.68-.6 3.12-1.44 4.32-2.64 1.2-1.2 2.04-2.64 2.64-4.32.56-1.68.84-3.36.84-5.04s-.28-3.36-.84-5.04c-.6-1.68-1.44-3.12-2.64-4.32C20.64 3.84 19.2 3 17.52 2.4 15.84 1.84 14.16 1.56 12.48 1.56c-1.68 0-3.36.28-5.04.84C5.76 3 4.32 3.84 3.12 5.04 1.92 6.24 1.08 7.68.48 9.36c-.56 1.68-.84 3.36-.84 5.04v.825zm17.28-6.72c.48.96.84 1.92 1.08 2.88.24.96.36 1.92.36 2.88 0 .96-.12 1.92-.36 2.88-.24.96-.6 1.92-1.08 2.88-.48.96-1.08 1.8-1.8 2.52-.72.72-1.56 1.32-2.52 1.8-.96.48-1.92.84-2.88 1.08-.96.24-1.92.36-2.88.36s-1.92-.12-2.88-.36c-.96-.24-1.92-.6-2.88-1.08-.96-.48-1.8-1.08-2.52-1.8-.72-.72-1.32-1.56-1.8-2.52-.48-.96-.84-1.92-1.08-2.88-.24-.96-.36-1.92-.36-2.88 0-.96.12-1.92.36-2.88.24-.96.6-1.92 1.08-2.88.48-.96 1.08-1.8 1.8-2.52.72-.72 1.56-1.32 2.52-1.8.96-.48 1.92-.84 2.88-1.08.96-.24 1.92-.36 2.88-.36s1.92.12 2.88.36c.96.24 1.92.6 2.88 1.08.96.48 1.8 1.08 2.52 1.8.72.72 1.32 1.56 1.8 2.52z" />
    </svg>
  );
}

export function HeroSection() {
  const root = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const logo = logoRef.current;
    const section = root.current;
    if (!logo || !section) return;

    if (reducedMotion) {
      gsap.set(logo, { opacity: 1, y: 0, scale: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from(logo, {
        opacity: 0,
        y: 40,
        scale: 0.96,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.2,
      });

      gsap.to(logo, {
        y: -24,
        scale: 0.92,
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={root}
      id="inicio"
      className="relative min-h-[75dvh] overflow-hidden bg-black"
    >
      <div className="hero-video-wrap pointer-events-none absolute inset-0">
        {/* Fumaça */}
        {([
          { w: 520, h: 420, l: "8%",   t: "55%", blur: 90,  dur: "13s", delay: "0s"   },
          { w: 400, h: 360, l: "45%",  t: "60%", blur: 110, dur: "17s", delay: "4s"   },
          { w: 580, h: 480, l: "68%",  t: "45%", blur: 95,  dur: "20s", delay: "8s"   },
          { w: 360, h: 300, l: "25%",  t: "65%", blur: 75,  dur: "15s", delay: "2s"   },
          { w: 440, h: 380, l: "-4%",  t: "50%", blur: 100, dur: "18s", delay: "10s"  },
        ] as const).map((p, i) => (
          <div
            key={i}
            className="sensi-smoke-puff"
            style={{
              width: p.w,
              height: p.h,
              left: p.l,
              top: p.t,
              filter: `blur(${p.blur}px)`,
              ["--smoke-dur" as string]: p.dur,
              animationDelay: p.delay,
            }}
          />
        ))}

        <Image
          src="/logo-sensi.png"
          alt=""
          fill
          className="object-contain sensi-hero-logo"
          sizes="100vw"
          priority
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/90" />
      </div>

      <header className="relative z-20 flex items-start justify-between px-4 pt-4 md:px-8 md:pt-6">
        <nav
          className="flex gap-4 text-muted"
          aria-label="Redes sociais"
        >
          {socialLinks.map((s) => (
            <a
              key={s.name}
              href={s.href}
              className="transition-colors hover:text-accent"
              aria-label={s.name}
              target="_blank"
              rel="noopener noreferrer"
            >
              <SocialIcon name={s.name} />
            </a>
          ))}
        </nav>

        <div className="flex max-w-[140px] flex-col gap-2 rounded-2xl border border-white/10 bg-black/40 p-3 backdrop-blur-md md:max-w-[180px]">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl">
            <Image
              src={heroSpotlight.image}
              alt={heroSpotlight.name}
              fill
              className="object-cover"
              sizes="180px"
            />
          </div>
          <div>
            <p className="font-display text-lg leading-none text-accent">
              {heroSpotlight.name}
            </p>
            <p className="mt-1 text-xs text-muted">{heroSpotlight.role}</p>
          </div>
        </div>
      </header>

      <aside className="pointer-events-none fixed left-0 top-1/2 z-30 hidden -translate-y-1/2 md:pointer-events-auto md:block md:pl-6">
        <nav
          className="flex flex-col gap-2"
          aria-label="Seções"
        >
          {navPills.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="rounded-full border border-white/15 bg-black/50 px-4 py-2 text-xs font-medium uppercase tracking-wider text-fg/90 backdrop-blur-sm transition hover:border-accent/50 hover:text-accent"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </aside>

      <div
        ref={logoRef}
        className="relative z-10 flex min-h-[40dvh] flex-col items-center justify-end pb-12 pt-24 md:min-h-[45dvh] md:pb-16"
      >
        <p className="mb-2 text-center text-[10px] uppercase tracking-[0.4em] text-muted">
          {heroTagline} · Gravadora
        </p>
        <h1 className="font-display text-center text-5xl leading-[0.9] text-accent drop-shadow-[0_0_40px_rgba(200,242,74,0.25)] sm:text-7xl md:text-8xl lg:text-9xl">
          SENSIMILLA
        </h1>
        <p className="font-display mt-2 text-2xl tracking-[0.35em] text-fg/80 md:text-3xl">
          RECORDS
        </p>
      </div>

      <nav
        className="relative z-20 flex gap-2 overflow-x-auto px-4 pb-6 md:hidden"
        aria-label="Seções"
      >
        {navPills.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className="shrink-0 rounded-full border border-white/15 bg-black/60 px-3 py-2 text-[10px] font-medium uppercase tracking-wider text-fg/90 backdrop-blur-sm"
          >
            {item.label}
          </a>
        ))}
      </nav>
    </section>
  );
}

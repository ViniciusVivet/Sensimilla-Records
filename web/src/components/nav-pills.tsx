"use client";

import { useState, useEffect, useRef } from "react";
import { navPills } from "@/data/site";

export function NavPills() {
  const [activeId, setActiveId] = useState<string>("inicio");
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const activeRef = useRef<HTMLAnchorElement | null>(null);
  const [underline, setUnderline] = useState({ left: 0, width: 0 });

  // Detect which section is in view
  useEffect(() => {
    const ids = navPills.map((p) => p.href.replace("#", ""));
    const ratios = new Map<string, number>(ids.map((id) => [id, 0]));

    const pick = () => {
      let best = "inicio";
      let max = -1;
      ratios.forEach((r, id) => {
        if (r > max) { max = r; best = id; }
      });
      setActiveId(best);
    };

    const observers = ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { ratios.set(id, entry.intersectionRatio); pick(); },
        { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] },
      );
      obs.observe(el);
      return obs;
    });

    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  // Show bg after scrolling past hero
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track underline position
  useEffect(() => {
    const el = activeRef.current;
    const nav = navRef.current;
    if (!el || !nav) return;
    const navRect = nav.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    setUnderline({
      left: elRect.left - navRect.left,
      width: elRect.width,
    });
  }, [activeId]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-bg/70 shadow-[0_1px_20px_rgba(0,0,0,0.3)] backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav
        ref={navRef}
        className="scrollbar-hide relative mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-4 py-3 md:justify-center md:gap-2 md:px-6"
        aria-label="Seções"
      >
        {navPills.map((item) => {
          const id = item.href.replace("#", "");
          const active = activeId === id;
          return (
            <a
              key={item.id}
              ref={active ? (el) => { activeRef.current = el; } : undefined}
              href={item.href}
              className={`relative shrink-0 px-3 py-2 text-[11px] font-medium uppercase tracking-wider transition-colors duration-300 md:px-4 ${
                active
                  ? "text-accent"
                  : "text-fg/40 hover:text-fg/70"
              }`}
            >
              {item.label}
            </a>
          );
        })}

        {/* Underline animado */}
        <span
          className="pointer-events-none absolute bottom-1.5 h-[2px] rounded-full bg-accent transition-all duration-300 ease-out"
          style={{
            left: underline.left,
            width: underline.width,
          }}
        />
      </nav>
    </header>
  );
}

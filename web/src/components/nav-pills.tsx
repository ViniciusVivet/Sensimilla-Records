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

  // Track underline position relative to nav
  useEffect(() => {
    const el = activeRef.current;
    const nav = navRef.current;
    if (!el || !nav) return;

    const update = () => {
      const navRect = nav.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      setUnderline({
        left: elRect.left - navRect.left + nav.scrollLeft,
        width: elRect.width,
      });
    };

    update();

    // Recalculate when nav scrolls (mobile swipe)
    nav.addEventListener("scroll", update, { passive: true });
    return () => nav.removeEventListener("scroll", update);
  }, [activeId]);

  // Auto-scroll active pill into view on mobile
  useEffect(() => {
    const el = activeRef.current;
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [activeId]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top,0px)] transition-all duration-500 ${
        scrolled
          ? "bg-bg/80 shadow-[0_1px_20px_rgba(0,0,0,0.4)] backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="flex items-center">
        {/* Nav — full width no mobile, centered no desktop */}
        <nav
          ref={navRef}
          className="scrollbar-hide relative flex flex-1 items-center gap-0.5 overflow-x-auto px-[max(0.75rem,env(safe-area-inset-left,0px))] py-2.5 md:justify-center md:gap-1 md:px-6 md:py-3"
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
                className={`relative shrink-0 rounded-md px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-wider transition-colors duration-300 md:px-3.5 md:py-2 md:text-[11px] ${
                  active
                    ? "text-accent"
                    : "text-fg/35 hover:text-fg/70"
                }`}
              >
                {item.label}
              </a>
            );
          })}

          {/* Underline animado */}
          <span
            className="pointer-events-none absolute bottom-1 h-[2px] rounded-full bg-accent transition-all duration-300 ease-out md:bottom-1.5"
            style={{ left: underline.left, width: underline.width }}
          />
        </nav>

        {/* Botao Servicos — so desktop, aparece ao scrollar */}
        <a
          href="/servicos"
          className={`cta-glow mr-4 hidden shrink-0 rounded-full bg-accent px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-bg transition-all duration-300 hover:bg-fg md:inline-flex ${
            scrolled ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
          }`}
        >
          Serviços
        </a>
      </div>
    </header>
  );
}

"use client";

import { useState, useEffect } from "react";
import { navPills } from "@/data/site";

export function NavPills() {
  const [activeId, setActiveId] = useState<string>("inicio");

  useEffect(() => {
    const ids = navPills.map((p) => p.href.replace("#", ""));
    const ratios = new Map<string, number>(ids.map((id) => [id, 0]));

    const pick = () => {
      let best = "inicio";
      let max = -1;
      ratios.forEach((r, id) => { if (r > max) { max = r; best = id; } });
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

  return (
    <aside className="pointer-events-none fixed left-0 top-1/2 z-30 hidden -translate-y-1/2 md:pointer-events-auto md:block md:pl-6">
      <nav className="flex flex-col gap-2" aria-label="Seções">
        {navPills.map((item) => {
          const id = item.href.replace("#", "");
          const active = activeId === id;
          return (
            <a
              key={item.id}
              href={item.href}
              className={`rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-wider backdrop-blur-sm transition-all duration-300 ${
                active
                  ? "border-white/50 bg-white/15 text-white shadow-[0_0_12px_rgba(255,255,255,0.08)]"
                  : "border-white/15 bg-black/50 text-fg/50 hover:border-accent/50 hover:text-accent"
              }`}
            >
              {item.label}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}

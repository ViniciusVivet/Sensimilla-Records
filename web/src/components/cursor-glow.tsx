"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/components/reduced-motion-provider";

export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    // Only on pointer:fine (desktop with mouse)
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const el = ref.current;
    if (!el) return;

    el.style.opacity = "1";

    let x = -200;
    let y = -200;
    let cx = -200;
    let cy = -200;
    let raf: number;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
    };

    const tick = () => {
      cx += (x - cx) * 0.12;
      cy += (y - cy) * 0.12;
      el.style.transform = `translate(${cx - 200}px, ${cy - 200}px)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9998] hidden h-[400px] w-[400px] rounded-full opacity-0 transition-opacity duration-700 md:block"
      style={{
        background:
          "radial-gradient(circle, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 30%, transparent 70%)",
        willChange: "transform",
      }}
    />
  );
}

"use client";

import { useRef, useCallback, useEffect, useState, type ReactNode, type PointerEvent } from "react";

export function Magnetic({
  children,
  className = "",
  strength = 0.3,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isFine, setIsFine] = useState(false);

  useEffect(() => {
    setIsFine(window.matchMedia("(pointer: fine)").matches);
  }, []);

  const onMove = useCallback(
    (e: PointerEvent) => {
      if (!isFine) return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * strength;
      const y = (e.clientY - rect.top - rect.height / 2) * strength;
      el.style.transform = `translate(${x}px, ${y}px)`;
    },
    [strength, isFine],
  );

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (el) el.style.transform = "";
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ transition: "transform 0.25s cubic-bezier(0.23, 1, 0.32, 1)", display: "inline-flex" }}
    >
      {children}
    </div>
  );
}

"use client";

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/components/reduced-motion-provider";

gsap.registerPlugin(ScrollTrigger);

/* Detailed bat silhouette SVG */
function BatSvg({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 100"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d="M100 45c-2-8-8-18-18-25-6-4-14-7-22-8 4 5 6 12 5 19-1 4-3 7-6 9 -8-14-20-24-34-28-8-2-17-2-25 1 10 6 18 16 22 28 2 5 3 11 2 16 -4-3-9-5-14-5 -3 0-6 1-8 3 8 3 14 9 18 17 3 5 4 11 4 17l2-1c4-3 9-5 14-6 6-1 12-1 17 1 5 2 10 4 14 6l1 0c5-2 10-4 15-6 5-2 11-2 17-1 5 1 10 3 14 6l2 1c0-6 1-12 4-17 4-8 10-14 18-17 -2-2-5-3-8-3 -5 0-10 2-14 5 -1-5 0-11 2-16 4-12 12-22 22-28 -8-3-17-3-25-1 -14 4-26 14-34 28 -3-2-5-5-6-9 -1-7 1-14 5-19 -8 1-16 4-22 8-10 7-16 17-18 25z" />
    </svg>
  );
}

const bats = [
  // Left side bats
  { id: "l1", side: "left" as const, x: -8, startY: 5, size: 90, rotation: -15, delay: 0 },
  { id: "l2", side: "left" as const, x: 2, startY: 18, size: 55, rotation: 10, delay: 0.08 },
  { id: "l3", side: "left" as const, x: -5, startY: 35, size: 70, rotation: -8, delay: 0.15 },
  // Right side bats
  { id: "r1", side: "right" as const, x: -8, startY: 8, size: 85, rotation: 12, delay: 0.04 },
  { id: "r2", side: "right" as const, x: 0, startY: 22, size: 50, rotation: -18, delay: 0.1 },
  { id: "r3", side: "right" as const, x: -3, startY: 40, size: 65, rotation: 5, delay: 0.18 },
];

export function ScrollBats() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (reducedMotion) return;
    const container = containerRef.current;
    if (!container) return;

    const batEls = container.querySelectorAll<HTMLElement>("[data-bat]");
    if (!batEls.length) return;

    const ctx = gsap.context(() => {
      batEls.forEach((el) => {
        const speed = parseFloat(el.dataset.batSpeed || "1");
        const wobble = parseFloat(el.dataset.batWobble || "0");

        gsap.to(el, {
          y: `+=${60 + speed * 40}`,
          x: `+=${wobble}`,
          rotation: `+=${wobble * 0.5}`,
          opacity: 0,
          ease: "power1.in",
          scrollTrigger: {
            trigger: "#inicio",
            start: "top top",
            endTrigger: "#manifesto",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      });
    }, container);

    return () => ctx.revert();
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[45] hidden overflow-hidden lg:block"
    >
      {bats.map((bat) => (
        <div
          key={bat.id}
          data-bat
          data-bat-speed={0.5 + Math.random()}
          data-bat-wobble={bat.side === "left" ? 15 + Math.random() * 20 : -(15 + Math.random() * 20)}
          className="absolute text-white/[0.04]"
          style={{
            [bat.side]: `${bat.x}%`,
            top: `${bat.startY}%`,
            width: bat.size,
            transform: `rotate(${bat.rotation}deg) ${bat.side === "right" ? "scaleX(-1)" : ""}`,
          }}
        >
          <BatSvg />
        </div>
      ))}
    </div>
  );
}

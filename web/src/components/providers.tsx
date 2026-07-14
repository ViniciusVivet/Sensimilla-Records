"use client";
import { ReducedMotionProvider } from "@/components/reduced-motion-provider";
import { CursorGlow } from "@/components/cursor-glow";
import type { ReactNode } from "react";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ReducedMotionProvider>
      <CursorGlow />
      {children}
    </ReducedMotionProvider>
  );
}

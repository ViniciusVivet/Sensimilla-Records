"use client";

import { ReducedMotionProvider } from "@/components/reduced-motion-provider";
import { MiniPlayerProvider } from "@/components/mini-player-context";
import { MiniPlayer } from "@/components/mini-player";
import type { ReactNode } from "react";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ReducedMotionProvider>
      <MiniPlayerProvider>
        {children}
        <MiniPlayer />
      </MiniPlayerProvider>
    </ReducedMotionProvider>
  );
}

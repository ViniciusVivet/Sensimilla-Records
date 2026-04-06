"use client";

import { useEffect } from "react";
import { ReducedMotionProvider } from "@/components/reduced-motion-provider";
import { MiniPlayerProvider, useMiniPlayer } from "@/components/mini-player-context";
import { MiniPlayer } from "@/components/mini-player";
import type { ReactNode } from "react";

function AutoplayOnMount() {
  const { open } = useMiniPlayer();
  useEffect(() => {
    open(1);
  }, [open]);
  return null;
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ReducedMotionProvider>
      <MiniPlayerProvider>
        <AutoplayOnMount />
        {children}
        <MiniPlayer />
      </MiniPlayerProvider>
    </ReducedMotionProvider>
  );
}

"use client";
import { ReducedMotionProvider } from "@/components/reduced-motion-provider";
import type { ReactNode } from "react";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ReducedMotionProvider>
      {children}
    </ReducedMotionProvider>
  );
}

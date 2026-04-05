"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { catalogReleases } from "@/data/site";

export type PlayerTrack = (typeof catalogReleases)[number];

type MiniPlayerCtx = {
  currentTrack: PlayerTrack | null;
  currentIndex: number | null;
  open: (index: number) => void;
  close: () => void;
  next: () => void;
  prev: () => void;
};

const Ctx = createContext<MiniPlayerCtx | null>(null);

export function MiniPlayerProvider({ children }: { children: ReactNode }) {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const open = useCallback((i: number) => setCurrentIndex(i), []);
  const close = useCallback(() => setCurrentIndex(null), []);
  const next = useCallback(
    () =>
      setCurrentIndex((i) =>
        i !== null ? (i + 1) % catalogReleases.length : 0,
      ),
    [],
  );
  const prev = useCallback(
    () =>
      setCurrentIndex((i) =>
        i !== null
          ? (i - 1 + catalogReleases.length) % catalogReleases.length
          : catalogReleases.length - 1,
      ),
    [],
  );

  return (
    <Ctx.Provider
      value={{
        currentTrack: currentIndex !== null ? catalogReleases[currentIndex] : null,
        currentIndex,
        open,
        close,
        next,
        prev,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useMiniPlayer() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useMiniPlayer must be used within MiniPlayerProvider");
  return ctx;
}

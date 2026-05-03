"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { catalogReleases } from "@/data/site";
import type { CmsRelease } from "@/lib/cms-types";

export type PlayerTrack = CmsRelease;

type MiniPlayerCtx = {
  currentTrack: PlayerTrack | null;
  currentIndex: number | null;
  open: (index: number) => void;
  close: () => void;
  next: () => void;
  prev: () => void;
};

const Ctx = createContext<MiniPlayerCtx | null>(null);

export function MiniPlayerProvider({
  children,
  tracks = catalogReleases,
}: {
  children: ReactNode;
  tracks?: PlayerTrack[];
}) {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const safeTracks = tracks.length ? tracks : catalogReleases;

  const open = useCallback(
    (i: number) => setCurrentIndex(Math.max(0, Math.min(i, safeTracks.length - 1))),
    [safeTracks.length],
  );
  const close = useCallback(() => setCurrentIndex(null), []);
  const next = useCallback(
    () =>
      setCurrentIndex((i) =>
        i !== null ? (i + 1) % safeTracks.length : 0,
      ),
    [safeTracks.length],
  );
  const prev = useCallback(
    () =>
      setCurrentIndex((i) =>
        i !== null
          ? (i - 1 + safeTracks.length) % safeTracks.length
          : safeTracks.length - 1,
      ),
    [safeTracks.length],
  );

  return (
    <Ctx.Provider
      value={{
        currentTrack: currentIndex !== null ? safeTracks[currentIndex] : null,
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

"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useMiniPlayer } from "@/components/mini-player-context";

type Corner = "tl" | "tr" | "bl" | "br";

const cornerStyle: Record<Corner, React.CSSProperties> = {
  tl: { top: 20, left: 20 },
  tr: { top: 20, right: 20 },
  bl: { bottom: 88, left: 20 },
  br: { bottom: 88, right: 20 },
};

function snapCorner(clientX: number, clientY: number): Corner {
  const midX = window.innerWidth / 2;
  const midY = window.innerHeight / 2;
  if (clientX < midX && clientY < midY) return "tl";
  if (clientX >= midX && clientY < midY) return "tr";
  if (clientX < midX) return "bl";
  return "br";
}

export function MiniPlayer() {
  const { currentTrack, close, next, prev } = useMiniPlayer();
  const [corner, setCorner] = useState<Corner>("br");
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const [expanded, setExpanded] = useState(false);
  const isDragging = useRef(false);
  const startRef = useRef<{ mx: number; my: number; ex: number; ey: number } | null>(null);
  const playerRef = useRef<HTMLDivElement>(null);

  const startDrag = useCallback(
    (clientX: number, clientY: number) => {
      const rect = playerRef.current?.getBoundingClientRect();
      if (!rect) return;
      isDragging.current = true;
      startRef.current = { mx: clientX, my: clientY, ex: rect.left, ey: rect.top };
      setDragPos({ x: rect.left, y: rect.top });
    },
    [],
  );

  const endDrag = useCallback((clientX: number, clientY: number) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    startRef.current = null;
    setDragPos(null);
    setCorner(snapCorner(clientX, clientY));
  }, []);

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!isDragging.current || !startRef.current) return;
      setDragPos({
        x: startRef.current.ex + (e.clientX - startRef.current.mx),
        y: startRef.current.ey + (e.clientY - startRef.current.my),
      });
    }
    function onMouseUp(e: MouseEvent) {
      endDrag(e.clientX, e.clientY);
    }
    function onTouchMove(e: TouchEvent) {
      if (!isDragging.current || !startRef.current) return;
      const t = e.touches[0];
      setDragPos({
        x: startRef.current.ex + (t.clientX - startRef.current.mx),
        y: startRef.current.ey + (t.clientY - startRef.current.my),
      });
    }
    function onTouchEnd(e: TouchEvent) {
      const t = e.changedTouches[0];
      endDrag(t.clientX, t.clientY);
    }
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [endDrag]);

  useEffect(() => {
    if (currentTrack) setExpanded(false);
  }, [currentTrack]);

  if (!currentTrack) return null;

  const posStyle: React.CSSProperties = dragPos
    ? { position: "fixed", left: dragPos.x, top: dragPos.y, right: "auto", bottom: "auto" }
    : { position: "fixed", ...cornerStyle[corner] };

  return (
    <div
      ref={playerRef}
      style={{ ...posStyle, transition: dragPos ? "none" : "all 0.3s cubic-bezier(0.16,1,0.3,1)" }}
      className="z-[120]"
    >
      {expanded ? (
        <div className="w-72 overflow-hidden rounded-2xl border border-white/15 bg-panel shadow-2xl shadow-black/60">
          <div
            className="flex cursor-grab items-center justify-between px-3 py-2 active:cursor-grabbing select-none"
            onMouseDown={(e) => startDrag(e.clientX, e.clientY)}
            onTouchStart={(e) => startDrag(e.touches[0].clientX, e.touches[0].clientY)}
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-fg">{currentTrack.title}</p>
              <p className="truncate text-[10px] text-muted">{currentTrack.artist}</p>
            </div>
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="ml-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs text-muted hover:bg-white/10 hover:text-fg"
              onMouseDown={(e) => e.stopPropagation()}
            >
              ▾
            </button>
          </div>
          <div className="overflow-hidden px-2 pb-2">
            <iframe
              key={currentTrack.spotifyEmbed}
              src={`https://open.spotify.com/embed/${currentTrack.spotifyEmbed}?utm_source=generator&theme=0`}
              width="100%"
              height="152"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="rounded-xl"
              style={{ border: 0, overflow: "hidden" }}
              title={`Spotify — ${currentTrack.title}`}
            />
          </div>
        </div>
      ) : (
        <div
          className="flex cursor-grab items-center gap-2 rounded-full border border-white/15 bg-panel/95 py-2 pl-2 pr-3 shadow-2xl shadow-black/60 backdrop-blur-md active:cursor-grabbing select-none"
          onMouseDown={(e) => startDrag(e.clientX, e.clientY)}
          onTouchStart={(e) => startDrag(e.touches[0].clientX, e.touches[0].clientY)}
        >
          <div
            className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-accent/50"
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="h-full w-full"
              aria-label="Expandir player"
            >
              <Image
                src={currentTrack.cover}
                alt={currentTrack.title}
                fill
                className="object-cover"
                sizes="40px"
              />
            </button>
          </div>

          <div
            className="min-w-0 max-w-[120px]"
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="block w-full text-left"
            >
              <p className="truncate text-xs font-semibold text-fg leading-tight">
                {currentTrack.title}
              </p>
              <p className="truncate text-[10px] text-muted leading-tight">
                {currentTrack.artist}
              </p>
            </button>
          </div>

          <div
            className="flex shrink-0 items-center gap-0.5"
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={prev}
              aria-label="Anterior"
              className="flex h-7 w-7 items-center justify-center rounded-full text-muted transition hover:bg-white/10 hover:text-fg"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Próxima"
              className="flex h-7 w-7 items-center justify-center rounded-full text-muted transition hover:bg-white/10 hover:text-fg"
            >
              ›
            </button>
            <button
              type="button"
              onClick={close}
              aria-label="Fechar"
              className="flex h-6 w-6 items-center justify-center rounded-full text-muted/60 transition hover:bg-red-500/20 hover:text-red-400"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

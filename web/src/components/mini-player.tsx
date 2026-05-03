"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useMiniPlayer } from "@/components/mini-player-context";

type Corner = "bl" | "br";

const cornerStyle: Record<Corner, React.CSSProperties> = {
  bl: {
    bottom: "max(1.5rem, env(safe-area-inset-bottom, 0px))",
    left: "max(1rem, env(safe-area-inset-left, 0px))",
  },
  br: {
    bottom: "max(1.5rem, env(safe-area-inset-bottom, 0px))",
    right: "max(1rem, env(safe-area-inset-right, 0px))",
  },
};

export function MiniPlayer() {
  const { currentTrack, close, next, prev } = useMiniPlayer();
  const [corner, setCorner] = useState<Corner>("br");
  const [minimized, setMinimized] = useState(false);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
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

  const endDrag = useCallback((clientX: number) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    startRef.current = null;
    setDragPos(null);
    setCorner(clientX < window.innerWidth / 2 ? "bl" : "br");
  }, []);

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!isDragging.current || !startRef.current) return;
      setDragPos({
        x: startRef.current.ex + (e.clientX - startRef.current.mx),
        y: startRef.current.ey + (e.clientY - startRef.current.my),
      });
    }
    function onMouseUp(e: MouseEvent) { endDrag(e.clientX); }
    function onTouchMove(e: TouchEvent) {
      if (!isDragging.current || !startRef.current) return;
      const t = e.touches[0];
      setDragPos({
        x: startRef.current.ex + (t.clientX - startRef.current.mx),
        y: startRef.current.ey + (t.clientY - startRef.current.my),
      });
    }
    function onTouchEnd(e: TouchEvent) { endDrag(e.changedTouches[0].clientX); }
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

  if (!currentTrack) return null;

  const posStyle: React.CSSProperties = dragPos
    ? { position: "fixed", left: dragPos.x, top: dragPos.y, right: "auto", bottom: "auto" }
    : { position: "fixed", ...cornerStyle[corner] };

  if (minimized) {
    return (
      <div
        ref={playerRef}
        style={{ ...posStyle, transition: dragPos ? "none" : "all 0.3s cubic-bezier(0.16,1,0.3,1)" }}
        className="z-[120]"
      >
        <div
          className="flex cursor-grab items-center gap-2.5 rounded-full border border-white/15 bg-panel/95 py-1.5 pl-1.5 pr-3 shadow-2xl shadow-black/60 backdrop-blur-md active:cursor-grabbing select-none"
          onMouseDown={(e) => startDrag(e.clientX, e.clientY)}
          onTouchStart={(e) => startDrag(e.touches[0].clientX, e.touches[0].clientY)}
        >
          {/* Capa do album */}
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full ring-2 ring-accent/40">
            <Image
              src={currentTrack.cover}
              alt={currentTrack.title}
              fill
              className="object-cover"
              sizes="36px"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <span className="text-[10px] text-white">♫</span>
            </div>
          </div>

          {/* Info */}
          <div className="min-w-0 max-w-[100px]">
            <p className="truncate text-xs font-semibold text-fg leading-tight">{currentTrack.title}</p>
            <p className="truncate text-[10px] text-muted leading-tight">{currentTrack.artist}</p>
          </div>

          {/* Botões */}
          <div
            className="flex shrink-0 items-center gap-0.5"
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setMinimized(false)}
              aria-label="Expandir player"
              className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-xs text-accent transition hover:bg-accent/15"
            >
              ▴
            </button>
            <button
              type="button"
              onClick={close}
              aria-label="Fechar"
              className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-[10px] text-muted/50 transition hover:bg-red-500/20 hover:text-red-400"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={playerRef}
      style={{ ...posStyle, transition: dragPos ? "none" : "all 0.3s cubic-bezier(0.16,1,0.3,1)" }}
      className="z-[120] w-[calc(100vw-1.25rem)] max-w-[360px] sm:w-[360px]"
    >
      <div className="overflow-hidden rounded-2xl border border-white/15 bg-panel shadow-2xl shadow-black/60">
        <div
          className="flex cursor-grab items-center justify-between px-3 py-1.5 active:cursor-grabbing select-none"
          onMouseDown={(e) => startDrag(e.clientX, e.clientY)}
          onTouchStart={(e) => startDrag(e.touches[0].clientX, e.touches[0].clientY)}
        >
          <div className="flex items-center gap-1" onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={prev}
              aria-label="Anterior"
              className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-xs text-muted transition hover:bg-white/10 hover:text-fg"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Próxima"
              className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-xs text-muted transition hover:bg-white/10 hover:text-fg"
            >
              ›
            </button>
          </div>
          <div className="flex items-center gap-1" onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setMinimized(true)}
              aria-label="Minimizar player"
              className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-xs text-muted transition hover:bg-white/10 hover:text-fg"
            >
              ▾
            </button>
            <button
              type="button"
              onClick={close}
              aria-label="Fechar player"
              className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-xs text-muted/60 transition hover:bg-red-500/20 hover:text-red-400"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="px-2 pb-2">
          <iframe
            key={currentTrack.spotifyEmbed}
            src={`https://open.spotify.com/embed/${currentTrack.spotifyEmbed}?utm_source=generator&theme=0`}
            width="100%"
            height="152"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="rounded-xl"
            style={{ border: 0 }}
            title={`Spotify — ${currentTrack.title}`}
          />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useMiniPlayer } from "@/components/mini-player-context";

type Corner = "bl" | "br";

const cornerStyle: Record<Corner, React.CSSProperties> = {
  bl: { bottom: 24, left: 20 },
  br: { bottom: 24, right: 20 },
};

export function MiniPlayer() {
  const { currentTrack, close, next, prev } = useMiniPlayer();
  const [corner, setCorner] = useState<Corner>("br");
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

  return (
    <div
      ref={playerRef}
      style={{ ...posStyle, transition: dragPos ? "none" : "all 0.3s cubic-bezier(0.16,1,0.3,1)" }}
      className="z-[120] w-[320px] sm:w-[360px]"
    >
      <div className="overflow-hidden rounded-2xl border border-white/15 bg-panel shadow-2xl shadow-black/60">
        {/* Barra de controle */}
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
              className="flex h-6 w-6 items-center justify-center rounded-full text-xs text-muted transition hover:bg-white/10 hover:text-fg"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Próxima"
              className="flex h-6 w-6 items-center justify-center rounded-full text-xs text-muted transition hover:bg-white/10 hover:text-fg"
            >
              ›
            </button>
          </div>
          <span className="text-[10px] uppercase tracking-widest text-muted/50 select-none">
            arraste
          </span>
          <button
            type="button"
            onClick={close}
            aria-label="Fechar player"
            className="flex h-6 w-6 items-center justify-center rounded-full text-xs text-muted/60 transition hover:bg-red-500/20 hover:text-red-400"
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            ✕
          </button>
        </div>

        {/* Embed Spotify — o próprio player com play/pause nativo */}
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

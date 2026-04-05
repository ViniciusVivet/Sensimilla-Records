"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useMiniPlayer } from "@/components/mini-player-context";

type Corner = "tl" | "tr" | "bl" | "br";

const cornerStyle: Record<Corner, React.CSSProperties> = {
  tl: { top: 16, left: 16 },
  tr: { top: 16, right: 16 },
  bl: { bottom: 80, left: 16 },
  br: { bottom: 80, right: 16 },
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

  if (!currentTrack) return null;

  const posStyle: React.CSSProperties = dragPos
    ? { position: "fixed", left: dragPos.x, top: dragPos.y, right: "auto", bottom: "auto" }
    : { position: "fixed", ...cornerStyle[corner] };

  return (
    <div
      ref={playerRef}
      style={posStyle}
      className="z-[120] w-72 rounded-2xl border border-white/15 bg-panel/95 shadow-2xl shadow-black/70 backdrop-blur-md"
    >
      {/* Barra de arraste + info + controles */}
      <div
        className="flex cursor-grab items-center gap-2 px-3 py-2 active:cursor-grabbing select-none"
        onMouseDown={(e) => startDrag(e.clientX, e.clientY)}
        onTouchStart={(e) => {
          const t = e.touches[0];
          startDrag(t.clientX, t.clientY);
        }}
      >
        {/* Capa */}
        <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg">
          <Image
            src={currentTrack.cover}
            alt={currentTrack.title}
            fill
            className="object-cover"
            sizes="32px"
          />
        </div>

        {/* Título + artista */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-fg leading-tight">
            {currentTrack.title}
          </p>
          <p className="truncate text-[10px] text-muted leading-tight">
            {currentTrack.artist}
          </p>
        </div>

        {/* Botões */}
        <div
          className="flex shrink-0 items-center gap-0.5"
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={prev}
            aria-label="Faixa anterior"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted transition hover:bg-white/10 hover:text-fg"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Próxima faixa"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted transition hover:bg-white/10 hover:text-fg"
          >
            ›
          </button>
          <button
            type="button"
            onClick={close}
            aria-label="Fechar player"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted transition hover:bg-red-500/20 hover:text-red-400"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Embed Spotify */}
      <div className="px-2 pb-2">
        <iframe
          key={currentTrack.spotifyEmbed}
          src={`https://open.spotify.com/embed/${currentTrack.spotifyEmbed}?utm_source=generator&theme=0`}
          width="100%"
          height="80"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="rounded-xl"
          title={`Spotify — ${currentTrack.title}`}
        />
      </div>
    </div>
  );
}

"use client";

import { useRef, useMemo, useState, useCallback, useEffect, type PointerEvent as RPointerEvent } from "react";
import Image from "next/image";
import { roster, type Member } from "@/data/site";
import { useReducedMotion } from "@/components/reduced-motion-provider";

function useTilt(ref: React.RefObject<HTMLElement | null>) {
  const isFine = useRef(false);
  useEffect(() => {
    isFine.current = window.matchMedia("(pointer: fine)").matches;
  }, []);

  const onMove = useCallback(
    (e: RPointerEvent) => {
      if (!isFine.current) return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(600px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg) scale(1.02)`;
    },
    [ref],
  );
  const onLeave = useCallback(() => {
    const el = ref.current;
    if (el) el.style.transform = "";
  }, [ref]);
  return { onMove, onLeave };
}

function MemberModal({
  member,
  members,
  onClose,
  onNavigate,
}: {
  member: Member;
  members: Member[];
  onClose: () => void;
  onNavigate: (member: Member) => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const index = Math.max(0, members.findIndex((m) => m.id === member.id));
  const len = members.length;

  useEffect(() => {
    rootRef.current?.focus({ preventScroll: true });
  }, [member.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); onClose(); return; }
      if (e.key === "ArrowLeft" && len > 1) { e.preventDefault(); onNavigate(members[(index - 1 + len) % len]); return; }
      if (e.key === "ArrowRight" && len > 1) { e.preventDefault(); onNavigate(members[(index + 1) % len]); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [member.id, index, len, members, onClose, onNavigate]);

  const go = (delta: number) => {
    if (len <= 1) return;
    onNavigate(members[(index + delta + len) % len]);
  };

  return (
    <div
      ref={rootRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="false"
      aria-labelledby="member-modal-title"
      className="absolute inset-0 z-20 overflow-y-auto overscroll-y-contain bg-black/90 backdrop-blur-md outline-none"
      onClick={onClose}
    >
      <div
        className="flex min-h-full w-full items-center justify-center px-3 py-[max(4rem,env(safe-area-inset-top))] pb-[max(4rem,env(safe-area-inset-bottom))] md:px-6 md:py-20"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-black/55 p-6 shadow-2xl md:p-10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-start gap-3">
              {len > 1 && (
                <button type="button" aria-label="Artista anterior" onClick={() => go(-1)}
                  className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-lg text-white/70 transition hover:border-accent/50 hover:text-accent">
                  ‹
                </button>
              )}
              <div className="flex min-w-0 flex-1 items-end gap-4 md:gap-5">
                {member.image && (
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-2xl shadow-lg md:h-32 md:w-24">
                    <Image src={member.image} alt="" fill className="object-cover" sizes="96px" />
                  </div>
                )}
                <div className="min-w-0">
                  <h3 id="member-modal-title" className="font-display text-3xl text-white md:text-5xl">{member.name}</h3>
                  {member.role && <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-white/40">{member.role}</p>}
                </div>
              </div>
              {len > 1 && (
                <button type="button" aria-label="Proximo artista" onClick={() => go(1)}
                  className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-lg text-white/70 transition hover:border-accent/50 hover:text-accent">
                  ›
                </button>
              )}
            </div>
            <button type="button" onClick={onClose} aria-label="Fechar"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-sm text-white/50 transition hover:border-white/40 hover:text-white">
              ✕
            </button>
          </div>

          {member.bio && <p className="mt-6 text-sm leading-relaxed text-white/75 md:text-base">{member.bio}</p>}

          {member.youtubeVideoId && (
            <div key={member.id} className="mt-6 overflow-hidden rounded-2xl" style={{ paddingBottom: "56.25%", position: "relative" }}>
              <iframe
                src={`https://www.youtube.com/embed/${member.youtubeVideoId}?autoplay=1&rel=0`}
                title={`${member.name} no YouTube`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen className="absolute inset-0 h-full w-full border-0" loading="lazy"
              />
            </div>
          )}

          {(member.spotifyUrl || member.instagramUrl || member.youtubeUrl) && (
            <div className="mt-6 flex flex-wrap gap-3">
              {member.spotifyUrl && (
                <a href={member.spotifyUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2.5 rounded-2xl bg-[#1DB954]/15 px-5 py-3 text-sm font-semibold text-[#1DB954] ring-1 ring-[#1DB954]/30 transition hover:bg-[#1DB954]/25 hover:ring-[#1DB954]/60">
                  <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
                  Spotify
                </a>
              )}
              {member.instagramUrl && (
                <a href={member.instagramUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2.5 rounded-2xl bg-gradient-to-br from-[#833ab4]/15 via-[#fd1d1d]/10 to-[#fcb045]/10 px-5 py-3 text-sm font-semibold text-[#f77737] ring-1 ring-[#f77737]/25 transition hover:ring-[#f77737]/50 hover:from-[#833ab4]/25 hover:to-[#fcb045]/20">
                  <svg className="h-4 w-4 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24" aria-hidden><rect x="3" y="3" width="18" height="18" rx="5" strokeWidth="1.8"/><circle cx="12" cy="12" r="4" strokeWidth="1.8"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
                  Instagram
                </a>
              )}
              {member.youtubeUrl && (
                <a href={member.youtubeUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2.5 rounded-2xl bg-[#FF0000]/10 px-5 py-3 text-sm font-semibold text-[#FF4444] ring-1 ring-[#FF0000]/25 transition hover:bg-[#FF0000]/20 hover:ring-[#FF0000]/50">
                  <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  YouTube
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MemberCard({
  member,
  isFeatured,
  onPointerUp,
}: {
  member: Member;
  isFeatured: boolean;
  onPointerUp: () => void;
}) {
  const cardRef = useRef<HTMLElement>(null);
  const { onMove, onLeave } = useTilt(cardRef);

  return (
    <article
      ref={cardRef}
      className={`group relative shrink-0 overflow-hidden rounded-2xl border cursor-pointer select-none ${
        isFeatured ? "border-accent/40 ring-1 ring-accent/30" : "border-white/10"
      }`}
      style={{ width: "min(280px, 72vw)", transition: "transform 0.15s ease-out, border-color 0.5s" }}
      onPointerUp={onPointerUp}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        {member.image ? (
          <Image src={member.image} alt={member.name} fill
            className="pointer-events-none object-cover transition duration-700 group-hover:scale-[1.03]"
            sizes="280px" draggable={false} />
        ) : (
          <div className="flex h-full min-h-[240px] flex-col items-center justify-center bg-gradient-to-br from-bg/10 via-bg/5 to-accent/20">
            <span className="font-display text-5xl text-fg/25 md:text-6xl">?</span>
            <span className="mt-2 text-xs uppercase tracking-[0.25em] text-fg/40">Em breve</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 space-y-1.5 p-3 md:p-4">
        <div>
          <h3 className="font-display text-xl text-white md:text-2xl">{member.name}</h3>
          {member.role && <p className="mt-0.5 text-[10px] uppercase tracking-wider text-white/60 line-clamp-1">{member.role}</p>}
          {member.bio && <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-white/50 md:line-clamp-3">{member.bio}</p>}
        </div>
      </div>
    </article>
  );
}

/** Pixels per second — auto-scroll speed */
const SPEED = 50;
/** Min drag distance (px) to count as drag, not tap */
const DRAG_THRESHOLD = 8;

export function RosterSection({ members = roster.members }: { members?: Member[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const hadModalOpenRef = useRef(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const reducedMotion = useReducedMotion();
  const items = members.length ? members : roster.members;

  const featuredIndex = useMemo(() => {
    const i = items.findIndex((m) => m.id === roster.featuredMemberId);
    return i >= 0 ? i : 0;
  }, [items]);

  // Duplicate for seamless loop
  const loopItems = useMemo(() => [...items, ...items], [items]);

  // --- Continuous scroll engine ---
  const offsetRef = useRef(0);
  const halfWidth = useRef(0);
  const pausedRef = useRef(false);
  const dragState = useRef({ active: false, startX: 0, startOffset: 0, moved: false });

  // Measure half-width (one set of items)
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => { halfWidth.current = track.scrollWidth / 2; };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [items]);

  // Animation loop
  useEffect(() => {
    if (reducedMotion) return;
    let prev = performance.now();
    let raf: number;

    const tick = (now: number) => {
      const dt = (now - prev) / 1000;
      prev = now;

      if (!pausedRef.current && !dragState.current.active && !selectedMember) {
        offsetRef.current -= SPEED * dt;
      }

      // Wrap around
      const hw = halfWidth.current;
      if (hw > 0) {
        if (offsetRef.current <= -hw) offsetRef.current += hw;
        if (offsetRef.current > 0) offsetRef.current -= hw;
      }

      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(${offsetRef.current}px)`;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion, selectedMember]);

  // --- Touch / pointer drag ---
  const onDragStart = useCallback((clientX: number) => {
    dragState.current = { active: true, startX: clientX, startOffset: offsetRef.current, moved: false };
  }, []);

  const onDragMove = useCallback((clientX: number) => {
    const ds = dragState.current;
    if (!ds.active) return;
    const delta = clientX - ds.startX;
    if (Math.abs(delta) > DRAG_THRESHOLD) ds.moved = true;
    offsetRef.current = ds.startOffset + delta;
  }, []);

  const onDragEnd = useCallback(() => {
    dragState.current.active = false;
  }, []);

  // Pointer events (works for both touch and mouse)
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    onDragStart(e.clientX);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, [onDragStart]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    onDragMove(e.clientX);
  }, [onDragMove]);

  const handlePointerUp = useCallback(() => {
    onDragEnd();
  }, [onDragEnd]);

  // Card click — only if not dragged
  const handleCardTap = useCallback((member: Member) => {
    if (dragState.current.moved) return;
    setSelectedMember(member);
  }, []);

  // Modal scroll-into-view
  useEffect(() => {
    if (!selectedMember) {
      hadModalOpenRef.current = false;
      return;
    }
    const openedFromClosed = !hadModalOpenRef.current;
    hadModalOpenRef.current = true;
    if (openedFromClosed) {
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [selectedMember]);

  // Desktop hover pause
  const onMouseEnter = useCallback(() => { pausedRef.current = true; }, []);
  const onMouseLeave = useCallback(() => { pausedRef.current = false; }, []);

  return (
    <section
      ref={sectionRef}
      id="equipe"
      className="relative bg-panel pb-20 pt-14 text-fg md:pb-28 md:pt-20"
    >
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-sage to-panel" />
      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
        <p className="text-xs uppercase tracking-[0.3em] text-muted">{roster.eyebrow}</p>
        <h2 className="font-display mt-3 max-w-3xl text-4xl md:text-6xl">{roster.title}</h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
          Quem está por trás dos lançamentos, do som e da cena.
        </p>
      </div>

      {/* Carrossel infinito */}
      <div
        className="relative z-10 mt-10 overflow-hidden md:mt-12 touch-pan-y"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ cursor: "grab" }}
      >
        {/* Fade nas bordas */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-panel to-transparent md:w-24" />
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-panel to-transparent md:w-24" />

        <div
          ref={trackRef}
          className="flex gap-4 pb-4 will-change-transform"
          style={{ width: "max-content" }}
        >
          {loopItems.map((a, i) => (
            <MemberCard
              key={`${a.id}-${i}`}
              member={a}
              isFeatured={i % items.length === featuredIndex}
              onPointerUp={() => handleCardTap(a)}
            />
          ))}
        </div>
      </div>

      {selectedMember && (
        <MemberModal
          member={selectedMember}
          members={items}
          onClose={() => setSelectedMember(null)}
          onNavigate={setSelectedMember}
        />
      )}
    </section>
  );
}

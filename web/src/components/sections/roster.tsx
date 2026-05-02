"use client";

import { useRef, useMemo, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { roster, type Member } from "@/data/site";

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
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "ArrowLeft" && len > 1) {
        e.preventDefault();
        onNavigate(members[(index - 1 + len) % len]);
        return;
      }
      if (e.key === "ArrowRight" && len > 1) {
        e.preventDefault();
        onNavigate(members[(index + 1) % len]);
      }
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
                <button
                  type="button"
                  aria-label="Artista anterior"
                  onClick={() => go(-1)}
                  className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-lg text-white/70 transition hover:border-accent/50 hover:text-accent"
                >
                  ‹
                </button>
              )}
              <div className="flex min-w-0 flex-1 items-end gap-4 md:gap-5">
                {member.image && (
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-2xl shadow-lg md:h-32 md:w-24">
                    <Image
                      src={member.image}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <h3
                    id="member-modal-title"
                    className="font-display text-3xl text-white md:text-5xl"
                  >
                    {member.name}
                  </h3>
                  {member.role && (
                    <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-white/40">
                      {member.role}
                    </p>
                  )}
                </div>
              </div>
              {len > 1 && (
                <button
                  type="button"
                  aria-label="Proximo artista"
                  onClick={() => go(1)}
                  className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-lg text-white/70 transition hover:border-accent/50 hover:text-accent"
                >
                  ›
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-sm text-white/50 transition hover:border-white/40 hover:text-white"
            >
              ✕
            </button>
          </div>

          {member.bio && (
            <p className="mt-6 text-sm leading-relaxed text-white/75 md:text-base">
              {member.bio}
            </p>
          )}

          {member.youtubeVideoId && (
            <div
              key={member.id}
              className="mt-6 overflow-hidden rounded-2xl"
              style={{ paddingBottom: "56.25%", position: "relative" }}
            >
              <iframe
                src={`https://www.youtube.com/embed/${member.youtubeVideoId}?autoplay=1&rel=0`}
                title={`${member.name} no YouTube`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
              />
            </div>
          )}

          {(member.spotifyUrl || member.instagramUrl || member.youtubeUrl) && (
            <div className="mt-6 flex flex-wrap gap-3">
              {member.spotifyUrl && (
                <a
                  href={member.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 rounded-2xl bg-[#1DB954]/15 px-5 py-3 text-sm font-semibold text-[#1DB954] ring-1 ring-[#1DB954]/30 transition hover:bg-[#1DB954]/25 hover:ring-[#1DB954]/60"
                >
                  <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                  Spotify
                </a>
              )}
              {member.instagramUrl && (
                <a
                  href={member.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 rounded-2xl bg-gradient-to-br from-[#833ab4]/15 via-[#fd1d1d]/10 to-[#fcb045]/10 px-5 py-3 text-sm font-semibold text-[#f77737] ring-1 ring-[#f77737]/25 transition hover:ring-[#f77737]/50 hover:from-[#833ab4]/25 hover:to-[#fcb045]/20"
                >
                  <svg className="h-4 w-4 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24" aria-hidden>
                    <rect x="3" y="3" width="18" height="18" rx="5" strokeWidth="1.8"/>
                    <circle cx="12" cy="12" r="4" strokeWidth="1.8"/>
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
                  </svg>
                  Instagram
                </a>
              )}
              {member.youtubeUrl && (
                <a
                  href={member.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 rounded-2xl bg-[#FF0000]/10 px-5 py-3 text-sm font-semibold text-[#FF4444] ring-1 ring-[#FF0000]/25 transition hover:bg-[#FF0000]/20 hover:ring-[#FF0000]/50"
                >
                  <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
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

function useDragScroll(ref: React.RefObject<HTMLDivElement | null>) {
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const hasMoved = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onDown = (e: MouseEvent) => {
      isDragging.current = true;
      hasMoved.current = false;
      startX.current = e.pageX - el.offsetLeft;
      scrollLeft.current = el.scrollLeft;
      el.style.cursor = "grabbing";
    };

    const onMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = x - startX.current;
      if (Math.abs(walk) > 5) hasMoved.current = true;
      el.scrollLeft = scrollLeft.current - walk;
    };

    const onUp = () => {
      isDragging.current = false;
      el.style.cursor = "";
    };

    el.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    return () => {
      el.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [ref]);

  return hasMoved;
}

export function RosterSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const hadModalOpenRef = useRef(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const hasDragged = useDragScroll(scrollRef);

  const featuredIndex = useMemo(() => {
    const i = roster.members.findIndex((m) => m.id === roster.featuredMemberId);
    return i >= 0 ? i : 0;
  }, []);

  useEffect(() => {
    if (!selectedMember) {
      hadModalOpenRef.current = false;
      return;
    }
    const openedFromClosed = !hadModalOpenRef.current;
    hadModalOpenRef.current = true;
    if (openedFromClosed) {
      sectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedMember]);

  const scroll = useCallback((dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector("article");
    const step = card ? card.offsetWidth + 16 : 300;
    el.scrollBy({ left: dir === "left" ? -step : step, behavior: "smooth" });
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (selectedMember) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        scroll("left");
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        scroll("right");
      }
    },
    [scroll, selectedMember],
  );

  const handleCardClick = useCallback(
    (member: Member) => {
      if (hasDragged.current) return;
      setSelectedMember(member);
    },
    [hasDragged],
  );

  return (
    <section
      ref={sectionRef}
      id="equipe"
      className="relative bg-panel py-24 text-fg md:py-32"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <p className="text-xs uppercase tracking-[0.3em] text-muted">
          {roster.eyebrow}
        </p>
        <h2 className="font-display mt-3 max-w-3xl text-4xl md:text-6xl">
          {roster.title}
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
          Quem está por trás dos lançamentos, do som e da cena.
        </p>
      </div>

      {/* Carrossel com setas laterais */}
      <div className="relative mt-14">
        {/* Seta esquerda — posicionada depois dos pills de navegacao */}
        <button
          type="button"
          onClick={() => scroll("left")}
          aria-label="Anterior"
          className="absolute left-[148px] top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/15 backdrop-blur-md h-11 w-11 text-lg text-white/80 shadow-lg transition hover:bg-white/25 hover:text-accent lg:flex lg:left-[156px]"
        >
          ‹
        </button>

        {/* Seta direita */}
        <button
          type="button"
          onClick={() => scroll("right")}
          aria-label="Próximo"
          className="absolute right-3 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/15 backdrop-blur-md h-11 w-11 text-lg text-white/80 shadow-lg transition hover:bg-white/25 hover:text-accent md:flex"
        >
          ›
        </button>

        {/* Recuo no wrapper (nao no overflow-x): evita snap/scroll anchoring resetarem scrollLeft quando imagens carregam ou ScrollTrigger refresca */}
        <div className="pl-6 pr-6 md:pl-[154px] lg:pl-[162px] md:pr-12">
          <div
            ref={scrollRef}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            className="flex cursor-grab snap-x snap-proximity gap-4 overflow-x-auto pb-4 outline-none active:cursor-grabbing scrollbar-hide touch-pan-x"
            style={{
              WebkitOverflowScrolling: "touch",
              overflowAnchor: "none",
            }}
          >
            {roster.members.map((a, i) => {
              const isFeatured = i === featuredIndex;
              return (
                <article
                key={a.id}
                className={`group relative shrink-0 snap-start overflow-hidden rounded-2xl border transition-all duration-500 hover:scale-[1.02] cursor-pointer select-none ${
                  isFeatured
                    ? "border-accent/40 ring-1 ring-accent/30"
                    : "border-white/10"
                }`}
                style={{ width: "min(280px, 72vw)" }}
                onClick={() => handleCardClick(a)}
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  {a.image ? (
                    <Image
                      src={a.image}
                      alt={a.name}
                      fill
                      className="pointer-events-none object-cover transition duration-700 group-hover:scale-[1.03]"
                      sizes="280px"
                      draggable={false}
                    />
                  ) : (
                    <div className="flex h-full min-h-[240px] flex-col items-center justify-center bg-gradient-to-br from-bg/10 via-bg/5 to-accent/20">
                      <span className="font-display text-5xl text-fg/25 md:text-6xl">
                        ?
                      </span>
                      <span className="mt-2 text-xs uppercase tracking-[0.25em] text-fg/40">
                        Em breve
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 space-y-1.5 p-3 md:p-4">
                  <div>
                    <h3 className="font-display text-xl text-white md:text-2xl">
                      {a.name}
                    </h3>
                    {a.role && (
                      <p className="mt-0.5 text-[10px] uppercase tracking-wider text-white/60 line-clamp-1">
                        {a.role}
                      </p>
                    )}
                    {a.bio && (
                      <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-white/50 md:line-clamp-3">
                        {a.bio}
                      </p>
                    )}
                  </div>
                </div>
              </article>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal de detalhe do membro */}
      {selectedMember && (
        <MemberModal
          member={selectedMember}
          members={roster.members}
          onClose={() => setSelectedMember(null)}
          onNavigate={setSelectedMember}
        />
      )}
    </section>
  );
}

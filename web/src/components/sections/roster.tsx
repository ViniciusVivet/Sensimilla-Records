"use client";

import { useRef, useMemo, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { roster, type Member } from "@/data/site";

function MemberModal({
  member,
  onClose,
}: {
  member: Member;
  onClose: () => void;
}) {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/85 backdrop-blur-sm">
      <div className="relative mx-auto flex w-full max-w-2xl flex-col items-center gap-6 px-6 py-10 md:flex-row md:items-start md:gap-10">
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-sm text-white/60 transition hover:bg-white/10 hover:text-white"
        >
          ✕
        </button>

        {member.image && (
          <div className="relative h-56 w-44 shrink-0 overflow-hidden rounded-2xl md:h-72 md:w-56">
            <Image
              src={member.image}
              alt={member.name}
              fill
              className="object-cover"
              sizes="224px"
            />
          </div>
        )}

        <div className="text-center md:text-left">
          <h3 className="font-display text-3xl text-white md:text-4xl">
            {member.name}
          </h3>
          {member.role && (
            <p className="mt-1 text-xs uppercase tracking-wider text-white/50">
              {member.role}
            </p>
          )}
          {member.bio && (
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              {member.bio}
            </p>
          )}
          {(member.spotifyUrl || member.instagramUrl || member.youtubeUrl) && (
            <div className="mt-6 flex flex-wrap justify-center gap-4 md:justify-start">
              {member.spotifyUrl && (
                <a
                  href={member.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-accent/40 px-4 py-2 text-xs font-medium uppercase tracking-wider text-accent transition hover:bg-accent/10"
                >
                  Spotify →
                </a>
              )}
              {member.instagramUrl && (
                <a
                  href={member.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-rose-300/30 px-4 py-2 text-xs font-medium uppercase tracking-wider text-rose-300/80 transition hover:bg-rose-300/10"
                >
                  Instagram →
                </a>
              )}
              {member.youtubeUrl && (
                <a
                  href={member.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/20 px-4 py-2 text-xs font-medium uppercase tracking-wider text-white/60 transition hover:bg-white/10"
                >
                  YouTube →
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
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const hasDragged = useDragScroll(scrollRef);

  const featuredIndex = useMemo(() => {
    const i = roster.members.findIndex((m) => m.id === roster.featuredMemberId);
    return i >= 0 ? i : 0;
  }, []);

  const scroll = useCallback((dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector("article");
    const step = card ? card.offsetWidth + 16 : 300;
    el.scrollBy({ left: dir === "left" ? -step : step, behavior: "smooth" });
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        scroll("left");
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        scroll("right");
      } else if (e.key === "Escape" && selectedMember) {
        setSelectedMember(null);
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
          className="absolute left-[140px] top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/15 backdrop-blur-md h-11 w-11 text-lg text-white/80 shadow-lg transition hover:bg-white/25 hover:text-accent lg:flex"
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

        <div
          ref={scrollRef}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className="flex cursor-grab snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-6 pb-4 outline-none active:cursor-grabbing md:px-12 scrollbar-hide"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {/* Spacer para nao sobrepor os nav pills fixos da esquerda */}
          <div className="hidden shrink-0 md:block md:w-36" aria-hidden />
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

      {/* Modal de detalhe do membro */}
      {selectedMember && (
        <MemberModal
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </section>
  );
}

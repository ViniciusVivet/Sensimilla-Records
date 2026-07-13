"use client";

import { Reveal } from "@/components/reveal";
import { tourDates } from "@/data/site";
import type { CmsEvent } from "@/lib/cms-types";

function EmptyAgenda() {
  return (
    <Reveal>
      <div className="mt-14 flex flex-col items-center rounded-3xl border border-white/[0.06] bg-panel/40 px-6 py-16 text-center md:py-20">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
          <span className="font-display text-3xl text-accent">$</span>
        </div>
        <h3 className="font-display mt-6 text-2xl text-white md:text-3xl">
          PRÓXIMOS DATES EM BREVE
        </h3>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-fg/45">
          A Sensi está preparando os próximos eventos. Fica de olho no
          Instagram pra ser o primeiro a saber quando abrir.
        </p>
        <a
          href="https://www.instagram.com/sensi.rec/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-accent transition hover:bg-accent hover:text-bg"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <rect x="3" y="3" width="18" height="18" rx="5" strokeWidth="1.5" />
            <circle cx="12" cy="12" r="4" strokeWidth="1.5" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
          </svg>
          @sensi.rec
        </a>
      </div>
    </Reveal>
  );
}

export function TourSection({ events = tourDates }: { events?: CmsEvent[] }) {
  const items: CmsEvent[] = events.length ? events : tourDates;
  const hasEvents = items.length > 0;

  return (
    <section id="agenda" className="bg-bg px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <h2 className="font-display text-5xl md:text-7xl">Agenda</h2>
          <p className="mt-2 max-w-md text-sm text-muted">
            {hasEvents
              ? "O que está rolando e o que vem aí — confirme sempre no Instagram oficial."
              : "Nenhum evento confirmado por enquanto — mas isso muda rápido."}
          </p>
        </Reveal>

        {hasEvents ? (
          <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((d, i) => (
              <Reveal key={`${d.city}-${d.day}`} delay={i * 0.06}>
                <li className="flex h-full flex-col rounded-2xl border border-white/10 bg-panel/60 p-6 backdrop-blur-sm transition hover:border-accent/40">
                  <div className="flex items-baseline gap-3">
                    <span className="font-display text-4xl text-accent">
                      {d.day}
                    </span>
                    <span className="text-sm uppercase tracking-widest text-muted">
                      {d.month}
                    </span>
                  </div>
                  <p className="font-display mt-4 text-2xl">{d.title || d.city}</p>
                  <p className="text-sm text-muted">
                    {d.title ? `${d.city} - ${d.venue}` : d.venue}
                  </p>
                  {d.eventTime ? (
                    <p className="mt-2 text-xs uppercase tracking-wider text-accent">
                      {d.eventTime.slice(0, 5)}
                    </p>
                  ) : null}
                  <p className="mt-3 text-xs uppercase tracking-wider text-fg/50">
                    {d.note}
                  </p>
                  {d.ticketUrl ? (
                    <a
                      href={d.ticketUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex w-fit rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-wider transition hover:border-accent hover:text-accent"
                    >
                      Ingressos
                    </a>
                  ) : (
                    <span className="mt-6 inline-block w-fit rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-wider text-muted">
                      Em breve
                    </span>
                  )}
                </li>
              </Reveal>
            ))}
          </ul>
        ) : (
          <EmptyAgenda />
        )}
      </div>
    </section>
  );
}

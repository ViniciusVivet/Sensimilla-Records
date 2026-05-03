"use client";

import { Reveal } from "@/components/reveal";
import { tourDates } from "@/data/site";
import type { CmsEvent } from "@/lib/cms-types";

export function TourSection({ events = tourDates }: { events?: CmsEvent[] }) {
  const items = events.length ? events : tourDates;

  return (
    <section id="tour" className="bg-bg px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <h2 className="font-display text-5xl md:text-7xl">Tour</h2>
          <p className="mt-2 max-w-md text-sm text-muted">
            O que está rolando e o que vem aí — confirme sempre no Instagram
            oficial.
          </p>
        </Reveal>

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
                <p className="font-display mt-4 text-2xl">{d.city}</p>
                <p className="text-sm text-muted">{d.venue}</p>
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
      </div>
    </section>
  );
}

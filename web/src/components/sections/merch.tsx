"use client";

import Image from "next/image";
import { merchProducts } from "@/data/site";

export function MerchSection() {
  return (
    <section
      id="merch"
      className="bg-lime-field px-6 py-24 text-fg md:px-12 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-fg/50">
              Loja · equipamento & wear
            </p>
            <h2 className="font-display mt-2 text-5xl md:text-7xl">Merch</h2>
          </div>
          <p className="max-w-sm text-sm text-fg/65">
            Peças limitadas e parcerias com estúdio. Som limpo, estética crua.
          </p>
        </div>

        <div className="mt-6 inline-block rounded-full border border-fg/20 bg-black/10 px-4 py-2 font-display text-xl tracking-[0.2em] text-fg/90">
          WAAW
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          {merchProducts.map((p) => (
            <article
              key={p.name}
              className="group flex flex-col rounded-2xl border border-fg/10 bg-black/15 p-4 transition hover:border-accent/50"
            >
              <div className="relative aspect-square overflow-hidden rounded-xl bg-[#e8e4dc]">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  className="object-contain p-3 transition duration-500 group-hover:scale-105"
                  sizes="(max-width:768px) 50vw, 33vw"
                />
              </div>
              <p className="mt-3 text-xs uppercase tracking-wider text-fg/50">
                {p.tag}
              </p>
              <h3 className="font-display text-xl">{p.name}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

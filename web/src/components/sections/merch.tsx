"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { merchProducts } from "@/data/site";

const WA_NUMBER = "5511918540870";

function buildWhatsAppUrl(productName: string, price: string) {
  const msg = `Oi, vim pelo site da Sensimilla e tenho interesse na ${productName} (${price}). Ainda tem disponível?`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}

function MerchModal({
  startIndex,
  onClose,
}: {
  startIndex: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(startIndex);
  const product = merchProducts[idx];

  const prev = useCallback(
    () => setIdx((i) => (i - 1 + merchProducts.length) % merchProducts.length),
    [],
  );
  const next = useCallback(
    () => setIdx((i) => (i + 1) % merchProducts.length),
    [],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next, onClose]);

  return (
    <div
      className="fixed inset-0 z-[150] flex max-h-[100dvh] items-center justify-center overflow-y-auto overscroll-y-contain bg-black/90 px-3 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md px-1 pb-[max(1rem,env(safe-area-inset-bottom))] pt-8 sm:px-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Setas */}
        <button
          type="button"
          onClick={prev}
          className="absolute left-1 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/60 text-lg text-white/80 transition hover:border-accent hover:text-accent sm:-left-3 md:-left-14"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={next}
          className="absolute right-1 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/60 text-lg text-white/80 transition hover:border-accent hover:text-accent sm:-right-3 md:-right-14"
        >
          ›
        </button>

        {/* Fechar */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-2 top-2 flex h-11 w-11 items-center justify-center rounded-full bg-black/70 text-base text-white/80 transition hover:text-white sm:-right-2 sm:-top-2 md:-right-10 md:top-2"
        >
          ✕
        </button>

        {/* Imagem */}
        <div className="relative aspect-square overflow-hidden rounded-3xl border border-white/10 bg-panel">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-6"
            sizes="400px"
          />
        </div>

        {/* Info + CTA */}
        <div className="mt-4 text-center">
          <p className="text-xs uppercase tracking-wider text-white/40">
            {product.tag}
          </p>
          <h3 className="font-display mt-1 text-3xl text-white">
            {product.name}
          </h3>
          <p className="font-display mt-1 text-2xl text-accent">
            {product.price}
          </p>
          <a
            href={buildWhatsAppUrl(product.name, product.price)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-block rounded-full bg-accent px-8 py-3 text-sm font-bold uppercase tracking-widest text-bg transition hover:shadow-[0_0_20px_rgba(200,242,74,0.2)]"
          >
            Comprar →
          </a>
          <p className="mt-3 text-xs text-white/30">
            {idx + 1} / {merchProducts.length}
          </p>
        </div>
      </div>
    </div>
  );
}

export function MerchSection() {
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  return (
    <>
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
            {merchProducts.map((p, i) => (
              <article
                key={p.name}
                className="group flex cursor-pointer flex-col rounded-2xl border border-fg/10 bg-black/15 p-4 transition active:scale-[0.99] hover:border-accent/50"
                onClick={() => setModalIndex(i)}
              >
                <div className="relative aspect-square overflow-hidden rounded-xl">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-contain p-3 transition duration-500 group-hover:scale-105"
                    sizes="(max-width:768px) 50vw, 33vw"
                  />
                </div>
                <div className="mt-3 flex items-baseline justify-between gap-2">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-fg/50">
                      {p.tag}
                    </p>
                    <h3 className="font-display text-xl">{p.name}</h3>
                  </div>
                  <span className="font-display text-lg text-accent">
                    {p.price}
                  </span>
                </div>
                <span className="mt-3 block rounded-full bg-accent py-2 text-center text-xs font-semibold uppercase tracking-widest text-bg transition group-hover:shadow-[0_0_15px_rgba(200,242,74,0.15)]">
                  Comprar
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {modalIndex !== null && (
        <MerchModal
          startIndex={modalIndex}
          onClose={() => setModalIndex(null)}
        />
      )}
    </>
  );
}

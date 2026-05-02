import Link from "next/link";

export function ServicosTeaserSection() {
  return (
    <section className="bg-bg px-6 py-20 md:px-12 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-3xl border border-accent/20 bg-accent/[0.04] px-8 py-16 text-center md:px-16">
          {/* fundo decorativo */}
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-accent/5"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-accent/5"
            aria-hidden
          />

          <p className="relative text-xs uppercase tracking-[0.4em] text-accent/80">
            Sensimilla Records · Estúdio & Produção
          </p>
          <h2 className="font-display relative mt-4 text-[12vw] leading-none text-white sm:text-[8vw] md:text-[6vw] lg:text-[72px]">
            GRAVE COM A GENTE
          </h2>
          <p className="relative mx-auto mt-5 max-w-lg text-sm text-fg/65 leading-relaxed md:text-base">
            Gravação, mix & master, vídeos verticais e campanhas audiovisuais.
            Planos para artistas, marcas e criadores.
          </p>
          <div className="relative mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/servicos"
              className="rounded-full bg-accent px-8 py-3 text-sm font-bold uppercase tracking-widest text-bg transition hover:bg-accent/90"
            >
              Ver planos e preços
            </Link>
            <a
              href="https://wa.me/5511918540870"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/20 px-8 py-3 text-sm font-medium text-fg transition hover:border-accent/50 hover:text-accent"
            >
              Chamar no WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

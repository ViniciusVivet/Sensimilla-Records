import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getSiteUrl } from "@/lib/site-config";
import { selo } from "@/data/dossie";
import { members, socialLinks } from "@/data/site";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Imprensa",
  description:
    "Press kit da Sensimilla Records — bio, integrantes, links oficiais e contato para imprensa.",
  alternates: { canonical: `${siteUrl}/imprensa` },
};

export default function ImprensaPage() {
  return (
    <div className="min-h-full bg-bg text-fg">
      <header className="border-b border-white/10 px-6 py-4 md:px-10">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link
            href="/"
            className="text-sm text-muted transition hover:text-accent"
          >
            ← Início
          </Link>
          <div className="relative h-8 w-8 overflow-hidden rounded-full">
            <Image
              src="/logo-sensi.jpg"
              alt="Sensimilla Records"
              fill
              className="object-cover"
              sizes="32px"
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 pb-24 pt-16 md:px-10">
        <p className="text-xs uppercase tracking-[0.4em] text-accent/80">
          Press Kit
        </p>
        <h1 className="font-display mt-2 text-5xl md:text-7xl">IMPRENSA</h1>

        {/* Bio copiável */}
        <section className="mt-12 rounded-2xl border border-white/10 bg-panel/60 p-6 md:p-8">
          <h2 className="text-xs uppercase tracking-[0.3em] text-muted">
            Bio oficial (copie livremente)
          </h2>
          <p className="mt-4 text-base leading-relaxed text-fg/80 md:text-lg">
            Sensimilla Records (@sensi.rec) é um selo independente de rap e trap
            da Zona Leste de São Paulo. Fundada pelo artista COGU, reúne MCs,
            produtores e criativos em torno de lançamentos musicais, eventos e
            conteúdo audiovisual. O núcleo inclui {members.map((m) => m.name).join(", ")} e
            o produtor C13Prod — com estética própria, produção interna e
            presença crescente no streaming e nos palcos de SP.
          </p>
        </section>

        {/* Links oficiais */}
        <section className="mt-10">
          <h2 className="text-xs uppercase tracking-[0.3em] text-muted">
            Links oficiais
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {socialLinks.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-5 py-3 text-sm transition hover:border-accent/40"
              >
                <span className="text-fg/80">{s.name}</span>
                <span className="text-xs text-accent">→</span>
              </a>
            ))}
            <a
              href={`${siteUrl}/servicos`}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-5 py-3 text-sm transition hover:border-accent/40"
            >
              <span className="text-fg/80">Serviços & Preços</span>
              <span className="text-xs text-accent">→</span>
            </a>
          </div>
        </section>

        {/* Integrantes */}
        <section className="mt-10">
          <h2 className="text-xs uppercase tracking-[0.3em] text-muted">
            Integrantes
          </h2>
          <ul className="mt-4 space-y-2">
            {members.map((m) => (
              <li
                key={m.id}
                className="flex items-center justify-between border-b border-white/5 py-2 text-sm"
              >
                <span className="font-medium text-fg/90">{m.name}</span>
                <span className="text-xs text-muted">{m.role}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Dados do selo */}
        <section className="mt-10">
          <h2 className="text-xs uppercase tracking-[0.3em] text-muted">
            Dados do selo
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex gap-4">
              <dt className="text-muted shrink-0 w-32">Nome</dt>
              <dd className="text-fg/80">{selo.nomes[0]}</dd>
            </div>
            <div className="flex gap-4">
              <dt className="text-muted shrink-0 w-32">Handle</dt>
              <dd className="text-fg/80">@{selo.instagram.handle}</dd>
            </div>
            <div className="flex gap-4">
              <dt className="text-muted shrink-0 w-32">Categoria</dt>
              <dd className="text-fg/80">{selo.categoriaPublica}</dd>
            </div>
            <div className="flex gap-4">
              <dt className="text-muted shrink-0 w-32">Contato</dt>
              <dd>
                <a
                  href="https://wa.me/5511918540870"
                  className="text-accent hover:underline"
                >
                  (11) 91854-0870
                </a>
              </dd>
            </div>
          </dl>
        </section>

        <p className="mt-12 text-xs text-muted/60">
          Para entrevistas, parcerias ou cobertura de eventos, entre em contato
          pelo WhatsApp ou Instagram.
        </p>
      </main>
    </div>
  );
}

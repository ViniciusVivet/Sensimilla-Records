import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import {
  arquivoPorArtista,
  eventos,
  faixasCitadas,
  integrantesResumo,
  pendencias,
  referenciasTexto,
  selo,
  spotifyIds,
} from "@/data/dossie";
import { getSiteUrl } from "@/lib/site-config";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Referências públicas",
  description:
    "Links oficiais Sensimilla Records, integrantes, IDs Spotify e notas para imprensa.",
  robots: { index: false, follow: false },
  alternates: { canonical: `${siteUrl}/referencias` },
};

function LinkCell({ href }: { href: string | null }) {
  if (!href)
    return <span className="text-muted">—</span>;
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="break-all text-accent underline-offset-2 hover:underline"
    >
      {href.replace(/^https?:\/\/(www\.)?/, "")}
    </Link>
  );
}

export default function ReferenciasPage() {
  return (
    <SiteShell title="Referências públicas">
      <p className="rounded-xl border border-white/10 bg-panel/40 px-4 py-3 text-sm text-muted">
        Página interna de conferência: URLs e notas reunidas para o time e
        imprensa. Não indexada por motores de busca.
      </p>

      <section>
        <h2 className="font-display text-2xl text-accent">Selo</h2>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-fg/80">
          {selo.nomes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
        <p className="mt-2 text-sm">
          <strong>Tagline:</strong> {selo.tagline}
        </p>
        <p className="mt-1 text-sm text-muted">{selo.categoriaPublica}</p>
        <ul className="mt-4 space-y-2 text-sm">
          <li>
            <strong>Instagram:</strong>{" "}
            <LinkCell href={selo.instagram.url} />
          </li>
          <li>
            <strong>YouTube:</strong> <LinkCell href={selo.youtube.url} />
          </li>
          <li>
            <strong>Spotify (vitrine COGU):</strong>{" "}
            <LinkCell href={selo.spotifyVitrine.url} />
          </li>
        </ul>
      </section>

      <section>
        <h2 className="font-display text-2xl text-accent">Eventos</h2>
        <p className="mt-2 text-sm">
          <strong>{eventos.ofdmSaoPauloIngressos.nome}</strong>
        </p>
        <LinkCell href={eventos.ofdmSaoPauloIngressos.url} />
        <p className="mt-2 text-sm text-muted">
          {eventos.ofdmSaoPauloIngressos.nota}
        </p>
      </section>

      <section>
        <h2 className="font-display text-2xl text-accent">
          Integrantes — links
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-xs md:text-sm">
            <thead>
              <tr className="border-b border-white/15 text-muted">
                <th className="py-2 pr-3 font-medium">Nome</th>
                <th className="py-2 pr-3 font-medium">Papel</th>
                <th className="py-2 pr-3 font-medium">Spotify</th>
                <th className="py-2 pr-3 font-medium">Instagram</th>
                <th className="py-2 font-medium">YouTube</th>
              </tr>
            </thead>
            <tbody>
              {arquivoPorArtista.map((a) => (
                <tr
                  key={a.id}
                  className="border-b border-white/10 align-top text-fg/85"
                >
                  <td className="py-3 pr-3 font-medium">{a.nome}</td>
                  <td className="py-3 pr-3 text-muted">{a.papel}</td>
                  <td className="py-3 pr-3">
                    <LinkCell href={a.spotify} />
                  </td>
                  <td className="py-3 pr-3">
                    <LinkCell href={a.instagram} />
                  </td>
                  <td className="py-3">
                    <LinkCell href={a.youtube} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl text-accent">IDs Spotify</h2>
        <ul className="mt-3 font-mono text-xs text-fg/75">
          {Object.entries(spotifyIds).map(([k, id]) => (
            <li key={k}>
              {k}: {id}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-display text-2xl text-accent">
          Faixas citadas (público)
        </h2>
        {(
          Object.entries(faixasCitadas) as [
            keyof typeof faixasCitadas,
            readonly string[],
          ][]
        ).map(([key, faixas]) => (
          <div key={key} className="mt-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
              {key}
            </h3>
            <p className="mt-1 text-sm text-fg/80">{faixas.join(" · ")}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="font-display text-2xl text-accent">Textos de apoio</h2>
        <ul className="mt-3 space-y-3 text-sm text-fg/75">
          <li>
            <strong>COGU (Spotify):</strong> {referenciasTexto.coguSpotifyBio}
          </li>
          <li>
            <strong>C13 (Spotify):</strong> {referenciasTexto.c13SpotifyBio}
          </li>
          <li>
            <strong>Bright (Spotify):</strong> {referenciasTexto.brightSpotifyBio}
          </li>
          <li>
            <strong>Vivet (Spotify):</strong> {referenciasTexto.vivetSpotifyBio}
          </li>
          <li>
            <strong>Cico (Spotify):</strong> {referenciasTexto.cicoSpotifyBio}
          </li>
          <li>
            <strong>PVinicius:</strong> {referenciasTexto.pvinicius}
          </li>
          <li>
            <strong>OFDM&apos;s / produção:</strong>{" "}
            {referenciasTexto.producaoOFDM}
          </li>
          <li>
            <strong>Podcast:</strong> {referenciasTexto.podcast}
          </li>
        </ul>
      </section>

      <section>
        <h2 className="font-display text-2xl text-accent">Núcleo (lista)</h2>
        <ul className="mt-3 list-inside list-disc text-sm text-fg/80">
          {integrantesResumo.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-display text-2xl text-amber-400/90">
          Pendências / conferir
        </h2>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-muted">
          {pendencias.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </section>

      <p className="text-xs text-muted">
        Fonte: perfis públicos Instagram, YouTube e Spotify compilados para o
        site Sensimilla Records. Atualize em{" "}
        <code className="rounded bg-white/10 px-1">web/src/data/dossie.ts</code>
        .
      </p>
    </SiteShell>
  );
}

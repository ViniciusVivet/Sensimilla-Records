import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import copy from "@/content/copy.json";
import { getSiteUrl } from "@/lib/site-config";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Termos de uso",
  description: "Termos de uso (rascunho) — Sensimilla Records.",
  robots: { index: false, follow: true },
  alternates: { canonical: `${siteUrl}/termos` },
};

export default function TermosPage() {
  const { termsIntro, termsPoints } = copy.legal;

  return (
    <SiteShell title="Termos de uso">
      <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-amber-100/90">
        <strong className="font-medium">Rascunho.</strong> Ajuste com suporte
        jurídico antes do lançamento.
      </p>
      <p>{termsIntro}</p>
      <p className="font-medium text-fg">Sugestão de tópicos:</p>
      <ul className="list-inside list-disc space-y-2 text-muted">
        {termsPoints.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </SiteShell>
  );
}

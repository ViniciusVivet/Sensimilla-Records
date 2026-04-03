import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import copy from "@/content/copy.json";
import { getSiteUrl } from "@/lib/site-config";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Privacidade",
  description: "Política de privacidade (rascunho) — Sensimilla Records.",
  robots: { index: false, follow: true },
  alternates: { canonical: `${siteUrl}/privacidade` },
};

export default function PrivacidadePage() {
  const { privacyIntro, privacyPoints } = copy.legal;

  return (
    <SiteShell title="Política de privacidade">
      <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-amber-100/90">
        <strong className="font-medium">Rascunho.</strong> Substitua este
        conteúdo por texto validado juridicamente antes de tráfego real.
      </p>
      <p>{privacyIntro}</p>
      <p className="font-medium text-fg">Sugestão de tópicos a detalhar:</p>
      <ul className="list-inside list-disc space-y-2 text-muted">
        {privacyPoints.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </SiteShell>
  );
}

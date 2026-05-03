import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import { ContactForm } from "./contact-form";
import { getSiteUrl } from "@/lib/site-config";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Contato Sensimilla Records — mensagens, shows, imprensa e parcerias. Site oficial do selo Sensimilla sensi.rec.",
  alternates: { canonical: `${siteUrl}/contato` },
  openGraph: {
    url: `${siteUrl}/contato`,
    title: "Contato · Sensimilla Records",
    description: "Fale com o selo Sensimilla Records (sensi.rec).",
    siteName: "Sensimilla Records",
  },
};

export default function ContatoPage() {
  return (
    <SiteShell title="Contato">
      <p>
        Use o formulário abaixo para mensagens gerais. Para contratos e
        urgências, confirme depois um canal oficial (e-mail ou telefone) no
        corpo do site quando estiver disponível.
      </p>
      <ContactForm />
    </SiteShell>
  );
}

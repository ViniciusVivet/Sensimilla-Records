import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import { ContactForm } from "./contact-form";
import { getSiteUrl } from "@/lib/site-config";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Fale com a Sensimilla Records — shows, imprensa, parcerias e demais assuntos.",
  alternates: { canonical: `${siteUrl}/contato` },
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

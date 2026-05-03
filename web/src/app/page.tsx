import type { Metadata } from "next";
import { HomeExperience } from "@/components/home-experience";
import { getSiteUrl } from "@/lib/site-config";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Sensimilla Records — rap, trap e selo da Zona Leste SP",
  description:
    "Página oficial da gravadora Sensimilla Records (sensi.rec): rap e trap na Zona Leste — artistas, lançamentos, merch e contato. Selo também buscado como Sensimilla ou Mob Sensimilla.",
  alternates: { canonical: siteUrl },
  openGraph: {
    url: siteUrl,
    title: "Sensimilla Records — site oficial sensi.rec",
    description:
      "Sensimilla Records: selo da Zona Leste SP — rap, trap, equipe e loja. Marca Sensimilla / sensi.rec.",
    siteName: "Sensimilla Records",
  },
};

export default function Home() {
  return <HomeExperience />;
}

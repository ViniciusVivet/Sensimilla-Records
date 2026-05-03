import { getSiteUrl } from "@/lib/site-config";

/** Schema.org em grafo: WebSite (marca / busca) + MusicGroup (selo). */
export function buildRootJsonLd(musicGroup: Record<string, unknown>) {
  const base = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${base}/#website`,
        url: base,
        name: "Sensimilla Records",
        alternateName: [
          "Sensimilla",
          "Sensimilla Records SP",
          "sensi.rec",
          "sensi rec",
          "MOB $ensimilla",
          "Mob Sensimilla",
        ],
        inLanguage: "pt-BR",
        publisher: { "@id": `${base}/#musicgroup` },
      },
      {
        ...musicGroup,
        "@id": `${base}/#musicgroup`,
        "@type": "MusicGroup",
        url: base,
      },
    ],
  };
}

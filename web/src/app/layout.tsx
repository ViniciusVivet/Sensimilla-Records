import type { Metadata, Viewport } from "next";
import { Bebas_Neue, DM_Sans } from "next/font/google";
import { AppProviders } from "@/components/providers";
import { LgpdBanner } from "@/components/lgpd-banner";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { getSiteUrl } from "@/lib/site-config";
import { buildRootJsonLd } from "@/lib/seo-jsonld";
import "./globals.css";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm",
  display: "swap",
});

const siteUrl = getSiteUrl();

const siteVerificationGoogle =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Sensimilla Records",
  title: {
    default: "Sensimilla Records",
    template: "%s · Sensimilla Records",
  },
  description:
    "Site oficial Sensimilla Records (@sensi.rec / sensi rec). Selo de rap e trap da Zona Leste — COGU, Bright, Vivet, Blade e mais. Também conhecido como Sensimilla ou Mob Sensimilla.",
  keywords: [
    "Sensimilla Records",
    "Sensimilla",
    "sensimilla",
    "sensi rec",
    "sensi.rec",
    "Mob Sensimilla",
    "MOB Sensimilla",
    "gravadora independente",
    "rap",
    "trap",
    "hip-hop",
    "Zona Leste",
    "São Paulo",
    "COGU",
    "Brasil",
  ],
  authors: [{ name: "Sensimilla Records", url: siteUrl }],
  creator: "Sensimilla Records",
  publisher: "Sensimilla Records",
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Sensimilla Records",
    title: "Sensimilla Records — selo rap & trap · Zona Leste SP",
    description:
      "Sensimilla Records (sensi.rec): selo independente de rap e trap em São Paulo. Equipe, lançamentos e merch.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sensimilla Records — sensi.rec",
    description:
      "Selo independente da ZL — rap, trap, produção e estética. Site oficial Sensimilla.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "music",
  ...(siteVerificationGoogle
    ? {
        verification: {
          google: siteVerificationGoogle,
        },
      }
    : {}),
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const musicGroupJsonLd = {
  name: "Sensimilla Records",
  alternateName: ["MOB $ensimilla Record's", "sensi.rec"],
  description:
    "Selo independente de rap e trap da Zona Leste de Sao Paulo. Fundado por COGU, reune artistas como Bright, Vivet, Blade, Cico, Guiga MC e C13Prod.",
  genre: ["Rap", "Trap", "Hip-Hop"],
  foundingLocation: {
    "@type": "Place",
    name: "Zona Leste, Sao Paulo, Brasil",
  },
  sameAs: [
    "https://www.instagram.com/sensi.rec/",
    "https://www.youtube.com/@SensimillaRecords",
    "https://open.spotify.com/intl-pt/artist/7gIPPDTUeV4vRRLvYPepD4",
  ],
  member: [
    { "@type": "Person", name: "COGU", url: "https://open.spotify.com/intl-pt/artist/7gIPPDTUeV4vRRLvYPepD4" },
    { "@type": "Person", name: "Bright", url: "https://open.spotify.com/artist/29jelWicSva9yVHSrhtXT5" },
    { "@type": "Person", name: "Vivet", url: "https://open.spotify.com/intl-pt/artist/50WZ6G4s8NCo5g2YKVgTQX" },
    { "@type": "Person", name: "Blade", url: "https://open.spotify.com/intl-pt/artist/7MhSAIhEVG3tYWiSSLD7zi" },
    { "@type": "Person", name: "Cico", url: "https://open.spotify.com/intl-pt/artist/2pFvXJcEhvM0UO3g71YIYw" },
    { "@type": "Person", name: "Guiga MC", url: "https://open.spotify.com/intl-pt/artist/6MSzW8zMjFL6rXJOZdC5LP" },
    { "@type": "Person", name: "C13Prod", url: "https://open.spotify.com/intl-pt/artist/3ccYe7lAn2pmfqJ46kCLCX" },
  ],
};

const jsonLd = buildRootJsonLd(musicGroupJsonLd);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${bebas.variable} ${dmSans.variable} relative h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full bg-bg font-[family-name:var(--font-dm)] text-fg">
        <a
          href="#main-content"
          className="fixed left-[-9999px] top-0 z-[200] whitespace-nowrap rounded-md bg-accent px-4 py-3 text-sm text-bg outline-none ring-2 ring-transparent transition-[left,top] focus:left-[max(1rem,env(safe-area-inset-left))] focus:top-[max(1rem,env(safe-area-inset-top))] focus:ring-bg/90"
        >
          Pular para o conteúdo
        </a>
        <AppProviders>{children}</AppProviders>
        <WhatsAppFab />
        <LgpdBanner />
      </body>
    </html>
  );
}

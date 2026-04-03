import type { Metadata, Viewport } from "next";
import { Bebas_Neue, DM_Sans } from "next/font/google";
import { AppProviders } from "@/components/providers";
import { getSiteUrl } from "@/lib/site-config";
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

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Sensimilla Records",
    template: "%s · Sensimilla Records",
  },
  description:
    "Sensimilla Records (@sensi.rec) — selo de rap/trap da ZL com COGU, Bright, Vivet, Blade, Cico, Guiga MC e o núcleo criativo. É A SEN$I.",
  keywords: [
    "Sensimilla Records",
    "gravadora",
    "música independente",
    "eletrônica",
    "dub",
    "Brasil",
  ],
  authors: [{ name: "Sensimilla Records" }],
  creator: "Sensimilla Records",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Sensimilla Records",
    title: "Sensimilla Records",
    description:
      "Selo independente da ZL — rap, trap, produção e estética. @sensi.rec",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sensimilla Records",
    description:
      "Selo independente da ZL — rap, trap, produção e estética. @sensi.rec",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "music",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

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
      <body className="min-h-full bg-bg font-[family-name:var(--font-dm)] text-fg">
        <a
          href="#main-content"
          className="absolute left-[-9999px] top-0 z-[200] rounded-md bg-accent px-4 py-2 text-sm text-bg focus:left-4 focus:top-4"
        >
          Pular para o conteúdo
        </a>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}

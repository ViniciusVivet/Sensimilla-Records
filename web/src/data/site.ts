import copy from "@/content/copy.json";
import {
  imagensSpotifyCdn as IMG,
  instagramUrls,
  selo,
  spotifyUrls as SPOTIFY,
  youtubeUrls as YOUTUBE,
} from "@/data/dossie";

export const navPills = [
  { id: "hero", label: "Início", href: "#inicio" },
  { id: "manifesto", label: "Manifesto", href: "#manifesto" },
  { id: "roster", label: "Equipe", href: "#equipe" },
  { id: "release", label: "Destaque", href: "#destaque" },
  { id: "catalog", label: "Out Now", href: "#out-now" },
  { id: "tour", label: "Tour", href: "#tour" },
  { id: "merch", label: "Merch", href: "#merch" },
  { id: "editorial", label: "Visuais", href: "#visuais" },
] as const;

/** Redes globais (hero + rodapé) — fonte: `dossie.ts` → `selo`. */
export const socialLinks = [
  { name: "Instagram", href: selo.instagram.url },
  { name: "Spotify", href: selo.spotifyVitrine.url },
  { name: "YouTube", href: selo.youtube.url },
] as const;

export const heroTagline = copy.tagline;

/** Destaque no canto do hero — fundador/rosto do selo. */
export const heroSpotlightMemberId = "cogu";

export type Member = {
  id: string;
  name: string;
  role?: string;
  image: string | null;
  isPlaceholder?: boolean;
  spotifyUrl?: string;
  youtubeUrl?: string;
  instagramUrl?: string;
  /** Uma linha para o site (bio curta). */
  bio?: string;
};

const INSTAGRAM = {
  cogu: instagramUrls.cogu,
  vivet: instagramUrls.vivet,
  bright: instagramUrls.bright,
  pvinicius: instagramUrls.pvinicius,
  blade: instagramUrls.blade,
  cico: instagramUrls.cico,
  guiga: instagramUrls.guiga,
  c13prod: instagramUrls.c13prod,
} as const;

/**
 * Núcleo ativo — links completos em `dossie.ts` + página /referencias.
 */
export const members: Member[] = [
  {
    id: "cogu",
    name: "COGU",
    role: "Fundador MOB $ensimilla · artista e compositor",
    bio: "Fundador da MOB $ensimilla Record's; trap com beats intensos e letras diretas. Destaques: Crumble, LOUCURA, Alta Voltagem (feat. internacional 270Jet), LAMA NO COPO.",
    image: IMG.cogu,
    spotifyUrl: SPOTIFY.cogu,
    instagramUrl: INSTAGRAM.cogu,
  },
  {
    id: "bright",
    name: "Bright",
    role: "MC · dança · Sensimilla",
    bio: "Flow autêntico e som ligado à performance; faixas como Casa Bomba e Preto Chique.",
    image: IMG.bright,
    spotifyUrl: SPOTIFY.bright,
    youtubeUrl: YOUTUBE.brightTopic,
    instagramUrl: INSTAGRAM.bright,
  },
  {
    id: "blade",
    name: "Blade",
    role: "BLADE OG",
    bio: "Trap com presença; Preto Chique, Dinheiro de Trap e participação em Nova Era.",
    image: IMG.blade,
    spotifyUrl: SPOTIFY.blade,
    instagramUrl: INSTAGRAM.blade,
  },
  {
    id: "vivet",
    name: "Vivet",
    role: "Artista · criativo digital",
    bio: "Som e visão híbrida; destaques BET777 e Casa Bomba no streaming.",
    image: IMG.vivet,
    spotifyUrl: SPOTIFY.vivet,
    youtubeUrl: YOUTUBE.vivet,
    instagramUrl: INSTAGRAM.vivet,
  },
  {
    id: "cico",
    name: "Cico",
    role: "Artista",
    bio: "Lançamentos expressivos: BORDELINE BIPOLAR!, Arrepios!, Barbie e mais.",
    image: IMG.cico,
    spotifyUrl: SPOTIFY.cico,
    youtubeUrl: YOUTUBE.cico,
    instagramUrl: INSTAGRAM.cico,
  },
  {
    id: "guiga",
    name: "Guiga MC",
    role: "MC",
    bio: "Casual, Não É Bem Assim, Escolhas e singles da linha Guiga MC.",
    image: IMG.guiga,
    spotifyUrl: SPOTIFY.guiga,
    instagramUrl: INSTAGRAM.guiga,
  },
  {
    id: "c13prod",
    name: "C13Prod",
    role: "Produção · c13_prod",
    bio: "Beatmaker e produtor — Futuro, Surfada na Night, No Plastic e remixes; bio no Spotify: “Apenas mais um fazendo umas parada no pc”.",
    image: IMG.c13prod,
    spotifyUrl: SPOTIFY.c13prod,
    youtubeUrl: YOUTUBE.c13prodTopic,
    instagramUrl: INSTAGRAM.c13prod,
  },
  {
    id: "pvinicius",
    name: "PVinicius",
    role: "Direção de styling · imagem",
    bio: "ZL / Itaquera; direção de styling ligada ao @sensi.rec. Spotify a confirmar.",
    image: null,
    instagramUrl: INSTAGRAM.pvinicius,
  },
  {
    id: "gb",
    name: "GB",
    role: "Integrante",
    bio: "Parte do núcleo — perfil público (Instagram/Spotify) a confirmar para não cruzar com outro artista.",
    image: null,
  },
];

export function getMemberById(id: string): Member | undefined {
  return members.find((m) => m.id === id);
}

export const heroSpotlight = (() => {
  const m = getMemberById(heroSpotlightMemberId) ?? members[0];
  return {
    name: m.name,
    role: m.role ?? "Sensimilla Records",
    image:
      m.image ??
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=500&fit=crop",
  };
})();

export const manifesto = {
  line: copy.manifesto.line,
  stats: copy.manifesto.stats,
};

export const roster = {
  eyebrow: "Integrantes",
  title: "Quem faz a Sensimilla",
  featuredMemberId: heroSpotlightMemberId,
  members,
};

export const featuredRelease = {
  title: "LAMA NO COPO",
  subtitle: "COGU · lançamento recente",
  description:
    "Último lançamento em destaque no perfil oficial no Spotify — seguindo a linha de Crumble, LOUCURA e o trap pesado que puxa o movimento da casa.",
  cover: IMG.cogu,
  cta: "Ouvir no Spotify",
  href: "https://open.spotify.com/search/lama%20no%20copo%20cogu",
};

export const catalogReleases = [
  {
    title: "Crumble",
    artist: "COGU ft. Bright",
    meta: "Single · 2026",
    cover: IMG.cogu,
  },
  {
    title: "LOUCURA",
    artist: "COGU",
    meta: "Single · 2026",
    cover: IMG.cogu,
  },
  {
    title: "Alta Voltagem",
    artist: "COGU · feat. 270Jet",
    meta: "Single · 2025",
    cover: IMG.cogu,
  },
  {
    title: "BET777",
    artist: "Vivet",
    meta: "Single · 2025",
    cover: IMG.vivet,
  },
  {
    title: "BORDELINE BIPOLAR!",
    artist: "Cico",
    meta: "Streaming",
    cover: IMG.cico,
  },
];

export type TourDate = {
  month: string;
  day: string;
  city: string;
  venue: string;
  note: string;
  ticketUrl?: string;
};

export const tourDates: TourDate[] = [
  {
    month: "ABR",
    day: "11",
    city: "São Paulo",
    venue: "OFDM's",
    note: "Ingressos no link oficial",
    ticketUrl:
      "https://moonz.com.br/event/ofdm-s-sao-palo/Rp7Uqg95h/Msvsz7bF0",
  },
  {
    month: "—",
    day: "?",
    city: "Próximas datas",
    venue: "Em anúncio",
    note: "Acompanhe @sensi.rec para lineup e cidades",
  },
  {
    month: "—",
    day: "?",
    city: "Shows & festivais",
    venue: "Sensimilla no palco",
    note: "Imprensa e booking pelo contato do site",
  },
];

export const merchProducts = [
  {
    name: "Fone Reference",
    tag: "Áudio",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
  },
  {
    name: "Earbuds Field",
    tag: "Wireless",
    image:
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&h=500&fit=crop",
  },
  {
    name: "Speaker Cabin",
    tag: "Som",
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e2?w=500&h=500&fit=crop",
  },
  {
    name: "Cap Sensimilla",
    tag: "Wear",
    image:
      "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=500&h=500&fit=crop",
  },
];

/** Colagem da seção “Visuais” — troque por fotos próprias (ex.: `/media/estudio-1.jpg` em `public/`). */
export type EditorialPhoto = { src: string; alt: string };

export const editorialCollage: EditorialPhoto[] = [
  { src: IMG.cogu, alt: "COGU — Sensimilla Records" },
  { src: IMG.bright, alt: "Bright — Sensimilla Records" },
  { src: IMG.vivet, alt: "Vivet — Sensimilla Records" },
];

/** Primeiro frame do vídeo do hero até o clip carregar (rosto do selo / fundador). */
export const heroVideoPoster = IMG.cogu;

/** Poster do bloco vertical (substitua por frame de clipe real em 9:16). */
export const reelPoster = IMG.vivet;

export const footerLinks = [
  { label: "Início", href: "/" },
  { label: "Shows", href: "/#tour" },
  { label: "Discografia", href: "/#out-now" },
  { label: "Equipe", href: "/#equipe" },
  { label: "Merch", href: "/#merch" },
  { label: "Imprensa", href: "/#" },
  { label: "Contato", href: "/contato" },
  { label: "Referências", href: "/referencias" },
  { label: "Privacidade", href: "/privacidade" },
  { label: "Termos", href: "/termos" },
] as const;

export const heroVideoSrc =
  "https://videos.pexels.com/video-files/3044129/3044129-uhd_2560_1440_25fps.mp4";

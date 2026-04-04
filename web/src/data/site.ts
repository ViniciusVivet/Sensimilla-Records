import copy from "@/content/copy.json";
import {
  imagensReleaseCdn as RELEASE,
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
  { id: "youtube", label: "YouTube", href: "#youtube" },
  { id: "editorial", label: "Visuais", href: "#visuais" },
] as const;

/** Redes globais (hero + rodapé) — fonte: `dossie.ts` → `selo`. */
export const socialLinks = [
  { name: "Instagram", href: selo.instagram.url },
  { name: "Spotify", href: selo.spotifyVitrine.url },
  { name: "YouTube", href: selo.youtube.url },
  { name: "Deezer", href: "https://www.deezer.com/search/Sensimilla%20Records" },
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
    bio: "Fundador da MOB $ensimilla Record's e uma das vozes emergentes do trap brasileiro. Beats intensos, flows únicos e letras que traduzem a essência das ruas. Destaques: LAMA NO COPO, Crumble, LOUCURA, Alta Voltagem (feat. 270Jet).",
    image: IMG.cogu,
    spotifyUrl: SPOTIFY.cogu,
    instagramUrl: INSTAGRAM.cogu,
  },
  {
    id: "bright",
    name: "Bright",
    role: "MC · dança · Sensimilla",
    bio: "Encontrou seu caminho no hip-hop pela dança há quase uma década; começou a escrever letras em 2017 e estreou no streaming em 2023. Flow diverso e lirismo único. Faixas: Casa Bomba, Preto Chique, Tudo Bem.",
    image: IMG.bright,
    spotifyUrl: SPOTIFY.bright,
    youtubeUrl: YOUTUBE.brightTopic,
    instagramUrl: INSTAGRAM.bright,
  },
  {
    id: "blade",
    name: "Blade",
    role: "BLADE OG",
    bio: "Trap com presença e identidade própria. Preto Chique, Dinheiro de Trap e Street Business no streaming.",
    image: IMG.blade,
    spotifyUrl: SPOTIFY.blade,
    instagramUrl: INSTAGRAM.blade,
  },
  {
    id: "vivet",
    name: "Vivet",
    role: "Artista · criativo digital",
    bio: "Das ruas do centro de São Paulo, diretamente para o seu sistema nervoso. Som e visão híbrida; BET777 e Casa Bomba no streaming.",
    image: IMG.vivet,
    spotifyUrl: SPOTIFY.vivet,
    youtubeUrl: YOUTUBE.vivet,
    instagramUrl: INSTAGRAM.vivet,
  },
  {
    id: "cico",
    name: "Cico",
    role: "Artista · ZL",
    bio: "Natural da ZL de SP, Cico é uma explosão de estilos: trap, drill, R&B, funk, rock. No streaming desde dez/2019 com +200k views no YouTube. Faixas: BORDELINE BIPOLAR!, Arrepios!, Barbie.",
    image: IMG.cico,
    spotifyUrl: SPOTIFY.cico,
    youtubeUrl: YOUTUBE.cico,
    instagramUrl: INSTAGRAM.cico,
  },
  {
    id: "guiga",
    name: "Guiga MC",
    role: "MC",
    bio: "Lirismo consistente e catálogo crescente. Casual, Não É Bem Assim, Escolhas e mais singles na linha do rap paulista.",
    image: IMG.guiga,
    spotifyUrl: SPOTIFY.guiga,
    instagramUrl: INSTAGRAM.guiga,
  },
  {
    id: "c13prod",
    name: "C13Prod",
    role: "Produção · c13_prod",
    bio: "\"Apenas mais um fazendo umas parada no pc.\" Beatmaker e produtor do núcleo — Futuro, Surfada na Night, No Plastic e colaborações pela casa.",
    image: IMG.c13prod,
    spotifyUrl: SPOTIFY.c13prod,
    youtubeUrl: YOUTUBE.c13prodTopic,
    instagramUrl: INSTAGRAM.c13prod,
  },
  {
    id: "pvinicius",
    name: "PVinicius",
    role: "Direção de styling · imagem",
    bio: "ZL / Itaquera. Direção de styling e identidade visual ligada ao @sensi.rec.",
    image: null,
    instagramUrl: INSTAGRAM.pvinicius,
  },
  {
    id: "gb",
    name: "GB",
    role: "Integrante",
    bio: "Parte do núcleo Sensimilla. Perfil público a confirmar.",
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
  cover: RELEASE.lamaNoCopoCogu,
  cta: "Ouvir no Spotify",
  href: "https://open.spotify.com/track/2gU7GSDchp6imuWQNkFZkR",
  /** "track/ID" ou "artist/ID" — embed Spotify inline. IDs verificados abr/2026. */
  spotifyEmbed: "track/2gU7GSDchp6imuWQNkFZkR",
  platforms: [
    { name: "Spotify", href: "https://open.spotify.com/track/2gU7GSDchp6imuWQNkFZkR" },
    { name: "Deezer", href: "https://www.deezer.com/search/COGU%20LAMA%20NO%20COPO" },
    { name: "YouTube Music", href: "https://music.youtube.com/search?q=COGU+LAMA+NO+COPO" },
    { name: "Apple Music", href: "https://music.apple.com/search?term=COGU+LAMA+NO+COPO" },
  ],
};

export const catalogReleases = [
  {
    title: "Crumble",
    artist: "COGU ft. Bright",
    meta: "Single · 2026",
    cover: RELEASE.crumbleCogu,
    spotifyEmbed: "track/6JF0fIJMzm16RFtYKWUBW",
  },
  {
    title: "LOUCURA",
    artist: "COGU",
    meta: "Single · 2026",
    cover: RELEASE.loucuraCogu,
    spotifyEmbed: "track/0UcwY1LLirUKinHDq1FKjo",
  },
  {
    title: "BET777",
    artist: "COGU · Vivet",
    meta: "Single · 2025",
    cover: RELEASE.bet777CoguVivet,
    spotifyEmbed: "track/0NCbITn7TnyuCCmXthgUyz",
  },
  {
    title: "Casa Bomba",
    artist: "Vivet · Bright",
    meta: "Single · 2024",
    cover: RELEASE.casaBombaVivetBright,
    spotifyEmbed: "track/2DLQxWlg6aILhyjWegjccy",
  },
  {
    title: "BORDELINE BIPOLAR!",
    artist: "Cico",
    meta: "Single · 2025",
    cover: RELEASE.borderlineBipolarCico,
    spotifyEmbed: "track/6Y0rF44x9H3D1JiIUcBAWZ",
  },
  {
    title: "Preto Chique",
    artist: "Bright · Blade",
    meta: "Single · 2024",
    cover: RELEASE.pretoChiqueBrightBlade,
    spotifyEmbed: "track/4kxccevhrhGEkPkhUN6lBW",
  },
  {
    title: "Casual",
    artist: "Guiga MC",
    meta: "Single · 2025",
    cover: RELEASE.casualGuiga,
    spotifyEmbed: "track/2IaYT5Lv06RuEnjufHwYDO",
  },
  {
    title: "Barbie",
    artist: "Cico",
    meta: "Single · 2024",
    cover: RELEASE.barbieCico,
    spotifyEmbed: "track/7BRBYfP2lNly0UD2A9Xzom",
  },
  {
    title: "A Bruxa",
    artist: "Bright",
    meta: "Single · 2023",
    cover: RELEASE.aBruxaBright,
    spotifyEmbed: "track/2kdgk7pMaRNbTHgOwT99cj",
  },
  {
    title: "Dinheiro de Trap",
    artist: "Blade",
    meta: "Single · 2023",
    cover: RELEASE.dinheiroDeTrapBlade,
    spotifyEmbed: "track/5laNdT6tue5Ok3EnwE0W4i",
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

/** Colagem da seção "Visuais" — troque por fotos próprias (ex.: `/media/estudio-1.jpg` em `public/`). */
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
  { label: "YouTube", href: "/#youtube" },
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

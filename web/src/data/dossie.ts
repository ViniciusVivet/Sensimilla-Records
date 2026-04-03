/**
 * Dossiê público da Sensimilla Records — referências reunidas para o site e imprensa.
 * Atualize aqui quando mudar handle ou URL; `site.ts` importa estes links.
 *
 * O que NÃO está listado = ainda não foi cruzado com perfil oficial (evitar homônimo).
 */

export const selo = {
  nomes: [
    "Sensimilla Records",
    "SENSIMILLA RECORDS",
    "MOB $ensimilla Record's",
    "@sensi.rec",
  ],
  tagline: "É A SEN$I",
  categoriaPublica: "Gravadora / selo independente (rap · trap · ZL)",
  instagram: {
    handle: "sensi.rec",
    url: "https://www.instagram.com/sensi.rec/",
  },
  youtube: {
    handle: "@SensimillaRecords",
    url: "https://www.youtube.com/@SensimillaRecords",
  },
  /** Spotify do COGU usado como vitrine “ouça a casa” no header (fundador). */
  spotifyVitrine: {
    artista: "COGU",
    url: "https://open.spotify.com/intl-pt/artist/7gIPPDTUeV4vRRLvYPepD4",
    id: "7gIPPDTUeV4vRRLvYPepD4",
  },
} as const;

/** IDs Spotify validados (abrir perfil → confirmar artista). */
export const spotifyIds = {
  cogu: "7gIPPDTUeV4vRRLvYPepD4",
  cico: "2pFvXJcEhvM0UO3g71YIYw",
  vivet: "50WZ6G4s8NCo5g2YKVgTQX",
  blade: "7MhSAIhEVG3tYWiSSLD7zi",
  bright: "29jelWicSva9yVHSrhtXT5",
  guiga: "6MSzW8zMjFL6rXJOZdC5LP",
  c13prod: "3ccYe7lAn2pmfqJ46kCLCX",
} as const;

export const spotifyUrls = {
  cogu: `https://open.spotify.com/intl-pt/artist/${spotifyIds.cogu}`,
  cico: `https://open.spotify.com/intl-pt/artist/${spotifyIds.cico}`,
  vivet: `https://open.spotify.com/intl-pt/artist/${spotifyIds.vivet}`,
  blade: `https://open.spotify.com/intl-pt/artist/${spotifyIds.blade}`,
  bright: `https://open.spotify.com/artist/${spotifyIds.bright}`,
  guiga: `https://open.spotify.com/intl-pt/artist/${spotifyIds.guiga}`,
  c13prod: `https://open.spotify.com/intl-pt/artist/${spotifyIds.c13prod}`,
} as const;

export const instagramUrls = {
  selo: selo.instagram.url,
  cogu: "https://www.instagram.com/cogu.sensi/",
  vivet: "https://www.instagram.com/vivetsp/",
  bright: "https://www.instagram.com/bright_moob/",
  blade: "https://www.instagram.com/_bladeog/",
  pvinicius: "https://www.instagram.com/pviniciuselias/",
  /** Também citado como @CicoTV1 no YouTube — confirmar se @cicotv4 é o mesmo núcleo. */
  cico: "https://www.instagram.com/cicotv4/",
  /** Handle clássico do MC; conferir se é o mesmo perfil ativo. */
  guiga: "https://www.instagram.com/guigamc/",
  /** Produção — alinhado ao @c13_prod citado em materiais do selo. */
  c13prod: "https://www.instagram.com/c13_prod/",
} as const;

export const youtubeUrls = {
  selo: selo.youtube.url,
  vivet: "https://www.youtube.com/@vivetsp",
  cico: "https://www.youtube.com/@CicoTV1",
  c13prodTopic: "https://www.youtube.com/channel/UCFM7xR9CvIGns43FtofMiUA",
  brightTopic: "https://www.youtube.com/channel/UCcRAkAtYU-HfxlWAJKFqoHw",
} as const;

/** Arte de perfil Spotify (CDN) — trocar por fotos próprias em `members` quando possível. */
export const imagensSpotifyCdn = {
  cogu: "https://i.scdn.co/image/ab6761610000e5eb1a88cc46ee1ee9688ca09281",
  cico: "https://i.scdn.co/image/ab6761610000e5ebda4a7c97b31751befb392d9c",
  vivet: "https://i.scdn.co/image/ab6761610000e5eba21a7013540e57aca7c4fd5b",
  blade: "https://i.scdn.co/image/ab6761610000e5ebd3c8f9a61d6240f383912a5d",
  bright: "https://i.scdn.co/image/ab6761610000e5ebbcb3fb34765c713768585968",
  guiga: "https://i.scdn.co/image/ab6761610000e5ebe42b14d272f2286f04064173",
  c13prod: "https://i.scdn.co/image/ab6761610000e5ebc703fb60699b039ef16be0ab",
} as const;

export const eventos = {
  ofdmSaoPauloIngressos: {
    nome: "OFDM's (São Paulo)",
    url: "https://moonz.com.br/event/ofdm-s-sao-palo/Rp7Uqg95h/Msvsz7bF0",
    nota: "Link de ingressos divulgado no Instagram do selo; confirmar data no calendário oficial.",
  },
} as const;

/** Referências textuais públicas (Spotify, bio, fichas). */
export const referenciasTexto = {
  coguSpotifyBio:
    "Artista, compositor e fundador da MOB $ensimilla Record's; trap brasileiro; colaboração internacional 270Jet em Alta Voltagem.",
  c13SpotifyBio: "Apenas mais um fazendo umas parada no pc",
  brightInstagramBio:
    "The Bright | $ensimilla Records — MC, dancer, flow autêntico (síntese de materiais públicos).",
  pvinicius:
    "Direção de styling ligada ao @sensi.rec; ZL / Itaquera (materiais públicos).",
  producaoOFDM:
    "Em materiais de evento OFDM's aparecem créditos ligados a @sensi.rec e @cogu.sensi (produção / CEO — conferir peça oficial).",
} as const;

/** O que ainda falta cruzar com link oficial (não inventar). */
export const pendencias = [
  "GB — Instagram / Spotify sem URL confirmada no dossiê (risco de homônimo).",
  "COGU — canal YouTube dedicado além do Topic / selo (se existir, colar URL aqui e em members).",
  "Guiga MC — YouTube Topic ou canal principal a confirmar.",
  "Blade — Instagram confirmado; YouTube além do Topic a confirmar.",
  "Cico — alinhar @cicotv4 (Instagram) com @CicoTV1 (YouTube) se forem o mesmo projeto.",
  "PVinicius — Spotify do artista/stylist a confirmar.",
] as const;

/** Lista humana para leitura (imprensa / nota de rodapé). */
export const integrantesResumo = [
  "COGU — fundador, MOB $ensimilla, artista",
  "Bright — MC, dança",
  "Blade — BLADE OG",
  "Vivet — artista, digital",
  "Cico — artista",
  "Guiga MC — MC",
  "C13Prod — produção (c13_prod)",
  "PVinicius — styling / imagem",
  "GB — núcleo (perfil público a fechar)",
] as const;

export const faixasCitadas = {
  cogu: [
    "LAMA NO COPO",
    "Crumble",
    "LOUCURA",
    "Alta Voltagem (feat. 270Jet)",
    "BET777",
    "Casa Bomba",
    "Donos Da Noite",
    "Cheirosa",
  ],
  bright: ["Casa Bomba", "Preto Chique", "Tudo Bem", "Mestre dos Magos"],
  vivet: ["BET777", "Casa Bomba"],
  cico: [
    "BORDELINE BIPOLAR!",
    "Arrepios!",
    "Barbie",
    "Colho o que eu planto!",
  ],
  blade: ["Preto Chique", "Dinheiro de Trap", "Nova Era"],
  guiga: [
    "Casual",
    "Não É Bem Assim",
    "Escolhas",
    "Mais um Dia",
    "Dama da Noite",
  ],
  c13prod: [
    "Futuro",
    "Surfada na Night",
    "No Plastic",
    "DESIGNE ESPORTIVO",
    "Contabilidades",
    "Dinheiro",
  ],
} as const;

/** Uma linha por pessoa — usado na página /referencias e para conferência rápida. */
export type ArquivoArtista = {
  id: string;
  nome: string;
  papel: string;
  spotify: string | null;
  instagram: string | null;
  youtube: string | null;
};

export const arquivoPorArtista: ArquivoArtista[] = [
  {
    id: "cogu",
    nome: "COGU",
    papel: "Fundador MOB $ensimilla · artista",
    spotify: spotifyUrls.cogu,
    instagram: instagramUrls.cogu,
    youtube: null,
  },
  {
    id: "bright",
    nome: "Bright",
    papel: "MC · dança · Sensimilla",
    spotify: spotifyUrls.bright,
    instagram: instagramUrls.bright,
    youtube: youtubeUrls.brightTopic,
  },
  {
    id: "blade",
    nome: "Blade (BLADE OG)",
    papel: "MC",
    spotify: spotifyUrls.blade,
    instagram: instagramUrls.blade,
    youtube: null,
  },
  {
    id: "vivet",
    nome: "Vivet",
    papel: "Artista · criativo digital",
    spotify: spotifyUrls.vivet,
    instagram: instagramUrls.vivet,
    youtube: youtubeUrls.vivet,
  },
  {
    id: "cico",
    nome: "Cico",
    papel: "Artista",
    spotify: spotifyUrls.cico,
    instagram: instagramUrls.cico,
    youtube: youtubeUrls.cico,
  },
  {
    id: "guiga",
    nome: "Guiga MC",
    papel: "MC",
    spotify: spotifyUrls.guiga,
    instagram: instagramUrls.guiga,
    youtube: null,
  },
  {
    id: "c13prod",
    nome: "C13Prod (c13_prod)",
    papel: "Produção",
    spotify: spotifyUrls.c13prod,
    instagram: instagramUrls.c13prod,
    youtube: youtubeUrls.c13prodTopic,
  },
  {
    id: "pvinicius",
    nome: "PVinicius",
    papel: "Direção de styling · imagem",
    spotify: null,
    instagram: instagramUrls.pvinicius,
    youtube: null,
  },
  {
    id: "gb",
    nome: "GB",
    papel: "Integrante",
    spotify: null,
    instagram: null,
    youtube: null,
  },
];

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getSiteUrl } from "@/lib/site-config";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Serviços",
  description:
    "Serviços Sensimilla Records: gravação, produção musical, vídeos e conteúdo digital. Planos para artistas e marcas — selo Sensimilla sensi.rec.",
  alternates: { canonical: `${siteUrl}/servicos` },
  openGraph: {
    type: "website",
    url: `${siteUrl}/servicos`,
    title: "Serviços · Sensimilla Records — estúdio e produção",
    description:
      "Planos e serviços do selo Sensimilla Records (SP): gravação, produção e pacotes para artistas.",
    siteName: "Sensimilla Records",
  },
};

const artistPlans = [
  {
    tag: "SENSI START",
    highlight: false,
    badge: null,
    price: "R$ 450",
    period: "por sessão",
    description: "Entrada sem desculpa. Grave, saia com o material na mão.",
    features: [
      "1 gravação de até 2h",
      "Entrega do áudio bruto tratado",
      "Suporte técnico na sessão",
    ],
  },
  {
    tag: "SENSI FLOW",
    highlight: true,
    badge: "MAIS VENDIDO",
    price: "R$ 900 – 1.200",
    period: "por mês",
    description:
      "Escala real: gravação, mix e visual em um único pacote recorrente.",
    features: [
      "2 gravações mensais",
      "1 mix & master profissional",
      "4 vídeos verticais (reels/shorts)",
      "Suporte de produção e estratégia",
    ],
  },
  {
    tag: "SENSI PRO ARTISTA",
    highlight: false,
    badge: null,
    price: "R$ 2.500 – 4.000",
    period: "por projeto",
    description:
      "Produção completa para quem quer lançar do jeito certo — do beat ao clipe.",
    features: [
      "Produção musical completa",
      "Mix & master profissional",
      "Clipe cinematográfico",
      "Distribuição digital (todas as plataformas)",
      "Content ID e monetização",
      "Planejamento de lançamento",
      "Identidade visual do release",
    ],
  },
];

const brandPlans = [
  {
    tag: "SENSI DIGITAL BRAND",
    highlight: false,
    badge: null,
    price: "R$ 1.800 – 2.500",
    period: "/mês",
    description: "Presença digital consistente com estética de gravadora.",
    features: [
      "8 vídeos mensais",
      "Captação + edição completa",
      "Conteúdo otimizado por plataforma",
      "Calendário editorial",
    ],
  },
  {
    tag: "SENSI CAMPAIGN",
    highlight: true,
    badge: "ALTO IMPACTO",
    price: "R$ 5.000 – 15.000",
    period: "por campanha",
    description:
      "Campanhas audiovisuais do conceito à entrega — trilha, spot, vídeo.",
    features: [
      "Criação de trilha ou spot sonoro",
      "Produção de vídeo completo",
      "Planejamento + execução",
      "Entrega em múltiplos formatos",
    ],
  },
  {
    tag: "SENSI PODCAST",
    highlight: false,
    badge: null,
    price: "R$ 1.500 – 3.000",
    period: "/mês",
    description: "Seu podcast com qualidade de estúdio, entrega semanal.",
    features: [
      "Edição completa de episódios",
      "Entrega semanal garantida",
      "Arte de capa e thumbnail",
      "Upload e distribuição",
    ],
  },
];

const avulso = [
  { label: "Gravação", price: "R$ 150/h" },
  { label: "Mix & Master", price: "R$ 350 – 700" },
  { label: "Reel avulso", price: "R$ 250 – 350" },
  { label: "Clipe profissional", price: "R$ 1.500+" },
];

const formatos = [
  {
    name: "SENSI CYPHER",
    emoji: "🎤",
    desc: "Formato de cypher exclusivo do selo — vários artistas, uma faixa, uma estética unificada. Visibilidade cruzada para todos os envolvidos.",
  },
  {
    name: "SENSI SESSION",
    emoji: "🎬",
    desc: "Sessão gravada ao vivo no estúdio, com captação em vídeo. Conteúdo autêntico e de alto valor para redes sociais.",
  },
  {
    name: "MEGA SESH",
    emoji: "⚡",
    desc: "Gravação em formato de evento — múltiplos artistas, um dia inteiro de produção, conteúdo para semanas.",
  },
];

const diferenciais = [
  {
    title: "Posicionamento estratégico",
    desc: "Não entregamos só áudio. Pensamos no lançamento, na narrativa e no impacto antes de abrir o Pro Tools.",
  },
  {
    title: "Identidade visual forte",
    desc: "Estética própria, coerente com o trap e o hip-hop de SP — sem template genérico.",
  },
  {
    title: "Mentalidade empresarial",
    desc: "Selo independente que pensa em crescimento e monetização, não só em arte.",
  },
  {
    title: "Rede de artistas ativa",
    desc: "Colaborações dentro do núcleo, visibilidade cruzada e uma base real de fãs construída organicamente.",
  },
];

function PlanCard({
  tag,
  highlight,
  badge,
  price,
  period,
  description,
  features,
}: (typeof artistPlans)[number]) {
  return (
    <div
      className={`group relative flex flex-col rounded-3xl border p-6 transition-all duration-500 hover:scale-[1.02] md:p-8 ${
        highlight
          ? "border-accent/50 bg-accent/[0.06] shadow-[0_0_60px_rgba(200,242,74,0.08)]"
          : "border-white/10 bg-white/[0.02] hover:border-white/20"
      }`}
    >
      {badge && (
        <span className="absolute -top-3 left-6 rounded-full bg-accent px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-bg">
          {badge}
        </span>
      )}
      <p
        className={`font-display text-sm tracking-[0.2em] ${highlight ? "text-accent" : "text-muted"}`}
      >
        {tag}
      </p>
      <p className="font-display mt-4 text-4xl text-white">{price}</p>
      <p className="mt-1 text-xs text-muted">{period}</p>
      <p className="mt-5 text-sm text-fg/65 leading-relaxed">{description}</p>
      <ul className="mt-6 flex-1 space-y-2.5">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm text-fg/80">
            <span className="mt-0.5 shrink-0 text-accent">✓</span>
            {f}
          </li>
        ))}
      </ul>
      <a
        href={`https://wa.me/5511918540870?text=${encodeURIComponent(`Oi, vim pelo site da Sensimilla e quero saber mais sobre o plano ${tag}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-8 block rounded-full py-3 text-center text-sm font-semibold uppercase tracking-wider transition ${
          highlight
            ? "bg-accent text-bg hover:bg-accent/90 hover:shadow-[0_0_20px_rgba(200,242,74,0.2)]"
            : "border border-white/20 text-fg hover:border-accent/50 hover:text-accent"
        }`}
      >
        Quero esse plano →
      </a>
    </div>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <p className="text-[10px] uppercase tracking-[0.4em] text-muted/60">
        {label}
      </p>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}

export default function ServicosPage() {
  return (
    <div className="relative min-h-full bg-bg text-fg">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="pointer-events-none absolute inset-0">
          <Image
            src="/banner-sensi.jpg"
            alt=""
            fill
            className="object-cover opacity-10"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-bg/60 via-bg/90 to-bg" />
        </div>

        <header className="relative px-6 pt-6 md:px-10">
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <Link
              href="/"
              className="text-sm text-muted transition hover:text-accent"
            >
              ← Início
            </Link>
            <div className="relative h-10 w-10 overflow-hidden rounded-full ring-1 ring-white/10">
              <Image
                src="/logo-sensi.png"
                alt="Sensimilla Records"
                fill
                className="object-cover"
                sizes="40px"
              />
            </div>
          </div>
        </header>

        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-24 text-center md:px-10 md:pt-32">
          <p className="font-display text-sm tracking-[0.4em] text-accent/70">
            SENSIMILLA RECORDS
          </p>
          <h1 className="font-display mt-4 text-[clamp(3rem,10vw,7rem)] leading-[0.9] text-white">
            TRABALHE
            <br />
            COM A SENSI
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-fg/60 leading-relaxed md:text-lg">
            Do estúdio até o feed — gravação, produção, audiovisual e estratégia.
            Tudo dentro do ecossistema do selo.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href="https://wa.me/5511918540870?text=Oi%2C%20vim%20pelo%20site%20e%20quero%20saber%20sobre%20os%20servicos"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-accent px-8 py-3 text-sm font-bold uppercase tracking-widest text-bg transition hover:shadow-[0_0_30px_rgba(200,242,74,0.15)]"
            >
              Falar no WhatsApp
            </a>
            <a
              href="#planos"
              className="rounded-full border border-white/15 px-8 py-3 text-sm text-fg/70 transition hover:border-accent/40 hover:text-accent"
            >
              Ver planos ↓
            </a>
          </div>
        </div>
      </div>

      <main id="planos" className="mx-auto max-w-6xl px-6 pb-24 pt-20 md:px-10">

        {/* Para Artistas */}
        <SectionDivider label="Para artistas" />
        <h2 className="font-display mt-6 text-center text-4xl text-white md:text-5xl">
          ESCALA + RECORRÊNCIA
        </h2>
        <p className="mt-2 text-center text-sm text-fg/50">
          Planos mensais e por projeto para quem quer crescer consistente.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {artistPlans.map((plan) => (
            <PlanCard key={plan.tag} {...plan} />
          ))}
        </div>

        {/* Para Marcas */}
        <div className="mt-28">
          <SectionDivider label="Para marcas & criadores" />
          <h2 className="font-display mt-6 text-center text-4xl text-white md:text-5xl">
            ÁUDIO · VÍDEO · DIGITAL
          </h2>
          <p className="mt-2 text-center text-sm text-fg/50">
            Conteúdo com qualidade de gravadora para quem quer se comunicar de verdade.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {brandPlans.map((plan) => (
              <PlanCard key={plan.tag} {...plan} />
            ))}
          </div>
        </div>

        {/* Formatos exclusivos */}
        <div className="mt-28">
          <SectionDivider label="Formatos exclusivos" />
          <h2 className="font-display mt-6 text-center text-4xl text-white md:text-5xl">
            PRODUTOS ORIGINAIS
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {formatos.map((f) => (
              <div
                key={f.name}
                className="group rounded-3xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-accent/30 md:p-8"
              >
                <span className="text-3xl">{f.emoji}</span>
                <p className="font-display mt-3 text-xl tracking-wider text-accent">
                  {f.name}
                </p>
                <p className="mt-3 text-sm text-fg/60 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Avulsos */}
        <div className="mt-28">
          <SectionDivider label="Serviços avulsos" />
          <h2 className="font-display mt-6 text-center text-4xl text-white md:text-5xl">
            SEM PACOTE? SEM PROBLEMA.
          </h2>
          <div className="mx-auto mt-10 max-w-xl">
            <div className="overflow-hidden rounded-3xl border border-white/10 divide-y divide-white/5">
              {avulso.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between px-6 py-5 transition hover:bg-white/[0.02]"
                >
                  <span className="text-sm text-fg/75">{item.label}</span>
                  <span className="font-display text-xl text-accent">
                    {item.price}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-center text-xs text-muted/50">
              Valores sujeitos a ajuste conforme escopo. Consulte antes de fechar.
            </p>
          </div>
        </div>

        {/* Modelos de parceria — do PDF apresentação artista */}
        <div className="mt-28">
          <SectionDivider label="Para artistas que querem ir além" />
          <h2 className="font-display mt-6 text-center text-4xl text-white md:text-5xl">
            MODELOS DE PARCERIA
          </h2>
          <p className="mt-2 text-center text-sm text-fg/50">
            Além de serviços avulsos, trabalhamos com modelos de longo prazo para construção de carreira.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {[
              {
                title: "Pacote completo de lançamento",
                desc: "Produção, clipe, distribuição, Content ID e estratégia — tudo num único pacote fechado.",
              },
              {
                title: "Participação em projetos oficiais",
                desc: "Entre no lineup de SENSI CYPHER, SENSI SESSION ou MEGA SESH com visibilidade cruzada do selo.",
              },
              {
                title: "Gestão artística com divisão de royalties",
                desc: "Investimos na sua carreira e crescemos juntos. Modelo de parceria com split de receita.",
              },
              {
                title: "Contratos de médio prazo",
                desc: "Construção de marca consistente com acompanhamento contínuo — posicionamento, lançamentos e presença digital.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-accent/30 md:p-8"
              >
                <p className="font-semibold text-white">{item.title}</p>
                <p className="mt-2 text-sm text-fg/55 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Diferenciais */}
        <div className="mt-28">
          <SectionDivider label="Por que a Sensimilla" />
          <h2 className="font-display mt-6 text-center text-4xl text-white md:text-5xl">
            NOSSO DIFERENCIAL
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {diferenciais.map((d) => (
              <div key={d.title} className="flex gap-4">
                <div className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-accent" />
                <div>
                  <p className="font-semibold text-white">{d.title}</p>
                  <p className="mt-1.5 text-sm text-fg/55 leading-relaxed">
                    {d.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA final */}
        <div className="mt-28 overflow-hidden rounded-3xl border border-accent/20 bg-gradient-to-br from-accent/[0.06] to-transparent px-6 py-16 text-center md:px-12">
          <p className="font-display text-sm tracking-[0.4em] text-accent/70">
            Contato comercial
          </p>
          <h2 className="font-display mt-4 text-5xl text-white md:text-6xl">
            BORA FECHAR?
          </h2>
          <p className="mx-auto mt-5 max-w-md text-sm text-fg/60 leading-relaxed">
            Manda um Whats pro Sensi Comercial ou chama no Instagram.
            Respondemos rápido e sem enrolação.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="https://wa.me/5511918540870?text=Oi%2C%20vim%20pelo%20site%20da%20Sensimilla%20Records%20e%20quero%20saber%20mais%20sobre%20os%20servicos"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-accent px-10 py-3.5 text-sm font-bold uppercase tracking-widest text-bg transition hover:shadow-[0_0_30px_rgba(200,242,74,0.15)]"
            >
              WhatsApp · (11) 91854-0870
            </a>
            <a
              href="https://www.instagram.com/sensi.rec/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/15 px-10 py-3.5 text-sm text-fg/70 transition hover:border-accent/40 hover:text-accent"
            >
              @sensi.rec no Instagram
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

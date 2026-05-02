import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getSiteUrl } from "@/lib/site-config";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Serviços",
  description:
    "Gravação, produção musical, vídeos e conteúdo digital. Conheça os planos da Sensimilla Records para artistas, marcas e criadores.",
  alternates: { canonical: `${siteUrl}/servicos` },
};

// ─── dados de planos ────────────────────────────────────────────────────────

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
      "1 vídeo profissional (clipe ou visual)",
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
    desc: "Formato de cypher exclusivo do selo — vários artistas, uma faixa, uma estética unificada. Visibilidade cruzada para todos os envolvidos.",
  },
  {
    name: "SENSI SESSION",
    desc: "Sessão gravada ao vivo no estúdio, com captação em vídeo. Conteúdo autêntico e de alto valor para redes sociais.",
  },
  {
    name: "MEGA SESH",
    desc: "Gravação em formato de evento — múltiplos artistas, um dia inteiro de produção, conteúdo para semanas. O maior pacote coletivo da casa.",
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

// ─── sub-componentes ─────────────────────────────────────────────────────────

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
      className={`relative flex flex-col rounded-2xl border p-6 ${
        highlight
          ? "border-accent bg-accent/5 shadow-[0_0_40px_rgba(200,242,74,0.08)]"
          : "border-white/10 bg-white/[0.03]"
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
      <p className="font-display mt-3 text-3xl text-white">{price}</p>
      <p className="text-xs text-muted mt-0.5">{period}</p>
      <p className="mt-4 text-sm text-fg/70 leading-relaxed">{description}</p>
      <ul className="mt-5 space-y-2 flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-fg/85">
            <span className="mt-0.5 text-accent shrink-0">✓</span>
            {f}
          </li>
        ))}
      </ul>
      <a
        href="https://wa.me/5511918540870?text=Oi%2C%20vim%20pelo%20site%20da%20Sensimilla%20e%20quero%20saber%20mais%20sobre%20o%20plano%20"
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-6 block rounded-full py-2.5 text-center text-sm font-semibold tracking-wider transition ${
          highlight
            ? "bg-accent text-bg hover:bg-accent/90"
            : "border border-white/20 text-fg hover:border-accent/50 hover:text-accent"
        }`}
      >
        Quero esse plano
      </a>
    </div>
  );
}

// ─── página ──────────────────────────────────────────────────────────────────

export default function ServicosPage() {
  return (
    <div className="relative min-h-full bg-bg text-fg">
      {/* nav simples */}
      <header className="border-b border-white/10 px-6 py-4 md:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link
            href="/"
            className="text-sm font-medium text-muted transition hover:text-accent"
          >
            ← Início
          </Link>
          <div className="relative h-8 w-8 overflow-hidden rounded-full">
            <Image
              src="/logo-sensi.jpg"
              alt="Sensimilla Records"
              fill
              className="object-cover"
              sizes="32px"
            />
          </div>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-6xl px-6 pb-24 pt-16 md:px-10">

        {/* ── HERO TEXTO ── */}
        <section className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-accent/80 mb-4">
            Sensimilla Records · Serviços
          </p>
          <h1 className="font-display text-[14vw] leading-none text-white sm:text-[10vw] md:text-[8vw] lg:text-[96px]">
            TRABALHE<br className="hidden sm:block" /> COM A SENSI
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-fg/70 leading-relaxed md:text-lg">
            Gravação, produção musical, audiovisual e estratégia de conteúdo.
            Do estúdio até o feed — tudo dentro do ecossistema do selo.
          </p>
        </section>

        {/* ── PARA ARTISTAS ── */}
        <section className="mt-24">
          <div className="mb-2 flex items-center gap-3">
            <span className="h-px flex-1 bg-white/10" />
            <p className="text-xs uppercase tracking-[0.3em] text-muted">
              Para artistas
            </p>
            <span className="h-px flex-1 bg-white/10" />
          </div>
          <h2 className="font-display text-center text-4xl text-white mt-2 md:text-5xl">
            ESCALA + RECORRÊNCIA
          </h2>
          <p className="text-center text-sm text-fg/60 mt-2">
            Planos mensais e por projeto para quem quer crescer de forma consistente.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {artistPlans.map((plan) => (
              <PlanCard key={plan.tag} {...plan} />
            ))}
          </div>
        </section>

        {/* ── PARA MARCAS & CRIADORES ── */}
        <section className="mt-24">
          <div className="mb-2 flex items-center gap-3">
            <span className="h-px flex-1 bg-white/10" />
            <p className="text-xs uppercase tracking-[0.3em] text-muted">
              Para marcas &amp; criadores
            </p>
            <span className="h-px flex-1 bg-white/10" />
          </div>
          <h2 className="font-display text-center text-4xl text-white mt-2 md:text-5xl">
            ÁUDIO · VÍDEO · DIGITAL
          </h2>
          <p className="text-center text-sm text-fg/60 mt-2">
            Conteúdo de qualidade de gravadora para marcas que querem se comunicar de verdade.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {brandPlans.map((plan) => (
              <PlanCard key={plan.tag} {...plan} />
            ))}
          </div>
        </section>

        {/* ── FORMATOS EXCLUSIVOS ── */}
        <section className="mt-24">
          <div className="mb-2 flex items-center gap-3">
            <span className="h-px flex-1 bg-white/10" />
            <p className="text-xs uppercase tracking-[0.3em] text-muted">
              Formatos exclusivos
            </p>
            <span className="h-px flex-1 bg-white/10" />
          </div>
          <h2 className="font-display text-center text-4xl text-white mt-2 md:text-5xl">
            PRODUTOS ORIGINAIS
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {formatos.map((f) => (
              <div
                key={f.name}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
              >
                <p className="font-display text-xl text-accent tracking-wider">
                  {f.name}
                </p>
                <p className="mt-3 text-sm text-fg/70 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── TABELA AVULSA ── */}
        <section className="mt-24">
          <div className="mb-2 flex items-center gap-3">
            <span className="h-px flex-1 bg-white/10" />
            <p className="text-xs uppercase tracking-[0.3em] text-muted">
              Serviços avulsos
            </p>
            <span className="h-px flex-1 bg-white/10" />
          </div>
          <h2 className="font-display text-center text-4xl text-white mt-2 md:text-5xl">
            SEM PACOTE?<br className="hidden sm:block" /> SEM PROBLEMA.
          </h2>
          <div className="mt-10 mx-auto max-w-xl">
            <div className="rounded-2xl border border-white/10 divide-y divide-white/10 overflow-hidden">
              {avulso.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <span className="text-sm text-fg/80">{item.label}</span>
                  <span className="font-display text-lg text-accent">
                    {item.price}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-center text-xs text-muted">
              Valores sujeitos a ajuste conforme escopo. Consulte antes de fechar.
            </p>
          </div>
        </section>

        {/* ── DIFERENCIAIS ── */}
        <section className="mt-24">
          <div className="mb-2 flex items-center gap-3">
            <span className="h-px flex-1 bg-white/10" />
            <p className="text-xs uppercase tracking-[0.3em] text-muted">
              Por que a Sensimilla
            </p>
            <span className="h-px flex-1 bg-white/10" />
          </div>
          <h2 className="font-display text-center text-4xl text-white mt-2 md:text-5xl">
            NOSSO DIFERENCIAL
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {diferenciais.map((d) => (
              <div key={d.title} className="flex gap-4">
                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent" />
                <div>
                  <p className="font-semibold text-white">{d.title}</p>
                  <p className="mt-1 text-sm text-fg/65 leading-relaxed">
                    {d.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section className="mt-24 rounded-3xl border border-accent/20 bg-accent/[0.04] px-6 py-14 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-accent/80">
            Contato comercial
          </p>
          <h2 className="font-display mt-4 text-5xl text-white md:text-6xl">
            BORA FECHAR?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-fg/70 leading-relaxed">
            Manda um Whats para o Sensi Comercial ou chama no Instagram.
            Respondemos rápido e sem enrolação.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="https://wa.me/5511918540870?text=Oi%2C%20vim%20pelo%20site%20da%20Sensimilla%20Records%20e%20quero%20saber%20mais%20sobre%20os%20servicos"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-accent px-8 py-3 text-sm font-bold uppercase tracking-widest text-bg transition hover:bg-accent/90"
            >
              WhatsApp · (11) 91854-0870
            </a>
            <a
              href="https://www.instagram.com/sensi.rec/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/20 px-8 py-3 text-sm font-medium text-fg transition hover:border-accent/50 hover:text-accent"
            >
              @sensi.rec no Instagram
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}

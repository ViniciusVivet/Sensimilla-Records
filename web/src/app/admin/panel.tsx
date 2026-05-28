"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import type { Session, SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { fallbackCmsData } from "@/lib/cms-fallback";

type TableName =
  | "site_events"
  | "site_members"
  | "site_releases"
  | "site_merch"
  | "site_editorial_photos"
  | "site_youtube_videos"
  | "site_social_links";

type Field = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "date" | "number" | "checkbox" | "image" | "json" | "select";
  placeholder?: string;
  help?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
};

type EntityConfig = {
  table: TableName;
  label: string;
  shortLabel: string;
  description: string;
  area: string;
  href: string;
  fields: Field[];
  defaults: Record<string, unknown>;
  titleField: string;
  summaryFields: string[];
};

type Row = Record<string, unknown> & { id?: string };

const configs: EntityConfig[] = [
  {
    table: "site_events",
    label: "Eventos",
    shortLabel: "Agenda",
    description: "Shows e datas que aparecem na secao Tour da home.",
    area: "Home / Tour",
    href: "/#tour",
    titleField: "city",
    summaryFields: ["event_date", "event_time", "venue", "note"],
    defaults: {
      title: "",
      event_date: new Date().toISOString().slice(0, 10),
      event_time: "",
      city: "",
      venue: "",
      note: "Ingressos em breve",
      ticket_url: "",
      status: "scheduled",
      active: true,
      sort_order: 0,
    },
    fields: [
      { name: "event_date", label: "Data", type: "date", required: true },
      { name: "event_time", label: "Horario", type: "text", placeholder: "20:00" },
      { name: "city", label: "Cidade", required: true, placeholder: "Sao Paulo" },
      { name: "venue", label: "Local", required: true, placeholder: "Casa / evento" },
      { name: "note", label: "Chamada", placeholder: "Ingressos em breve" },
      { name: "ticket_url", label: "Link de ingresso", placeholder: "https://..." },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: [
          { label: "Agendado", value: "scheduled" },
          { label: "Passado", value: "past" },
          { label: "Rascunho", value: "draft" },
        ],
      },
      { name: "sort_order", label: "Ordem", type: "number", help: "Numero menor aparece primeiro." },
      { name: "active", label: "Publicado no site", type: "checkbox" },
    ],
  },
  {
    table: "site_members",
    label: "Membros",
    shortLabel: "Equipe",
    description: "Artistas e equipe que aparecem na secao Quem faz a Sensimilla.",
    area: "Home / Equipe",
    href: "/#equipe",
    titleField: "name",
    summaryFields: ["role", "instagram_url", "spotify_url"],
    defaults: {
      slug: "",
      name: "",
      role: "",
      bio: "",
      image_url: "",
      spotify_url: "",
      instagram_url: "",
      youtube_url: "",
      youtube_video_id: "",
      is_placeholder: false,
      active: true,
      sort_order: 0,
    },
    fields: [
      { name: "slug", label: "Slug/id", required: true, placeholder: "nome-sem-espaco", help: "Identificador interno. Use minusculas e hifens." },
      { name: "name", label: "Nome", required: true },
      { name: "role", label: "Funcao", placeholder: "Artista / produtor / direcao" },
      { name: "bio", label: "Bio curta", type: "textarea", help: "Texto direto para card/modal. Evite paragrafo muito longo." },
      { name: "image_url", label: "Foto", type: "image", help: "Suba imagem local ou cole uma URL publica." },
      { name: "spotify_url", label: "Spotify", placeholder: "https://open.spotify.com/..." },
      { name: "instagram_url", label: "Instagram", placeholder: "https://www.instagram.com/..." },
      { name: "youtube_url", label: "YouTube", placeholder: "https://www.youtube.com/..." },
      { name: "youtube_video_id", label: "ID video YouTube", help: "Somente o ID, exemplo: C9Eyy_hnxvs." },
      { name: "sort_order", label: "Ordem", type: "number", help: "Numero menor aparece primeiro." },
      { name: "is_placeholder", label: "Placeholder", type: "checkbox" },
      { name: "active", label: "Publicado no site", type: "checkbox" },
    ],
  },
  {
    table: "site_releases",
    label: "Musicas",
    shortLabel: "Musicas",
    description: "Lancamentos que alimentam Out Now, destaque e mini player.",
    area: "Home / Out Now",
    href: "/#out-now",
    titleField: "title",
    summaryFields: ["artist", "meta", "spotify_embed"],
    defaults: {
      title: "",
      artist: "",
      meta: "Single",
      cover_url: "",
      spotify_embed: "track/",
      href: "",
      cta: "Ouvir no Spotify",
      description: "",
      platforms: [],
      featured: false,
      active: true,
      sort_order: 0,
    },
    fields: [
      { name: "title", label: "Titulo", required: true },
      { name: "artist", label: "Artista", required: true },
      { name: "meta", label: "Meta" },
      { name: "cover_url", label: "Capa", type: "image", required: true },
      { name: "spotify_embed", label: "Spotify embed", required: true, placeholder: "track/ID ou artist/ID", help: "Cole como track/2gU... ou artist/7gI..." },
      { name: "href", label: "Link principal", placeholder: "https://open.spotify.com/..." },
      { name: "cta", label: "Texto do botao" },
      { name: "description", label: "Descricao do destaque", type: "textarea" },
      { name: "platforms", label: "Links de plataformas (JSON)", type: "json", help: "Opcional. Formato: [{\"name\":\"Spotify\",\"href\":\"https://...\"}]" },
      { name: "sort_order", label: "Ordem", type: "number", help: "Numero menor aparece primeiro." },
      { name: "featured", label: "Destaque da home", type: "checkbox" },
      { name: "active", label: "Publicado no site", type: "checkbox" },
    ],
  },
  {
    table: "site_merch",
    label: "Merch",
    shortLabel: "Merch",
    description: "Produtos que aparecem na vitrine da home.",
    area: "Home / Merch",
    href: "/#merch",
    titleField: "name",
    summaryFields: ["tag", "price"],
    defaults: { name: "", tag: "", price: "", image_url: "", active: true, sort_order: 0 },
    fields: [
      { name: "name", label: "Nome", required: true },
      { name: "tag", label: "Categoria" },
      { name: "price", label: "Preco" },
      { name: "image_url", label: "Imagem", type: "image", required: true },
      { name: "sort_order", label: "Ordem", type: "number", help: "Numero menor aparece primeiro." },
      { name: "active", label: "Publicado no site", type: "checkbox" },
    ],
  },
  {
    table: "site_editorial_photos",
    label: "Galeria",
    shortLabel: "Galeria",
    description: "Fotos da secao Visuais/editorial.",
    area: "Home / Visuais",
    href: "/#visuais",
    titleField: "alt",
    summaryFields: ["src"],
    defaults: { src: "", alt: "", active: true, sort_order: 0 },
    fields: [
      { name: "src", label: "Imagem", type: "image", required: true },
      { name: "alt", label: "Texto alternativo", required: true, help: "Descreva a imagem para acessibilidade e SEO." },
      { name: "sort_order", label: "Ordem", type: "number", help: "Numero menor aparece primeiro." },
      { name: "active", label: "Publicado no site", type: "checkbox" },
    ],
  },
  {
    table: "site_youtube_videos",
    label: "YouTube",
    shortLabel: "YouTube",
    description: "Videos embedados no hub de YouTube da home.",
    area: "Home / YouTube",
    href: "/#youtube",
    titleField: "title",
    summaryFields: ["youtube_id"],
    defaults: { youtube_id: "", title: "", active: true, sort_order: 0 },
    fields: [
      { name: "youtube_id", label: "ID do video", required: true, help: "Somente o ID, exemplo: C9Eyy_hnxvs." },
      { name: "title", label: "Titulo", required: true },
      { name: "sort_order", label: "Ordem", type: "number", help: "Numero menor aparece primeiro." },
      { name: "active", label: "Publicado no site", type: "checkbox" },
    ],
  },
  {
    table: "site_social_links",
    label: "Redes",
    shortLabel: "Redes",
    description: "Links globais usados no hero e no rodape.",
    area: "Home / Hero e rodape",
    href: "/",
    titleField: "name",
    summaryFields: ["href"],
    defaults: { name: "", href: "", active: true, sort_order: 0 },
    fields: [
      { name: "name", label: "Nome", required: true, placeholder: "Instagram" },
      { name: "href", label: "URL", required: true, placeholder: "https://..." },
      { name: "sort_order", label: "Ordem", type: "number", help: "Numero menor aparece primeiro." },
      { name: "active", label: "Publicado no site", type: "checkbox" },
    ],
  },
];

const settingFields = [
  { key: "heroLogo", label: "Logo do hero" },
  { key: "bannerImage", label: "Banner principal" },
  { key: "footerBanner", label: "Banner do rodape" },
  { key: "heroVideoSrc", label: "Video do hero" },
  { key: "verticalReelVideoId", label: "ID do clipe vertical" },
];

function inputValue(value: unknown) {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  return String(value);
}

function rowValue(row: Row, fieldName: string) {
  return inputValue(row[fieldName]).trim();
}

function isPublished(row: Row) {
  return row.active !== false;
}

function imageFieldFor(config: EntityConfig) {
  return config.fields.find((field) => field.type === "image")?.name;
}

function rowSummary(row: Row, config: EntityConfig) {
  return config.summaryFields
    .map((fieldName) => rowValue(row, fieldName))
    .filter(Boolean)
    .slice(0, 3)
    .join(" - ");
}

function searchText(row: Row, config: EntityConfig) {
  return [rowValue(row, config.titleField), rowSummary(row, config)]
    .join(" ")
    .toLowerCase();
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${
        active
          ? "border-accent/30 bg-accent/10 text-accent"
          : "border-white/10 bg-white/[0.03] text-muted"
      }`}
    >
      {active ? "Publicado" : "Rascunho"}
    </span>
  );
}

function EventStatusBadge({ status, active }: { status: string; active: boolean }) {
  const label = !active
    ? "Oculto"
    : status === "past"
      ? "Passado"
      : status === "draft"
        ? "Rascunho"
        : "Agendado";
  const styles = !active
    ? "border-white/10 bg-white/[0.03] text-muted"
    : status === "past"
      ? "border-white/15 bg-white/[0.05] text-fg/70"
      : status === "draft"
        ? "border-yellow-300/30 bg-yellow-300/10 text-yellow-200"
        : "border-accent/30 bg-accent/10 text-accent";

  return (
    <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${styles}`}>
      {label}
    </span>
  );
}

function StatusMessage({ children }: { children: string }) {
  if (!children) return null;
  return (
    <p
      role="status"
      className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-muted"
    >
      {children}
    </p>
  );
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

type CalendarView = "day" | "week" | "month" | "year";

const monthFormatter = new Intl.DateTimeFormat("pt-BR", {
  month: "long",
  year: "numeric",
});
const shortMonthFormatter = new Intl.DateTimeFormat("pt-BR", { month: "short" });
const weekdayFormatter = new Intl.DateTimeFormat("pt-BR", { weekday: "short" });

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateKey(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function addMonths(date: Date, months: number) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}

function startOfWeek(date: Date) {
  const next = new Date(date);
  next.setDate(next.getDate() - next.getDay());
  return next;
}

function calendarTitle(date: Date, view: CalendarView) {
  if (view === "year") return String(date.getFullYear());
  if (view === "day") {
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }
  if (view === "week") {
    const start = startOfWeek(date);
    const end = addDays(start, 6);
    return `${start.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })} - ${end.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}`;
  }
  return monthFormatter.format(date);
}

function moveCalendar(date: Date, view: CalendarView, amount: number) {
  if (view === "day") return addDays(date, amount);
  if (view === "week") return addDays(date, amount * 7);
  if (view === "year") return new Date(date.getFullYear() + amount, 0, 1);
  return addMonths(date, amount);
}

function inferFallbackEventDate(event: { date?: string; month?: string; day?: string }) {
  if (event.date) return event.date;
  const monthMap: Record<string, number> = {
    JAN: 1,
    FEV: 2,
    MAR: 3,
    ABR: 4,
    MAI: 5,
    JUN: 6,
    JUL: 7,
    AGO: 8,
    SET: 9,
    OUT: 10,
    NOV: 11,
    DEZ: 12,
  };
  const month = monthMap[(event.month || "").toUpperCase()];
  const day = Number(event.day);
  if (!month || !day) return "";
  return `${new Date().getFullYear()}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function fallbackEventRows() {
  return fallbackCmsData.events.map((event, index) => ({
    title: `${event.city} - ${event.venue}`,
    event_date: inferFallbackEventDate(event),
    event_time: "",
    city: event.city,
    venue: event.venue,
    note: event.note,
    ticket_url: event.ticketUrl || "",
    status: event.status || "past",
    active: true,
    sort_order: index * 10,
  }));
}

function fallbackMemberRows() {
  return fallbackCmsData.members.map((member, index) => ({
    id: `fallback-${member.id}`,
    _fallback: true,
    slug: member.id,
    name: member.name,
    role: member.role || "",
    bio: member.bio || "",
    image_url: member.image || "",
    spotify_url: member.spotifyUrl || "",
    instagram_url: member.instagramUrl || "",
    youtube_url: member.youtubeUrl || "",
    youtube_video_id: member.youtubeVideoId || "",
    is_placeholder: Boolean(member.isPlaceholder),
    active: true,
    sort_order: index * 10,
  }));
}

function fallbackReleaseRows() {
  const rows = fallbackCmsData.releases.map((release, index) => ({
    id: `fallback-release-${release.spotifyEmbed || release.title}`,
    _fallback: true,
    title: release.title,
    artist: release.artist,
    meta: release.meta,
    cover_url: release.cover,
    spotify_embed: release.spotifyEmbed,
    href: release.href || (release.spotifyEmbed ? `https://open.spotify.com/${release.spotifyEmbed}` : ""),
    cta: release.cta || "Ouvir no Spotify",
    description: release.description || "",
    platforms: release.platforms || [],
    featured: Boolean(release.featured),
    active: true,
    sort_order: index * 10,
  }));

  const featured = fallbackCmsData.featuredRelease;
  const featuredKey = featured.spotifyEmbed || featured.title;
  if (!rows.some((row) => releaseKey(row) === featuredKey.toLowerCase())) {
    rows.unshift({
      id: `fallback-release-${featuredKey}`,
      _fallback: true,
      title: featured.title,
      artist: featured.subtitle,
      meta: "Destaque",
      cover_url: featured.cover,
      spotify_embed: featured.spotifyEmbed,
      href: featured.href,
      cta: featured.cta,
      description: featured.description,
      platforms: featured.platforms,
      featured: true,
      active: true,
      sort_order: -10,
    });
  }

  return rows;
}

function eventKey(row: Row) {
  return [
    rowValue(row, "event_date"),
    rowValue(row, "city").toLowerCase(),
    rowValue(row, "venue").toLowerCase(),
  ].join("|");
}

function memberKey(row: Row) {
  return (rowValue(row, "slug") || rowValue(row, "name")).toLowerCase();
}

function memberName(row: Row) {
  return rowValue(row, "name") || "Membro sem nome";
}

function releaseKey(row: Row) {
  return (rowValue(row, "spotify_embed") || rowValue(row, "title")).toLowerCase();
}

function releaseTitle(row: Row) {
  return rowValue(row, "title") || "Musica sem titulo";
}

function eventTitle(row: Row) {
  return rowValue(row, "title") || `${rowValue(row, "city") || "Evento"} - ${rowValue(row, "venue") || "sem local"}`;
}

function formatEventDate(row: Row) {
  const date = rowValue(row, "event_date");
  if (!date) return "Sem data";
  const parsed = parseDateKey(date);
  return parsed.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function eventSortValue(row: Row) {
  return `${rowValue(row, "event_date")}T${rowValue(row, "event_time") || "23:59"}`;
}

function splitEvents(rows: Row[]) {
  const today = toDateKey(new Date());
  const visible = [...rows].sort((a, b) => eventSortValue(a).localeCompare(eventSortValue(b)));
  return {
    upcoming: visible.filter((row) => rowValue(row, "event_date") >= today && rowValue(row, "status") !== "past"),
    past: visible.filter((row) => rowValue(row, "event_date") < today || rowValue(row, "status") === "past").reverse(),
  };
}

function inputClass() {
  return "mt-2 w-full rounded-xl border border-white/15 bg-bg px-3 py-3 text-sm text-fg outline-none focus:border-accent";
}

function AdminPreview({ config, form }: { config: EntityConfig; form: Row }) {
  if (config.table === "site_events") {
    return <EventPreview form={form} />;
  }

  if (config.table === "site_members") {
    return (
      <PreviewShell title="Previa na equipe">
        <div className="flex gap-3 rounded-xl border border-white/10 bg-bg/70 p-3">
          <PreviewImage src={rowValue(form, "image_url")} label="Foto" />
          <div className="min-w-0">
            <p className="font-display text-2xl">{rowValue(form, "name") || "Nome do membro"}</p>
            <p className="truncate text-xs uppercase tracking-wider text-accent">
              {rowValue(form, "role") || "Funcao"}
            </p>
            <p className="mt-2 line-clamp-3 text-sm text-muted">
              {rowValue(form, "bio") || "Bio curta aparece aqui."}
            </p>
          </div>
        </div>
      </PreviewShell>
    );
  }

  if (config.table === "site_releases") {
    return (
      <PreviewShell title="Previa no Out Now">
        <div className="rounded-xl border border-white/10 bg-bg/70 p-3">
          <PreviewImage src={rowValue(form, "cover_url")} label="Capa" square />
          <p className="font-display mt-3 text-2xl">{rowValue(form, "title") || "Titulo da musica"}</p>
          <p className="text-sm text-muted">{rowValue(form, "artist") || "Artista"}</p>
          <p className="mt-1 text-xs uppercase tracking-wider text-accent">
            {rowValue(form, "meta") || "Single"}
          </p>
          {form.featured ? (
            <span className="mt-3 inline-flex rounded-full border border-accent/30 px-3 py-1 text-xs text-accent">
              Destaque da home
            </span>
          ) : null}
        </div>
      </PreviewShell>
    );
  }

  if (config.table === "site_merch") {
    return (
      <PreviewShell title="Previa no merch">
        <div className="rounded-xl border border-white/10 bg-bg/70 p-3">
          <PreviewImage src={rowValue(form, "image_url")} label="Produto" square />
          <p className="font-display mt-3 text-2xl">{rowValue(form, "name") || "Produto"}</p>
          <p className="text-xs uppercase tracking-wider text-muted">{rowValue(form, "tag") || "Categoria"}</p>
          <p className="mt-2 text-sm font-bold text-accent">{rowValue(form, "price") || "Preco"}</p>
        </div>
      </PreviewShell>
    );
  }

  if (config.table === "site_editorial_photos") {
    return (
      <PreviewShell title="Previa na galeria">
        <div className="rounded-xl border border-white/10 bg-bg/70 p-3">
          <PreviewImage src={rowValue(form, "src")} label="Imagem" />
          <p className="mt-2 text-xs text-muted">{rowValue(form, "alt") || "Texto alternativo"}</p>
        </div>
      </PreviewShell>
    );
  }

  if (config.table === "site_youtube_videos") {
    const videoId = rowValue(form, "youtube_id");
    return (
      <PreviewShell title="Previa no YouTube">
        <div className="rounded-xl border border-white/10 bg-bg/70 p-3">
          <div className="aspect-video rounded-lg border border-white/10 bg-black/50">
            {videoId ? (
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title={rowValue(form, "title") || "Video"}
                className="h-full w-full rounded-lg"
                allowFullScreen
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted">
                Cole um ID do YouTube
              </div>
            )}
          </div>
          <p className="mt-2 text-sm font-bold">{rowValue(form, "title") || "Titulo do video"}</p>
        </div>
      </PreviewShell>
    );
  }

  if (config.table === "site_social_links") {
    return (
      <PreviewShell title="Previa no hero/rodape">
        <div className="flex items-center justify-between rounded-full border border-white/15 bg-bg/70 px-4 py-3">
          <span className="text-sm font-bold">{rowValue(form, "name") || "Rede"}</span>
          <span className="max-w-[14rem] truncate text-xs text-muted">{rowValue(form, "href") || "https://..."}</span>
        </div>
      </PreviewShell>
    );
  }

  return null;
}

function EventPreview({ form }: { form: Row }) {
  const date = rowValue(form, "event_date");
  const parsed = date ? parseDateKey(date) : new Date();
  return (
    <PreviewShell title="Previa na home / Tour">
      <div className="rounded-xl border border-white/10 bg-bg/70 p-4">
        <div className="flex items-baseline gap-3">
          <span className="font-display text-4xl text-accent">
            {String(parsed.getDate()).padStart(2, "0")}
          </span>
          <span className="text-sm uppercase tracking-widest text-muted">
            {shortMonthFormatter.format(parsed).replace(".", "")}
          </span>
        </div>
        <p className="font-display mt-4 text-2xl">{rowValue(form, "city") || "Cidade"}</p>
        <p className="text-sm text-muted">{rowValue(form, "venue") || "Local"}</p>
        {rowValue(form, "event_time") ? (
          <p className="mt-2 text-xs uppercase tracking-wider text-accent">
            {rowValue(form, "event_time")}
          </p>
        ) : null}
        <p className="mt-3 text-xs uppercase tracking-wider text-fg/50">
          {rowValue(form, "note") || "Chamada do evento"}
        </p>
        <span className="mt-4 inline-flex rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-wider text-muted">
          {rowValue(form, "ticket_url") ? "Ingressos" : "Em breve"}
        </span>
      </div>
    </PreviewShell>
  );
}

function PreviewShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <aside className="mt-5 rounded-2xl border border-accent/20 bg-accent/5 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">{title}</p>
      <div className="mt-3">{children}</div>
      <p className="mt-3 text-[11px] text-muted">
        Esta previa e aproximada. A home final ainda depende do layout da secao e do tamanho da tela.
      </p>
    </aside>
  );
}

function PreviewImage({
  src,
  label,
  square = false,
}: {
  src: string;
  label: string;
  square?: boolean;
}) {
  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black/30 ${
        square ? "aspect-square w-full" : "h-24 w-24"
      }`}
    >
      {src ? (
        <Image src={src} alt="" fill sizes="220px" unoptimized className="object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-xs text-muted">
          {label}
        </div>
      )}
    </div>
  );
}

function MembersSectionPreview({
  rows,
  draft,
  editingId,
  onEdit,
}: {
  rows: Row[];
  draft: Row;
  editingId: string | null;
  onEdit: (row: Row) => void;
}) {
  const mergedRows = useMemo(() => {
    const normalized = rows.map((row) =>
      editingId && String(row.id) === editingId ? { ...row, ...draft } : row,
    );
    if (!editingId && rowValue(draft, "name")) {
      normalized.push({ ...draft, id: "__draft" });
    }
    return normalized
      .filter((row) => row.active !== false)
      .sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0));
  }, [draft, editingId, rows]);

  return (
    <section className="rounded-2xl border border-accent/20 bg-panel p-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-accent">Previa da secao</p>
          <h3 className="font-display mt-1 text-4xl">Quem faz a Sensimilla</h3>
          <p className="mt-1 text-sm text-muted">
            Aproximacao do carrossel da home. Clique em um card para editar.
          </p>
        </div>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted">
          {mergedRows.length} visiveis
        </span>
      </div>

      <div className="mt-5 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {mergedRows.map((member, index) => {
          const isDraft = member.id === "__draft";
          const isEditing = editingId && String(member.id) === editingId;
          return (
            <button
              key={String(member.id ?? memberKey(member))}
              type="button"
              onClick={() => !isDraft && onEdit(member)}
              className={`group relative w-[220px] shrink-0 overflow-hidden rounded-2xl border text-left transition hover:scale-[1.01] ${
                isDraft || isEditing
                  ? "border-accent ring-1 ring-accent/40"
                  : index === 0
                    ? "border-accent/40 ring-1 ring-accent/20"
                    : "border-white/10"
              }`}
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-bg">
                {rowValue(member, "image_url") ? (
                  <Image
                    src={rowValue(member, "image_url")}
                    alt=""
                    fill
                    sizes="220px"
                    unoptimized
                    className="object-cover transition duration-700 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-bg/10 via-bg/5 to-accent/20">
                    <span className="font-display text-5xl text-fg/25">?</span>
                    <span className="mt-2 text-xs uppercase tracking-[0.25em] text-fg/40">
                      Sem foto
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-display text-2xl text-white">{memberName(member)}</h4>
                  {isDraft && (
                    <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-bg">
                      previa
                    </span>
                  )}
                </div>
                {rowValue(member, "role") && (
                  <p className="mt-1 line-clamp-1 text-[10px] uppercase tracking-wider text-white/60">
                    {rowValue(member, "role")}
                  </p>
                )}
                {rowValue(member, "bio") && (
                  <p className="mt-2 line-clamp-3 text-[11px] leading-relaxed text-white/55">
                    {rowValue(member, "bio")}
                  </p>
                )}
              </div>
            </button>
          );
        })}
        {!mergedRows.length && (
          <div className="rounded-xl border border-white/10 bg-bg/70 p-6 text-sm text-muted">
            Nenhum membro publicado para prever.
          </div>
        )}
      </div>
    </section>
  );
}

function MemberList({
  rows,
  onEdit,
  onTogglePublished,
  onDuplicate,
  onRemove,
}: {
  rows: Row[];
  onEdit: (row: Row) => void;
  onTogglePublished: (row: Row) => void;
  onDuplicate: (row: Row) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-panel p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-3xl">Membros cadastrados</h3>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted">
          {rows.length}
        </span>
      </div>
      <div className="mt-3 space-y-2">
        {rows.map((row) => (
          <article key={String(row.id)} className="rounded-xl border border-white/10 bg-bg/70 p-3">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <PreviewImage src={rowValue(row, "image_url")} label="Foto" />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-bold text-fg">{memberName(row)}</p>
                    {row._fallback ? (
                      <span className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-accent">
                        No site / fora do CMS
                      </span>
                    ) : (
                      <StatusBadge active={row.active !== false} />
                    )}
                  </div>
                  <p className="mt-1 truncate text-sm text-muted">
                    {rowValue(row, "role") || "Sem funcao"} - ordem {rowValue(row, "sort_order") || "0"}
                  </p>
                  <p className="mt-1 truncate text-xs text-fg/50">
                    {rowValue(row, "instagram_url") || rowValue(row, "spotify_url") || "Sem links"}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 md:justify-end">
                {!row._fallback && (
                  <>
                    <button
                      type="button"
                      onClick={() => onTogglePublished(row)}
                      className="rounded-full border border-white/15 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-fg hover:border-accent hover:text-accent"
                    >
                      {row.active === false ? "Publicar" : "Ocultar"}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDuplicate(row)}
                      className="rounded-full border border-white/15 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-fg hover:border-accent hover:text-accent"
                    >
                      Duplicar
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => onEdit(row)}
                  className="rounded-full border border-white/15 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-fg hover:border-accent hover:text-accent"
                >
                  {row._fallback ? "Trazer para o painel" : "Editar"}
                </button>
                {!row._fallback && (
                  <button
                    type="button"
                    onClick={() => row.id && onRemove(String(row.id))}
                    className="rounded-full border border-red-500/30 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-red-300 hover:border-red-400"
                  >
                    Apagar
                  </button>
                )}
              </div>
            </div>
          </article>
        ))}
        {!rows.length && <p className="py-4 text-sm text-muted">Nenhum membro cadastrado no CMS.</p>}
      </div>
    </section>
  );
}

function ReleasesSectionPreview({
  rows,
  draft,
  editingId,
  onEdit,
}: {
  rows: Row[];
  draft: Row;
  editingId: string | null;
  onEdit: (row: Row) => void;
}) {
  const mergedRows = useMemo(() => {
    const normalized = rows.map((row) =>
      editingId && String(row.id) === editingId ? { ...row, ...draft } : row,
    );
    if (!editingId && rowValue(draft, "title")) {
      normalized.push({ ...draft, id: "__draft" });
    }
    return normalized
      .filter((row) => row.active !== false)
      .sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0));
  }, [draft, editingId, rows]);

  const featured = mergedRows.find((row) => Boolean(row.featured)) ?? mergedRows[0];

  return (
    <section className="rounded-2xl border border-accent/20 bg-panel p-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-accent">Previa da secao</p>
          <h3 className="font-display mt-1 text-4xl">Out Now / Destaque</h3>
          <p className="mt-1 text-sm text-muted">
            Aproximacao de como a lista de musicas e o destaque aparecem na home.
          </p>
        </div>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted">
          {mergedRows.length} visiveis
        </span>
      </div>

      {featured && (
        <div className="mt-5 grid gap-4 rounded-2xl border border-white/10 bg-sage p-4 text-bg md:grid-cols-[160px_minmax(0,1fr)]">
          <PreviewImage src={rowValue(featured, "cover_url")} label="Capa" square />
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.25em] text-bg/55">
              {rowValue(featured, "artist") || "Destaque"}
            </p>
            <h4 className="font-display mt-2 text-4xl">{releaseTitle(featured)}</h4>
            <p className="mt-3 line-clamp-3 text-sm text-bg/70">
              {rowValue(featured, "description") || "Descricao do destaque aparece aqui."}
            </p>
          </div>
        </div>
      )}

      <div className="mt-5 space-y-2">
        {mergedRows.map((release) => {
          const isDraft = release.id === "__draft";
          const isEditing = editingId && String(release.id) === editingId;
          return (
            <button
              key={String(release.id ?? releaseKey(release))}
              type="button"
              onClick={() => !isDraft && onEdit(release)}
              className={`flex w-full gap-3 rounded-2xl border bg-bg/70 p-3 text-left transition hover:border-accent ${
                isDraft || isEditing ? "border-accent ring-1 ring-accent/40" : "border-white/10"
              }`}
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/30">
                {rowValue(release, "cover_url") ? (
                  <Image
                    src={rowValue(release, "cover_url")}
                    alt=""
                    fill
                    sizes="80px"
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted">Capa</div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-display truncate text-2xl">{releaseTitle(release)}</p>
                  {release.featured ? (
                    <span className="rounded-full border border-accent/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
                      destaque
                    </span>
                  ) : null}
                  {isDraft ? (
                    <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-bg">
                      previa
                    </span>
                  ) : null}
                </div>
                <p className="truncate text-sm text-muted">{rowValue(release, "artist") || "Artista"}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-muted/80">
                  {rowValue(release, "meta") || "Single"} - ordem {rowValue(release, "sort_order") || "0"}
                </p>
              </div>
            </button>
          );
        })}
        {!mergedRows.length && (
          <div className="rounded-xl border border-white/10 bg-bg/70 p-6 text-sm text-muted">
            Nenhuma musica publicada para prever.
          </div>
        )}
      </div>
    </section>
  );
}

function ReleaseList({
  rows,
  onEdit,
  onTogglePublished,
  onDuplicate,
  onRemove,
}: {
  rows: Row[];
  onEdit: (row: Row) => void;
  onTogglePublished: (row: Row) => void;
  onDuplicate: (row: Row) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-panel p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-3xl">Musicas cadastradas</h3>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted">
          {rows.length}
        </span>
      </div>
      <div className="mt-3 space-y-2">
        {rows.map((row) => (
          <article key={String(row.id)} className="rounded-xl border border-white/10 bg-bg/70 p-3">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <PreviewImage src={rowValue(row, "cover_url")} label="Capa" />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-bold text-fg">{releaseTitle(row)}</p>
                    {row._fallback ? (
                      <span className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-accent">
                        No site / fora do painel
                      </span>
                    ) : (
                      <StatusBadge active={row.active !== false} />
                    )}
                    {row.featured ? (
                      <span className="rounded-full border border-accent/30 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-accent">
                        Destaque
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 truncate text-sm text-muted">
                    {rowValue(row, "artist") || "Sem artista"} - {rowValue(row, "meta") || "Single"} - ordem {rowValue(row, "sort_order") || "0"}
                  </p>
                  <p className="mt-1 truncate text-xs text-fg/50">
                    {rowValue(row, "spotify_embed") || "Sem Spotify embed"}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 md:justify-end">
                {!row._fallback && (
                  <>
                    <button
                      type="button"
                      onClick={() => onTogglePublished(row)}
                      className="rounded-full border border-white/15 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-fg hover:border-accent hover:text-accent"
                    >
                      {row.active === false ? "Publicar" : "Ocultar"}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDuplicate(row)}
                      className="rounded-full border border-white/15 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-fg hover:border-accent hover:text-accent"
                    >
                      Duplicar
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => onEdit(row)}
                  className="rounded-full border border-white/15 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-fg hover:border-accent hover:text-accent"
                >
                  {row._fallback ? "Trazer para o painel" : "Editar"}
                </button>
                {!row._fallback && (
                  <button
                    type="button"
                    onClick={() => row.id && onRemove(String(row.id))}
                    className="rounded-full border border-red-500/30 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-red-300 hover:border-red-400"
                  >
                    Apagar
                  </button>
                )}
              </div>
            </div>
          </article>
        ))}
        {!rows.length && <p className="py-4 text-sm text-muted">Nenhuma musica cadastrada no CMS.</p>}
      </div>
    </section>
  );
}

async function uploadFile(
  supabase: SupabaseClient,
  file: File,
  folder: string,
) {
  const ext = file.name.split(".").pop() || "bin";
  const path = `${folder}/${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ""))}.${ext}`;
  const { error } = await supabase.storage.from("site-media").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  return supabase.storage.from("site-media").getPublicUrl(path).data.publicUrl;
}

function Login({ supabase }: { supabase: SupabaseClient }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setStatus("Entrando...");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setStatus(error ? error.message : "");
  }

  return (
    <main className="flex min-h-screen items-center bg-bg px-6 py-16 text-fg">
      <form
        onSubmit={submit}
        className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-panel p-6 shadow-2xl shadow-black/30"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-accent">Admin</p>
        <h1 className="font-display mt-2 text-5xl">Sensimilla CMS</h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Entre para atualizar agenda, equipe, musicas, merch, videos e imagens do site.
        </p>
        <label className="mt-8 block text-xs uppercase tracking-wider text-muted">
          E-mail
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            autoComplete="email"
            required
            className="mt-2 w-full rounded-xl border border-white/15 bg-bg px-4 py-3 text-fg outline-none focus:border-accent"
          />
        </label>
        <label className="mt-4 block text-xs uppercase tracking-wider text-muted">
          Senha
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            autoComplete="current-password"
            required
            className="mt-2 w-full rounded-xl border border-white/15 bg-bg px-4 py-3 text-fg outline-none focus:border-accent"
          />
        </label>
        <button className="mt-6 w-full rounded-full bg-accent px-5 py-3 text-sm font-bold text-bg">
          Entrar
        </button>
        <div className="mt-4">
          <StatusMessage>{status}</StatusMessage>
        </div>
      </form>
    </main>
  );
}

function EventCalendar({
  rows,
  selectedDate,
  highlightedDate,
  onSelectDate,
  onEditEvent,
}: {
  rows: Row[];
  selectedDate: Date;
  highlightedDate?: string;
  onSelectDate: (date: Date) => void;
  onEditEvent: (row: Row) => void;
}) {
  const [view, setView] = useState<CalendarView>("month");
  const [cursor, setCursor] = useState(selectedDate);
  const todayKey = toDateKey(new Date());
  const selectedKey = toDateKey(selectedDate);

  const eventsByDate = useMemo(() => {
    return rows.reduce<Record<string, Row[]>>((acc, row) => {
      const date = rowValue(row, "event_date");
      if (!date) return acc;
      acc[date] = [...(acc[date] ?? []), row];
      return acc;
    }, {});
  }, [rows]);

  function chooseDate(date: Date) {
    setCursor(date);
    onSelectDate(date);
  }

  function renderEventPills(dateKey: string, compact = false) {
    return (eventsByDate[dateKey] ?? []).slice(0, compact ? 1 : 4).map((event) => (
      <button
        key={String(event.id ?? `${dateKey}-${rowValue(event, "venue")}`)}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onEditEvent(event);
        }}
        className="block w-full truncate rounded-md bg-accent/15 px-1.5 py-0.5 text-left text-[10px] font-bold text-accent hover:bg-accent hover:text-bg"
      >
        {rowValue(event, "city") || rowValue(event, "venue") || "Evento"}
      </button>
    ));
  }

  function renderDayCell(date: Date, muted = false) {
    const dateKey = toDateKey(date);
    const dayEvents = eventsByDate[dateKey] ?? [];
    return (
      <div
        key={dateKey}
        className={`min-h-16 rounded-lg border p-1.5 text-left transition hover:border-accent md:min-h-20 ${
          selectedKey === dateKey
            ? "border-accent bg-accent/10"
            : "border-white/10 bg-bg/70"
        } ${highlightedDate === dateKey ? "ring-2 ring-accent/50" : ""} ${muted ? "opacity-45" : ""}`}
      >
        <button
          type="button"
          onClick={() => chooseDate(date)}
          className="flex w-full items-center justify-between gap-2 text-left"
        >
          <span className="text-[11px] font-bold text-fg">{date.getDate()}</span>
          {todayKey === dateKey && (
            <span className="rounded-full bg-accent px-1.5 py-0.5 text-[9px] font-bold text-bg">
              hoje
            </span>
          )}
        </button>
        <span className="mt-1 block space-y-1">
          {dayEvents.length ? (
            renderEventPills(dateKey, true)
          ) : (
            <button
              type="button"
              onClick={() => chooseDate(date)}
              className="text-left text-[10px] text-muted hover:text-accent"
            >
              +
            </button>
          )}
        </span>
      </div>
    );
  }

  const monthDays = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const start = startOfWeek(first);
    return Array.from({ length: 42 }, (_, index) => addDays(start, index));
  }, [cursor]);

  const weekDays = useMemo(() => {
    const start = startOfWeek(cursor);
    return Array.from({ length: 7 }, (_, index) => addDays(start, index));
  }, [cursor]);

  const previousLabel =
    view === "month" ? "Mes anterior" : view === "week" ? "Semana anterior" : view === "day" ? "Dia anterior" : "Ano anterior";
  const nextLabel =
    view === "month" ? "Proximo mes" : view === "week" ? "Proxima semana" : view === "day" ? "Proximo dia" : "Proximo ano";

  return (
    <section className="rounded-2xl border border-white/10 bg-panel p-3">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-accent">Calendario</p>
          <h3 className="font-display mt-1 text-3xl capitalize">{calendarTitle(cursor, view)}</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {(["day", "week", "month", "year"] as CalendarView[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setView(item)}
              className={`rounded-full border px-3 py-2 text-xs font-bold uppercase tracking-wider ${
                view === item
                  ? "border-accent bg-accent text-bg"
                  : "border-white/15 text-muted hover:border-accent hover:text-accent"
              }`}
            >
              {item === "day" ? "Dia" : item === "week" ? "Semana" : item === "month" ? "Mes" : "Ano"}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setCursor((current) => moveCalendar(current, view, -1))}
            className="rounded-full border border-white/15 px-3 py-2 text-xs font-bold text-fg hover:border-accent hover:text-accent"
          >
            {previousLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              const now = new Date();
              setCursor(now);
              onSelectDate(now);
            }}
            className="rounded-full border border-white/15 px-3 py-2 text-xs font-bold text-fg hover:border-accent hover:text-accent"
          >
            Hoje
          </button>
          <button
            type="button"
            onClick={() => setCursor((current) => moveCalendar(current, view, 1))}
            className="rounded-full border border-white/15 px-3 py-2 text-xs font-bold text-fg hover:border-accent hover:text-accent"
          >
            {nextLabel}
          </button>
        </div>
        <p className="text-xs text-muted">Clique em um dia para iniciar um evento nessa data.</p>
      </div>

      {view === "month" && (
        <div className="mt-3">
          <div className="grid grid-cols-7 gap-1 pb-2 text-center text-[10px] font-bold uppercase tracking-wider text-muted md:gap-2 md:text-[11px]">
            {weekDays.map((day) => (
              <span key={day.getDay()}>{weekdayFormatter.format(day)}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 md:gap-2">
            {monthDays.map((day) => renderDayCell(day, day.getMonth() !== cursor.getMonth()))}
          </div>
        </div>
      )}

      {view === "week" && (
        <div className="mt-3 grid grid-cols-7 gap-1 md:gap-2">
          {weekDays.map((day) => renderDayCell(day))}
        </div>
      )}

      {view === "day" && (
        <div className="mt-4 rounded-2xl border border-white/10 bg-bg/70 p-4">
          <div className="rounded-xl border border-white/10 p-4">
            <span className="font-display text-4xl">{cursor.getDate()}</span>
            <span className="ml-3 text-sm capitalize text-muted">
              {cursor.toLocaleDateString("pt-BR", { weekday: "long", month: "long", year: "numeric" })}
            </span>
            <span className="mt-4 block space-y-2">
              {(eventsByDate[toDateKey(cursor)] ?? []).length
                ? renderEventPills(toDateKey(cursor))
                : (
                  <button
                    type="button"
                    onClick={() => chooseDate(cursor)}
                    className="text-sm text-muted hover:text-accent"
                  >
                    Nenhum evento. Clique para criar.
                  </button>
                )}
            </span>
          </div>
        </div>
      )}

      {view === "year" && (
        <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
          {Array.from({ length: 12 }, (_, month) => {
            const date = new Date(cursor.getFullYear(), month, 1);
            const count = rows.filter((row) => {
              const value = rowValue(row, "event_date");
              return value.startsWith(`${cursor.getFullYear()}-${String(month + 1).padStart(2, "0")}`);
            }).length;
            return (
              <button
                key={month}
                type="button"
                onClick={() => {
                  setCursor(date);
                  setView("month");
                }}
                className="rounded-xl border border-white/10 bg-bg/70 p-4 text-left hover:border-accent"
              >
                <span className="font-display block text-3xl capitalize">
                  {shortMonthFormatter.format(date)}
                </span>
                <span className="text-xs text-muted">
                  {count ? `${count} evento${count > 1 ? "s" : ""}` : "sem eventos"}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}

function EventModal({
  open,
  form,
  editing,
  saving,
  status,
  onClose,
  onChange,
  onSave,
}: {
  open: boolean;
  form: Row;
  editing: boolean;
  saving: boolean;
  status: string;
  onClose: () => void;
  onChange: (name: string, value: string | boolean | number) => void;
  onSave: (e: FormEvent) => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 px-4 py-6">
      <form
        onSubmit={onSave}
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-panel p-5 shadow-2xl shadow-black/50"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-accent">
              {editing ? "Editar evento" : "Novo evento"}
            </p>
            <h2 className="font-display mt-1 text-4xl">Agenda</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/15 px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted hover:border-accent hover:text-accent"
          >
            Fechar
          </button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="block text-xs uppercase tracking-wider text-muted">
            Data *
            <input
              type="date"
              required
              value={rowValue(form, "event_date")}
              onChange={(e) => onChange("event_date", e.target.value)}
              className={inputClass()}
            />
          </label>
          <label className="block text-xs uppercase tracking-wider text-muted">
            Horario
            <input
              type="time"
              value={rowValue(form, "event_time")}
              onChange={(e) => onChange("event_time", e.target.value)}
              className={inputClass()}
            />
          </label>
          <label className="block text-xs uppercase tracking-wider text-muted">
            Cidade *
            <input
              required
              value={rowValue(form, "city")}
              onChange={(e) => onChange("city", e.target.value)}
              placeholder="Sao Paulo"
              className={inputClass()}
            />
          </label>
          <label className="block text-xs uppercase tracking-wider text-muted">
            Local *
            <input
              required
              value={rowValue(form, "venue")}
              onChange={(e) => onChange("venue", e.target.value)}
              placeholder="Casa / evento"
              className={inputClass()}
            />
          </label>
          <label className="block text-xs uppercase tracking-wider text-muted md:col-span-2">
            Nome interno
            <input
              value={rowValue(form, "title")}
              onChange={(e) => onChange("title", e.target.value)}
              placeholder="Opcional. Ex: OFDM's - Sao Paulo"
              className={inputClass()}
            />
          </label>
          <label className="block text-xs uppercase tracking-wider text-muted md:col-span-2">
            Chamada
            <textarea
              rows={3}
              value={rowValue(form, "note")}
              onChange={(e) => onChange("note", e.target.value)}
              placeholder="Ingressos em breve"
              className={inputClass()}
            />
          </label>
          <label className="block text-xs uppercase tracking-wider text-muted md:col-span-2">
            Link de ingresso
            <input
              value={rowValue(form, "ticket_url")}
              onChange={(e) => onChange("ticket_url", e.target.value)}
              placeholder="https://..."
              className={inputClass()}
            />
          </label>
          <label className="block text-xs uppercase tracking-wider text-muted">
            Status
            <select
              value={rowValue(form, "status") || "scheduled"}
              onChange={(e) => onChange("status", e.target.value)}
              className={inputClass()}
            >
              <option value="scheduled">Agendado</option>
              <option value="past">Passado</option>
              <option value="draft">Rascunho</option>
            </select>
          </label>
          <label className="block text-xs uppercase tracking-wider text-muted">
            Ordem
            <input
              type="number"
              value={rowValue(form, "sort_order") || "0"}
              onChange={(e) => onChange("sort_order", Number(e.target.value || 0))}
              className={inputClass()}
            />
          </label>
          <label className="flex items-center justify-between rounded-xl border border-white/15 bg-bg px-3 py-3 text-xs uppercase tracking-wider text-muted md:col-span-2">
            Publicado no site
            <input
              type="checkbox"
              checked={form.active !== false}
              onChange={(e) => onChange("active", e.target.checked)}
              className="h-5 w-5 accent-[var(--accent)]"
            />
          </label>
        </div>

        <EventPreview form={form} />

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            disabled={saving}
            className="rounded-full bg-accent px-5 py-3 text-sm font-bold text-bg disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Salvando..." : "Salvar evento"}
          </button>
          <StatusMessage>{status}</StatusMessage>
        </div>
      </form>
    </div>
  );
}

function EventList({
  title,
  rows,
  emptyText,
  onEdit,
  onTogglePublished,
  onDuplicate,
  onRemove,
}: {
  title: string;
  rows: Row[];
  emptyText: string;
  onEdit: (row: Row) => void;
  onTogglePublished: (row: Row) => void;
  onDuplicate: (row: Row) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-panel p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-3xl">{title}</h3>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted">
          {rows.length}
        </span>
      </div>
      <div className="mt-3 space-y-2">
        {rows.map((row) => (
          <article
            key={String(row.id)}
            className="rounded-xl border border-white/10 bg-bg/70 p-3"
          >
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate font-bold text-fg">{eventTitle(row)}</p>
                  <EventStatusBadge
                    status={rowValue(row, "status")}
                    active={row.active !== false}
                  />
                </div>
                <p className="mt-1 text-sm text-muted">
                  {formatEventDate(row)}
                  {rowValue(row, "event_time") ? ` - ${rowValue(row, "event_time")}` : ""} - {rowValue(row, "venue") || "sem local"}
                </p>
                {rowValue(row, "note") && (
                  <p className="mt-1 truncate text-xs text-fg/60">{rowValue(row, "note")}</p>
                )}
              </div>
              <div className="flex flex-wrap gap-2 md:justify-end">
                <button
                  type="button"
                  onClick={() => onTogglePublished(row)}
                  className="rounded-full border border-white/15 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-fg hover:border-accent hover:text-accent"
                >
                  {row.active === false ? "Publicar" : "Ocultar"}
                </button>
                <button
                  type="button"
                  onClick={() => onDuplicate(row)}
                  className="rounded-full border border-white/15 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-fg hover:border-accent hover:text-accent"
                >
                  Duplicar
                </button>
                <button
                  type="button"
                  onClick={() => onEdit(row)}
                  className="rounded-full border border-white/15 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-fg hover:border-accent hover:text-accent"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => row.id && onRemove(String(row.id))}
                  className="rounded-full border border-red-500/30 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-red-300 hover:border-red-400"
                >
                  Apagar
                </button>
              </div>
            </div>
          </article>
        ))}
        {!rows.length && <p className="py-4 text-sm text-muted">{emptyText}</p>}
      </div>
    </section>
  );
}

function EntityEditor({
  config,
  supabase,
}: {
  config: EntityConfig;
  supabase: SupabaseClient;
}) {
  const [rows, setRows] = useState<Row[]>([]);
  const [form, setForm] = useState<Row>(config.defaults);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [query, setQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [highlightedDate, setHighlightedDate] = useState("");
  const [localImagePreview, setLocalImagePreview] = useState<Record<string, string>>({});
  const isEventsConfig = config.table === "site_events";
  const isMembersConfig = config.table === "site_members";
  const isReleasesConfig = config.table === "site_releases";
  const imageField = imageFieldFor(config);

  const load = useCallback(async () => {
    const request = supabase.from(config.table).select("*");
    const { data, error } = isEventsConfig
      ? await request.order("event_date", { ascending: true })
      : await request.order("sort_order", { ascending: true });
    if (error) {
      setStatus(error.message);
      return;
    }
    setRows(data ?? []);
  }, [config.table, isEventsConfig, supabase]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const publishedCount = rows.filter(isPublished).length;
  const draftCount = rows.length - publishedCount;
  const fallbackRows = useMemo(() => fallbackEventRows().filter((event) => event.event_date), []);
  const missingFallbackEvents = useMemo(() => {
    const existing = new Set(rows.map(eventKey));
    return fallbackRows.filter((event) => !existing.has(eventKey(event)));
  }, [fallbackRows, rows]);
  const fallbackMembers = useMemo(() => fallbackMemberRows(), []);
  const missingFallbackMembers = useMemo(() => {
    const existing = new Set(rows.map(memberKey));
    return fallbackMembers.filter((member) => !existing.has(memberKey(member)));
  }, [fallbackMembers, rows]);
  const effectiveMemberRows = useMemo(() => {
    return [...rows, ...missingFallbackMembers].sort(
      (a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0),
    );
  }, [missingFallbackMembers, rows]);
  const fallbackReleases = useMemo(() => fallbackReleaseRows(), []);
  const missingFallbackReleases = useMemo(() => {
    const existing = new Set(rows.map(releaseKey));
    return fallbackReleases.filter((release) => !existing.has(releaseKey(release)));
  }, [fallbackReleases, rows]);
  const effectiveReleaseRows = useMemo(() => {
    return [...rows, ...missingFallbackReleases].sort(
      (a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0),
    );
  }, [missingFallbackReleases, rows]);
  const visibleRows = isMembersConfig ? effectiveMemberRows : isReleasesConfig ? effectiveReleaseRows : rows;
  const filteredRows = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return visibleRows;
    return visibleRows.filter((row) => searchText(row, config).includes(normalized));
  }, [config, query, visibleRows]);
  const splitEventRows = useMemo(() => splitEvents(rows), [rows]);

  function updateField(field: Field, value: string | boolean) {
    setForm((current) => ({
      ...current,
      [field.name]:
        field.type === "number"
            ? Number(value || 0)
            : field.type === "json"
              ? value
              : value,
    }));
  }

  function startNew(date?: Date) {
    const base = { ...config.defaults };
    if (isEventsConfig) {
      const eventDate = date ?? selectedDate;
      base.event_date = toDateKey(eventDate);
      base.status = eventDate < new Date(new Date().setHours(0, 0, 0, 0)) ? "past" : "scheduled";
    }
    setEditingId(null);
    setForm(base);
    setStatus("");
    setLocalImagePreview({});
    if (isEventsConfig) setEventModalOpen(true);
  }

  function editRow(row: Row) {
    if (row._fallback) {
      const draft = { ...row };
      delete draft.id;
      delete draft._fallback;
      setEditingId(null);
      setForm(draft);
      setLocalImagePreview({});
      setStatus(
        isReleasesConfig
          ? "Esta musica ja aparece no site, mas ainda esta fora do painel. Revise e salve para controlar pelo CMS."
          : "Este membro ja aparece no site, mas ainda esta fora do CMS. Revise e salve para assumir o controle pelo painel.",
      );
      return;
    }
    setEditingId(String(row.id));
    setForm(row);
    setLocalImagePreview({});
    const eventDate = rowValue(row, "event_date");
    if (eventDate) setSelectedDate(parseDateKey(eventDate));
    setStatus("");
    if (isEventsConfig) setEventModalOpen(true);
  }

  async function importFallbackEvents() {
    if (!isEventsConfig) return;
    if (!fallbackRows.length) {
      setStatus("Nenhum evento padrao encontrado para importar.");
      return;
    }
    const missing = missingFallbackEvents;
    if (!missing.length) {
      setStatus("Os eventos padrao ja estao no CMS.");
      return;
    }
    setStatus("Importando eventos padrao...");
    const { error } = await supabase.from("site_events").insert(missing);
    if (error) {
      setStatus(error.message);
      return;
    }
    await load();
    setStatus(`${missing.length} evento${missing.length > 1 ? "s" : ""} importado${missing.length > 1 ? "s" : ""}.`);
  }

  async function importFallbackMembers() {
    if (!isMembersConfig) return;
    if (!missingFallbackMembers.length) {
      setStatus("Os membros padrao ja estao no CMS.");
      return;
    }
    setStatus("Importando membros padrao...");
    const { error } = await supabase.from("site_members").insert(missingFallbackMembers);
    if (error) {
      setStatus(error.message);
      return;
    }
    await load();
    setStatus(`${missingFallbackMembers.length} membro${missingFallbackMembers.length > 1 ? "s" : ""} importado${missingFallbackMembers.length > 1 ? "s" : ""}.`);
  }

  async function importFallbackReleases() {
    if (!isReleasesConfig) return;
    if (!missingFallbackReleases.length) {
      setStatus("As musicas padrao ja estao no CMS.");
      return;
    }
    setStatus("Importando musicas padrao...");
    const payload = missingFallbackReleases.map((release) => {
      const copy: Row = { ...release };
      delete copy.id;
      delete copy._fallback;
      return copy;
    });
    const { error } = await supabase.from("site_releases").insert(payload);
    if (error) {
      setStatus(error.message);
      return;
    }
    await load();
    setStatus(`${payload.length} musica${payload.length > 1 ? "s" : ""} importada${payload.length > 1 ? "s" : ""}.`);
  }

  async function toggleEventPublished(row: Row) {
    setStatus("Atualizando publicacao...");
    const { error } = await supabase
      .from("site_events")
      .update({ active: row.active === false })
      .eq("id", String(row.id));
    if (error) {
      setStatus(error.message);
      return;
    }
    await load();
    setStatus(row.active === false ? "Evento publicado." : "Evento ocultado.");
  }

  async function duplicateEvent(row: Row) {
    const copy = { ...row };
    delete copy.id;
    delete copy.created_at;
    delete copy.updated_at;
    copy.title = `${rowValue(row, "title") || eventTitle(row)} (copia)`;
    copy.active = false;
    copy.status = "draft";
    copy.sort_order = Number(row.sort_order ?? 0) + 1;
    setStatus("Duplicando evento...");
    const { error } = await supabase.from("site_events").insert(copy);
    if (error) {
      setStatus(error.message);
      return;
    }
    await load();
    setStatus("Evento duplicado como rascunho.");
  }

  async function toggleMemberPublished(row: Row) {
    setStatus("Atualizando membro...");
    const { error } = await supabase
      .from("site_members")
      .update({ active: row.active === false })
      .eq("id", String(row.id));
    if (error) {
      setStatus(error.message);
      return;
    }
    await load();
    setStatus(row.active === false ? "Membro publicado." : "Membro ocultado.");
  }

  async function duplicateMember(row: Row) {
    const copy = { ...row };
    delete copy.id;
    delete copy.created_at;
    delete copy.updated_at;
    copy.slug = `${memberKey(row)}-copia-${Date.now()}`;
    copy.name = `${memberName(row)} (copia)`;
    copy.active = false;
    copy.sort_order = Number(row.sort_order ?? 0) + 1;
    setStatus("Duplicando membro...");
    const { error } = await supabase.from("site_members").insert(copy);
    if (error) {
      setStatus(error.message);
      return;
    }
    await load();
    setStatus("Membro duplicado como rascunho.");
  }

  async function toggleReleasePublished(row: Row) {
    setStatus("Atualizando musica...");
    const { error } = await supabase
      .from("site_releases")
      .update({ active: row.active === false })
      .eq("id", String(row.id));
    if (error) {
      setStatus(error.message);
      return;
    }
    await load();
    setStatus(row.active === false ? "Musica publicada." : "Musica ocultada.");
  }

  async function duplicateRelease(row: Row) {
    const copy = { ...row };
    delete copy.id;
    delete copy.created_at;
    delete copy.updated_at;
    delete copy._fallback;
    copy.title = `${releaseTitle(row)} (copia)`;
    copy.active = false;
    copy.featured = false;
    copy.sort_order = Number(row.sort_order ?? 0) + 1;
    setStatus("Duplicando musica...");
    const { error } = await supabase.from("site_releases").insert(copy);
    if (error) {
      setStatus(error.message);
      return;
    }
    await load();
    setStatus("Musica duplicada como rascunho.");
  }

  async function handleFile(field: Field, e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setLocalImagePreview((current) => ({ ...current, [field.name]: previewUrl }));
    setStatus("Enviando arquivo...");
    try {
      const url = await uploadFile(supabase, file, config.table);
      setForm((current) => ({ ...current, [field.name]: url }));
      setStatus("Upload concluido.");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Falha no upload.");
    }
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    if (saving) return;
    setStatus("Salvando...");
    setSaving(true);
    const payload = { ...form };
    for (const field of config.fields) {
      if (field.required && !inputValue(payload[field.name]).trim()) {
        setStatus(`Preencha ${field.label}.`);
        setSaving(false);
        return;
      }
      if (field.type === "json" && typeof payload[field.name] === "string") {
        try {
          payload[field.name] = JSON.parse(String(payload[field.name] || "[]"));
        } catch {
          setStatus(`JSON invalido em ${field.label}.`);
          setSaving(false);
          return;
        }
      }
    }

    delete payload._fallback;
    delete payload.created_at;
    delete payload.updated_at;

    if (isEventsConfig && !inputValue(payload.event_time).trim()) {
      delete payload.event_time;
    }

    const query = editingId
      ? supabase.from(config.table).update(payload).eq("id", editingId)
      : supabase.from(config.table).insert(payload);
    const { error } = await query;
    if (error) {
      setStatus(error.message);
      setSaving(false);
      return;
    }
    setForm(config.defaults);
    setEditingId(null);
    const savedDate = rowValue(payload, "event_date");
    if (isEventsConfig && savedDate) {
      setHighlightedDate(savedDate);
      setStatus(`Evento salvo em ${parseDateKey(savedDate).toLocaleDateString("pt-BR")}.`);
      setEventModalOpen(false);
    } else {
      setStatus("Salvo.");
    }
    await load();
    setSaving(false);
  }

  async function remove(id: string) {
    const row = rows.find((item) => String(item.id) === id);
    const title = row ? rowValue(row, config.titleField) || "este item" : "este item";
    if (!window.confirm(`Apagar "${title}"? Esta acao remove o item do CMS.`)) return;
    setStatus("Apagando...");
    const { error } = await supabase.from(config.table).delete().eq("id", id);
    if (error) {
      setStatus(error.message);
      return;
    }
    await load();
    setStatus("Item apagado.");
  }

  if (isEventsConfig) {
    return (
      <section className="space-y-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-panel p-5 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-accent">{config.area}</p>
            <h2 className="font-display mt-1 text-4xl">{config.label}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              Crie eventos clicando direto no calendario ou gerencie proximos e passados pelas listas.
            </p>
          </div>
          <a
            href={config.href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit rounded-full border border-white/15 px-4 py-2 text-xs font-bold uppercase tracking-wider text-fg hover:border-accent hover:text-accent"
          >
            Ver no site
          </a>
        </div>

        <div className="grid gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs uppercase tracking-wider text-muted">Total</p>
            <p className="font-display mt-1 text-4xl">{rows.length}</p>
          </div>
          <div className="rounded-2xl border border-accent/20 bg-accent/10 p-4">
            <p className="text-xs uppercase tracking-wider text-muted">Publicados</p>
            <p className="font-display mt-1 text-4xl text-accent">{publishedCount}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs uppercase tracking-wider text-muted">Proximos</p>
            <p className="font-display mt-1 text-4xl">{splitEventRows.upcoming.length}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs uppercase tracking-wider text-muted">Rascunhos</p>
            <p className="font-display mt-1 text-4xl">{draftCount}</p>
          </div>
        </div>

        {missingFallbackEvents.length > 0 && (
          <div className="flex flex-col gap-3 rounded-2xl border border-accent/20 bg-accent/10 p-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-bold text-accent">
                Existe {missingFallbackEvents.length} evento do site fora do CMS
              </p>
              <p className="mt-1 text-xs text-fg/70">
                Importe para a agenda editar tudo pelo painel.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void importFallbackEvents()}
              className="rounded-full bg-accent px-5 py-3 text-sm font-bold text-bg"
            >
              Importar agora
            </button>
          </div>
        )}

        <EventCalendar
          rows={rows}
          selectedDate={selectedDate}
          highlightedDate={highlightedDate}
          onSelectDate={(date) => {
            setSelectedDate(date);
            startNew(date);
          }}
          onEditEvent={editRow}
        />

        <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-panel p-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="block flex-1 text-xs uppercase tracking-wider text-muted">
            Buscar eventos
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cidade, local, nota..."
              className="mt-2 w-full rounded-xl border border-white/15 bg-bg px-3 py-3 text-sm normal-case tracking-normal text-fg outline-none focus:border-accent"
            />
          </label>
          <button
            type="button"
            onClick={() => startNew()}
            className="rounded-full bg-accent px-5 py-3 text-sm font-bold text-bg"
          >
            Novo evento
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <EventList
            title="Proximos eventos"
            rows={filteredRows.filter((row) => splitEventRows.upcoming.some((event) => event.id === row.id))}
            emptyText="Nenhum evento futuro cadastrado."
            onEdit={editRow}
            onTogglePublished={(row) => void toggleEventPublished(row)}
            onDuplicate={(row) => void duplicateEvent(row)}
            onRemove={(id) => void remove(id)}
          />
          <EventList
            title="Eventos passados"
            rows={filteredRows.filter((row) => splitEventRows.past.some((event) => event.id === row.id))}
            emptyText="Nenhum evento passado cadastrado."
            onEdit={editRow}
            onTogglePublished={(row) => void toggleEventPublished(row)}
            onDuplicate={(row) => void duplicateEvent(row)}
            onRemove={(id) => void remove(id)}
          />
        </div>

        <StatusMessage>{status}</StatusMessage>

        <EventModal
          open={eventModalOpen}
          form={form}
          editing={Boolean(editingId)}
          saving={saving}
          status={status}
          onClose={() => {
            setEventModalOpen(false);
            setStatus("");
          }}
          onChange={(name, value) =>
            setForm((current) => ({
              ...current,
              [name]: value,
            }))
          }
          onSave={save}
        />
      </section>
    );
  }

  if (isMembersConfig) {
    return (
      <section className="space-y-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-panel p-5 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-accent">{config.area}</p>
            <h2 className="font-display mt-1 text-4xl">{config.label}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              Controle totalmente quem aparece na secao Equipe: ordem, foto, bio, links e publicacao.
            </p>
          </div>
          <a
            href={config.href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit rounded-full border border-white/15 px-4 py-2 text-xs font-bold uppercase tracking-wider text-fg hover:border-accent hover:text-accent"
          >
            Ver no site
          </a>
        </div>

        <div className="grid gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs uppercase tracking-wider text-muted">Total</p>
            <p className="font-display mt-1 text-4xl">{effectiveMemberRows.length}</p>
          </div>
          <div className="rounded-2xl border border-accent/20 bg-accent/10 p-4">
            <p className="text-xs uppercase tracking-wider text-muted">Publicados</p>
            <p className="font-display mt-1 text-4xl text-accent">
              {effectiveMemberRows.filter(isPublished).length}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs uppercase tracking-wider text-muted">Ocultos</p>
            <p className="font-display mt-1 text-4xl">
              {effectiveMemberRows.length - effectiveMemberRows.filter(isPublished).length}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs uppercase tracking-wider text-muted">Faltando</p>
            <p className="font-display mt-1 text-4xl">{missingFallbackMembers.length}</p>
          </div>
        </div>

        {missingFallbackMembers.length > 0 && (
          <div className="flex flex-col gap-3 rounded-2xl border border-accent/20 bg-accent/10 p-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-bold text-accent">
                A home tem {missingFallbackMembers.length} membro{missingFallbackMembers.length > 1 ? "s" : ""} fora do CMS
              </p>
              <p className="mt-1 text-xs text-fg/70">
                Importe para o painel controlar a secao real de membros.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void importFallbackMembers()}
              className="rounded-full bg-accent px-5 py-3 text-sm font-bold text-bg"
            >
              Importar membros
            </button>
          </div>
        )}

        <MembersSectionPreview
          rows={effectiveMemberRows}
          draft={form}
          editingId={editingId}
          onEdit={editRow}
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="space-y-4">
            <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-panel p-4 sm:flex-row sm:items-center sm:justify-between">
              <label className="block flex-1 text-xs uppercase tracking-wider text-muted">
                Buscar membros
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Nome, funcao, link..."
                  className="mt-2 w-full rounded-xl border border-white/15 bg-bg px-3 py-3 text-sm normal-case tracking-normal text-fg outline-none focus:border-accent"
                />
              </label>
              <button
                type="button"
                onClick={() => startNew()}
                className="rounded-full bg-accent px-5 py-3 text-sm font-bold text-bg"
              >
                Novo membro
              </button>
            </div>

            <MemberList
              rows={filteredRows}
              onEdit={editRow}
              onTogglePublished={(row) => void toggleMemberPublished(row)}
              onDuplicate={(row) => void duplicateMember(row)}
              onRemove={(id) => void remove(id)}
            />
          </div>

          <form onSubmit={save} className="h-fit rounded-2xl border border-white/10 bg-panel p-5 lg:sticky lg:top-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-accent">
                  {editingId ? "Editando" : "Criando"}
                </p>
                <h2 className="font-display text-3xl">{editingId ? "Editar membro" : "Novo membro"}</h2>
              </div>
              {editingId && (
                <button
                  type="button"
                  onClick={() => startNew()}
                  className="text-xs text-muted hover:text-accent"
                >
                  cancelar
                </button>
              )}
            </div>
            <div className="mt-5 space-y-4">
              {config.fields.map((field) => (
                <label key={field.name} className="block text-xs uppercase tracking-wider text-muted">
                  <span>
                    {field.label}
                    {field.required ? <span className="text-accent"> *</span> : null}
                  </span>
                  {field.type === "textarea" ? (
                    <textarea
                      value={inputValue(form[field.name])}
                      onChange={(e) => updateField(field, e.target.value)}
                      rows={4}
                      required={field.required}
                      placeholder={field.placeholder}
                      className="mt-2 w-full rounded-xl border border-white/15 bg-bg px-3 py-3 text-sm normal-case tracking-normal text-fg outline-none focus:border-accent"
                    />
                  ) : field.type === "checkbox" ? (
                    <span className="mt-2 flex items-center justify-between rounded-xl border border-white/15 bg-bg px-3 py-3 normal-case tracking-normal">
                      <span className="text-sm text-fg">{Boolean(form[field.name]) ? "Sim" : "Nao"}</span>
                      <input
                        checked={Boolean(form[field.name])}
                        onChange={(e) => updateField(field, e.target.checked)}
                        type="checkbox"
                        className="h-5 w-5 accent-[var(--accent)]"
                      />
                    </span>
                  ) : (
                    <>
                      {field.type === "image" && (
                        <div className="mt-2 rounded-2xl border border-white/10 bg-bg/70 p-3">
                          <div className="flex gap-3">
                            <PreviewImage
                              src={localImagePreview[field.name] || rowValue(form, field.name)}
                              label="Foto"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-bold text-fg">Foto do membro</p>
                              <p className="mt-1 text-xs normal-case tracking-normal text-muted">
                                Escolha uma imagem da galeria do celular ou do computador. A previa aparece aqui antes de salvar.
                              </p>
                              <input
                                onChange={(e) => void handleFile(field, e)}
                                type="file"
                                accept="image/*"
                                className="mt-3 w-full text-xs normal-case tracking-normal text-muted"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      <input
                        value={inputValue(form[field.name])}
                        onChange={(e) => updateField(field, e.target.value)}
                        type={field.type === "number" ? "number" : "text"}
                        placeholder={field.placeholder}
                        required={field.required}
                        className="mt-2 w-full rounded-xl border border-white/15 bg-bg px-3 py-3 text-sm normal-case tracking-normal text-fg outline-none focus:border-accent"
                      />
                      {field.type === "image" && (
                        <span className="mt-1 block text-[11px] normal-case tracking-normal text-muted">
                          Opcional: cole uma URL publica acima, ou use o seletor de arquivo.
                        </span>
                      )}
                    </>
                  )}
                  {field.help && <span className="mt-1 block text-[11px] normal-case tracking-normal text-muted">{field.help}</span>}
                </label>
              ))}
            </div>
            <AdminPreview config={config} form={form} />
            <button
              disabled={saving}
              className="mt-6 w-full rounded-full bg-accent px-5 py-3 text-sm font-bold text-bg disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Salvando..." : "Salvar membro"}
            </button>
            <div className="mt-4">
              <StatusMessage>{status}</StatusMessage>
            </div>
          </form>
        </div>
      </section>
    );
  }

  if (isReleasesConfig) {
    return (
      <section className="space-y-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-panel p-5 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-accent">{config.area}</p>
            <h2 className="font-display mt-1 text-4xl">{config.label}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              Controle as musicas que aparecem no Out Now, no mini player e no destaque da home.
            </p>
          </div>
          <a
            href={config.href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit rounded-full border border-white/15 px-4 py-2 text-xs font-bold uppercase tracking-wider text-fg hover:border-accent hover:text-accent"
          >
            Ver no site
          </a>
        </div>

        <div className="grid gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs uppercase tracking-wider text-muted">Total</p>
            <p className="font-display mt-1 text-4xl">{effectiveReleaseRows.length}</p>
          </div>
          <div className="rounded-2xl border border-accent/20 bg-accent/10 p-4">
            <p className="text-xs uppercase tracking-wider text-muted">Publicadas</p>
            <p className="font-display mt-1 text-4xl text-accent">
              {effectiveReleaseRows.filter(isPublished).length}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs uppercase tracking-wider text-muted">Destaques</p>
            <p className="font-display mt-1 text-4xl">
              {effectiveReleaseRows.filter((row) => Boolean(row.featured)).length}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs uppercase tracking-wider text-muted">Faltando</p>
            <p className="font-display mt-1 text-4xl">{missingFallbackReleases.length}</p>
          </div>
        </div>

        {missingFallbackReleases.length > 0 && (
          <div className="flex flex-col gap-3 rounded-2xl border border-accent/20 bg-accent/10 p-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-bold text-accent">
                A home tem {missingFallbackReleases.length} musica{missingFallbackReleases.length > 1 ? "s" : ""} fora do painel
              </p>
              <p className="mt-1 text-xs text-fg/70">
                Importe para ordenar, editar, ocultar ou remover pelo CMS.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void importFallbackReleases()}
              className="rounded-full bg-accent px-5 py-3 text-sm font-bold text-bg"
            >
              Importar musicas
            </button>
          </div>
        )}

        <ReleasesSectionPreview
          rows={effectiveReleaseRows}
          draft={form}
          editingId={editingId}
          onEdit={editRow}
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="space-y-4">
            <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-panel p-4 sm:flex-row sm:items-center sm:justify-between">
              <label className="block flex-1 text-xs uppercase tracking-wider text-muted">
                Buscar musicas
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Titulo, artista, Spotify..."
                  className="mt-2 w-full rounded-xl border border-white/15 bg-bg px-3 py-3 text-sm normal-case tracking-normal text-fg outline-none focus:border-accent"
                />
              </label>
              <button
                type="button"
                onClick={() => startNew()}
                className="rounded-full bg-accent px-5 py-3 text-sm font-bold text-bg"
              >
                Nova musica
              </button>
            </div>

            <ReleaseList
              rows={filteredRows}
              onEdit={editRow}
              onTogglePublished={(row) => void toggleReleasePublished(row)}
              onDuplicate={(row) => void duplicateRelease(row)}
              onRemove={(id) => void remove(id)}
            />
          </div>

          <form onSubmit={save} className="h-fit rounded-2xl border border-white/10 bg-panel p-5 lg:sticky lg:top-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-accent">
                  {editingId ? "Editando" : "Criando"}
                </p>
                <h2 className="font-display text-3xl">{editingId ? "Editar musica" : "Nova musica"}</h2>
              </div>
              {editingId && (
                <button
                  type="button"
                  onClick={() => startNew()}
                  className="text-xs text-muted hover:text-accent"
                >
                  cancelar
                </button>
              )}
            </div>
            <div className="mt-5 space-y-4">
              {config.fields.map((field) => (
                <label key={field.name} className="block text-xs uppercase tracking-wider text-muted">
                  <span>
                    {field.label}
                    {field.required ? <span className="text-accent"> *</span> : null}
                  </span>
                  {field.type === "textarea" ? (
                    <textarea
                      value={inputValue(form[field.name])}
                      onChange={(e) => updateField(field, e.target.value)}
                      rows={4}
                      required={field.required}
                      placeholder={field.placeholder}
                      className="mt-2 w-full rounded-xl border border-white/15 bg-bg px-3 py-3 text-sm normal-case tracking-normal text-fg outline-none focus:border-accent"
                    />
                  ) : field.type === "checkbox" ? (
                    <span className="mt-2 flex items-center justify-between rounded-xl border border-white/15 bg-bg px-3 py-3 normal-case tracking-normal">
                      <span className="text-sm text-fg">{Boolean(form[field.name]) ? "Sim" : "Nao"}</span>
                      <input
                        checked={Boolean(form[field.name])}
                        onChange={(e) => updateField(field, e.target.checked)}
                        type="checkbox"
                        className="h-5 w-5 accent-[var(--accent)]"
                      />
                    </span>
                  ) : field.type === "json" ? (
                    <textarea
                      value={inputValue(form[field.name])}
                      onChange={(e) => updateField(field, e.target.value)}
                      rows={4}
                      className="mt-2 w-full rounded-xl border border-white/15 bg-bg px-3 py-3 font-mono text-xs normal-case tracking-normal text-fg outline-none focus:border-accent"
                    />
                  ) : (
                    <>
                      {field.type === "image" && (
                        <div className="mt-2 rounded-2xl border border-white/10 bg-bg/70 p-3">
                          <div className="flex gap-3">
                            <PreviewImage
                              src={localImagePreview[field.name] || rowValue(form, field.name)}
                              label="Capa"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-bold text-fg">Capa da musica</p>
                              <p className="mt-1 text-xs normal-case tracking-normal text-muted">
                                Envie uma capa do celular/PC ou cole uma URL publica no campo abaixo.
                              </p>
                              <input
                                onChange={(e) => void handleFile(field, e)}
                                type="file"
                                accept="image/*"
                                className="mt-3 w-full text-xs normal-case tracking-normal text-muted"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      <input
                        value={inputValue(form[field.name])}
                        onChange={(e) => updateField(field, e.target.value)}
                        type={field.type === "number" ? "number" : "text"}
                        placeholder={field.placeholder}
                        required={field.required}
                        className="mt-2 w-full rounded-xl border border-white/15 bg-bg px-3 py-3 text-sm normal-case tracking-normal text-fg outline-none focus:border-accent"
                      />
                    </>
                  )}
                  {field.help && <span className="mt-1 block text-[11px] normal-case tracking-normal text-muted">{field.help}</span>}
                </label>
              ))}
            </div>
            <AdminPreview config={config} form={form} />
            <button
              disabled={saving}
              className="mt-6 w-full rounded-full bg-accent px-5 py-3 text-sm font-bold text-bg disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Salvando..." : "Salvar musica"}
            </button>
            <div className="mt-4">
              <StatusMessage>{status}</StatusMessage>
            </div>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
      <div className="min-w-0 space-y-5">
        <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-panel p-5 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-accent">{config.area}</p>
            <h2 className="font-display mt-1 text-4xl">{config.label}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{config.description}</p>
          </div>
          <a
            href={config.href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit rounded-full border border-white/15 px-4 py-2 text-xs font-bold uppercase tracking-wider text-fg hover:border-accent hover:text-accent"
          >
            Ver no site
          </a>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs uppercase tracking-wider text-muted">Total</p>
            <p className="font-display mt-1 text-4xl">{rows.length}</p>
          </div>
          <div className="rounded-2xl border border-accent/20 bg-accent/10 p-4">
            <p className="text-xs uppercase tracking-wider text-muted">Publicados</p>
            <p className="font-display mt-1 text-4xl text-accent">{publishedCount}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs uppercase tracking-wider text-muted">Rascunhos</p>
            <p className="font-display mt-1 text-4xl">{draftCount}</p>
          </div>
        </div>

        {isEventsConfig && (
          <EventCalendar
            rows={rows}
            selectedDate={selectedDate}
            onSelectDate={(date) => {
              setSelectedDate(date);
              startNew(date);
            }}
            onEditEvent={editRow}
          />
        )}

        <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-panel p-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="block flex-1 text-xs uppercase tracking-wider text-muted">
            Buscar nesta aba
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nome, artista, cidade, link..."
              className="mt-2 w-full rounded-xl border border-white/15 bg-bg px-3 py-3 text-sm normal-case tracking-normal text-fg outline-none focus:border-accent"
            />
          </label>
          {isEventsConfig && (
            <button
              type="button"
              onClick={() => void importFallbackEvents()}
              className="rounded-full border border-white/15 px-5 py-3 text-sm font-bold text-fg hover:border-accent hover:text-accent"
            >
              Importar OFDM
            </button>
          )}
          <button
            type="button"
            onClick={() => startNew()}
            className="rounded-full bg-accent px-5 py-3 text-sm font-bold text-bg"
          >
            Novo item
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-panel">
          {filteredRows.map((row) => {
            const title = rowValue(row, config.titleField) || "Sem titulo";
            const summary = rowSummary(row, config);
            const imageUrl = imageField ? rowValue(row, imageField) : "";
            return (
              <article
                key={row.id}
                className={`grid gap-4 border-b border-white/10 px-4 py-4 last:border-b-0 md:grid-cols-[72px_minmax(0,1fr)_auto] md:items-center ${
                  editingId === row.id ? "bg-accent/10" : "bg-white/[0.02]"
                }`}
              >
                <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-white/10 bg-bg">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt=""
                      fill
                      sizes="64px"
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-muted">
                      sem img
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-base font-bold text-fg">{title}</h3>
                    <StatusBadge active={isPublished(row)} />
                  </div>
                  <p className="mt-1 truncate text-sm text-muted">
                    {summary || "Sem detalhes preenchidos"}
                  </p>
                  <p className="mt-1 text-xs text-muted">ordem {rowValue(row, "sort_order") || "0"}</p>
                </div>

                <div className="flex flex-wrap gap-2 md:justify-end">
                  <button
                    type="button"
                    onClick={() => editRow(row)}
                    className="rounded-full border border-white/15 px-4 py-2 text-xs font-bold uppercase tracking-wider text-fg hover:border-accent hover:text-accent"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => void remove(String(row.id))}
                    className="rounded-full border border-red-500/30 px-4 py-2 text-xs font-bold uppercase tracking-wider text-red-300 hover:border-red-400"
                  >
                    Apagar
                  </button>
                </div>
              </article>
            );
          })}
          {!filteredRows.length && (
            <div className="px-5 py-10 text-center">
              <p className="font-display text-3xl">Nada encontrado</p>
              <p className="mt-2 text-sm text-muted">
                {rows.length ? "Tente outro termo de busca." : "Cadastre o primeiro item desta aba."}
              </p>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={save} className="h-fit rounded-2xl border border-white/10 bg-panel p-5 lg:sticky lg:top-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-accent">
              {editingId ? "Editando" : "Criando"}
            </p>
            <h2 className="font-display text-3xl">{editingId ? "Editar item" : "Novo item"}</h2>
          </div>
          {editingId && (
            <button
              type="button"
              onClick={() => startNew()}
              className="text-xs text-muted hover:text-accent"
            >
              cancelar
            </button>
          )}
        </div>
        <div className="mt-5 space-y-4">
          {config.fields.map((field) => (
            <label key={field.name} className="block text-xs uppercase tracking-wider text-muted">
              <span className="flex items-center justify-between gap-2">
                <span>
                  {field.label}
                  {field.required ? <span className="text-accent"> *</span> : null}
                </span>
              </span>
              {field.type === "textarea" ? (
                <textarea
                  value={inputValue(form[field.name])}
                  onChange={(e) => updateField(field, e.target.value)}
                  rows={4}
                  required={field.required}
                  placeholder={field.placeholder}
                  className="mt-2 w-full rounded-xl border border-white/15 bg-bg px-3 py-3 text-sm normal-case tracking-normal text-fg outline-none focus:border-accent"
                />
              ) : field.type === "checkbox" ? (
                <span className="mt-2 flex items-center justify-between rounded-xl border border-white/15 bg-bg px-3 py-3 normal-case tracking-normal">
                  <span className="text-sm text-fg">
                    {Boolean(form[field.name]) ? "Sim" : "Nao"}
                  </span>
                  <input
                    checked={Boolean(form[field.name])}
                    onChange={(e) => updateField(field, e.target.checked)}
                    type="checkbox"
                    className="h-5 w-5 accent-[var(--accent)]"
                  />
                </span>
              ) : field.type === "select" ? (
                <select
                  value={inputValue(form[field.name])}
                  onChange={(e) => updateField(field, e.target.value)}
                  required={field.required}
                  className="mt-2 w-full rounded-xl border border-white/15 bg-bg px-3 py-3 text-sm normal-case tracking-normal text-fg outline-none focus:border-accent"
                >
                  {(field.options ?? []).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <>
                  <input
                    value={inputValue(form[field.name])}
                    onChange={(e) => updateField(field, e.target.value)}
                    type={field.type === "date" ? "date" : field.type === "number" ? "number" : "text"}
                    placeholder={field.placeholder}
                    required={field.required}
                    className="mt-2 w-full rounded-xl border border-white/15 bg-bg px-3 py-3 text-sm normal-case tracking-normal text-fg outline-none focus:border-accent"
                  />
                  {field.type === "image" && (
                    <input
                      onChange={(e) => void handleFile(field, e)}
                      type="file"
                      accept="image/*"
                      className="mt-2 w-full text-xs text-muted"
                    />
                  )}
                </>
              )}
              {field.help && <span className="mt-1 block text-[11px] normal-case tracking-normal text-muted">{field.help}</span>}
            </label>
          ))}
        </div>
        <AdminPreview config={config} form={form} />
        <button
          disabled={saving}
          className="mt-6 w-full rounded-full bg-accent px-5 py-3 text-sm font-bold text-bg disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Salvando..." : "Salvar"}
        </button>
        <div className="mt-4">
          <StatusMessage>{status}</StatusMessage>
        </div>
      </form>
    </section>
  );
}

function SettingsEditor({ supabase }: { supabase: SupabaseClient }) {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("");

  type CoverTransform = { zoom: number; x: number; y: number };
  const defaultTransform: CoverTransform = { zoom: 1, x: 0, y: 0 };

  function parseTransform(input?: string): CoverTransform {
    if (!input) return defaultTransform;
    try {
      const parsed = JSON.parse(input) as Partial<CoverTransform>;
      const zoom =
        typeof parsed.zoom === "number" ? parsed.zoom : defaultTransform.zoom;
      const x = typeof parsed.x === "number" ? parsed.x : defaultTransform.x;
      const y = typeof parsed.y === "number" ? parsed.y : defaultTransform.y;
      return {
        zoom: Number.isFinite(zoom) ? Math.min(3, Math.max(0.5, zoom)) : 1,
        x: Number.isFinite(x) ? Math.min(80, Math.max(-80, x)) : 0,
        y: Number.isFinite(y) ? Math.min(80, Math.max(-80, y)) : 0,
      };
    } catch {
      return defaultTransform;
    }
  }

  const [bannerTransform, setBannerTransform] = useState<CoverTransform>(defaultTransform);
  const [footerTransform, setFooterTransform] = useState<CoverTransform>(defaultTransform);

  const bannerSrc =
    settings.bannerImage || fallbackCmsData.media.bannerImage || "/banner-sensi.jpg";
  const footerBannerSrc =
    settings.footerBanner ||
    settings.bannerImage ||
    fallbackCmsData.media.footerBanner ||
    fallbackCmsData.media.bannerImage ||
    "/banner-sensi.jpg";
  const heroLogoSrc =
    settings.heroLogo || fallbackCmsData.media.heroLogo || "/logo-sensi.png";

  const load = useCallback(async () => {
    const { data, error } = await supabase.from("site_settings").select("*");
    if (error) {
      setStatus(error.message);
      return;
    }
    setSettings(
      Object.fromEntries((data ?? []).map((row) => [String(row.key), String(row.value)])),
    );
  }, [supabase]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setBannerTransform(parseTransform(settings.bannerImageTransform));
    setFooterTransform(parseTransform(settings.footerBannerTransform));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.bannerImageTransform, settings.footerBannerTransform]);

  async function save() {
    setStatus("Salvando...");
    const payload: Record<string, string> = {
      ...settings,
      bannerImageTransform: JSON.stringify(bannerTransform),
      footerBannerTransform: JSON.stringify(footerTransform),
    };

    const rows = Object.entries(payload)
      .filter(([, value]) => value.trim())
      .map(([key, value]) => ({ key, value }));
    const { error } = await supabase.from("site_settings").upsert(rows);
    setStatus(error ? error.message : "Configuracoes salvas.");
  }

  async function handleUpload(key: string, e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus("Enviando arquivo...");
    try {
      const url = await uploadFile(supabase, file, "settings");
      setSettings((current) => ({ ...current, [key]: url }));
      setStatus("Upload concluido.");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Falha no upload.");
    }
  }

  return (
    <section className="max-w-5xl space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-panel p-5 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-accent">Home / Visual</p>
          <h2 className="font-display mt-1 text-4xl">Midias globais</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Ajuste logo, banners, video do hero e clipe vertical. Os previews abaixo mostram enquadramento antes de salvar.
          </p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-fit rounded-full border border-white/15 px-4 py-2 text-xs font-bold uppercase tracking-wider text-fg hover:border-accent hover:text-accent"
        >
          Ver no site
        </a>
      </div>

      <div className="space-y-6 rounded-2xl border border-white/10 bg-panel p-5">
        {/* Hero banner */}
        <div className="space-y-3 rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">
            Banner hero (thumbnail YouTube)
          </p>
          <div className="grid gap-4 md:grid-cols-2 md:items-start">
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-panel">
              <Image
                src={bannerSrc}
                alt=""
                fill
                sizes="(min-width: 768px) 320px, 100vw"
                unoptimized
                className="absolute inset-0 h-full w-full object-cover"
                style={{
                  transform: `scale(${bannerTransform.zoom}) translate(${bannerTransform.x}%, ${bannerTransform.y}%)`,
                  transformOrigin: "50% 50%",
                }}
              />
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/15" />
                <div className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-white/15" />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs uppercase tracking-wider text-muted">
                Trocar imagem
                <input
                  onChange={(e) => void handleUpload("bannerImage", e)}
                  type="file"
                  accept="image/*"
                  className="mt-2 w-full text-xs text-muted"
                />
              </label>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>Zoom</span>
                  <span className="text-fg/80">{bannerTransform.zoom.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={2.5}
                  step={0.01}
                  value={bannerTransform.zoom}
                  onChange={(e) =>
                    setBannerTransform((t) => ({ ...t, zoom: Number(e.target.value) }))
                  }
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>Pan X</span>
                  <span className="text-fg/80">{Math.round(bannerTransform.x)}%</span>
                </div>
                <input
                  type="range"
                  min={-60}
                  max={60}
                  step={1}
                  value={bannerTransform.x}
                  onChange={(e) =>
                    setBannerTransform((t) => ({ ...t, x: Number(e.target.value) }))
                  }
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>Pan Y</span>
                  <span className="text-fg/80">{Math.round(bannerTransform.y)}%</span>
                </div>
                <input
                  type="range"
                  min={-60}
                  max={60}
                  step={1}
                  value={bannerTransform.y}
                  onChange={(e) =>
                    setBannerTransform((t) => ({ ...t, y: Number(e.target.value) }))
                  }
                  className="w-full"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setBannerTransform(defaultTransform)}
                  className="rounded-full border border-white/15 px-4 py-2 text-xs text-muted hover:border-accent hover:text-accent"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Rodape banner */}
        <div className="space-y-3 rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">
            Banner rodape
          </p>
          <div className="grid gap-4 md:grid-cols-2 md:items-start">
            <div className="relative h-40 overflow-hidden rounded-2xl border border-white/10 bg-panel">
              <div
                aria-hidden
                className="absolute inset-0 bg-cover bg-center opacity-15"
                style={{
                  backgroundImage: `url(${footerBannerSrc})`,
                  transform: `scale(${footerTransform.zoom}) translate(${footerTransform.x}%, ${footerTransform.y}%)`,
                  transformOrigin: "50% 50%",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60" />
            </div>

            <div className="space-y-3">
              <label className="block text-xs uppercase tracking-wider text-muted">
                Trocar imagem
                <input
                  onChange={(e) => void handleUpload("footerBanner", e)}
                  type="file"
                  accept="image/*"
                  className="mt-2 w-full text-xs text-muted"
                />
              </label>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>Zoom</span>
                  <span className="text-fg/80">{footerTransform.zoom.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={2.5}
                  step={0.01}
                  value={footerTransform.zoom}
                  onChange={(e) =>
                    setFooterTransform((t) => ({
                      ...t,
                      zoom: Number(e.target.value),
                    }))
                  }
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>Pan X</span>
                  <span className="text-fg/80">{Math.round(footerTransform.x)}%</span>
                </div>
                <input
                  type="range"
                  min={-60}
                  max={60}
                  step={1}
                  value={footerTransform.x}
                  onChange={(e) =>
                    setFooterTransform((t) => ({ ...t, x: Number(e.target.value) }))
                  }
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>Pan Y</span>
                  <span className="text-fg/80">{Math.round(footerTransform.y)}%</span>
                </div>
                <input
                  type="range"
                  min={-60}
                  max={60}
                  step={1}
                  value={footerTransform.y}
                  onChange={(e) =>
                    setFooterTransform((t) => ({ ...t, y: Number(e.target.value) }))
                  }
                  className="w-full"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFooterTransform(defaultTransform)}
                  className="rounded-full border border-white/15 px-4 py-2 text-xs text-muted hover:border-accent hover:text-accent"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Logo do hero + outros */}
        <div className="space-y-3 rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">
            Logo do hero e midias extras
          </p>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-full border border-white/10 bg-panel">
                <Image
                  src={heroLogoSrc}
                  alt=""
                  fill
                  sizes="64px"
                  unoptimized
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-fg">Logo do hero</p>
                <p className="text-xs text-muted">Atualize a imagem e salve.</p>
              </div>
            </div>

            <div className="w-full md:max-w-xs">
              <input
                onChange={(e) => void handleUpload("heroLogo", e)}
                type="file"
                accept="image/*"
                className="w-full text-xs text-muted"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {settingFields
              .filter((f) => f.key === "heroVideoSrc" || f.key === "verticalReelVideoId")
              .map((field) => (
                <label
                  key={field.key}
                  className="block text-xs uppercase tracking-wider text-muted"
                >
                  {field.label}
                  <input
                    value={settings[field.key] ?? ""}
                    onChange={(e) =>
                      setSettings((current) => ({
                        ...current,
                        [field.key]: e.target.value,
                      }))
                    }
                    className="mt-2 w-full rounded-xl border border-white/15 bg-bg px-3 py-2 text-sm text-fg outline-none focus:border-accent"
                  />
                  {field.key !== "verticalReelVideoId" && (
                    <input
                      onChange={(e) => void handleUpload(field.key, e)}
                      type="file"
                      accept="image/*,video/*"
                      className="mt-2 w-full text-xs text-muted"
                    />
                  )}
                </label>
              ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => void save()}
          className="rounded-full bg-accent px-5 py-3 text-sm font-bold text-bg"
        >
          Salvar configuracoes
        </button>
        <StatusMessage>{status}</StatusMessage>
      </div>
    </section>
  );
}

export function AdminPanel() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [active, setActive] = useState<TableName | "settings">("site_events");

  useEffect(() => {
    if (!supabase) return;
    void supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });
    return () => data.subscription.unsubscribe();
  }, [supabase]);

  if (!supabase) {
    return (
      <main className="flex min-h-screen items-center bg-bg px-6 py-16 text-fg">
        <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-panel p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">Config</p>
          <h1 className="font-display mt-2 text-5xl">Supabase nao configurado</h1>
          <p className="mt-3 text-sm leading-6 text-muted">
            Preencha NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no .env.local para liberar login, uploads e edicao do conteudo.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-full border border-white/15 px-5 py-3 text-sm font-bold text-fg hover:border-accent hover:text-accent"
          >
            Voltar ao site
          </Link>
        </div>
      </main>
    );
  }

  if (!session) return <Login supabase={supabase} />;

  const config = configs.find((item) => item.table === active);

  return (
    <main className="min-h-screen bg-bg px-4 py-6 text-fg md:px-8">
      <header className="mx-auto max-w-7xl border-b border-white/10 pb-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-accent">CMS</p>
            <h1 className="font-display mt-1 text-5xl md:text-6xl">Admin Sensimilla</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              Painel para atualizar o site sem mexer no codigo. Itens publicados aparecem em poucos segundos; rascunhos ficam guardados aqui.
            </p>
            <p className="mt-2 text-xs text-muted">Logado como {session.user.email}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit rounded-full border border-white/15 px-5 py-3 text-sm font-bold text-fg hover:border-accent hover:text-accent"
            >
              Ver site
            </a>
            <button
              type="button"
              onClick={() => void supabase.auth.signOut()}
              className="w-fit rounded-full border border-white/15 px-5 py-3 text-sm text-muted hover:border-accent hover:text-accent"
            >
              Sair
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs uppercase tracking-wider text-muted">Fluxo recomendado</p>
            <p className="mt-2 text-sm text-fg">Edite, salve, abra Ver no site e confira no celular.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs uppercase tracking-wider text-muted">Ordem</p>
            <p className="mt-2 text-sm text-fg">Use 0, 10, 20... para reordenar sem refazer tudo.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs uppercase tracking-wider text-muted">Publicacao</p>
            <p className="mt-2 text-sm text-fg">Desmarque Publicado para esconder sem apagar.</p>
          </div>
        </div>
      </header>

      <div className="mx-auto mt-6 max-w-7xl">
        <section
          aria-label="Categorias do CMS"
          className="rounded-2xl border border-white/10 bg-panel p-3"
        >
          <div className="mb-3 flex items-center gap-3 px-1">
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-muted">
              Categorias
            </span>
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <nav className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {configs.map((item) => (
              <button
                key={item.table}
                type="button"
                onClick={() => setActive(item.table)}
                className={`relative min-w-[8.5rem] shrink-0 rounded-xl border px-3 py-2 text-left transition ${
                  active === item.table
                    ? "border-accent bg-accent text-bg shadow-[0_0_0_1px_rgba(200,242,74,0.25)]"
                    : "border-white/10 bg-bg/70 text-fg hover:border-accent/70"
                }`}
              >
                <span
                  className={`absolute inset-y-2 left-0 w-1 rounded-r-full ${
                    active === item.table ? "bg-bg/80" : "bg-accent/50"
                  }`}
                />
                <span className="block truncate pl-2 text-[10px] font-bold uppercase tracking-wider opacity-65">
                  {item.area.replace("Home / ", "")}
                </span>
                <span className="font-display block pl-2 text-2xl leading-none">
                  {item.shortLabel}
                </span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => setActive("settings")}
              className={`relative min-w-[8.5rem] shrink-0 rounded-xl border px-3 py-2 text-left transition ${
                active === "settings"
                  ? "border-accent bg-accent text-bg shadow-[0_0_0_1px_rgba(200,242,74,0.25)]"
                  : "border-white/10 bg-bg/70 text-fg hover:border-accent/70"
              }`}
            >
              <span
                className={`absolute inset-y-2 left-0 w-1 rounded-r-full ${
                  active === "settings" ? "bg-bg/80" : "bg-accent/50"
                }`}
              />
              <span className="block truncate pl-2 text-[10px] font-bold uppercase tracking-wider opacity-65">
                Visual
              </span>
              <span className="font-display block pl-2 text-2xl leading-none">Midias</span>
            </button>
          </nav>
        </section>

        <div className="mt-6">
          {active === "settings" ? (
            <SettingsEditor supabase={supabase} />
          ) : config ? (
            <EntityEditor key={config.table} config={config} supabase={supabase} />
          ) : null}
        </div>
      </div>
    </main>
  );
}

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
    summaryFields: ["event_date", "venue", "note"],
    defaults: {
      title: "",
      event_date: new Date().toISOString().slice(0, 10),
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
  const imageField = imageFieldFor(config);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from(config.table)
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) {
      setStatus(error.message);
      return;
    }
    setRows(data ?? []);
  }, [config.table, supabase]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const filteredRows = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return rows;
    return rows.filter((row) => searchText(row, config).includes(normalized));
  }, [config, query, rows]);

  const publishedCount = rows.filter(isPublished).length;
  const draftCount = rows.length - publishedCount;

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

  function startNew() {
    setEditingId(null);
    setForm(config.defaults);
    setStatus("");
  }

  function editRow(row: Row) {
    setEditingId(String(row.id));
    setForm(row);
    setStatus("");
  }

  async function handleFile(field: Field, e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
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
    setStatus("Salvo.");
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
          <button
            type="button"
            onClick={startNew}
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
              onClick={startNew}
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
        <nav className="grid gap-2 pb-3 sm:grid-cols-2 lg:grid-cols-4">
          {configs.map((item) => (
            <button
              key={item.table}
              type="button"
              onClick={() => setActive(item.table)}
              className={`rounded-2xl border p-4 text-left transition ${
                active === item.table
                  ? "border-accent bg-accent text-bg"
                  : "border-white/15 bg-panel text-fg hover:border-accent"
              }`}
            >
              <span className="block text-xs font-bold uppercase tracking-wider opacity-70">
                {item.area}
              </span>
              <span className="font-display mt-1 block text-3xl">{item.shortLabel}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => setActive("settings")}
            className={`rounded-2xl border p-4 text-left transition ${
              active === "settings"
                ? "border-accent bg-accent text-bg"
                : "border-white/15 bg-panel text-fg hover:border-accent"
            }`}
          >
            <span className="block text-xs font-bold uppercase tracking-wider opacity-70">
              Home / Visual
            </span>
            <span className="font-display mt-1 block text-3xl">Midias</span>
          </button>
        </nav>

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

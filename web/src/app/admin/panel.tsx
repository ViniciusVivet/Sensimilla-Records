"use client";

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
  type?: "text" | "textarea" | "date" | "number" | "checkbox" | "image" | "json";
  placeholder?: string;
};

type EntityConfig = {
  table: TableName;
  label: string;
  description: string;
  fields: Field[];
  defaults: Record<string, unknown>;
  titleField: string;
};

type Row = Record<string, unknown> & { id?: string };

const configs: EntityConfig[] = [
  {
    table: "site_events",
    label: "Eventos",
    description: "Calendario, cidade, casa, nota e link de ingresso.",
    titleField: "city",
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
      { name: "event_date", label: "Data", type: "date" },
      { name: "city", label: "Cidade" },
      { name: "venue", label: "Local" },
      { name: "note", label: "Nota" },
      { name: "ticket_url", label: "Link de ingresso" },
      { name: "status", label: "Status" },
      { name: "sort_order", label: "Ordem", type: "number" },
      { name: "active", label: "Publicado", type: "checkbox" },
    ],
  },
  {
    table: "site_members",
    label: "Membros",
    description: "Equipe, artistas, links, fotos e videos de destaque.",
    titleField: "name",
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
      { name: "slug", label: "Slug/id" },
      { name: "name", label: "Nome" },
      { name: "role", label: "Funcao" },
      { name: "bio", label: "Bio", type: "textarea" },
      { name: "image_url", label: "Foto", type: "image" },
      { name: "spotify_url", label: "Spotify" },
      { name: "instagram_url", label: "Instagram" },
      { name: "youtube_url", label: "YouTube" },
      { name: "youtube_video_id", label: "ID video YouTube" },
      { name: "sort_order", label: "Ordem", type: "number" },
      { name: "is_placeholder", label: "Placeholder", type: "checkbox" },
      { name: "active", label: "Publicado", type: "checkbox" },
    ],
  },
  {
    table: "site_releases",
    label: "Musicas",
    description: "Catalogo, player Spotify, capa, ordem e destaque.",
    titleField: "title",
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
      { name: "title", label: "Titulo" },
      { name: "artist", label: "Artista" },
      { name: "meta", label: "Meta" },
      { name: "cover_url", label: "Capa", type: "image" },
      { name: "spotify_embed", label: "Spotify embed", placeholder: "track/ID ou artist/ID" },
      { name: "href", label: "Link principal" },
      { name: "cta", label: "Texto do botao" },
      { name: "description", label: "Descricao do destaque", type: "textarea" },
      { name: "platforms", label: "Plataformas JSON", type: "json" },
      { name: "sort_order", label: "Ordem", type: "number" },
      { name: "featured", label: "Destaque da home", type: "checkbox" },
      { name: "active", label: "Publicado", type: "checkbox" },
    ],
  },
  {
    table: "site_merch",
    label: "Merch",
    description: "Produtos, imagens, precos e chamada para WhatsApp.",
    titleField: "name",
    defaults: { name: "", tag: "", price: "", image_url: "", active: true, sort_order: 0 },
    fields: [
      { name: "name", label: "Nome" },
      { name: "tag", label: "Categoria" },
      { name: "price", label: "Preco" },
      { name: "image_url", label: "Imagem", type: "image" },
      { name: "sort_order", label: "Ordem", type: "number" },
      { name: "active", label: "Publicado", type: "checkbox" },
    ],
  },
  {
    table: "site_editorial_photos",
    label: "Galeria",
    description: "Fotos da secao Visuais/editorial.",
    titleField: "alt",
    defaults: { src: "", alt: "", active: true, sort_order: 0 },
    fields: [
      { name: "src", label: "Imagem", type: "image" },
      { name: "alt", label: "Texto alternativo" },
      { name: "sort_order", label: "Ordem", type: "number" },
      { name: "active", label: "Publicado", type: "checkbox" },
    ],
  },
  {
    table: "site_youtube_videos",
    label: "YouTube",
    description: "Videos embedados na home e clipe vertical.",
    titleField: "title",
    defaults: { youtube_id: "", title: "", active: true, sort_order: 0 },
    fields: [
      { name: "youtube_id", label: "ID do video" },
      { name: "title", label: "Titulo" },
      { name: "sort_order", label: "Ordem", type: "number" },
      { name: "active", label: "Publicado", type: "checkbox" },
    ],
  },
  {
    table: "site_social_links",
    label: "Redes",
    description: "Links globais de Instagram, Spotify, YouTube e outros.",
    titleField: "name",
    defaults: { name: "", href: "", active: true, sort_order: 0 },
    fields: [
      { name: "name", label: "Nome" },
      { name: "href", label: "URL" },
      { name: "sort_order", label: "Ordem", type: "number" },
      { name: "active", label: "Publicado", type: "checkbox" },
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
    <main className="min-h-screen bg-bg px-6 py-16 text-fg">
      <form
        onSubmit={submit}
        className="mx-auto max-w-sm rounded-2xl border border-white/10 bg-panel p-6"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-accent">Admin</p>
        <h1 className="font-display mt-2 text-4xl">Sensimilla CMS</h1>
        <label className="mt-8 block text-xs uppercase tracking-wider text-muted">
          E-mail
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="mt-2 w-full rounded-xl border border-white/15 bg-bg px-4 py-3 text-fg outline-none focus:border-accent"
          />
        </label>
        <label className="mt-4 block text-xs uppercase tracking-wider text-muted">
          Senha
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="mt-2 w-full rounded-xl border border-white/15 bg-bg px-4 py-3 text-fg outline-none focus:border-accent"
          />
        </label>
        <button className="mt-6 w-full rounded-full bg-accent px-5 py-3 text-sm font-bold text-bg">
          Entrar
        </button>
        {status && <p className="mt-4 text-sm text-muted">{status}</p>}
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
    setStatus("Salvando...");
    const payload = { ...form };
    for (const field of config.fields) {
      if (field.type === "json" && typeof payload[field.name] === "string") {
        try {
          payload[field.name] = JSON.parse(String(payload[field.name] || "[]"));
        } catch {
          setStatus(`JSON invalido em ${field.label}.`);
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
      return;
    }
    setForm(config.defaults);
    setEditingId(null);
    setStatus("Salvo.");
    await load();
  }

  async function remove(id: string) {
    const { error } = await supabase.from(config.table).delete().eq("id", id);
    if (error) {
      setStatus(error.message);
      return;
    }
    await load();
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div>
        <p className="text-sm text-muted">{config.description}</p>
        <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
          {rows.map((row) => (
            <div
              key={row.id}
              className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-white/[0.02] px-4 py-3 last:border-b-0"
            >
              <div>
                <p className="font-medium text-fg">
                  {inputValue(row[config.titleField]) || "Sem titulo"}
                </p>
                <p className="text-xs text-muted">
                  ordem {inputValue(row.sort_order)} - {row.active ? "publicado" : "rascunho"}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(String(row.id));
                    setForm(row);
                  }}
                  className="rounded-full border border-white/15 px-4 py-2 text-xs text-fg hover:border-accent hover:text-accent"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => void remove(String(row.id))}
                  className="rounded-full border border-red-500/30 px-4 py-2 text-xs text-red-300 hover:border-red-400"
                >
                  Apagar
                </button>
              </div>
            </div>
          ))}
          {!rows.length && <p className="px-4 py-6 text-sm text-muted">Nada cadastrado ainda.</p>}
        </div>
      </div>

      <form onSubmit={save} className="rounded-2xl border border-white/10 bg-panel p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-2xl">{editingId ? "Editar" : "Novo"}</h2>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(config.defaults);
              }}
              className="text-xs text-muted hover:text-accent"
            >
              cancelar
            </button>
          )}
        </div>
        <div className="mt-5 space-y-4">
          {config.fields.map((field) => (
            <label key={field.name} className="block text-xs uppercase tracking-wider text-muted">
              {field.label}
              {field.type === "textarea" ? (
                <textarea
                  value={inputValue(form[field.name])}
                  onChange={(e) => updateField(field, e.target.value)}
                  rows={4}
                  className="mt-2 w-full rounded-xl border border-white/15 bg-bg px-3 py-2 text-sm text-fg outline-none focus:border-accent"
                />
              ) : field.type === "checkbox" ? (
                <input
                  checked={Boolean(form[field.name])}
                  onChange={(e) => updateField(field, e.target.checked)}
                  type="checkbox"
                  className="ml-3"
                />
              ) : (
                <>
                  <input
                    value={inputValue(form[field.name])}
                    onChange={(e) => updateField(field, e.target.value)}
                    type={field.type === "date" ? "date" : field.type === "number" ? "number" : "text"}
                    placeholder={field.placeholder}
                    className="mt-2 w-full rounded-xl border border-white/15 bg-bg px-3 py-2 text-sm text-fg outline-none focus:border-accent"
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
            </label>
          ))}
        </div>
        <button className="mt-6 w-full rounded-full bg-accent px-5 py-3 text-sm font-bold text-bg">
          Salvar
        </button>
        {status && <p className="mt-4 text-xs text-muted">{status}</p>}
      </form>
    </section>
  );
}

function SettingsEditor({ supabase }: { supabase: SupabaseClient }) {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("");

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  async function save() {
    setStatus("Salvando...");
    const rows = Object.entries(settings)
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
    <section className="max-w-2xl">
      <p className="text-sm text-muted">
        Midias globais usadas em hero, banner, rodape e clipe vertical.
      </p>
      <div className="mt-6 space-y-4 rounded-2xl border border-white/10 bg-panel p-5">
        {settingFields.map((field) => (
          <label key={field.key} className="block text-xs uppercase tracking-wider text-muted">
            {field.label}
            <input
              value={settings[field.key] ?? ""}
              onChange={(e) =>
                setSettings((current) => ({ ...current, [field.key]: e.target.value }))
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
        <button
          type="button"
          onClick={() => void save()}
          className="rounded-full bg-accent px-5 py-3 text-sm font-bold text-bg"
        >
          Salvar configuracoes
        </button>
        {status && <p className="text-xs text-muted">{status}</p>}
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
      <main className="min-h-screen bg-bg px-6 py-16 text-fg">
        <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-panel p-6">
          <h1 className="font-display text-4xl">Supabase nao configurado</h1>
          <p className="mt-3 text-sm text-muted">
            Preencha NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no .env.local.
          </p>
        </div>
      </main>
    );
  }

  if (!session) return <Login supabase={supabase} />;

  const config = configs.find((item) => item.table === active);

  return (
    <main className="min-h-screen bg-bg px-4 py-6 text-fg md:px-8">
      <header className="mx-auto flex max-w-7xl flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-accent">CMS</p>
          <h1 className="font-display mt-1 text-5xl">Admin Sensimilla</h1>
          <p className="mt-2 text-sm text-muted">
            Logado como {session.user.email}. Alteracoes publicadas aparecem na home.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void supabase.auth.signOut()}
          className="w-fit rounded-full border border-white/15 px-5 py-3 text-sm text-muted hover:border-accent hover:text-accent"
        >
          Sair
        </button>
      </header>

      <div className="mx-auto mt-6 max-w-7xl">
        <nav className="flex gap-2 overflow-x-auto pb-3">
          {configs.map((item) => (
            <button
              key={item.table}
              type="button"
              onClick={() => setActive(item.table)}
              className={`shrink-0 rounded-full border px-4 py-2 text-xs uppercase tracking-wider ${
                active === item.table
                  ? "border-accent bg-accent text-bg"
                  : "border-white/15 text-muted hover:border-accent hover:text-accent"
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setActive("settings")}
            className={`shrink-0 rounded-full border px-4 py-2 text-xs uppercase tracking-wider ${
              active === "settings"
                ? "border-accent bg-accent text-bg"
                : "border-white/15 text-muted hover:border-accent hover:text-accent"
            }`}
          >
            Midias globais
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

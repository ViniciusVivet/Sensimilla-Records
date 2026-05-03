-- Sensimilla Records CMS
-- Run this file in the Supabase SQL Editor.

create extension if not exists "pgcrypto";

create table if not exists public.site_members (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  role text,
  bio text,
  image_url text,
  spotify_url text,
  instagram_url text,
  youtube_url text,
  youtube_video_id text,
  is_placeholder boolean not null default false,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_events (
  id uuid primary key default gen_random_uuid(),
  title text,
  event_date date not null,
  city text not null,
  venue text not null,
  note text,
  ticket_url text,
  status text not null default 'scheduled' check (status in ('scheduled', 'past', 'draft')),
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_releases (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  artist text not null,
  meta text,
  cover_url text not null,
  spotify_embed text not null,
  href text,
  cta text,
  description text,
  platforms jsonb not null default '[]'::jsonb,
  featured boolean not null default false,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_merch (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tag text,
  price text,
  image_url text not null,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_editorial_photos (
  id uuid primary key default gen_random_uuid(),
  src text not null,
  alt text not null,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_social_links (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  href text not null,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_youtube_videos (
  id uuid primary key default gen_random_uuid(),
  youtube_id text not null,
  title text not null,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists touch_site_members on public.site_members;
create trigger touch_site_members before update on public.site_members
for each row execute function public.touch_updated_at();

drop trigger if exists touch_site_events on public.site_events;
create trigger touch_site_events before update on public.site_events
for each row execute function public.touch_updated_at();

drop trigger if exists touch_site_releases on public.site_releases;
create trigger touch_site_releases before update on public.site_releases
for each row execute function public.touch_updated_at();

drop trigger if exists touch_site_merch on public.site_merch;
create trigger touch_site_merch before update on public.site_merch
for each row execute function public.touch_updated_at();

drop trigger if exists touch_site_editorial_photos on public.site_editorial_photos;
create trigger touch_site_editorial_photos before update on public.site_editorial_photos
for each row execute function public.touch_updated_at();

drop trigger if exists touch_site_social_links on public.site_social_links;
create trigger touch_site_social_links before update on public.site_social_links
for each row execute function public.touch_updated_at();

drop trigger if exists touch_site_youtube_videos on public.site_youtube_videos;
create trigger touch_site_youtube_videos before update on public.site_youtube_videos
for each row execute function public.touch_updated_at();

alter table public.site_members enable row level security;
alter table public.site_events enable row level security;
alter table public.site_releases enable row level security;
alter table public.site_merch enable row level security;
alter table public.site_editorial_photos enable row level security;
alter table public.site_social_links enable row level security;
alter table public.site_youtube_videos enable row level security;
alter table public.site_settings enable row level security;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'site_members',
    'site_events',
    'site_releases',
    'site_merch',
    'site_editorial_photos',
    'site_social_links',
    'site_youtube_videos'
  ]
  loop
    execute format('drop policy if exists "%s public active select" on public.%I', table_name, table_name);
    execute format('create policy "%s public active select" on public.%I for select using (active = true)', table_name, table_name);
    execute format('drop policy if exists "%s authenticated manage" on public.%I', table_name, table_name);
    execute format('create policy "%s authenticated manage" on public.%I for all to authenticated using (true) with check (true)', table_name, table_name);
  end loop;
end $$;

drop policy if exists "site_settings public select" on public.site_settings;
create policy "site_settings public select" on public.site_settings
for select using (true);

drop policy if exists "site_settings authenticated manage" on public.site_settings;
create policy "site_settings authenticated manage" on public.site_settings
for all to authenticated using (true) with check (true);

insert into storage.buckets (id, name, public)
values ('site-media', 'site-media', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "site media public read" on storage.objects;
create policy "site media public read" on storage.objects
for select using (bucket_id = 'site-media');

drop policy if exists "site media authenticated manage" on storage.objects;
create policy "site media authenticated manage" on storage.objects
for all to authenticated
using (bucket_id = 'site-media')
with check (bucket_id = 'site-media');

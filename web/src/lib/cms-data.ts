import { unstable_noStore as noStore } from "next/cache";
import { fallbackCmsData } from "@/lib/cms-fallback";
import { createSupabaseServerClient } from "@/lib/supabase";
import type {
  CmsEditorialPhoto,
  CmsEvent,
  CmsFeaturedRelease,
  CmsMediaSettings,
  CmsMember,
  CmsMerchProduct,
  CmsRelease,
  CmsSocialLink,
  CmsVideo,
  PublicCmsData,
} from "@/lib/cms-types";

type Row = Record<string, unknown>;

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function asBool(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

function asArray<T>(value: unknown, fallback: T[] = []) {
  return Array.isArray(value) ? (value as T[]) : fallback;
}

function monthFromDate(date: string) {
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed
    .toLocaleDateString("pt-BR", { month: "short" })
    .replace(".", "")
    .toUpperCase();
}

function dayFromDate(date: string) {
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return "";
  return String(parsed.getDate()).padStart(2, "0");
}

function mapMember(row: Row): CmsMember {
  return {
    id: asString(row.slug || row.id),
    name: asString(row.name),
    role: asString(row.role),
    bio: asString(row.bio),
    image: asString(row.image_url) || null,
    spotifyUrl: asString(row.spotify_url) || undefined,
    youtubeUrl: asString(row.youtube_url) || undefined,
    instagramUrl: asString(row.instagram_url) || undefined,
    youtubeVideoId: asString(row.youtube_video_id) || undefined,
    isPlaceholder: asBool(row.is_placeholder),
  };
}

function mapEvent(row: Row): CmsEvent {
  const date = asString(row.event_date);
  return {
    date,
    month: asString(row.month) || monthFromDate(date),
    day: asString(row.day) || dayFromDate(date),
    city: asString(row.city),
    venue: asString(row.venue),
    note: asString(row.note),
    ticketUrl: asString(row.ticket_url) || undefined,
    status: asString(row.status, "scheduled") as CmsEvent["status"],
  };
}

function mapRelease(row: Row): CmsRelease {
  return {
    title: asString(row.title),
    artist: asString(row.artist),
    meta: asString(row.meta),
    cover: asString(row.cover_url),
    spotifyEmbed: asString(row.spotify_embed),
    featured: asBool(row.featured),
    description: asString(row.description) || undefined,
    href: asString(row.href) || undefined,
    cta: asString(row.cta) || undefined,
    platforms: asArray<{ name: string; href: string }>(row.platforms),
  };
}

function mapMerch(row: Row): CmsMerchProduct {
  return {
    name: asString(row.name),
    tag: asString(row.tag),
    price: asString(row.price),
    image: asString(row.image_url),
  };
}

function mapPhoto(row: Row): CmsEditorialPhoto {
  return {
    src: asString(row.src),
    alt: asString(row.alt),
  };
}

function mapSocial(row: Row): CmsSocialLink {
  return {
    name: asString(row.name),
    href: asString(row.href),
  } as CmsSocialLink;
}

function mapVideo(row: Row): CmsVideo {
  return {
    id: asString(row.youtube_id),
    title: asString(row.title),
    sortOrder: Number(row.sort_order ?? 0),
    active: asBool(row.active, true),
  };
}

function buildFeaturedRelease(
  releases: CmsRelease[],
  fallback: CmsFeaturedRelease,
): CmsFeaturedRelease {
  const item = releases.find((release) => release.featured) ?? releases[0];
  if (!item) return fallback;
  return {
    title: item.title,
    subtitle: item.artist,
    description: item.description || fallback.description,
    cover: item.cover || fallback.cover,
    cta: item.cta || "Ouvir no Spotify",
    href: item.href || `https://open.spotify.com/${item.spotifyEmbed}`,
    spotifyEmbed: item.spotifyEmbed,
    platforms: item.platforms?.length ? item.platforms : fallback.platforms,
  };
}

export async function getPublicCmsData(): Promise<PublicCmsData> {
  noStore();
  const supabase = createSupabaseServerClient();
  if (!supabase) return fallbackCmsData;

  const [
    membersResult,
    eventsResult,
    releasesResult,
    merchResult,
    photosResult,
    socialsResult,
    videosResult,
    settingsResult,
  ] = await Promise.all([
    supabase.from("site_members").select("*").eq("active", true).order("sort_order"),
    supabase.from("site_events").select("*").eq("active", true).order("event_date"),
    supabase.from("site_releases").select("*").eq("active", true).order("sort_order"),
    supabase.from("site_merch").select("*").eq("active", true).order("sort_order"),
    supabase.from("site_editorial_photos").select("*").eq("active", true).order("sort_order"),
    supabase.from("site_social_links").select("*").eq("active", true).order("sort_order"),
    supabase.from("site_youtube_videos").select("*").eq("active", true).order("sort_order"),
    supabase.from("site_settings").select("key,value"),
  ]);

  if (
    membersResult.error ||
    eventsResult.error ||
    releasesResult.error ||
    merchResult.error ||
    photosResult.error ||
    socialsResult.error ||
    videosResult.error ||
    settingsResult.error
  ) {
    return fallbackCmsData;
  }

  const releases = (releasesResult.data ?? []).map(mapRelease);
  const media = (settingsResult.data ?? []).reduce<CmsMediaSettings>(
    (acc, row) => {
      const key = asString(row.key) as keyof CmsMediaSettings;
      const value = asString(row.value);
      if (key && value) acc[key] = value;
      return acc;
    },
    {},
  );

  return {
    members: (membersResult.data ?? []).map(mapMember).length
      ? (membersResult.data ?? []).map(mapMember)
      : fallbackCmsData.members,
    events: (eventsResult.data ?? []).map(mapEvent).length
      ? (eventsResult.data ?? []).map(mapEvent)
      : fallbackCmsData.events,
    releases: releases.length ? releases : fallbackCmsData.releases,
    featuredRelease: buildFeaturedRelease(releases, fallbackCmsData.featuredRelease),
    merchProducts: (merchResult.data ?? []).map(mapMerch).length
      ? (merchResult.data ?? []).map(mapMerch)
      : fallbackCmsData.merchProducts,
    editorialPhotos: (photosResult.data ?? []).map(mapPhoto).length
      ? (photosResult.data ?? []).map(mapPhoto)
      : fallbackCmsData.editorialPhotos,
    socialLinks: (socialsResult.data ?? []).map(mapSocial).length
      ? (socialsResult.data ?? []).map(mapSocial)
      : fallbackCmsData.socialLinks,
    youtubeVideos: (videosResult.data ?? []).map(mapVideo).length
      ? (videosResult.data ?? []).map(mapVideo)
      : fallbackCmsData.youtubeVideos,
    media: { ...fallbackCmsData.media, ...media },
  };
}

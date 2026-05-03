import type {
  editorialCollage,
  merchProducts,
  members,
  tourDates,
} from "@/data/site";

export type CmsMember = (typeof members)[number];
export type CmsEvent = (typeof tourDates)[number] & {
  date?: string;
  status?: "scheduled" | "past" | "draft";
};
export type CmsRelease = {
  title: string;
  artist: string;
  meta: string;
  cover: string;
  spotifyEmbed: string;
  featured?: boolean;
  description?: string;
  href?: string;
  cta?: string;
  platforms?: { name: string; href: string }[];
};
export type CmsFeaturedRelease = {
  title: string;
  subtitle: string;
  description: string;
  cover: string;
  cta: string;
  href: string;
  spotifyEmbed: string;
  platforms: { name: string; href: string }[];
};
export type CmsMerchProduct = (typeof merchProducts)[number];
export type CmsEditorialPhoto = (typeof editorialCollage)[number];
export type CmsSocialLink = { name: string; href: string };

export type CmsVideo = {
  id: string;
  title: string;
  sortOrder?: number;
  active?: boolean;
};

export type CmsMediaSettings = {
  heroLogo?: string;
  bannerImage?: string;
  footerBanner?: string;
  heroVideoSrc?: string;
  verticalReelVideoId?: string;
};

export type PublicCmsData = {
  members: CmsMember[];
  events: CmsEvent[];
  releases: CmsRelease[];
  featuredRelease: CmsFeaturedRelease;
  merchProducts: CmsMerchProduct[];
  editorialPhotos: CmsEditorialPhoto[];
  socialLinks: CmsSocialLink[];
  youtubeVideos: CmsVideo[];
  media: CmsMediaSettings;
};

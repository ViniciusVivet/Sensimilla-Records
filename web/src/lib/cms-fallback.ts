import {
  catalogReleases,
  editorialCollage,
  featuredRelease,
  merchProducts,
  members,
  socialLinks,
  tourDates,
} from "@/data/site";
import type { PublicCmsData } from "@/lib/cms-types";

export const fallbackCmsData: PublicCmsData = {
  members: [...members],
  events: [...tourDates],
  releases: [...catalogReleases],
  featuredRelease,
  merchProducts: [...merchProducts],
  editorialPhotos: [...editorialCollage],
  socialLinks: [...socialLinks],
  youtubeVideos: [
    { id: "C9Eyy_hnxvs", title: "COGU FT. 270Jet - Alta Voltagem" },
    { id: "iv7MXFYxWMI", title: "LOUCURA - COGU FT. DAZDIH" },
    { id: "8N117Oo5KmE", title: "Festa Da SEN$I" },
  ],
  media: {
    heroLogo: "/logo-sensi.png",
    bannerImage: "/banner-sensi.jpg",
    footerBanner: "/banner-sensi.jpg",
    verticalReelVideoId: "C9Eyy_hnxvs",
  },
};

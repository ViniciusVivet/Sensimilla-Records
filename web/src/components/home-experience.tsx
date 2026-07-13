"use client";

import { SmoothScroll } from "@/components/smooth-scroll";
import { MiniPlayer } from "@/components/mini-player";
import { MiniPlayerProvider } from "@/components/mini-player-context";
import { HeroSection } from "@/components/sections/hero";
import { BrandStatementSection } from "@/components/sections/brand-statement";
import { BackstageSpotlightSection } from "@/components/sections/backstage-spotlight";
import { RosterSection } from "@/components/sections/roster";
import { TypeOutlineSection } from "@/components/sections/type-outline";
import { FeaturedReleaseSection } from "@/components/sections/featured-release";
import { OutNowSection } from "@/components/sections/out-now";
import { LiveBridgeSection } from "@/components/sections/live-bridge";
import { TourSection } from "@/components/sections/tour";
import { MerchSection } from "@/components/sections/merch";
import { YoutubeHubSection } from "@/components/sections/youtube-hub";
import { EditorialSection } from "@/components/sections/editorial";
import { VerticalReelSection } from "@/components/sections/vertical-reel";
import { ServicosTeaserSection } from "@/components/sections/servicos-teaser";
import { SiteFooter } from "@/components/sections/site-footer";
import { NavPills } from "@/components/nav-pills";
import type { PublicCmsData } from "@/lib/cms-types";

export function HomeExperience({ cmsData }: { cmsData: PublicCmsData }) {
  return (
    <MiniPlayerProvider tracks={cmsData.releases}>
      <SmoothScroll>
        <NavPills />
        <main
          id="main-content"
          className="bg-bg text-fg pb-[calc(7rem+env(safe-area-inset-bottom,0px))] md:pb-0"
        >
          <HeroSection socialLinks={cmsData.socialLinks} media={cmsData.media} />
          <BrandStatementSection
            manifestoLine={cmsData.media.manifestoLine}
            manifestoStats={cmsData.media.manifestoStats}
          />
          <BackstageSpotlightSection />
          <RosterSection members={cmsData.members} />
          <TourSection events={cmsData.events} />
          <TypeOutlineSection />
          <FeaturedReleaseSection release={cmsData.featuredRelease} />
          <OutNowSection releases={cmsData.releases} />
          <LiveBridgeSection />
          <ServicosTeaserSection whatsappNumber={cmsData.media.whatsappNumber} />
          <MerchSection products={cmsData.merchProducts} whatsappNumber={cmsData.media.whatsappNumber} />
          <YoutubeHubSection videos={cmsData.youtubeVideos} />
          <EditorialSection photos={cmsData.editorialPhotos} />
          <VerticalReelSection videoId={cmsData.media.verticalReelVideoId} />
          <SiteFooter socialLinks={cmsData.socialLinks} media={cmsData.media} />
        </main>
      </SmoothScroll>
      <MiniPlayer />
    </MiniPlayerProvider>
  );
}

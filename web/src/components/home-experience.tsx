"use client";

import { SmoothScroll } from "@/components/smooth-scroll";
import { HeroSection } from "@/components/sections/hero";
import { TypographySplash } from "@/components/sections/typography-splash";
import { BrandStatementSection } from "@/components/sections/brand-statement";
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

export function HomeExperience() {
  return (
    <SmoothScroll>
      <NavPills />
      <main id="main-content" className="bg-bg text-fg">
        <HeroSection />
        <TypographySplash />
        <BrandStatementSection />
        <RosterSection />
        <TourSection />
        <TypeOutlineSection />
        <FeaturedReleaseSection />
        <OutNowSection />
        <LiveBridgeSection />
        <ServicosTeaserSection />
        <MerchSection />
        <YoutubeHubSection />
        <EditorialSection />
        <VerticalReelSection />
        <SiteFooter />
      </main>
    </SmoothScroll>
  );
}

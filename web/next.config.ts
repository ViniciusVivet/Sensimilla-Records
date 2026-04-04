import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /**
   * Turbopack (dev): resolve tailwindcss a partir de web/node_modules,
   * nao da raiz do repo (onde nao ha node_modules).
   */
  turbopack: {
    resolveAlias: {
      tailwindcss: path.resolve(__dirname, "node_modules/tailwindcss"),
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "i.scdn.co", pathname: "/image/**" },
    ],
  },
};

export default nextConfig;

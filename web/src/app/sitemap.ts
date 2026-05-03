import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  const paths: { path: string; changeFrequency: "weekly" | "monthly"; priority: number }[] = [
    { path: "", changeFrequency: "weekly", priority: 1 },
    { path: "/servicos", changeFrequency: "weekly", priority: 0.9 },
    { path: "/imprensa", changeFrequency: "monthly", priority: 0.75 },
    { path: "/contato", changeFrequency: "monthly", priority: 0.7 },
    { path: "/referencias", changeFrequency: "monthly", priority: 0.5 },
    { path: "/privacidade", changeFrequency: "yearly", priority: 0.3 },
    { path: "/termos", changeFrequency: "yearly", priority: 0.3 },
  ];

  return paths.map(({ path, changeFrequency, priority }) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}

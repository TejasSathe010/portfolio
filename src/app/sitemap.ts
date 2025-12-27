import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { caseStudies } from "@/lib/content";

// Optional but recommended: cache sitemap for a day (prevents regenerating on every request)
export const revalidate = 60 * 60 * 24;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const lastModified = new Date();

  const staticPaths = [
    "",
    "/start",
    "/case-studies",
    "/work",
    "/evidence",
    "/postmortems",
    "/highlights",
    "/console"
  ];

  const staticRoutes = staticPaths.map((p) => ({
    url: `${base}${p}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : p === "/start" ? 0.9 : 0.7
  }));

  const csRoutes = caseStudies.map((c) => ({
    url: `${base}/case-studies/${c.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.8
  }));

  return [...staticRoutes, ...csRoutes];
}

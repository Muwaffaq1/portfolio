import type { MetadataRoute } from "next";
import { getProjects, getSystems } from "@/lib/content";
import { lab } from "@/lib/lab";

// Built once at export time, so search engines get every page without crawling for it.
export const dynamic = "force-static";

const base = "https://muwaffaq.pages.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const page = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({ url: `${base}${path}`, priority });
  return [
    page("/", 1),
    page("/about/", 0.8),
    page("/services/", 0.6),
    page("/systems/", 0.7),
    page("/playground/", 0.7),
    ...getProjects().filter((p) => p.hasCaseStudy).map((p) => page(`/work/${p.slug}/`, 0.9)),
    ...getSystems().map((s) => page(`/systems/${s.slug}/`, 0.8)),
    ...lab.map((p) => page(`/playground/${p.slug}/`, 0.4)),
  ];
}

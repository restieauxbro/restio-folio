import type { MetadataRoute } from "next";
import { getAllCaseStudies } from "@/lib/case-studies";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/case-studies", "/about", "/contact"].map((path) => ({ url: `${site.url}${path}` }));
  const studies = getAllCaseStudies().map((cs) => ({
    url: `${site.url}/case-studies/${cs.slug}`,
    lastModified: new Date(`${cs.date}T00:00:00Z`),
  }));
  return [...pages, ...studies];
}

import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/content";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();
  const latest = posts[0]?.date ?? new Date();
  return [
    { url: site.url, lastModified: latest, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/insights`, lastModified: latest, changeFrequency: "weekly", priority: 0.8 },
    ...posts.map((p) => ({
      url: `${site.url}/insights/${p.slug}`,
      lastModified: p.date,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}

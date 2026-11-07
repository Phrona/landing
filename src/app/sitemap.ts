import type { MetadataRoute } from "next";

/**
 * sitemap.xml
 *
 * Low value at eight pages — crawlers will find these by following links. It
 * earns its keep as the library grows, when a new essay should be discovered in
 * days rather than weeks. Listed by hand rather than globbed so that adding a
 * page is a deliberate act: /about is unlinked on purpose and must stay out.
 */
const BASE = "https://phrona.io";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    {
      url: `${BASE}/how-it-works`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    { url: `${BASE}/for-operators`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/for-investors`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/connect`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    {
      url: `${BASE}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}

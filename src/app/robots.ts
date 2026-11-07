import type { MetadataRoute } from "next";

/**
 * robots.txt
 *
 * Everything is open, deliberately. The crawlers that matter here are the ones
 * that fetch a page at query time to answer someone's question — OAI-SearchBot,
 * Claude-SearchBot, PerplexityBot and their user-initiated siblings. Blocking
 * them would leave third-party aggregator profiles as the only retrievable
 * description of this company, which is the opposite of what we want while
 * those profiles are wrong.
 *
 * /about is excluded because it is deliberately unlinked; it also carries a
 * noindex tag, and the two together are belt and braces.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/about"] }],
    sitemap: "https://phrona.io/sitemap.xml",
    host: "https://phrona.io",
  };
}

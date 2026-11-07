/**
 * Organization + WebSite structured data.
 *
 * Scope note, because this is easy to over-value: Google's own AI-optimization
 * guidance (updated 2026-07-10) states plainly that "structured data isn't
 * required for generative AI search, and there's no special schema.org markup
 * you need to add." A controlled study found no positive effect on AI citation
 * and a small negative one on AI Overviews. So this is NOT here as a
 * discoverability lever.
 *
 * It is here for two documented jobs:
 *
 *  1. `WebSite.name` / `alternateName` is the documented way to control the
 *     site name Google displays. That matters when a third-party aggregator
 *     profile outranks the company's own site.
 *  2. `naics` and `legalName` are named by Google as properties used to
 *     disambiguate one organization from another — which is the actual problem
 *     here, given how many companies share this name root.
 *
 * NAICS 541614 covers management consulting; 511210 covers software publishing.
 * 513210 is the current software-publisher code under NAICS 2022 and is the
 * closer fit for a subscription platform.
 */
export function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://phrona.io/#organization",
        name: "Phrona",
        legalName: "Phrona, Inc.",
        alternateName: "Phrona, Inc.",
        url: "https://phrona.io",
        logo: "https://phrona.io/icon.png",
        description:
          "Phrona is infrastructure for strategy. It continuously monitors the world around a company, keeping the convictions its strategy depends on grounded in reality and the strategy itself coherent.",
        naics: "513210",
        foundingDate: "2026",
        email: "hello@phrona.io",
        knowsAbout: [
          "strategic planning",
          "competitive intelligence",
          "strategic assumptions",
          "scenario planning",
          "market intelligence",
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://phrona.io/#website",
        url: "https://phrona.io",
        name: "Phrona",
        alternateName: "Phrona, Inc.",
        publisher: { "@id": "https://phrona.io/#organization" },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Content is a literal defined above — no user input reaches this.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

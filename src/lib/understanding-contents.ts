/**
 * Every question on the Understanding Phrona page, in document order.
 *
 * One list, three consumers: the section headings, the mobile contents card,
 * and the sticky pane's scroll-spy. Anchors are derived rather than written
 * down, so retitling a question can't strand a link.
 */
export const CONTENTS = [
  "What is Phrona?",
  "What is “infrastructure for strategy”?",
  "Why doesn’t infrastructure for strategy already exist?",
  "Will every company eventually need strategy infrastructure?",
  "How does Phrona work?",
  "Does Phrona make strategic decisions?",
  "Can’t Claude (or ChatGPT or Gemini) do the same thing?",
  "Isn’t this just a knowledge graph? Or GraphRAG?",
  "So it’s just competitive intelligence, then?",
  "Isn’t this just strategy software? Or another OKR platform?",
  "Why not just hire a consultant?",
  "Doesn’t my team already own this?",
  "What changes when a company has infrastructure for strategy?",
  "What this means in practice",
  "Is Phrona just another system to maintain?",
  "What does Phrona deliver?",
  "Who is Phrona for?",
  "How is our strategy kept private?",
  "What is the Founding Cohort?",
  "How do we get started?",
] as const;

/** Anchor id for a question. */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

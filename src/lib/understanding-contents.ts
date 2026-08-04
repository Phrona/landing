/**
 * Every question on the Understanding Phrona page, in document order.
 *
 * One list, three consumers: the section headings, the mobile contents card,
 * and the sticky pane's scroll-spy. Anchors are derived rather than written
 * down, so retitling a question can't strand a link.
 */
export const CONTENT_GROUPS = [
  {
    label: "What it is",
    questions: [
      "What is Phrona?",
      "What is “infrastructure for strategy”?",
      "Why doesn’t infrastructure for strategy already exist?",
      "Will every company eventually need strategy infrastructure?",
    ],
  },
  {
    label: "How it works",
    questions: [
      "How does Phrona work?",
      "Does Phrona make strategic decisions?",
    ],
  },
  {
    label: "What it isn’t",
    questions: [
      "Can’t Claude (or ChatGPT or Gemini) do the same thing?",
      "Isn’t this just a knowledge graph? Or GraphRAG?",
      "So it’s just competitive intelligence, then?",
      "Isn’t this just strategy software? Or another OKR platform?",
      "Why not just hire a consultant?",
      "Doesn’t my team already own this?",
    ],
  },
  {
    label: "What changes",
    questions: [
      "What changes when a company has infrastructure for strategy?",
      "What this means in practice",
      "Is Phrona just another system to maintain?",
    ],
  },
  {
    label: "What you get",
    questions: [
      "What does Phrona deliver?",
      "Who is Phrona for?",
      "How is our strategy kept private?",
      "What is the Founding Cohort?",
      "How do we get started?",
    ],
  },
] as const;

/** Flat document order — the groups exist for navigation, not for the page. */
export const CONTENTS = CONTENT_GROUPS.flatMap((g) => g.questions);

/** Anchor id for a question. */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

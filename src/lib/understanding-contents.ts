/**
 * Every question on the Understanding Phrona page, in document order.
 *
 * One list, three consumers: the section headings, the mobile contents card,
 * and the sticky pane's scroll-spy. Anchors are derived rather than written
 * down, so retitling a question can't strand a link.
 *
 * `nav` is the short form used in the contents rail. A heading can afford a
 * full sentence across 48rem; a 17rem rail can't, and a rail where every
 * entry wraps to two lines is one that scrolls — which defeats the point of
 * having the whole document one click away. Where `nav` is absent the
 * question is already short enough to stand as-is.
 */
export const CONTENT_GROUPS = [
  {
    label: "What it is",
    questions: [
      { title: "What is Phrona?" },
      {
        title: "What is “infrastructure for strategy”?",
        nav: "Infrastructure for strategy",
      },
      {
        title: "Why doesn’t infrastructure for strategy already exist?",
        nav: "Why doesn’t it exist yet?",
      },
      {
        title: "Will every company eventually need strategy infrastructure?",
        nav: "Will everyone need it?",
      },
    ],
  },
  {
    label: "How it works",
    questions: [
      { title: "How does Phrona work?" },
      {
        title: "Does Phrona make strategic decisions?",
        nav: "Does it decide for you?",
      },
    ],
  },
  {
    label: "What it isn’t",
    questions: [
      {
        title: "Can’t Claude (or ChatGPT or Gemini) do the same thing?",
        nav: "Isn’t this just ChatGPT?",
      },
      {
        title: "Isn’t this just a knowledge graph? Or GraphRAG?",
        nav: "Knowledge graph? GraphRAG?",
      },
      {
        title: "So it’s just competitive intelligence, then?",
        nav: "Competitive intelligence?",
      },
      {
        title: "Isn’t this just strategy software? Or another OKR platform?",
        nav: "Strategy software? OKRs?",
      },
      { title: "Why not just hire a consultant?" },
      {
        title: "Doesn’t my team already own this?",
        nav: "Doesn’t my team own this?",
      },
    ],
  },
  {
    label: "What changes",
    questions: [
      {
        title: "What changes when a company has infrastructure for strategy?",
        nav: "What changes",
      },
      {
        title: "Is Phrona just another system to maintain?",
        nav: "Another system to maintain?",
      },
    ],
  },
  {
    label: "What you get",
    questions: [
      { title: "What does Phrona deliver?" },
      { title: "Who is Phrona for?" },
      { title: "How is our strategy kept private?" },
      { title: "What is the Founding Cohort?" },
      { title: "How do we get started?" },
    ],
  },
] as const;

/** Flat document order — the groups exist for navigation, not for the page. */
export const CONTENTS = CONTENT_GROUPS.flatMap((g) =>
  g.questions.map((q) => q.title),
);

/** Anchor id for a question. Always derived from the full title, never the
    short nav form, so shortening a label can't move an anchor. */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

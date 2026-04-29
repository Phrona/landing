import ReactMarkdown from "react-markdown";

/**
 * Renders a long-form legal markdown doc with:
 *  - H1 + preface content (banners, dates) at top
 *  - Auto-generated Table of Contents (bordered card, 2-col grid)
 *  - Each h2 section gets a numbered badge + accent underline + slug anchor
 *
 * Pattern adapted from Neville Ventures' legal pages — numbered scaffolding
 * makes long legal text scannable instead of a wall.
 */

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

// Strip leading numbers from section titles ("1. Overview" → "Overview")
// since we auto-number sections via the badge.
function cleanTitle(title: string): string {
  return title.replace(/^\d+\.\s+/, "");
}

function parseSections(md: string) {
  const lines = md.split("\n");
  const preface: string[] = [];
  const sections: Array<{ title: string; content: string }> = [];
  let mode: "preface" | "section" = "preface";
  let currentTitle = "";
  let currentContent: string[] = [];

  const finishCurrent = () => {
    if (mode === "section" && (currentTitle || currentContent.length)) {
      sections.push({
        title: cleanTitle(currentTitle),
        content: currentContent.join("\n"),
      });
      currentTitle = "";
      currentContent = [];
    }
  };

  for (const line of lines) {
    if (line.startsWith("## ")) {
      finishCurrent();
      mode = "section";
      currentTitle = line.slice(3).trim();
      continue;
    }
    if (mode === "preface") {
      preface.push(line);
    } else {
      currentContent.push(line);
    }
  }
  finishCurrent();

  return { preface: preface.join("\n"), sections };
}

// Shared markdown component map used for both preface and section bodies.
const components = {
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-medium text-foreground mb-8 leading-[1.15]">
      {children}
    </h1>
  ),
  // h2 is handled by SectionHeader, not by this map. Remaining h-levels:
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="font-heading text-lg sm:text-xl font-medium text-foreground mt-10 mb-4 leading-[1.25]">
      {children}
    </h3>
  ),
  h4: ({ children }: { children?: React.ReactNode }) => (
    <h4 className="font-heading text-base sm:text-lg font-medium text-foreground mt-8 mb-3 leading-[1.3]">
      {children}
    </h4>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="mb-5 text-muted-foreground leading-relaxed">{children}</p>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="mb-5 ml-6 space-y-2 list-disc text-muted-foreground">
      {children}
    </ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="mb-5 ml-6 space-y-2 list-decimal text-muted-foreground">
      {children}
    </ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="leading-relaxed">{children}</li>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="text-foreground font-semibold">{children}</strong>
  ),
  em: ({ children }: { children?: React.ReactNode }) => (
    <em className="italic">{children}</em>
  ),
  a: ({
    href,
    children,
  }: {
    href?: string;
    children?: React.ReactNode;
  }) => (
    <a
      href={href}
      className="text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
    >
      {children}
    </a>
  ),
  // Card-style callout — used for DRAFT banners, contact info, notes.
  // Subtle white-tint bg + cyan-blue left accent + rounded corners.
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="my-8 px-7 py-6 rounded-lg border-l-[3px] border-[rgba(120,180,255,0.55)] bg-[rgba(255,255,255,0.025)] not-italic text-muted-foreground [&>p:last-child]:mb-0 [&>p]:mb-3">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-12 border-border" />,
  code: ({ children }: { children?: React.ReactNode }) => (
    <code className="font-mono text-sm bg-muted px-1.5 py-0.5 rounded">
      {children}
    </code>
  ),
  table: ({ children }: { children?: React.ReactNode }) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full text-sm">{children}</table>
    </div>
  ),
  th: ({ children }: { children?: React.ReactNode }) => (
    <th className="text-left font-medium text-foreground border-b border-border pb-2 pr-4">
      {children}
    </th>
  ),
  td: ({ children }: { children?: React.ReactNode }) => (
    <td className="py-2 pr-4 align-top border-b border-border/50">
      {children}
    </td>
  ),
};

function TableOfContents({
  sections,
}: {
  sections: Array<{ title: string }>;
}) {
  return (
    <nav
      aria-label="Table of contents"
      className="my-12 px-8 py-8 rounded-xl border border-border bg-[rgba(255,255,255,0.015)]"
    >
      <h2 className="font-heading text-lg sm:text-xl font-semibold text-foreground mb-5">
        Table of Contents
      </h2>
      <hr className="border-border mb-6" />
      <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4 list-none m-0 p-0">
        {sections.map((section, i) => {
          const num = String(i + 1).padStart(2, "0");
          const slug = slugify(section.title);
          return (
            <li key={slug} className="flex gap-5 items-baseline m-0">
              <span className="font-mono text-sm slashed-zero tabular-nums text-[rgb(120,180,255)] font-medium w-7 shrink-0">
                {num}
              </span>
              <a
                href={`#${slug}`}
                className="text-muted-foreground hover:text-foreground transition-colors no-underline leading-relaxed"
              >
                {section.title}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function SectionHeader({ num, title }: { num: number; title: string }) {
  const numStr = String(num).padStart(2, "0");
  return (
    <div className="mb-6">
      <div className="flex items-center gap-4 mb-4">
        <span className="font-mono text-sm slashed-zero tabular-nums text-[rgb(120,180,255)] font-semibold border border-[rgba(120,180,255,0.35)] bg-[rgba(120,180,255,0.06)] rounded-md px-2.5 py-1.5 leading-none">
          {numStr}
        </span>
        <h2 className="font-heading text-2xl sm:text-3xl font-medium text-foreground leading-[1.2] m-0">
          {title}
        </h2>
      </div>
      <div className="h-px w-16 bg-[rgba(120,180,255,0.4)]" />
    </div>
  );
}

export function MarkdownPage({ source }: { source: string }) {
  const { preface, sections } = parseSections(source);

  return (
    <article
      id="top"
      className="font-sans text-base sm:text-lg text-muted-foreground leading-relaxed scroll-mt-12"
    >
      {/* H1 + preface (banners, dates, intro) */}
      <ReactMarkdown components={components}>{preface}</ReactMarkdown>

      {sections.length > 0 && <TableOfContents sections={sections} />}

      {/* Numbered sections — each with its own anchor for TOC linking */}
      {sections.map((section, i) => {
        const slug = slugify(section.title);
        return (
          <section
            key={slug}
            id={slug}
            className="mt-16 scroll-mt-24"
          >
            <SectionHeader num={i + 1} title={section.title} />
            <ReactMarkdown components={components}>
              {section.content}
            </ReactMarkdown>
          </section>
        );
      })}

      {/* Back to top — outlined chip, subtle */}
      {sections.length > 0 && (
        <div className="mt-20 mb-4">
          <a
            href="#top"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md border border-border text-sm text-muted-foreground hover:text-foreground hover:border-[rgba(120,180,255,0.4)] transition-colors no-underline"
          >
            <span aria-hidden>↑</span>
            <span>Back to top</span>
          </a>
        </div>
      )}
    </article>
  );
}

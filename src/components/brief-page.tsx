import { UpdatesForm } from "@/components/updates-form";

/**
 * Shared layout for /for-operators and /for-investors: the problem the brief
 * addresses in a few lines, then the brief itself as a direct download.
 *
 * The download is never gated. The updates field sits beneath it as an option
 * for readers who want more, because the priority is that the brief is easy to
 * read, forward and discuss.
 */
export function BriefPage({
  eyebrow,
  title,
  lede,
  points,
  briefSlug,
  briefLabel,
  audience,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  points: { heading: string; body: string }[];
  briefSlug: "operator-brief" | "investor-brief";
  briefLabel: string;
  audience: "operators" | "investors";
}) {
  return (
    <main className="flex flex-1 flex-col">
      <section className="px-6 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-muted-foreground mb-6">
            {eyebrow}
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-medium mb-6 leading-[1.15]">
            {title}
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-12">{lede}</p>

          <div className="space-y-8 mb-14">
            {points.map((p) => (
              <div key={p.heading}>
                <h2 className="text-base sm:text-lg font-medium text-foreground mb-2">{p.heading}</h2>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-12">
            <h2 className="font-heading text-2xl sm:text-3xl font-medium mb-3">{briefLabel}</h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8">
              Five pages. No sign-up needed.
            </p>
            <a
              href={`/download/${briefSlug}`}
              className="inline-flex items-center justify-center px-6 py-3 bg-hero text-hero-foreground rounded-full text-lg font-bold hover:shadow-[0_0_28px_rgba(120,180,255,0.65),0_0_64px_rgba(120,180,255,0.40)] transition-shadow"
            >
              Download the brief (PDF)
            </a>

            <div className="mt-14">
              <UpdatesForm audience={audience} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

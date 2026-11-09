import type { Metadata } from "next";
import { SnapshotRequestForm } from "@/components/snapshot-request-form";

export const metadata: Metadata = {
  title: "Request a Strategy Snapshot",
  description:
    "A free, outside-in read of your company's strategy from public information: what you appear to be betting on, what those bets depend on, and what the public record can't tell us.",
  alternates: { canonical: "/snapshot" },
};

const COVERS = [
  "How your company presents itself, and what it appears to stand for.",
  "The bets your strategy seems to rest on, and the assumptions each one depends on.",
  "What the public record says about those assumptions, including competitors and the organisations around you.",
  "What Phrona would watch for you, and the questions only your own records can answer.",
];

/**
 * phrona.io/snapshot — request a free Strategy Snapshot (Aaron, 2026-11-09).
 * Each Snapshot is prepared by hand and sent as a PDF; nothing here generates
 * one or promises when it arrives. `?for=investor` preselects "a company I've
 * invested in", for links from /for-investors.
 */
export default async function SnapshotPage({
  searchParams,
}: {
  searchParams: Promise<{ for?: string }>;
}) {
  const { for: who } = await searchParams;
  const audience = who === "investor" ? "investor" : "operator";
  return (
    <main className="flex flex-1 flex-col">
      <section className="px-6 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-muted-foreground mb-6">Strategy Snapshot</p>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-medium mb-6 leading-[1.15]">
            Request a Strategy Snapshot
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-12">
            We read what&rsquo;s public about your company and send you a short document showing how Phrona reads your
            strategy. It&rsquo;s free, and no call is needed.
          </p>

          <div className="grid sm:grid-cols-2 gap-10 mb-16 border-t border-border pt-12">
            <div>
              <h2 className="font-heading text-xl sm:text-2xl font-medium mb-5">What it covers</h2>
              <ul className="space-y-3">
                {COVERS.map((c) => (
                  <li key={c} className="text-base text-muted-foreground leading-relaxed flex gap-3">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[rgb(120,180,255)]" aria-hidden="true" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-heading text-xl sm:text-2xl font-medium mb-5">What it isn&rsquo;t</h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                It uses only public information, so it can&rsquo;t see your plans, your numbers or your internal
                discussions. It&rsquo;s an introduction to how Phrona reasons, not a substitute for Phrona itself, which
                works from your own strategy and keeps watch as conditions change.
              </p>
            </div>
          </div>

          <div id="request" className="scroll-mt-28 border-t border-border pt-12">
            <SnapshotRequestForm audience={audience} />
          </div>
        </div>
      </section>
    </main>
  );
}

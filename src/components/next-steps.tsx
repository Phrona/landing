import Link from "next/link";
import { InquireForm } from "@/components/inquire-form";

const outlinePill =
  "inline-flex items-center justify-center px-6 py-3 border border-foreground/70 rounded-full text-base sm:text-lg font-bold text-foreground hover:border-foreground hover:shadow-[0_0_20px_rgba(120,180,255,0.40),0_0_44px_rgba(120,180,255,0.22)] transition-shadow";

/**
 * The shared close of /for-operators and /for-investors (Aaron, 2026-11-09):
 * after the page's own opening, the same two steps for either reader. First test
 * it out with a free Strategy Snapshot, then join the founding beta.
 */
export function NextSteps({ audience }: { audience: "operator" | "investor" }) {
  const investor = audience === "investor";
  return (
    <>
      <div id="snapshot" className="scroll-mt-28 border-t border-border mt-16 pt-16">
        <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-muted-foreground mb-4">Test it out</p>
        <h2 className="font-heading text-3xl sm:text-4xl font-medium mb-6 leading-[1.15]">
          {investor ? "See how Phrona reads a company you hold" : "See how Phrona reads your company"}
        </h2>
        <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8">
          {investor
            ? "Request a free Strategy Snapshot of one of your portfolio companies. We read what's public and send you a short document on what it appears to be betting on, what those bets depend on, and what the public record can't tell us."
            : "Request a free Strategy Snapshot. We read what's public about your company and send you a short document on what you appear to be betting on, what those bets depend on, and what the public record can't tell us."}
        </p>
        <Link href={investor ? "/snapshot?for=investor" : "/snapshot"} className={outlinePill}>
          Request a Strategy Snapshot
        </Link>
      </div>

      <div id="founding-beta" className="scroll-mt-28 border-t border-border mt-16 pt-16">
        {/* The old anchor, kept so links to it still land here. */}
        <span id="founding-cohort" className="block scroll-mt-28" aria-hidden="true" />
        <h2 className="font-heading text-3xl sm:text-4xl font-medium mb-6 leading-[1.15]">Join the founding beta</h2>
        <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-12">
          Phrona is launching in beta, with limited availability. We&rsquo;re working with a small group of{" "}
          {investor ? "investors and companies" : "companies and investors"} to define what infrastructure for strategy
          becomes.
        </p>
        <InquireForm audience={audience} />
      </div>
    </>
  );
}

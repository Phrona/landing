import type { Metadata } from "next";
import { BriefPage } from "@/components/brief-page";
import { InquireForm } from "@/components/inquire-form";

export const metadata: Metadata = {
  title: "For operators",
  description:
    "Strategy drifts when the world changes faster than execution can adapt. Get the operator brief.",
  alternates: { canonical: "/for-operators" },
};

export default function ForOperatorsPage() {
  return (
    <BriefPage
      eyebrow="For operators"
      title="Your strategy needs to keep pace as the world changes"
      lede="Strategy drifts when the world changes faster than execution can adapt. When time, capital, and attention continue to follow the original plan, that drift gets expensive."
      claims={[
        "Changes are addressed, but decisions are not revisited.",
        "The longer you stay the course, the more committed you become.",
        "Companies track performance, but not what their decisions depend on.",
      ]}
      inside={[
        "How strategic drift develops while execution continues",
        "How Phrona connects changing conditions to decisions already in motion",
        "A worked example showing what earlier reconsideration preserves",
      ]}
      briefSlug="operator-brief"
      cover={{ src: "/briefs/operator-brief-cover.png", alt: "Cover of the Phrona operator brief" }}
    >
      <div id="founding-cohort" className="scroll-mt-28 border-t border-border mt-16 pt-16">
        <h2 className="font-heading text-3xl sm:text-4xl font-medium mb-6 leading-[1.15]">Join the founding cohort</h2>
        <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-12">
          Phrona is launching in beta. We&rsquo;re partnering with ten companies to define what infrastructure for strategy becomes.
        </p>
        <InquireForm />
      </div>
    </BriefPage>
  );
}

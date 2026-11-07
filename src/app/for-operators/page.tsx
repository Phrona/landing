import type { Metadata } from "next";
import { BriefPage } from "@/components/brief-page";

export const metadata: Metadata = {
  title: "For operators",
  description:
    "Strategy drifts when the world changes faster than execution can adapt. Get the operator brief.",
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
    />
  );
}

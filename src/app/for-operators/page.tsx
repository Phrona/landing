import type { Metadata } from "next";
import { BriefPage } from "@/components/brief-page";

export const metadata: Metadata = {
  title: "For operators",
  description:
    "Strategy drifts when the world changes faster than execution can adapt. Download the operator brief.",
  // Reached from links Aaron shares, not from search, until the pages are announced.
  robots: { index: false, follow: true },
};

export default function ForOperatorsPage() {
  return (
    <BriefPage
      eyebrow="For operators"
      title="Your strategy needs to keep pace as the world changes"
      lede="Strategy drifts when the world changes faster than execution can adapt. When time, capital, and attention continue to follow the original plan, that drift gets expensive."
      points={[
        {
          heading: "Changes are addressed, but decisions are not revisited",
          body: "Forecasts are revised, operating plans are adjusted, and recovery measures are put in place. Each response addresses the immediate change, but none reopens the original decision on its own, and their combined effect is not considered.",
        },
        {
          heading: "The longer you stay the course, the more committed you become",
          body: "By the time a decision is reconsidered, investments have been made and opportunities have passed. Some commitments cannot be reversed.",
        },
        {
          heading: "Companies track performance, but not what their decisions depend on",
          body: "Companies track forecasts, performance, cash, and headcount, but not their key decisions and the reasoning behind them. Phrona connects changing conditions to the decisions they affect.",
        },
      ]}
      briefSlug="operator-brief"
      briefLabel="The operator brief"
      audience="operators"
    />
  );
}

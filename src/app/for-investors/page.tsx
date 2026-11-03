import type { Metadata } from "next";
import { BriefPage } from "@/components/brief-page";

export const metadata: Metadata = {
  title: "For investors",
  description:
    "The investment thesis formed in diligence can fall out of date after you invest. Download the investor brief.",
  // Reached from links Aaron shares, not from search, until the pages are announced.
  robots: { index: false, follow: true },
};

export default function ForInvestorsPage() {
  return (
    <BriefPage
      eyebrow="For investors"
      title="Your investment thesis can fall out of date after you invest"
      lede="Diligence captures the risks and assumptions behind an investment at one point in time. After the check is written, new evidence arrives, but the original thesis is rarely updated in one place."
      points={[
        {
          heading: "New issues reach the board, but the investment thesis is not revisited",
          body: "Board decks are rebuilt each quarter around current results. They rarely carry forward what the investment depended on, or whether those questions were resolved.",
        },
        {
          heading: "The longer a risk remains open, the more capital depends on it",
          body: "Some investments turn on a few prominent risks: a permit, an anchor customer, a technical milestone, a tax credit. If they are not resolved early, more capital is committed while the outcome remains uncertain.",
        },
        {
          heading: "Portfolio reporting tracks performance, not the assumptions behind it",
          body: "Phrona keeps each investment connected to the assumptions behind it, shows what new information changes, and helps investors decide where to look next.",
        },
      ]}
      briefSlug="investor-brief"
      briefLabel="The investor brief"
      audience="investors"
    />
  );
}

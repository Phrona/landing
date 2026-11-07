import type { Metadata } from "next";
import { BriefPage } from "@/components/brief-page";

export const metadata: Metadata = {
  title: "For investors",
  description:
    "Due diligence identifies key risks at a point in time. Get the investor brief on keeping your investments connected to the assumptions behind them.",
};

export default function ForInvestorsPage() {
  return (
    <BriefPage
      eyebrow="For investors"
      title="Strong returns start with knowing where your investments stand"
      lede="Due diligence identifies key risks at a point in time. After you invest, new evidence can undermine your thesis as follow-ons put more capital at risk."
      claims={[
        "New issues reach the board, but the investment thesis is not revisited.",
        "The longer a risk goes unresolved, the more your capital is exposed.",
        "Reporting tracks performance, not whether key risks are resolved.",
      ]}
      inside={[
        "Why investment assumptions disappear from view after diligence",
        "How Phrona reconnects new evidence to the original thesis",
        "How it could support diligence, board preparation, and portfolio oversight",
      ]}
      briefSlug="investor-brief"
      cover={{ src: "/briefs/investor-brief-cover.png", alt: "Cover of the Phrona investor brief" }}
    />
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { BriefPage } from "@/components/brief-page";

export const metadata: Metadata = {
  title: "For investors",
  description:
    "Due diligence identifies key risks at a point in time. Get the investor brief on keeping your investments connected to the assumptions behind them.",
  alternates: { canonical: "/for-investors" },
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
    >
      <div className="border-t border-border mt-16 pt-16">
        <h2 className="font-heading text-3xl sm:text-4xl font-medium mb-6 leading-[1.15]">Talk about your portfolio</h2>
        <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10">
          Tell us about an investment, or a decision ahead of you, and we&rsquo;ll show you how Phrona would keep the thesis behind it current.
        </p>
        <Link
          href="/connect"
          className="inline-flex items-center justify-center px-6 py-3 bg-hero text-hero-foreground rounded-full text-lg font-bold hover:shadow-[0_0_28px_rgba(120,180,255,0.65),0_0_64px_rgba(120,180,255,0.40)] transition-shadow"
        >
          Connect with Phrona
        </Link>
      </div>
    </BriefPage>
  );
}

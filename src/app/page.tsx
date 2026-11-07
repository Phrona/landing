import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SmallCaps } from "@/components/small-caps";

const DECISIONS = [
  {
    n: "01",
    title: "Entering a new market",
    body: "You’re betting millions on assumptions about customers, competitors, regulation, and timing. If those assumptions change, your strategy should too.",
  },
  {
    n: "02",
    title: "Launching a new product",
    body: "Product decisions compound quickly. The longer they’re built on outdated customer assumptions, the more expensive they become to change.",
  },
  {
    n: "03",
    title: "Committing significant capital",
    body: "Capital is easy to deploy and difficult to recover. Strategic assumptions deserve continuous validation before they become irreversible investments.",
  },
  {
    n: "04",
    title: "Scaling the organization",
    body: "Hiring amplifies strategy. Building the wrong organization around stale assumptions locks yesterday’s thinking into tomorrow’s execution.",
  },
  {
    n: "05",
    title: "Responding to disruption",
    body: "The hardest part isn’t seeing competitors move — it’s knowing whether their move should change yours.",
  },
  {
    n: "06",
    title: "Making long-term technology bets",
    body: "Every long-term technology bet depends on convictions about where technology is headed. The hard part is knowing when those convictions should change.",
  },
];

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const MOVES = [
  {
    n: "01",
    title: "Capture",
    body: "Phrona maps your convictions, the goals they support and the initiatives they enable into a living model of your strategy.",
  },
  {
    n: "02",
    title: "Monitor",
    body: "It watches the external drivers that matter because of those convictions: competitors, markets, regulation, technology, customers, and capital.",
  },
  {
    n: "03",
    title: "Challenge",
    body: "As new evidence emerges, it tests your convictions, surfacing weak assumptions, blind spots, and views that no longer reflect reality.",
  },
  {
    n: "04",
    title: "Inform",
    body: "It shows what is now at risk, what else may be affected, and where your attention is needed. The judgment remains yours.",
  },
];

const PATHS = [
  {
    href: "/for-operators",
    eyebrow: "For operators",
    title: "Keep important decisions connected to the conditions they depend on.",
    body: "See when changing conditions call for a second look, before time and capital follow the original plan. The founding cohort is open to ten companies.",
    cta: "Get the operator brief",
  },
  {
    href: "/for-investors",
    eyebrow: "For investors",
    title: "Keep each investment connected to the assumptions behind it.",
    body: "See when new evidence undermines a thesis and where board attention belongs, before more capital is committed.",
    cta: "Get the investor brief",
  },
];

const primaryButton =
  "inline-flex items-center justify-center px-6 py-3 bg-hero text-hero-foreground rounded-full text-lg font-bold hover:opacity-100 hover:shadow-[0_0_28px_rgba(120,180,255,0.65),0_0_64px_rgba(120,180,255,0.40)]";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-6 py-32 sm:py-40 text-center min-h-[90vh]">
        <div className="phrona-logo-glow-pulse mb-24">
          <Image
            src="/logos/Phrona_Light_paths.svg"
            alt="Phrona"
            width={520}
            height={203}
            priority
            className="w-[320px] sm:w-[420px] md:w-[520px] h-auto"
          />
        </div>

        <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-normal max-w-5xl mb-8 leading-[1.3]">
          Phrona is infrastructure for strategy.
        </h1>

        <p className="font-heading text-xl sm:text-2xl font-normal text-muted-foreground leading-[1.6] max-w-3xl mb-24">
          Phrona continuously monitors the world around you, keeping the
          convictions your strategy depends on grounded in reality and your
          strategy itself coherent.
        </p>

        <a href="#how-it-works" className={primaryButton}>
          See how it works
        </a>
      </section>

      {/* Pain → Root → Resolution → CTA */}
      <section className="px-6 pb-24 sm:pb-32">
        <div className="max-w-6xl mx-auto pt-24 sm:pt-32 border-t border-border">
          {/* Heading → the turn → the grid it sets up */}
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8">
              Whether you&rsquo;re committing significant capital, entering new
              markets, launching major products, or scaling rapidly, every
              consequential decision depends on assumptions about how the world
              works.
            </p>

            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10">
              Many companies get these decisions wrong because they continue
              executing a stale strategy as the world changes underneath them.
            </p>

            <h2 className="text-xl sm:text-2xl font-normal text-foreground leading-relaxed">
              That&rsquo;s{" "}
              <span className="font-semibold">
                <SmallCaps>Dead Reckoning</SmallCaps>
              </span>{" "}
              &mdash; charting your course based on where you{" "}
              <em className="italic">were</em>, rather than where you{" "}
              <em className="italic">are</em>.
            </h2>
          </div>

          {/* Pain points grid */}
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
            {DECISIONS.map((p) => (
              <li key={p.n} className="pain-glow rounded-xl p-6">
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="font-mono text-base sm:text-lg text-[rgb(120,180,255)] slashed-zero tabular-nums font-medium shrink-0">
                    {p.n}
                  </span>
                  <h3 className="font-heading text-xl sm:text-2xl font-semibold leading-snug">
                    {p.title}
                  </h3>
                </div>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {p.body}
                </p>
              </li>
            ))}
          </ul>

          {/* Unifier → 3-beat (stacked) → Resolution → CTA */}
          <div className="max-w-3xl mx-auto mt-32 text-center">
            <p className="text-xl sm:text-2xl leading-relaxed mb-16">
              None of these problems exist because leaders lack judgment. They
              exist because strategy is the only critical business function
              operating without infrastructure.
            </p>

            <div className="flex flex-col gap-4 text-lg sm:text-xl text-muted-foreground mb-16 sm:mb-20">
              <p>Sales has Salesforce.</p>
              <p>Finance has NetSuite.</p>
              <p>HR has Workday.</p>
            </div>
            <p className="font-heading text-base sm:text-lg uppercase tracking-[0.18em] font-medium text-foreground mb-12">
              Strategy has nothing.
            </p>

            <p className="font-heading text-2xl sm:text-3xl font-medium text-foreground leading-[1.2] mb-12">
              Until Phrona
            </p>
            <p className="font-heading text-2xl sm:text-3xl font-medium text-foreground leading-[1.2]">
              Infrastructure for strategy.
            </p>
          </div>
        </div>
      </section>

      {/* How it works, in brief */}
      <section id="how-it-works" className="px-6 pb-24 sm:pb-32 scroll-mt-20">
        <div className="max-w-6xl mx-auto pt-24 sm:pt-32 border-t border-border">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-medium mb-6 leading-[1.15]">
              How Phrona works
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
              Four moves keep your strategy connected to the world it depends on.
            </p>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12 max-w-5xl mx-auto">
            {MOVES.map((m) => (
              <li key={m.n}>
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="font-mono text-base sm:text-lg text-[rgb(120,180,255)] slashed-zero tabular-nums font-medium shrink-0">
                    {m.n}
                  </span>
                  <h3 className="font-heading text-xl sm:text-2xl font-semibold leading-snug">
                    <SmallCaps>{m.title}</SmallCaps>
                  </h3>
                </div>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">{m.body}</p>
              </li>
            ))}
          </ul>
          <p className="text-center mt-16">
            <Link
              href="/how-it-works"
              className="text-base sm:text-lg text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground transition-colors"
            >
              Read the full explanation &rarr;
            </Link>
          </p>
        </div>
      </section>

      {/* Two paths */}
      <section className="px-6 pb-24 sm:pb-32">
        <div className="max-w-6xl mx-auto pt-24 sm:pt-32 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PATHS.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="pain-glow rounded-xl p-8 sm:p-10 flex flex-col group"
              >
                <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-muted-foreground mb-5">{p.eyebrow}</p>
                <h3 className="font-heading text-2xl sm:text-3xl font-medium leading-[1.25] mb-5">{p.title}</h3>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8">{p.body}</p>
                <span className="mt-auto text-base sm:text-lg font-semibold text-foreground underline decoration-border underline-offset-4 group-hover:decoration-foreground transition-colors">
                  {p.cta} &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Close */}
      <section className="px-6 pb-24 sm:pb-32">
        <div className="max-w-6xl mx-auto pt-24 sm:pt-32 border-t border-border text-center">
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-medium mb-6 leading-[1.15]">
            Start with one important decision.
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-12">
            Tell us what you&rsquo;re deciding and what it depends on. We&rsquo;ll show you how Phrona would keep it current.
          </p>
          <Link href="/connect" className={primaryButton}>
            Connect with Phrona
          </Link>
        </div>
      </section>
    </main>
  );
}

import Image from "next/image";
import Link from "next/link";
import { SmallCaps } from "@/components/small-caps";
import { InquireForm } from "@/components/inquire-form";

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

/**
 * The page's call to action: join, or read first. Both placements use this,
 * so the secondary door is never missing from one of them.
 */
function CallToAction() {
  return (
    <div className="flex flex-col items-center gap-8">
      <a
        href="#inquire"
        className="inline-flex items-center justify-center px-6 py-3 bg-hero text-hero-foreground rounded-full text-lg font-bold hover:opacity-100 hover:shadow-[0_0_28px_rgba(120,180,255,0.65),0_0_64px_rgba(120,180,255,0.40)]"
      >
        Join our founding cohort
      </a>
      <Link
        href="/understanding-phrona"
        className="inline-flex items-center justify-center px-6 py-3 bg-[#94a3b8] text-hero-foreground rounded-full text-lg font-bold hover:shadow-[0_0_20px_rgba(120,180,255,0.40),0_0_44px_rgba(120,180,255,0.22)] transition-shadow"
      >
        Learn more
      </Link>
    </div>
  );
}

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

        <h1 className="flex flex-col gap-6 sm:gap-8 font-heading text-2xl sm:text-3xl md:text-4xl font-normal max-w-5xl mb-24 leading-[1.3]">
          <span className="block">Infrastructure for strategy.</span>
          <span className="block">Coherence for a changing world.</span>
        </h1>

        <CallToAction />
      </section>

      {/* Pain → Root → Resolution → CTA */}
      <section className="px-6 pb-24 sm:pb-32">
        <div className="max-w-6xl mx-auto pt-24 sm:pt-32 border-t border-border">
          {/* Heading → the turn → the grid it sets up */}
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-medium leading-[1.2] mb-16">
              Where intelligent companies get into trouble.
            </h2>

            <p className="font-heading text-xl sm:text-2xl font-normal text-muted-foreground leading-[1.6] mb-10">
              Organizations don&rsquo;t fail because they stop executing. They
              fail because they continue executing strategies that no longer fit
              the world around them.
            </p>

            <p className="font-heading text-2xl sm:text-3xl font-normal text-foreground leading-[1.2]">
              That&rsquo;s{" "}
              <span className="font-semibold">
                <SmallCaps>Dead Reckoning</SmallCaps>
              </span>
              .
            </p>
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
            <p className="font-heading text-2xl sm:text-3xl font-medium text-foreground leading-[1.2] mb-16">
              Infrastructure for strategy.
            </p>

            <p className="font-heading text-xl sm:text-2xl font-normal text-muted-foreground leading-[1.6] mb-16">
              Phrona continuously monitors the convictions your strategy depends
              on, preserving its coherence as your company and the world around
              it evolve.
            </p>

            <CallToAction />
          </div>
        </div>
      </section>

      {/* Inquire */}
      <section id="inquire" className="px-6 pb-24 sm:pb-32">
        <div className="max-w-6xl mx-auto pt-24 sm:pt-32 border-t border-border">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-medium mb-8 leading-[1.15]">
                Phrona is launching in beta.
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                We&rsquo;re partnering with ten companies to define what
                infrastructure for strategy becomes.
              </p>
            </div>
            <InquireForm />
          </div>
        </div>
      </section>
    </main>
  );
}

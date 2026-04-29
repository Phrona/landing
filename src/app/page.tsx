import Image from "next/image";
import { InquireForm } from "@/components/inquire-form";

const PAIN_POINTS = [
  {
    n: "01",
    title: "You're drowning in noise.",
    body:
      "Investors push for capital efficiency. Customers demand commitments that offload their risk onto you. Your board wants margins while you're still investing in scale.",
  },
  {
    n: "02",
    title: "Everything feels urgent.",
    body:
      "The capital raise is closing. The board wants the new-hire profile yesterday. Three accounts need executive attention this week. Strategic work keeps slipping because everything tactical feels existential.",
  },
  {
    n: "03",
    title: "The path forward is unclear.",
    body:
      "You're hitting your numbers. But the next leg of growth — new geography, new segment, new product line, new channel — isn't obvious. Every option carries different risks, different ceilings, different timelines.",
  },
  {
    n: "04",
    title: "You second-guess everything.",
    body:
      "Decisions sit on your desk for weeks. The stakes are high, the feedback loops are long, and you won't know if you're right for 18 months — or longer.",
  },
  {
    n: "05",
    title: "You've hit a ceiling.",
    body:
      "Deals stall in late-stage procurement. Buyers raise issues that weren't issues six months ago. You're starting to wonder if the playbook that got you here still works at this scale.",
  },
  {
    n: "06",
    title: "You're out of answers.",
    body:
      "The frameworks you've collected don't quite fit this moment. Your advisors are working from dated intel. You can feel your decisions getting noisier as the stakes rise.",
  },
];

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

        <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-normal max-w-5xl mb-24 leading-[1.3]">
          Your strategy. Made coherent. Brought to life.
        </h1>

        <a
          href="#inquire"
          className="inline-flex items-center justify-center px-10 py-5 bg-hero text-hero-foreground rounded-full text-lg font-bold hover:opacity-100 hover:shadow-[0_0_28px_rgba(120,180,255,0.65),0_0_64px_rgba(120,180,255,0.40)]"
        >
          Join our founding cohort
        </a>
      </section>

      {/* Pain → Root → Resolution → CTA */}
      <section className="px-6 pb-24 sm:pb-32">
        <div className="max-w-6xl mx-auto pt-24 sm:pt-32 border-t border-border">
          {/* Eyebrow + heading */}
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <p className="font-heading text-base sm:text-lg uppercase tracking-[0.16em] font-medium text-muted-foreground mb-8">
              Strategy is complex. It&apos;s easy to get lost.
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-medium leading-[1.15]">
              Does any of this feel familiar?
            </h2>
          </div>

          {/* Pain points grid */}
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
            {PAIN_POINTS.map((p) => (
              <li key={p.n} className="pain-glow rounded-xl p-6">
                <div className="font-mono text-2xl sm:text-3xl text-muted-foreground slashed-zero tabular-nums font-medium mb-5">
                  {p.n}
                </div>
                <h3 className="font-heading text-xl sm:text-2xl font-semibold mb-3 leading-snug">
                  {p.title}
                </h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {p.body}
                </p>
              </li>
            ))}
          </ul>

          {/* Unifier → 3-beat (stacked) → Resolution → CTA */}
          <div className="max-w-3xl mx-auto mt-32 text-center">
            <p className="text-xl sm:text-2xl leading-relaxed mb-12">
              These breakdowns share a root cause:{" "}
              <span className="text-foreground font-medium">
                strategy without infrastructure.
              </span>
            </p>

            <div className="text-lg sm:text-xl text-muted-foreground space-y-2 mb-16 sm:mb-20">
              <p>Sales has Salesforce.</p>
              <p>Finance has NetSuite.</p>
              <p>HR has Workday.</p>
            </div>
            <p className="font-heading text-base sm:text-lg uppercase tracking-[0.18em] font-medium text-foreground mb-20">
              Strategy has nothing.
            </p>

            <p className="text-xl sm:text-2xl font-heading font-normal leading-[1.3] mb-16">
              Phrona is the missing link &mdash; it brings your strategy to
              life and keeps it current while the world changes around you.
            </p>

            <a
              href="#inquire"
              className="inline-flex items-center justify-center px-10 py-5 bg-hero text-hero-foreground rounded-full text-lg font-bold hover:opacity-100 hover:shadow-[0_0_28px_rgba(120,180,255,0.65),0_0_64px_rgba(120,180,255,0.40)]"
            >
              Join our founding cohort
            </a>
          </div>
        </div>
      </section>

      {/* Who's behind it */}
      <section className="px-6 pb-24 sm:pb-32">
        <div className="max-w-6xl mx-auto pt-24 sm:pt-32 border-t border-border">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-medium mb-12 leading-[1.15]">
              Who&apos;s behind it.
            </h2>
            <p className="text-foreground font-medium text-lg mb-6">
              Aaron Chockla.
            </p>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-6">
              I built Phrona to resolve systematic strategic failures
              I&apos;ve observed through 15+ years of investing and operating
              in hardtech and cleantech. The patterns aren&apos;t random, and
              they aren&apos;t fixed with polished slide decks and cliché
              frameworks.
            </p>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8">
              Phrona is what those frameworks can&apos;t be &mdash; a living
              embodiment of your strategy that challenges assumptions, uncovers
              blindspots, and flags opportunities in real time.
            </p>
            <div className="text-lg sm:text-xl text-muted-foreground leading-relaxed space-y-6">
              <p>
                For a more tailored experience, visit me at{" "}
                <a
                  href="https://acstrategygroup.com"
                  className="text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
                >
                  AC Strategy Group
                </a>
                .
              </p>
              <p>
                To learn more about the philosophy embedded in Phrona, follow
                me on{" "}
                <a
                  href="https://acstrategy.substack.com"
                  className="text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
                >
                  Substack
                </a>
                .
              </p>
              <p>
                For shorter takes and Phrona updates, find me on{" "}
                <a
                  href="https://www.linkedin.com/in/chockla/"
                  className="text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
                >
                  LinkedIn
                </a>
                .
              </p>
            </div>
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
                We&apos;re hand-picking 10 companies to join our founding cohort.
              </p>
            </div>
            <InquireForm />
          </div>
        </div>
      </section>

    </main>
  );
}

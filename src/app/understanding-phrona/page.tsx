import type { Metadata } from "next";
import Link from "next/link";
import { ContentsPane } from "@/components/contents-pane";
import {
  CONTENTS,
  CONTENT_GROUPS,
  slugify,
} from "@/lib/understanding-contents";

export const metadata: Metadata = {
  title: "Understanding Phrona",
  description:
    "What Phrona is, what it isn’t, and why we believe every company will eventually need strategy infrastructure.",
  openGraph: {
    title: "Understanding Phrona",
    description:
      "What Phrona is, what it isn’t, and why we believe every company will eventually need strategy infrastructure.",
    url: "https://phrona.io/understanding-phrona",
    siteName: "Phrona",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Understanding Phrona",
    description:
      "What Phrona is, what it isn’t, and why we believe every company will eventually need strategy infrastructure.",
  },
};

const MOVES = [
  {
    n: "01",
    title: "Capture",
    body: "Phrona maps your convictions, the goals they support, the initiatives they enable, and the relationships among them, creating a living model of your strategy. This model becomes the foundation for everything Phrona does, from continuous validation to competitor analysis and strategic simulation.",
  },
  {
    n: "02",
    title: "Monitor",
    body: "Phrona continuously monitors the external drivers that matter because of those convictions — competitors, markets, regulation, technology, customers, and capital.",
  },
  {
    n: "03",
    title: "Challenge",
    body: "As new evidence emerges, Phrona challenges your convictions to identify contradictions, surface weak assumptions, expose blind spots, and highlight where your views no longer reflect reality.",
  },
  {
    n: "04",
    title: "Inform",
    body: "Phrona connects new data to your strategy, showing what is now at risk, what else may be affected, and where your attention is needed. The analysis is automated. The judgment remains yours.",
  },
];

const IN_PRACTICE = [
  "stop committing capital to opportunities the market has already left behind;",
  "discover your customers have changed before your declining revenue tells you;",
  "redirect investment before product development decisions compound on the wrong thesis;",
  "avoid building an organization optimized to execute a strategy the world has outgrown;",
  "change direction while it’s still inexpensive.",
];

/**
 * A question block. The answer closes with a faint three-quarter rule,
 * centred — the only rule that repeats. The single cyan rule belongs to the
 * document, marking where the intro ends and the questions begin.
 */
function Q({ title, children }: { title: string; children: React.ReactNode }) {
  // Numbering comes from document order, so the heading and the rail can
  // never disagree about which question this is.
  const number = (CONTENTS as readonly string[]).indexOf(title) + 1;
  return (
    <section id={slugify(title)} className="mt-24 first:mt-0 scroll-mt-24">
      <h2 className="font-heading text-2xl sm:text-3xl font-medium leading-[1.2] mb-8 flex gap-4 sm:gap-5 items-baseline">
        {number > 0 && (
          <span className="font-mono text-base sm:text-lg slashed-zero tabular-nums text-[rgb(120,180,255)] font-medium shrink-0">
            {String(number).padStart(2, "0")}
          </span>
        )}
        <span>{title}</span>
      </h2>
      <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
        {children}
      </div>
      <div className="h-px w-3/4 mx-auto bg-border mt-12" />
    </section>
  );
}

/** Small-screen contents card. Above lg the sticky ContentsPane takes over. */
function Contents() {
  return (
    <nav
      aria-label="Contents"
      className="lg:hidden my-16 px-6 py-7 sm:px-8 rounded-xl border border-border bg-[rgba(255,255,255,0.015)]"
    >
      <p className="font-heading text-sm uppercase tracking-[0.16em] text-muted-foreground mb-6">
        Contents
      </p>
      <div className="space-y-8">
        {CONTENT_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="font-heading text-[11px] uppercase tracking-[0.18em] text-[rgba(255,255,255,0.32)] mb-3">
              {group.label}
            </p>
            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-2.5 list-none m-0 p-0">
              {group.questions.map((question) => (
                <li key={question.title} className="m-0">
                  <a
                    href={`#${slugify(question.title)}`}
                    className="block text-base text-[rgba(255,255,255,0.55)] hover:text-foreground transition-colors leading-relaxed"
                  >
                    {"nav" in question ? question.nav : question.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </nav>
  );
}

/** Centered statement — the document's punctuation beats. */
function PullLine({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-heading text-xl sm:text-2xl font-medium text-foreground text-center leading-[1.3] my-14">
      {children}
    </p>
  );
}

/** Rule-marked examples — the PDF's vertical-bar indented lines. */
function RuleList({ items }: { items: string[] }) {
  return (
    <ul className="my-10 space-y-5 list-none">
      {items.map((item) => (
        <li
          key={item}
          className="border-l-2 border-[rgba(120,180,255,0.45)] pl-6 italic text-muted-foreground leading-relaxed"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function UnderstandingPhrona() {
  return (
    <main className="flex flex-1 flex-col">
      <article className="px-6 pb-24 sm:pb-32">
        <div className="max-w-[69rem] mx-auto pt-8 sm:pt-12 lg:grid lg:grid-cols-[17rem_minmax(0,48rem)] lg:gap-16">
          <ContentsPane />

          <div className="min-w-0 max-w-3xl">
            {/* Opening */}
            <header className="mb-20">
              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-medium leading-[1.1] mb-10">
                Understanding Phrona
              </h1>
              <p className="text-xl sm:text-2xl text-foreground leading-relaxed">
                Companies rarely fail due to poor planning. They fail because
                the world changes while the plan is being executed, and those at
                the helm continue steering by assumptions that used to be true
                but no longer are.
              </p>
            </header>

            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p className="text-foreground font-medium">
                Every strategy depends on convictions — things the company holds
                to be true.
              </p>

              <RuleList
                items={[
                  "Customers will pay a premium.",
                  "A critical regulation will remain in force.",
                  "We have a sustainable first-mover advantage.",
                ]}
              />

              <p>
                These aren’t facts. They’re strategic convictions, and every
                major decision depends on them. The problem isn’t that these
                convictions are wrong — it’s that they’re usually revisited only
                after disappointing results force the issue. By then, months —
                or even years’ worth — of decisions about product, people, and
                capital have compounded on assumptions that no longer reflect
                reality.
              </p>

              <p>
                There’s a name for this in navigation — where you estimate your
                current position based only on where you’ve been, without
                checking against your surroundings:
              </p>

              <PullLine>Dead reckoning.</PullLine>

              <p>
                It works — until the world changes. Most companies run strategy
                the same way: they establish a direction and execute
                relentlessly, but no one checks whether they’re still on course.
                Dead reckoning fails because unmeasured drift from wind and
                current compounds over distance. It wrecked ships for centuries.
                It does the same to strategy.
              </p>

              <p>
                Every critical business function has infrastructure that keeps
                it connected to reality.
              </p>

              <p className="text-foreground">
                Finance has ERP. Sales has CRM. Engineering has Git.
                Manufacturing has MES.
              </p>

              <p>
                Strategy has nothing. It still depends on infrequent strategy
                sessions, memory, and periodic planning.
              </p>

              <PullLine>
                Phrona provides the infrastructure strategy lacks.
              </PullLine>

              <p>
                Phrona continuously monitors the convictions your strategy
                depends on. It watches the external signals most likely to
                change them and alerts you when the world — and your
                understanding of it — have begun to diverge.
              </p>

              <p className="italic">
                This document explains what Phrona is, what it isn’t, and why we
                believe every company will eventually need strategy
                infrastructure.
              </p>
            </div>

            <Contents />

          {/* The document's one cyan rule: intro ends, questions begin. Equal
              space above and below so it reads as a divider, not an underline. */}
          <div className="h-px w-full bg-[rgba(120,180,255,0.4)] my-20" />

            {/* ——— The document proper ——— */}
            <div>
              <Q title="What is Phrona?">
                <p className="text-foreground text-xl font-medium">
                  Phrona is infrastructure for strategy.
                </p>
              </Q>

              <Q title="What is “infrastructure for strategy”?">
                <p>This is best explained through a few examples:</p>

                <RuleList
                  items={[
                    "an energy company builds toward production of fifteen million tons of green hydrogen per year, on the conviction that renewable power will get cheap enough, fast enough, to make it work;",
                    "a newly appointed retail CEO eliminates coupons and promotions because he believes customers prefer simple, transparent pricing;",
                    "a smartphone company keeps building for the keyboard, convinced serious users will never accept typing on glass — and that consumer enthusiasm won’t change what enterprises buy.",
                  ]}
                />

                <p>
                  What do these decisions have in common? Each is guided by a{" "}
                  <span className="text-foreground font-medium">
                    conviction
                  </span>{" "}
                  — a belief the company holds to be true.
                </p>

                <p>
                  Every strategy depends on a handful of convictions. The
                  problem: reality shifts; convictions rarely do.
                </p>

                <p>
                  Every other critical business function has infrastructure to
                  keep it grounded in reality — finance has ERP; sales has CRM;
                  manufacturing has MES; engineering has Git. Each exists for
                  the same reason: to ensure decisions are based on today’s
                  reality, not yesterday’s.
                </p>

                <PullLine>Strategy has no equivalent.</PullLine>

                <p>
                  Organizations naturally spend more time executing strategy
                  than revisiting the underlying convictions. The better a
                  company gets at execution, the more dangerous stale
                  convictions become.
                </p>

                <p className="text-foreground font-medium">
                  Strategy infrastructure maintains coherence between your
                  strategic decisions and the changing world around you.
                </p>

                <p>
                  It tracks the convictions your strategy depends on and
                  continuously monitors your competitive environment for
                  evidence that could change them. It alerts you when reality
                  begins to diverge from what you believe to be true. By doing
                  so, Phrona helps detect strategic drift before it becomes a
                  strategic failure.
                </p>

                <p className="text-foreground">
                  The companies mentioned above? Fortescue. JCPenney.
                  BlackBerry.
                </p>

                <p>
                  Different industries, different strategies, one pattern:
                  reality changed, convictions didn’t, and strategy never caught
                  up.
                </p>

                <p>That’s the gap strategy infrastructure exists to close.</p>
              </Q>

              <Q title="Why doesn’t infrastructure for strategy already exist?">
                <p className="text-foreground font-medium">
                  It wasn’t practical.
                </p>

                <p>
                  Until recently, markets evolved slowly, and strategy could be
                  revisited periodically without falling behind reality. Even if
                  you wanted your strategy to reflect the latest intel, it
                  wasn’t practical. Doing so required constantly monitoring
                  competitors, markets, regulation, technology, customers, and
                  capital — and connecting those changes back to the specific
                  convictions your strategy depended on. That required more
                  sustained analysis than any leadership team could
                  realistically maintain without a multi-million-dollar
                  management consulting budget.
                </p>

                <p>
                  So companies settled into an episodic rhythm. They planned,
                  executed, periodically revisited strategy, and relied on
                  leadership intuition between planning cycles.
                </p>

                <p>
                  Today, neither driver holds — reality moves faster than
                  planning cycles can keep pace, and AI has made continuous
                  strategic analysis economically practical.
                </p>

                <p className="text-foreground">
                  Infrastructure for strategy has become possible at exactly the
                  moment it has become necessary.
                </p>
              </Q>

              <Q title="Will every company eventually need strategy infrastructure?">
                <p className="text-foreground font-medium">We think so.</p>
                <p>
                  Every critical function eventually became too important to
                  manage without infrastructure. We believe strategy has reached
                  that point.
                </p>
              </Q>
            </div>

            {/* ——— How it works ——— */}
            <div className="mt-24 pt-20">
              <Q title="How does Phrona work?">
                <p>Phrona operates through four moves:</p>
                <ul className="mt-10 space-y-10 list-none">
                  {MOVES.map((m) => (
                    <li key={m.n}>
                      <div className="flex items-baseline gap-4 mb-3">
                        <span className="font-mono text-sm slashed-zero tabular-nums text-[rgb(120,180,255)] font-medium">
                          {m.n}
                        </span>
                        <h3 className="font-heading text-lg sm:text-xl font-semibold text-foreground uppercase tracking-[0.12em]">
                          {m.title}
                        </h3>
                      </div>
                      <p className="pl-10 leading-relaxed">{m.body}</p>
                    </li>
                  ))}
                </ul>
              </Q>

              <Q title="Does Phrona make strategic decisions?">
                <p className="text-foreground font-medium">
                  No. Phrona is designed to challenge strategy, not replace it.
                </p>
                <p>
                  Phrona questions the convictions underneath your strategy,
                  surfaces evidence that no longer supports them, and forces
                  conversations you might not otherwise have. It never decides
                  what comes next.
                </p>
                <PullLine>Phrona challenges. You exercise judgment.</PullLine>
              </Q>
            </div>

            {/* ——— What it isn't ——— */}
            <div className="mt-24 pt-20">
              <Q title="Can’t Claude (or ChatGPT or Gemini) do the same thing?">
                <p className="text-foreground font-medium">Not quite.</p>
                <p>
                  Language models are exceptional thinking partners, but they
                  think in episodes. Every conversation begins from scratch, and
                  any understanding they develop disappears when the
                  conversation ends.
                </p>
                <p>
                  Phrona begins every conversation with your strategy as a
                  living structure. It remembers the convictions your strategy
                  depends on, continuously incorporates new information, and
                  maintains a current understanding of your strategy and the
                  world it operates in.
                </p>
                <PullLine>
                  LLMs provide intelligence. Phrona provides continuity.
                </PullLine>
              </Q>

              <Q title="Isn’t this just a knowledge graph? Or GraphRAG?">
                <p className="text-foreground font-medium">No.</p>
                <p>
                  Knowledge graphs organize information, and GraphRAG helps
                  retrieve the right documents and answer questions more
                  accurately.
                </p>
                <p>
                  Phrona models strategy. Its graph isn’t a library of
                  information. It’s a living model of the convictions, goals,
                  initiatives, and dependencies your strategy relies on.
                </p>
              </Q>

              <Q title="So it’s just competitive intelligence, then?">
                <p className="text-foreground font-medium">No.</p>
                <p>
                  Competitive intelligence tells you what’s happening in the
                  world.
                </p>
                <p>
                  The same competitor announcement, regulatory change,
                  technological breakthrough, or customer trend can be
                  irrelevant to one company and existential to another. Its
                  importance depends entirely on the convictions your strategy
                  rests upon.
                </p>
                <p>
                  Phrona doesn’t replace competitive intelligence — it
                  integrates it, calibrating every signal against your strategy.
                  The result is less noise, more relevance.
                </p>
              </Q>

              <Q title="Isn’t this just strategy software? Or another OKR platform?">
                <p>
                  Strategy software helps document strategy; OKR platforms help
                  execute. Neither asks whether the strategy is still correct.
                </p>
                <p>
                  Phrona does. It doesn’t replace planning or execution. It
                  ensures the strategy guiding both remains coherent as the
                  world changes.
                </p>
              </Q>

              <Q title="Why not just hire a consultant?">
                <p className="text-foreground font-medium">
                  The two complement each other — consultants deliver snapshots,
                  Phrona delivers continuity.
                </p>
                <p>
                  Consultants provide perspective at a point in time. But the
                  world continues to change after the engagement ends. A
                  strategy fit for yesterday may not fit today. Phrona provides
                  continuity between those moments, keeping you informed as the
                  environment changes.
                </p>
              </Q>

              <Q title="Doesn’t my team already own this?">
                <p className="text-foreground font-medium">Absolutely.</p>
                <p>
                  The CEO and leadership team should own strategy. Phrona was
                  never designed to replace them.
                </p>
                <p>
                  Owning a responsibility, however, is not the same as having
                  infrastructure to support it.
                </p>
                <p>
                  Most teams spend their time executing strategy, not
                  questioning the convictions underneath it. Phrona makes
                  continuous strategic questioning possible.
                </p>
              </Q>
            </div>

            {/* ——— What changes ——— */}
            <div className="mt-24 pt-20">
              <Q title="What changes when a company has infrastructure for strategy?">
                <p>
                  Strategy stops being an event and becomes a continuous
                  discipline — instead of revisiting strategy only during annual
                  reviews (or after disappointing results force the issue) you
                  gain an ongoing understanding of how a changing world affects
                  the direction of the business.
                </p>
                <p>
                  Conversations change as well — rather than asking{" "}
                  <span className="italic">“What happened?”</span> after the
                  fact, you start asking{" "}
                  <span className="italic">“What’s changing?”</span> while there
                  is still time to respond.
                </p>
                <p>
                  You gain confidence in execution, because the strategy behind
                  it doesn’t quietly grow stale. Convictions become explicit
                  rather than implicit. Strategic discussions become
                  evidence-driven rather than memory-driven. Your strategy
                  remains coherent as both your company and the world around it
                  evolve.
                </p>
                <p className="text-foreground">
                  The result isn’t better strategy in theory — it’s fewer
                  expensive mistakes in practice.
                </p>
              </Q>

              <Q title="What this means in practice">
                <p>You:</p>
                <ul className="my-8 space-y-4 list-none">
                  {IN_PRACTICE.map((item) => (
                    <li
                      key={item}
                      className="border-l-2 border-[rgba(120,180,255,0.45)] pl-6 leading-relaxed"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
                <p>
                  Strategy infrastructure doesn’t eliminate uncertainty — it
                  eliminates dead reckoning. It preserves the coherence of your
                  strategy as the world changes.
                </p>
              </Q>

              <Q title="Is Phrona just another system to maintain?">
                <p className="text-foreground font-medium">
                  No. Phrona exists to reduce strategic overhead, not create it.
                </p>
                <p>
                  Most of the work happens in the background — Phrona
                  continuously gathers information, monitors competitors, tracks
                  regulation, and — most importantly — connects the dots to show
                  what it means for your strategy. It automates the analytical
                  work, allowing you to focus on what technology cannot replace:
                  judgment.
                </p>
                <p>
                  When nothing meaningful changes, Phrona stays quiet. When
                  something does, it tells you what changed, why it matters, and
                  where your attention is needed.
                </p>
                <p>
                  Strategy infrastructure feels less like another tool and more
                  like another member of the team — you don’t spend your day
                  working in Phrona; Phrona spends its day working for you.
                </p>
              </Q>
            </div>

            {/* ——— What you get ——— */}
            <div className="mt-24 pt-20">
              <Q title="What does Phrona deliver?">
                <p className="text-foreground font-medium">
                  Phrona delivers a continuously current understanding of your
                  strategy and the world around it.
                </p>
                <p>
                  As your company evolves, Phrona incorporates new planning
                  documents, meeting notes, emails, and other strategic context
                  into a living model of your strategy.
                </p>
                <p>
                  At the same time, it continuously monitors competitors,
                  customers, markets, regulation, technology, and capital for
                  developments that matter.
                </p>
                <p>
                  When something meaningful changes, Phrona explains what
                  changed, why it matters, what part of your strategy is
                  affected, and the evidence behind its reasoning. It also
                  provides recurring strategic briefings, and whenever you want
                  to explore an issue more deeply, you can simply ask.
                </p>
                <p>
                  As your model gains richness, so do the capabilities built on
                  top of it — from continuously validating your strategy, to
                  analyzing competitors through the same lens, to rehearsing
                  major decisions before you commit capital.
                </p>
                <p className="text-foreground">
                  Phrona is designed to keep you informed — not constantly
                  engaged.
                </p>
              </Q>

              <Q title="Who is Phrona for?">
                <p className="text-foreground font-medium">
                  Phrona is built for companies whose success depends on a few
                  consequential strategic decisions.
                </p>
                <p>
                  Organizations committing significant capital, entering new
                  markets, launching new products, scaling rapidly, or betting
                  on long-term technological shifts all depend on a handful of
                  convictions about how the world works. As those commitments
                  grow, so does the cost of getting them wrong.
                </p>
                <p>
                  Phrona helps ensure the strategy behind those decisions
                  continues to fit the environment they’re unfolding in.
                </p>
              </Q>

              <Q title="How is our strategy kept private?">
                <p className="text-foreground font-medium">
                  Your strategy is one of your most valuable assets and we treat
                  it that way.
                </p>
                <p>
                  Customer data is isolated, access is tightly controlled, and
                  strategy is never shared. Your information is used only to
                  support your company’s strategic analysis.
                </p>
                <p className="text-base">
                  Full detail is in our{" "}
                  <Link
                    href="/privacy"
                    className="text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
                  >
                    privacy policy
                  </Link>
                  , and we’re glad to walk your security team through the
                  specifics.
                </p>
              </Q>

              <Q title="What is the Founding Cohort?">
                <p className="text-foreground font-medium">
                  We’re inviting ten companies to help define what strategy
                  infrastructure becomes.
                </p>
                <p>
                  Founding members will deploy Phrona against consequential
                  strategic decisions while working directly with us as the
                  platform evolves. Their feedback will shape not just the
                  product, but the category itself.
                </p>
                <p>
                  Participation is limited because building a new category is
                  something we want to do with a handful of exceptional
                  companies.
                </p>
              </Q>

              <Q title="How do we get started?">
                <p>
                  We begin by making your strategy explicit — not only what’s
                  written in your planning documents, slide decks, and marketing
                  material, but the convictions, goals, initiatives, and
                  relationships that drive decisions.
                </p>
                <p>
                  Onboarding is collaborative. After that, Phrona works in the
                  background and requires very little from your team.
                </p>
              </Q>
            </div>

            {/* ——— Close ——— */}
            <div className="mt-24 pt-20 text-center">
              <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed mb-8">
                Every company has convictions it cannot afford to get wrong.
              </p>
              <p className="font-heading text-base sm:text-lg uppercase tracking-[0.18em] font-medium text-foreground mb-16">
                What are yours?
              </p>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-14">
                Ready to explore whether Phrona is a fit for your company — and
                whether joining the Founding Cohort makes sense? Let’s connect.
              </p>
              <Link
                href="/#inquire"
                className="inline-flex items-center justify-center px-10 py-5 bg-hero text-hero-foreground rounded-full text-lg font-bold hover:shadow-[0_0_28px_rgba(120,180,255,0.65),0_0_64px_rgba(120,180,255,0.40)]"
              >
                Join our founding cohort
              </Link>
              <p className="mt-12 text-sm text-muted-foreground">
                <a
                  href="/download/understanding-phrona"
                  className="underline decoration-border underline-offset-4 hover:decoration-foreground hover:text-foreground transition-colors"
                >
                  Download this as a PDF
                </a>
                <span className="mx-3 text-[rgba(255,255,255,0.25)]">·</span>
                <a
                  href="mailto:hello@phrona.io"
                  className="underline decoration-border underline-offset-4 hover:decoration-foreground hover:text-foreground transition-colors"
                >
                  hello@phrona.io
                </a>
              </p>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}

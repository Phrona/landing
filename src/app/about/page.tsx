import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Phrona",
  description: "Who's behind Phrona.",
  // Reachable only by direct link for now — no nav points here, so keep it
  // out of search results until it's meant to be found.
  robots: { index: false, follow: true },
};

export default function AboutPage() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="px-6 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-medium mb-12 leading-[1.15]">
            Who&apos;s behind it.
          </h2>
          <p className="text-foreground font-medium text-lg mb-6">
            Aaron Chockla.
          </p>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-6">
            I built Phrona to resolve systematic strategic failures I&apos;ve
            observed through 15+ years of investing and operating in hardtech
            and cleantech. The patterns aren&apos;t random, and they aren&apos;t
            fixed with polished slide decks and cliché frameworks.
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
              To learn more about the philosophy embedded in Phrona, follow me
              on{" "}
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
      </section>
    </main>
  );
}

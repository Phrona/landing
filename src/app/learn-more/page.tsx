import type { Metadata } from "next";
import { LearnMoreForm } from "@/components/learn-more-form";

export const metadata: Metadata = {
  title: "Start with one important decision | Phrona",
  description: "Tell us what you're deciding, what it depends on, and what may be changing around it.",
  // Reached from forwarded documents, not from search.
  robots: { index: false, follow: true },
};

export default function LearnMorePage() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="px-6 py-16 sm:py-24">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-medium mb-6 leading-[1.15]">
              Start with one important decision.
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
              Tell us what you&rsquo;re deciding, what it depends on, and what may be changing around it. We&rsquo;ll follow up to learn more and see whether Phrona can help.
            </p>
          </div>
          <LearnMoreForm />
        </div>
      </section>
    </main>
  );
}

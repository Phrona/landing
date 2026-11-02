import type { Metadata } from "next";
import { LearnMoreForm } from "@/components/learn-more-form";

export const metadata: Metadata = {
  title: "Tell us about your decisions | Phrona",
  description: "Tell us about the decisions you're working through, and we'll be in touch.",
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
              Tell us about your decisions.
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
              Tell us what you&rsquo;re weighing, and we&rsquo;ll be in touch.
            </p>
          </div>
          <LearnMoreForm />
        </div>
      </section>
    </main>
  );
}

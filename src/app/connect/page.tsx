import type { Metadata } from "next";
import Link from "next/link";
import { ConnectForm } from "@/components/connect-form";

export const metadata: Metadata = {
  title: "Connect with Phrona",
  description: "Start with one important decision. Tell us what you're deciding, what it depends on, and what may be changing around it.",
  alternates: { canonical: "/connect" },
};

export default function ConnectPage() {
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
            <p className="text-base text-muted-foreground leading-relaxed mt-6">
              Rather see how Phrona reads your company first?{" "}
              <Link href="/snapshot" className="text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground">
                Request a Strategy Snapshot
              </Link>
              .
            </p>
          </div>
          <ConnectForm />
        </div>
      </section>
    </main>
  );
}

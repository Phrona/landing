import Image from "next/image";
import { BriefRequestForm } from "@/components/brief-request-form";
import type { BriefSlug } from "@/lib/briefs";

/**
 * Shared layout for /for-operators and /for-investors.
 *
 * The offer comes first: the headline, one paragraph on the problem, then the
 * request form. Below it, three one-line claims and what the reader gets in
 * the brief, with its cover, so the offer is concrete.
 */
export function BriefPage({
  eyebrow,
  title,
  lede,
  claims,
  inside,
  briefSlug,
  cover,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  claims: string[];
  inside: string[];
  briefSlug: BriefSlug;
  cover: { src: string; alt: string };
}) {
  return (
    <main className="flex flex-1 flex-col">
      <section className="px-6 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-muted-foreground mb-6">{eyebrow}</p>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-medium mb-6 leading-[1.15]">{title}</h1>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-12">{lede}</p>

          <div id="get-the-brief" className="scroll-mt-28 mb-16">
            <BriefRequestForm brief={briefSlug} />
          </div>

          <ul className="space-y-4 mb-16 border-t border-border pt-12">
            {claims.map((c) => (
              <li key={c} className="text-base sm:text-lg text-foreground leading-relaxed">
                {c}
              </li>
            ))}
          </ul>

          <div className="border-t border-border pt-12 grid sm:grid-cols-[180px_1fr] gap-8 sm:gap-10 items-start">
            <Image
              src={cover.src}
              alt={cover.alt}
              width={180}
              height={233}
              className="w-[140px] sm:w-[180px] h-auto rounded-sm shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
            />
            <div>
              <h2 className="text-xs sm:text-sm uppercase tracking-[0.2em] text-muted-foreground mb-5">
                Inside the brief
              </h2>
              <ul className="space-y-4">
                {inside.map((point) => (
                  <li key={point} className="flex gap-3 text-base sm:text-lg text-foreground leading-relaxed">
                    <span aria-hidden className="mt-[0.7em] h-1.5 w-1.5 flex-none rounded-full bg-[rgb(120,180,255)]" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

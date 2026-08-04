"use client";

import { useEffect, useRef } from "react";
import { keepItemInView, useActiveSection } from "@/lib/use-active-section";

/**
 * Sticky contents rail for a numbered long-form document (lg and up).
 *
 * The legal pages' counterpart to the Understanding Phrona rail: the whole
 * document stays one click away, and the section you're in is lit white
 * against the muted rest. A privacy policy is read by search — "what do they
 * do with my data" — far more than it's read top to bottom, so the rail is
 * doing more work here than it does on a page people actually read through.
 */
export function SectionRail({
  sections,
}: {
  sections: ReadonlyArray<{ id: string; label: string }>;
}) {
  const active = useActiveSection(sections.map((s) => s.id));
  const paneRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef(new Map<string, HTMLAnchorElement>());

  useEffect(() => {
    if (active) keepItemInView(paneRef.current, itemRefs.current.get(active));
  }, [active]);

  return (
    <aside
      ref={paneRef}
      aria-label="Contents"
      className="hidden lg:block sticky top-20 self-start max-h-[calc(100vh-6.5rem)] overflow-y-auto pr-3"
    >
      <p className="font-heading text-[10px] uppercase tracking-[0.18em] text-[rgba(255,255,255,0.32)] mb-3">
        Contents
      </p>
      <ol className="flex flex-col gap-[7px] list-none m-0 p-0">
        {sections.map((section, i) => {
          const isActive = active === section.id;
          return (
            <li key={section.id} className="flex gap-2.5 items-baseline m-0">
              <span
                className={`font-mono text-[10px] slashed-zero tabular-nums w-4 shrink-0 transition-colors ${
                  isActive
                    ? "text-[rgb(120,180,255)]"
                    : "text-[rgba(120,180,255,0.4)]"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <a
                ref={(el) => {
                  if (el) itemRefs.current.set(section.id, el);
                  else itemRefs.current.delete(section.id);
                }}
                href={`#${section.id}`}
                aria-current={isActive ? "location" : undefined}
                className={`block text-[13px] font-semibold leading-snug transition-colors ${
                  isActive
                    ? "text-white"
                    : "text-[rgba(255,255,255,0.42)] hover:text-[rgba(255,255,255,0.75)]"
                }`}
              >
                {section.label}
              </a>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}

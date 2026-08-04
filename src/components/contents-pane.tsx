"use client";

import { useEffect, useRef } from "react";
import {
  CONTENTS,
  CONTENT_GROUPS,
  slugify,
} from "@/lib/understanding-contents";
import { keepItemInView, useActiveSection } from "@/lib/use-active-section";

/**
 * Sticky contents pane for the Understanding Phrona page (lg and up).
 *
 * The whole list stays on screen so any question is one click away at any
 * point in the read, and the question you're currently in is lit pure white
 * against the muted rest.
 *
 * Active section is resolved by scroll position rather than IntersectionObserver:
 * with twenty sections of wildly different heights, "the last heading that has
 * crossed the line" is unambiguous, where an observer band can hold two
 * sections at once or none. Reads are batched into a rAF so a scroll never
 * triggers more than one layout pass.
 */

/** The opening, before the questions start. Anchored in the page itself. */
const INTRO = { id: "intro", label: "Intro" };

export function ContentsPane() {
  const paneRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef(new Map<string, HTMLAnchorElement>());
  const active = useActiveSection([INTRO.id, ...CONTENTS.map(slugify)]);

  useEffect(() => {
    if (active) keepItemInView(paneRef.current, itemRefs.current.get(active));
  }, [active]);

  return (
    <aside
      ref={paneRef}
      aria-label="Contents"
      className="hidden lg:block sticky top-20 self-start max-h-[calc(100vh-6.5rem)] overflow-y-auto pr-3"
    >
      <ol className="flex flex-col gap-[7px] list-none m-0 p-0 mb-3.5">
        <li className="flex gap-2.5 items-baseline m-0">
          {/* Empty where the others carry a numeral — the intro isn't one of
              the twenty, but its label still lines up with them. */}
          <span className="w-4 shrink-0" aria-hidden />
          <a
            ref={(el) => {
              if (el) itemRefs.current.set(INTRO.id, el);
              else itemRefs.current.delete(INTRO.id);
            }}
            href={`#${INTRO.id}`}
            aria-current={active === INTRO.id ? "location" : undefined}
            className={`block text-[13px] font-semibold leading-snug transition-colors ${
              active === INTRO.id
                ? "text-white"
                : "text-[rgba(255,255,255,0.42)] hover:text-[rgba(255,255,255,0.75)]"
            }`}
          >
            {INTRO.label}
          </a>
        </li>
      </ol>

      {CONTENT_GROUPS.map((group, gi) => {
        // Numbering runs 01–20 across the whole document, not per group.
        const offset = CONTENT_GROUPS.slice(0, gi).reduce(
          (sum, g) => sum + g.questions.length,
          0,
        );
        return (
          <div key={group.label} className={gi === 0 ? "" : "mt-3.5"}>
            <p className="font-heading text-[10px] uppercase tracking-[0.18em] text-[rgba(255,255,255,0.32)] mb-3">
              {group.label}
            </p>
            <ol className="flex flex-col gap-[7px] list-none m-0 p-0">
              {group.questions.map((question, i) => {
                const { title } = question;
                const id = slugify(title);
                const isActive = active === id;
                return (
                  <li key={title} className="flex gap-2.5 items-baseline m-0">
                    <span
                      className={`font-mono text-[10px] slashed-zero tabular-nums w-4 shrink-0 transition-colors ${
                        isActive
                          ? "text-[rgb(120,180,255)]"
                          : "text-[rgba(120,180,255,0.4)]"
                      }`}
                    >
                      {String(offset + i + 1).padStart(2, "0")}
                    </span>
                    <a
                      ref={(el) => {
                        if (el) itemRefs.current.set(id, el);
                        else itemRefs.current.delete(id);
                      }}
                      href={`#${id}`}
                      aria-current={isActive ? "location" : undefined}
                      className={`block text-[13px] font-semibold leading-snug transition-colors ${
                        isActive
                          ? "text-white"
                          : "text-[rgba(255,255,255,0.42)] hover:text-[rgba(255,255,255,0.75)]"
                      }`}
                    >
                      {"nav" in question ? question.nav : title}
                    </a>
                  </li>
                );
              })}
            </ol>
          </div>
        );
      })}
    </aside>
  );
}

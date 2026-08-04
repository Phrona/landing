"use client";

import { useEffect, useRef, useState } from "react";
import { CONTENTS, CONTENT_GROUPS, slugify } from "@/lib/understanding-contents";

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

/** Where a heading counts as "current" — below the sticky header, not at the very top. */
const ACTIVE_LINE_PX = 140;

export function ContentsPane() {
  const [active, setActive] = useState<string | null>(null);
  const paneRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef(new Map<string, HTMLAnchorElement>());

  useEffect(() => {
    const ids = CONTENTS.map(slugify);
    let frame = 0;

    const update = () => {
      frame = 0;
      // Sections are in document order, so the first heading still below the
      // line means every later one is too — stop there.
      let current: string | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= ACTIVE_LINE_PX) current = id;
        else break;
      }
      setActive(current);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Keep the lit item visible when the list is taller than the pane. Scrolls
  // the pane itself — scrollIntoView would also move the page and fight the
  // reader's own scrolling.
  useEffect(() => {
    if (!active) return;
    const pane = paneRef.current;
    const item = itemRefs.current.get(active);
    if (!pane || !item) return;
    const paneBox = pane.getBoundingClientRect();
    const itemBox = item.getBoundingClientRect();
    if (itemBox.top < paneBox.top) {
      pane.scrollTop += itemBox.top - paneBox.top - 12;
    } else if (itemBox.bottom > paneBox.bottom) {
      pane.scrollTop += itemBox.bottom - paneBox.bottom + 12;
    }
  }, [active]);

  return (
    <aside
      ref={paneRef}
      aria-label="Contents"
      className="hidden lg:block sticky top-24 self-start max-h-[calc(100vh-8rem)] overflow-y-auto pr-3"
    >
      {CONTENT_GROUPS.map((group, gi) => (
        <div key={group.label} className={gi === 0 ? "" : "mt-11"}>
          <p className="font-heading text-[11px] uppercase tracking-[0.18em] text-[rgba(255,255,255,0.32)] mb-4">
            {group.label}
          </p>
          <ol className="flex flex-col gap-6 list-none m-0 p-0">
            {group.questions.map((title) => {
              const id = slugify(title);
              const isActive = active === id;
              return (
                <li key={title} className="m-0">
                  <a
                    ref={(el) => {
                      if (el) itemRefs.current.set(id, el);
                      else itemRefs.current.delete(id);
                    }}
                    href={`#${id}`}
                    aria-current={isActive ? "location" : undefined}
                    className={`block text-sm leading-snug transition-colors ${
                      isActive
                        ? "text-white"
                        : "text-[rgba(255,255,255,0.42)] hover:text-[rgba(255,255,255,0.75)]"
                    }`}
                  >
                    {title}
                  </a>
                </li>
              );
            })}
          </ol>
        </div>
      ))}
    </aside>
  );
}

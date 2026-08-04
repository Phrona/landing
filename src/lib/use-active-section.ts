"use client";

import { useEffect, useState } from "react";

/** Where a heading counts as "current" — below the sticky header, not at the very top. */
const ACTIVE_LINE_PX = 140;

/**
 * Which section the reader is currently in, for a contents rail to light up.
 *
 * Resolved by scroll position rather than IntersectionObserver: with sections
 * of wildly different heights, "the last heading that has crossed the line" is
 * unambiguous, where an observer band can hold two sections at once or none.
 * Reads are batched into a rAF so a scroll never triggers more than one layout
 * pass.
 *
 * Returns null while the reader is above the first section — nothing is lit
 * rather than something being lit wrongly.
 */
export function useActiveSection(ids: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join("|");

  useEffect(() => {
    const sectionIds = key.split("|");
    let frame = 0;

    const update = () => {
      frame = 0;
      // Sections are in document order, so the first heading still below the
      // line means every later one is too — stop there.
      let current: string | null = null;
      for (const id of sectionIds) {
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
  }, [key]);

  return active;
}

/**
 * Scroll a rail so its lit item stays visible when the list is taller than the
 * rail. Moves the rail only — scrollIntoView would also move the page and
 * fight the reader's own scrolling.
 */
export function keepItemInView(
  pane: HTMLElement | null,
  item: HTMLElement | null | undefined,
): void {
  if (!pane || !item) return;
  const paneBox = pane.getBoundingClientRect();
  const itemBox = item.getBoundingClientRect();
  if (itemBox.top < paneBox.top) {
    pane.scrollTop += itemBox.top - paneBox.top - 12;
  } else if (itemBox.bottom > paneBox.bottom) {
    pane.scrollTop += itemBox.bottom - paneBox.bottom + 12;
  }
}

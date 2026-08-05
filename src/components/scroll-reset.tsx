"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Put a new route at the top of the page.
 *
 * Next resets scroll on navigation, but `scroll-behavior: smooth` turns that
 * reset into an animation which can be cut short — landing the reader partway
 * down a page they have never seen, with the heading tucked under the header.
 * This forces the jump to be instant while leaving in-page anchors smooth.
 *
 * A hash means the URL is asking for a specific section, so leave it alone.
 */
export function ScrollReset() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.location.hash) return;
    const html = document.documentElement;
    const previous = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    html.style.scrollBehavior = previous;
  }, [pathname]);

  return null;
}

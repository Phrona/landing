"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

/**
 * Header — appears on all pages EXCEPT the landing page (/).
 * On the landing page, the giant glowing wordmark is the brand statement;
 * a small header above it would be redundant.
 *
 * On legal/secondary pages, the header gives users:
 *   - Logo (links home)
 *   - Back to Home link (right side)
 */
export function Header() {
  const pathname = usePathname();

  // No header on the landing page — the hero handles brand presence
  if (pathname === "/") return null;

  return (
    <header className="px-6 py-5">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <a href="/" aria-label="Phrona — home" className="inline-block">
          <Image
            src="/logos/Phrona_Light_paths.svg"
            alt="Phrona"
            width={520}
            height={203}
            priority
            className="h-7 w-auto"
          />
        </a>
        <a
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
        >
          <span aria-hidden>←</span>
          <span>Back to Home</span>
        </a>
      </div>
    </header>
  );
}

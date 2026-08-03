"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Header — sticky nav on every page.
 *
 * On the landing page the giant glowing wordmark IS the brand statement, so the
 * nav's own logo stays hidden until the reader scrolls past the hero. It fades
 * in rather than mounting, so the nav never reflows and the links never move.
 */
export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHome = pathname === "/";
  const hideLogo = isHome && !scrolled;

  return (
    <header
      className={`sticky top-0 z-50 px-6 py-4 transition-colors duration-300 ${
        scrolled
          ? "bg-[rgba(8,17,34,0.92)] backdrop-blur-md border-b border-border"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <Link
          href="/"
          aria-label="Phrona — home"
          className={`inline-block transition-opacity duration-300 ${
            hideLogo ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
          tabIndex={hideLogo ? -1 : undefined}
        >
          <Image
            src="/logos/Phrona_Light_paths.svg"
            alt="Phrona"
            width={520}
            height={203}
            priority
            className="h-6 sm:h-7 w-auto"
          />
        </Link>

        <nav className="flex items-center gap-5 sm:gap-8">
          <Link
            href="/understanding-phrona"
            aria-current={
              pathname === "/understanding-phrona" ? "page" : undefined
            }
            className={`text-sm transition-colors ${
              pathname === "/understanding-phrona"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Understanding Phrona
          </Link>
          {/* CTA is desktop-only — on narrow screens the nav's job is navigation,
              and both the hero and the page footer already carry this call. */}
          <Link
            href="/#inquire"
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 bg-hero text-hero-foreground rounded-full text-sm font-bold hover:shadow-[0_0_20px_rgba(120,180,255,0.55),0_0_44px_rgba(120,180,255,0.32)] transition-shadow"
          >
            Join our founding cohort
          </Link>
        </nav>
      </div>
    </header>
  );
}

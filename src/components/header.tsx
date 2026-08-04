"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Header — absent on the landing page, where the hero is the brand statement
 * and anything above it competes with the wordmark.
 *
 * Elsewhere it carries one thing, chosen by what the page is for:
 *   - content pages get the cohort CTA, since a reader who has read this far
 *     is the one worth asking;
 *   - legal pages get the wordmark and a way back, since a CTA on a terms
 *     page is noise.
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

  if (pathname === "/") return null;

  const isLegal = pathname === "/privacy" || pathname === "/terms";

  return (
    <header
      className={`sticky top-0 z-50 px-6 py-4 transition-colors duration-300 ${
        scrolled
          ? "bg-[rgba(8,17,34,0.92)] backdrop-blur-md border-b border-border"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {isLegal ? (
          <Link href="/" aria-label="Phrona — home" className="inline-block">
            <Image
              src="/logos/Phrona_Light_paths.svg"
              alt="Phrona"
              width={520}
              height={203}
              priority
              className="h-6 sm:h-7 w-auto"
            />
          </Link>
        ) : (
          <span aria-hidden />
        )}

        {isLegal ? (
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
          >
            <span aria-hidden>←</span>
            <span>Back to Home</span>
          </Link>
        ) : (
          <Link
            href="/#inquire"
            className="inline-flex items-center justify-center px-5 py-2.5 bg-hero text-hero-foreground rounded-full text-sm font-bold hover:shadow-[0_0_20px_rgba(120,180,255,0.55),0_0_44px_rgba(120,180,255,0.32)] transition-shadow"
          >
            Join our founding cohort
          </Link>
        )}
      </div>
    </header>
  );
}

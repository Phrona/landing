"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/for-operators", label: "For operators" },
  { href: "/for-investors", label: "For investors" },
] as const;

/**
 * Header on every page: the wordmark, the three paths through the site, and
 * Connect as the one persistent button.
 *
 * On the home page the hero carries the full logo, so the wordmark appears only
 * once the reader has scrolled past it. On narrow screens the three links fold
 * away (the footer carries them) and the wordmark and Connect remain.
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
  const showWordmark = !isHome || scrolled;

  return (
    <header
      className={`sticky top-0 z-50 px-6 py-4 transition-colors duration-300 ${
        scrolled
          ? "bg-[rgba(8,17,34,0.92)] backdrop-blur-md border-b border-border"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-6">
        <Link
          href="/"
          aria-label="Phrona — home"
          className={`inline-block transition-opacity duration-300 ${showWordmark ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          tabIndex={showWordmark ? 0 : -1}
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

        <nav className="flex items-center gap-6 sm:gap-8">
          <ul className="hidden md:flex items-center gap-8 text-sm">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  aria-current={pathname === n.href ? "page" : undefined}
                  className={`transition-colors ${
                    pathname === n.href ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/connect"
            className="inline-flex items-center justify-center px-5 py-2.5 bg-hero text-hero-foreground rounded-full text-sm font-bold hover:shadow-[0_0_20px_rgba(120,180,255,0.55),0_0_44px_rgba(120,180,255,0.32)] transition-shadow"
          >
            Connect
          </Link>
        </nav>
      </div>
    </header>
  );
}

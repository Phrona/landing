import Link from "next/link";
import { NewsletterForm } from "@/components/newsletter-form";

const linkClass = "text-[rgba(255,255,255,0.55)] hover:text-[rgba(255,255,255,0.9)] transition-colors";
const headingClass = "text-xs uppercase tracking-[0.18em] text-[rgba(255,255,255,0.4)] mb-4";

const COLUMNS: { heading: string; links: { href: string; label: string }[] }[] = [
  {
    heading: "Phrona",
    links: [
      { href: "/how-it-works", label: "How it works" },
      { href: "/for-operators", label: "For operators" },
      { href: "/for-investors", label: "For investors" },
    ],
  },
  {
    heading: "Get started",
    links: [
      { href: "/snapshot", label: "Request a Strategy Snapshot" },
      { href: "/for-operators#founding-beta", label: "Join the founding beta" },
      { href: "/connect", label: "Connect" },
    ],
  },
];

/**
 * Every page: four columns (Phrona, Get started, Stay informed, Company), with
 * the newsletter sign-up in the third. Stacks to one column on a phone.
 */
export function Footer() {
  return (
    <footer className="px-6 pb-10 mt-auto">
      <div className="max-w-6xl mx-auto pt-12 border-t border-border grid grid-cols-2 md:grid-cols-[1fr_1fr_1.6fr_1fr] gap-x-8 gap-y-10 text-sm">
        {COLUMNS.map((col) => (
          <nav key={col.heading} aria-label={col.heading}>
            <p className={headingClass}>{col.heading}</p>
            <ul className="space-y-2.5">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className="col-span-2 md:col-span-1">
          <p className={headingClass}>Stay informed</p>
          <NewsletterForm compact />
        </div>

        <div>
          <p className={headingClass}>Company</p>
          <ul className="space-y-2.5">
            <li>
              <Link href="/privacy" className={linkClass}>
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/terms" className={linkClass}>
                Terms
              </Link>
            </li>
            <li>
              <a href="mailto:hello@phrona.io" className={linkClass}>
                hello@phrona.io
              </a>
            </li>
          </ul>
          <p className="mt-6 text-xs text-[rgba(255,255,255,0.4)]">&copy; 2026 Phrona, Inc.</p>
        </div>
      </div>
    </footer>
  );
}

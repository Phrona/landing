import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/header";
import { ScrollReset } from "@/components/scroll-reset";
import { Footer } from "@/components/footer";
import { StructuredData } from "@/components/structured-data";

// Fonts are served from the repository (variable files, SIL OFL licences beside
// them) rather than fetched from Google at build time, so a build never fails
// on a font download.
const montserrat = localFont({
  src: "./fonts/Montserrat.woff2",
  variable: "--font-montserrat",
  weight: "100 900",
  display: "swap",
});

// Geist Mono for numerals — matches the workspace pattern used in
// products/phrona/frontend (font-mono on numbered lists). Reliable
// slashed-zero + clean tabular figures across platforms.
const geistMono = localFont({
  src: "./fonts/GeistMono.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://phrona.io"),
  // Title and description are the strings search engines display and AI systems
  // read as the definition of what this company is. They must match the page's
  // own claim — a stale pair here is the retired positioning shown on every
  // forward preview, search result, and machine read.
  title: {
    default: "Phrona — Infrastructure for strategy",
    template: "%s — Phrona",
  },
  description:
    "Phrona continuously monitors the world around you, keeping the convictions your strategy depends on grounded in reality and your strategy itself coherent. Private beta for hardtech and cleantech founders.",
  applicationName: "Phrona",
  authors: [{ name: "Phrona, Inc.", url: "https://phrona.io" }],
  creator: "Phrona, Inc.",
  publisher: "Phrona, Inc.",
  openGraph: {
    title: "Phrona — Infrastructure for strategy",
    description:
      "Phrona continuously monitors the world around you, keeping the convictions your strategy depends on grounded in reality and your strategy itself coherent.",
    url: "https://phrona.io",
    siteName: "Phrona",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Phrona — Infrastructure for strategy",
    description:
      "Phrona continuously monitors the world around you, keeping the convictions your strategy depends on grounded in reality and your strategy itself coherent.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${geistMono.variable} h-full antialiased motion-safe:scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <StructuredData />
        <ScrollReset />
        <Header />
        {children}
        <Footer />
        {/*
          Vercel Analytics — free on Hobby plan, privacy-respecting (no cookies, no PII),
          no consent banner needed. Auto-activates once deployed to Vercel; no-ops on
          localhost. Page views, top pages, top referrers, basic geo, devices.
        */}
        <Analytics />
      </body>
    </html>
  );
}

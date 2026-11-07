import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/header";
import { ScrollReset } from "@/components/scroll-reset";
import { Footer } from "@/components/footer";

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
  title: "Phrona — Strategy made coherent",
  description:
    "A reasoning engine for the bets that matter. Private beta for hardtech and cleantech founders.",
  openGraph: {
    title: "Phrona — Strategy made coherent",
    description:
      "Your strategy, brought to life. Private beta for hardtech and cleantech founders.",
    url: "https://phrona.io",
    siteName: "Phrona",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Phrona — Strategy made coherent",
    description:
      "Your strategy, brought to life. Private beta for hardtech and cleantech founders.",
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

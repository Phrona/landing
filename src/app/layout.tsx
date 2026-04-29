import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Montserrat, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

// Geist Mono for numerals — matches the workspace pattern used in
// products/phrona/frontend (font-mono on numbered lists). Reliable
// slashed-zero + clean tabular figures across platforms.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
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
      className={`${montserrat.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
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

import fs from "node:fs";
import path from "node:path";
import { MarkdownPage } from "@/components/markdown-page";

export const metadata = {
  title: "Terms of Service — Phrona",
  description: "Terms governing the phrona.io site and inquiries.",
};

export default function TermsPage() {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/content/terms.md"),
    "utf-8"
  );

  return (
    <main className="px-6 py-24 sm:py-32">
      <div className="max-w-3xl mx-auto">
        <MarkdownPage source={source} />
      </div>
    </main>
  );
}

import fs from "node:fs";
import path from "node:path";
import { MarkdownPage } from "@/components/markdown-page";

export const metadata = {
  title: "Privacy Policy — Phrona",
  description: "How Phrona collects, uses, and protects personal information.",
};

export default function PrivacyPage() {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/content/privacy.md"),
    "utf-8"
  );

  return (
    <main className="px-6 py-16 sm:py-20">
      <div className="max-w-[69rem] mx-auto">
        <MarkdownPage source={source} />
      </div>
    </main>
  );
}

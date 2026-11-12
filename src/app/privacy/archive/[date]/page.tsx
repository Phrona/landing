import fs from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import { MarkdownPage } from "@/components/markdown-page";
import versions from "@/content/privacy-archive/versions.json";

const previous = versions.filter((v) => !v.current).map((v) => v.effective);

export const dynamicParams = false;

export function generateStaticParams() {
  return previous.map((date) => ({ date }));
}

export async function generateMetadata({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  return {
    title: `Privacy Policy (effective ${date}) — Phrona`,
    description: "A previous version of Phrona's Privacy Policy.",
    robots: { index: false },
  };
}

export default async function PrivacyVersionPage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  if (!previous.includes(date)) notFound();
  const source = fs.readFileSync(path.join(process.cwd(), "src/content/privacy-archive", `${date}.md`), "utf-8");
  return (
    <main className="px-6 py-16 sm:py-20">
      <div className="max-w-[69rem] mx-auto">
        <MarkdownPage source={source} />
      </div>
    </main>
  );
}

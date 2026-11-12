import Link from "next/link";
import versions from "@/content/privacy-archive/versions.json";

export const metadata = {
  title: "Privacy Policy versions — Phrona",
  description: "Every version of Phrona's Privacy Policy, with the date each took effect.",
};

const long = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

export default function PrivacyArchivePage() {
  return (
    <main className="px-6 py-16 sm:py-20">
      <div className="max-w-[48rem] mx-auto">
        <h1 className="text-3xl font-semibold text-white">Privacy Policy versions</h1>
        <p className="mt-4 text-white/70">
          Every version of our Privacy Policy, with the date it took effect. A new version is posted at least thirty days
          before it takes effect.
        </p>
        <ul className="mt-10 divide-y divide-white/10 border-y border-white/10">
          {versions.map((v) => (
            <li key={v.effective} className="py-5 flex flex-wrap items-baseline justify-between gap-3">
              <Link
                href={v.current ? "/privacy" : `/privacy/archive/${v.effective}`}
                className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
              >
                Effective {long(v.effective)}
              </Link>
              <span className="text-sm text-white/60">
                {v.current ? "Current version" : "Previous version"} · posted {long(v.posted)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

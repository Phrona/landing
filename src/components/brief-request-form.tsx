"use client";

import { useState, useTransition } from "react";
import { requestBrief } from "@/app/actions/request-brief";
import type { BriefSlug } from "@/lib/briefs";

/**
 * "Email me the brief": a work email, an optional mailing-list box (never
 * pre-ticked), and the download link shown as soon as the request is accepted.
 */
export function BriefRequestForm({ brief }: { brief: BriefSlug }) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{ url: string; emailed: boolean; email: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(formData: FormData) {
    setError(null);
    const from = new URLSearchParams(window.location.search).get("from");
    if (from) formData.set("from", from);
    const email = String(formData.get("email") ?? "");
    startTransition(async () => {
      const r = await requestBrief(formData);
      if (r.ok) setResult({ url: r.url, emailed: r.emailed, email });
      else setError(r.error);
    });
  }

  if (result) {
    return (
      <div>
        <p className="text-lg sm:text-xl text-foreground mb-6">Your brief is ready.</p>
        <a
          href={result.url}
          className="inline-flex items-center justify-center px-6 py-3 bg-hero text-hero-foreground rounded-full text-lg font-bold hover:shadow-[0_0_28px_rgba(120,180,255,0.65),0_0_64px_rgba(120,180,255,0.40)] transition-shadow"
        >
          Download the brief (PDF)
        </a>
        {result.emailed && (
          <p className="mt-5 text-base text-muted-foreground">
            We&rsquo;ve also emailed a copy to {result.email}.
          </p>
        )}
      </div>
    );
  }

  return (
    <form action={onSubmit} className="max-w-xl">
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label htmlFor="no_fill">Don&apos;t fill this out:</label>
        <input type="text" name="no_fill" id="no_fill" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="brief" value={brief} />
      <h2 className="font-heading text-2xl sm:text-3xl font-medium mb-5">Email me the brief</h2>
      <label htmlFor="brief-email" className="block text-sm font-medium text-muted-foreground mb-3">
        Work email
      </label>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          id="brief-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
          className="field-fill flex-1 bg-transparent border border-border rounded-md px-4 py-3 text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground transition-colors"
        />
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center px-6 py-3 bg-hero text-hero-foreground rounded-full text-base font-bold hover:shadow-[0_0_28px_rgba(120,180,255,0.65),0_0_64px_rgba(120,180,255,0.40)] transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pending ? "Sending…" : "Send me the PDF"}
        </button>
      </div>
      <label className="mt-4 flex items-start gap-3 text-sm text-muted-foreground cursor-pointer">
        <input type="checkbox" name="updates" className="mt-0.5 h-4 w-4 accent-[rgb(120,180,255)]" />
        <span>Join our mailing list to receive product updates. Unsubscribe anytime.</span>
      </label>
      {error && (
        <p className="mt-3 text-sm text-[#e58a6a]" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}

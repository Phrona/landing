"use client";

import { useState, useTransition } from "react";
import { subscribeToUpdates } from "@/app/actions/subscribe";

/**
 * Optional email sign-up beneath a brief download. One field and a button;
 * nothing about it blocks the download above it.
 */
export function UpdatesForm({ audience }: { audience: "operators" | "investors" }) {
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await subscribeToUpdates(formData);
      if (result.ok) setDone(true);
      else setError(result.error);
    });
  }

  if (done) {
    return (
      <p className="text-base sm:text-lg text-muted-foreground">
        Thank you. We&rsquo;ll send updates and new briefs as they&rsquo;re ready.
      </p>
    );
  }

  return (
    <form action={onSubmit} className="max-w-xl">
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label htmlFor="no_fill">Don&apos;t fill this out:</label>
        <input type="text" name="no_fill" id="no_fill" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="audience" value={audience} />
      <label htmlFor="updates-email" className="block text-sm font-medium text-muted-foreground mb-3">
        Get product updates and new decision briefs
      </label>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          id="updates-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Email"
          className="field-fill flex-1 bg-transparent border border-border rounded-md px-4 py-3 text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground transition-colors"
        />
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center px-5 py-3 border border-border rounded-full text-base font-medium text-foreground hover:border-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pending ? "Sending…" : "Keep me posted"}
        </button>
      </div>
      {error && (
        <p className="mt-3 text-sm text-[#e58a6a]" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}

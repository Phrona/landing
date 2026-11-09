"use client";

import { useState, useTransition } from "react";
import { subscribeNewsletter } from "@/app/actions/subscribe";

/** What a subscriber gets, said once and shown wherever the sign-up appears. */
export const NEWSLETTER_PROMISE =
  "A short letter from Phrona about once a month: how strategy holds up as conditions change, and what's new in Phrona. Unsubscribe anytime.";

/**
 * The newsletter sign-up: one email field and Subscribe. `compact` is the
 * footer's version; the default is the band at the end of /how-it-works.
 */
export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await subscribeNewsletter(formData);
      if (result.ok) setDone(true);
      else setError(result.error);
    });
  }

  if (done) {
    return (
      <p className={compact ? "text-sm text-foreground" : "text-lg text-foreground"}>
        Thank you. You&rsquo;re on the list.
      </p>
    );
  }

  return (
    <form action={onSubmit} className={compact ? "w-full" : "w-full max-w-md mx-auto"}>
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label htmlFor={compact ? "nl_no_fill_f" : "nl_no_fill"}>Don&apos;t fill this out:</label>
        <input type="text" name="no_fill" id={compact ? "nl_no_fill_f" : "nl_no_fill"} tabIndex={-1} autoComplete="off" />
      </div>
      <div className="flex gap-2">
        <label htmlFor={compact ? "nl_email_f" : "nl_email"} className="sr-only">
          Email
        </label>
        <input
          id={compact ? "nl_email_f" : "nl_email"}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Your email"
          className={`field-fill min-w-0 flex-1 bg-transparent border border-border rounded-full px-4 ${
            compact ? "py-2 text-sm" : "py-3 text-base"
          } text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground transition-colors`}
        />
        <button
          type="submit"
          disabled={pending}
          className={`shrink-0 inline-flex items-center justify-center border border-foreground/70 rounded-full font-bold text-foreground hover:border-foreground hover:shadow-[0_0_20px_rgba(120,180,255,0.40),0_0_44px_rgba(120,180,255,0.22)] transition-shadow disabled:opacity-50 ${
            compact ? "px-4 py-2 text-sm" : "px-6 py-3 text-base"
          }`}
        >
          {pending ? "…" : "Subscribe"}
        </button>
      </div>
      {error && (
        <p className="text-sm text-[#e58a6a] mt-2" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}

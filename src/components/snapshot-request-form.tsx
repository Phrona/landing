"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { requestSnapshot } from "@/app/actions/request-snapshot";

const fieldClass =
  "field-fill w-full bg-transparent border border-border rounded-md px-4 py-3 text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground transition-colors";

const labelClass = "block text-sm font-medium text-muted-foreground mb-2";

const WHOSE = [
  { value: "operator", label: "My own company" },
  { value: "investor", label: "A company I've invested in" },
] as const;

/**
 * The Strategy Snapshot request: name, work email, the company and its website,
 * whose company it is, and an optional note. `audience` preselects whose company
 * it is (the investor page passes "investor"). The time the form appeared is sent
 * with it, so a submission faster than a person could type is dropped.
 */
export function SnapshotRequestForm({ audience = "operator" }: { audience?: "operator" | "investor" }) {
  const [pending, startTransition] = useTransition();
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  function onSubmit(formData: FormData) {
    setError(null);
    formData.set("started", String(startedAt.current));
    startTransition(async () => {
      const result = await requestSnapshot(formData);
      if (result.ok) setSentTo(result.email);
      else setError(result.error);
    });
  }

  if (sentTo !== null) {
    return (
      <div className="text-center py-8" role="status">
        <p className="text-2xl font-heading font-medium mb-4">Thank you.</p>
        <p className="text-lg text-muted-foreground leading-relaxed">
          We&rsquo;ve received your request. We prepare each Snapshot ourselves and will send yours to{" "}
          <span className="text-foreground">{sentTo}</span> when it&rsquo;s ready. If we have a question,
          we&rsquo;ll be in touch.
        </p>
      </div>
    );
  }

  return (
    <form action={onSubmit} className="text-left space-y-6">
      {/* Honeypot: the name must stay meaningless to autofill, as on the other forms. */}
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label htmlFor="snap_no_fill">Don&apos;t fill this out:</label>
        <input type="text" name="no_fill" id="snap_no_fill" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="snap_name" className={labelClass}>
            Name
          </label>
          <input id="snap_name" name="name" required autoComplete="name" placeholder=" " className={fieldClass} />
        </div>
        <div>
          <label htmlFor="snap_email" className={labelClass}>
            Work email
          </label>
          <input
            id="snap_email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder=" "
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="snap_company" className={labelClass}>
            Company
          </label>
          <input
            id="snap_company"
            name="company"
            required
            autoComplete="organization"
            placeholder=" "
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="snap_website" className={labelClass}>
            Company website
          </label>
          <input
            id="snap_website"
            name="website_address"
            required
            inputMode="url"
            autoComplete="url"
            placeholder="example.com"
            className={fieldClass}
          />
        </div>
      </div>

      <fieldset>
        <legend className={labelClass}>Whose company is it?</legend>
        <div className="flex flex-wrap gap-3">
          {WHOSE.map((w) => (
            <label
              key={w.value}
              className="flex items-center gap-2.5 border border-border rounded-full px-4 py-2 text-base text-foreground cursor-pointer has-[:checked]:border-foreground has-[:checked]:bg-[rgba(255,255,255,0.06)] transition-colors"
            >
              <input
                type="radio"
                name="audience"
                value={w.value}
                defaultChecked={w.value === audience}
                required
                className="h-4 w-4 accent-[rgb(120,180,255)]"
              />
              {w.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="snap_context" className={labelClass}>
          Anything you&rsquo;d like us to look at? <span className="text-muted-foreground/70">(optional)</span>
        </label>
        <textarea
          id="snap_context"
          name="context"
          rows={4}
          maxLength={2000}
          className={`${fieldClass} resize-none`}
          placeholder="A decision you're weighing, a market you're watching, a question you'd like answered."
        />
      </div>

      <label className="flex items-start gap-3 text-sm text-muted-foreground cursor-pointer">
        <input type="checkbox" name="newsletter" className="mt-0.5 h-4 w-4 accent-[rgb(120,180,255)]" />
        <span>Send me the Phrona newsletter (unsubscribe anytime).</span>
      </label>

      {error && (
        <p className="text-sm text-[#e58a6a]" role="alert">
          {error}
        </p>
      )}

      <div className="text-center pt-2">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center px-6 py-3 bg-hero text-hero-foreground rounded-full text-lg font-bold hover:opacity-100 hover:shadow-[0_0_28px_rgba(120,180,255,0.65),0_0_64px_rgba(120,180,255,0.40)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pending ? "Sending…" : "Request a Snapshot"}
        </button>
      </div>
    </form>
  );
}

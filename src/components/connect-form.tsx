"use client";

import { useState, useTransition } from "react";
import { submitConnect } from "@/app/actions/inquire";

const fieldClass =
  "field-fill w-full bg-transparent border border-border rounded-md px-4 py-3 text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground transition-colors";

const labelClass = "block text-sm font-medium text-muted-foreground mb-2";

const FIELDS = [
  { id: "name", label: "Name", type: "text", autoComplete: "name" },
  { id: "email", label: "Email", type: "email", autoComplete: "email" },
  { id: "company", label: "Company", type: "text", autoComplete: "organization" },
] as const;

const AUDIENCES = [
  { value: "operator", label: "An operator" },
  { value: "investor", label: "An investor" },
  { value: "other", label: "Other" },
] as const;

/** The /connect form: who you are, and the decision you are working through. */
export function ConnectForm() {
  const [pending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await submitConnect(formData);
      if (result.ok) {
        setSuccess(true);
      } else {
        setError(result.error);
      }
    });
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <p className="text-2xl font-heading font-medium mb-4">Thank you.</p>
        <p className="text-lg text-muted-foreground leading-relaxed">
          We&apos;ll be in touch shortly.
        </p>
      </div>
    );
  }

  return (
    <form action={onSubmit} className="text-left space-y-6">
      {/* Honeypot: the name must stay meaningless to autofill, as on the inquiry form. */}
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label htmlFor="no_fill">Don&apos;t fill this out:</label>
        <input type="text" name="no_fill" id="no_fill" tabIndex={-1} autoComplete="off" />
      </div>

      {FIELDS.map((f) => (
        <div key={f.id}>
          <label htmlFor={f.id} className={labelClass}>
            {f.label}
          </label>
          <input
            id={f.id}
            name={f.id}
            type={f.type}
            required
            autoComplete={f.autoComplete}
            placeholder=" "
            className={fieldClass}
          />
        </div>
      ))}

      <fieldset>
        <legend className={labelClass}>I&apos;m</legend>
        <div className="flex flex-wrap gap-3">
          {AUDIENCES.map((a) => (
            <label
              key={a.value}
              className="flex items-center gap-2.5 border border-border rounded-full px-4 py-2 text-base text-foreground cursor-pointer has-[:checked]:border-foreground has-[:checked]:bg-[rgba(255,255,255,0.06)] transition-colors"
            >
              <input type="radio" name="audience" value={a.value} required className="h-4 w-4 accent-[rgb(120,180,255)]" />
              {a.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="context" className={labelClass}>
          What decision are you working through?
        </label>
        <textarea
          id="context"
          name="context"
          required
          rows={5}
          maxLength={2000}
          className={`${fieldClass} resize-none`}
          placeholder="A sentence or two is plenty. What are you deciding, and what does the decision depend on?"
        />
      </div>

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
          {pending ? "Submitting…" : "Connect with Phrona"}
        </button>
      </div>
    </form>
  );
}

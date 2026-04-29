"use client";

import { useState, useTransition } from "react";
import { submitInquiry } from "@/app/actions/inquire";

const fieldClass =
  "w-full bg-transparent border border-border rounded-md px-4 py-3 text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground transition-colors";

const labelClass =
  "block text-sm font-medium text-muted-foreground mb-2";

export function InquireForm() {
  const [pending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await submitInquiry(formData);
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
        <p className="text-2xl font-heading font-medium mb-4">
          Thanks for reaching out.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed">
          We&apos;ll be in touch within 48 hours.
        </p>
      </div>
    );
  }

  return (
    <form action={onSubmit} className="text-left space-y-6">
      {/* Honeypot — hidden from humans, irresistible to bots */}
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label htmlFor="company_url">Don&apos;t fill this out:</label>
        <input
          type="text"
          name="company_url"
          id="company_url"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className={labelClass}>
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="company" className={labelClass}>
            Company
          </label>
          <input
            id="company"
            name="company"
            type="text"
            required
            autoComplete="organization"
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="role" className={labelClass}>
            Role
          </label>
          <input
            id="role"
            name="role"
            type="text"
            required
            autoComplete="organization-title"
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="context" className={labelClass}>
          What&apos;s prompting this?
        </label>
        <textarea
          id="context"
          name="context"
          required
          rows={5}
          maxLength={2000}
          className={`${fieldClass} resize-none`}
          placeholder="A sentence or two on what you're working on and why Phrona caught your attention."
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
          className="inline-flex items-center justify-center px-10 py-5 bg-hero text-hero-foreground rounded-full text-lg font-bold hover:opacity-100 hover:shadow-[0_0_28px_rgba(120,180,255,0.65),0_0_64px_rgba(120,180,255,0.40)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pending ? "Submitting…" : "Submit"}
        </button>
      </div>
    </form>
  );
}

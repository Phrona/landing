"use server";

import { addSubscriber, NEWSLETTER } from "@/lib/briefs";

export type SubscribeResult = { ok: true } | { ok: false; error: string };

/**
 * Server action behind the newsletter sign-ups (the footer on every page, and
 * the band at the end of /how-it-works): adds the address to the newsletter list
 * in `landing_subscribers`. An address already on the list stays on it once.
 */
export async function subscribeNewsletter(formData: FormData): Promise<SubscribeResult> {
  const honeypot = formData.get("no_fill");
  if (honeypot && String(honeypot).trim().length > 0) {
    console.warn("[NEWSLETTER] honeypot tripped — sign-up dropped.");
    return { ok: true };
  }
  const email = String(formData.get("email") ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 320) {
    return { ok: false, error: "That doesn't look like a valid email." };
  }
  if (!(await addSubscriber(email, NEWSLETTER))) {
    return { ok: false, error: "Something went wrong. Please try again, or email hello@phrona.io." };
  }
  return { ok: true };
}

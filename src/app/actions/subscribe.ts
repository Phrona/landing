"use server";

import { neon } from "@neondatabase/serverless";
import nodemailer from "nodemailer";

export type SubscribeResult = { ok: true } | { ok: false; error: string };

/**
 * Server action for the optional "Get product updates and new decision briefs"
 * field on /for-operators and /for-investors.
 *
 * The briefs themselves are never gated on this: a reader can download without
 * giving an email, and this is only for those who want to hear more.
 *
 * Flow: validate → persist to `landing_subscribers` (Neon, the durable record;
 * the table creates itself on first use) → notify Aaron by email. A repeat
 * sign-up from the same address and page is accepted silently rather than
 * stored twice. Persistence and notification are each best-effort against the
 * other, as on the inquiry form: a failed write must not lose the notification,
 * and a failed send must not lose the row.
 */

let tableReady = false;

const AUDIENCES = new Set(["operators", "investors"]);

export async function subscribeToUpdates(formData: FormData): Promise<SubscribeResult> {
  const honeypot = formData.get("no_fill");
  if (honeypot && String(honeypot).trim().length > 0) {
    console.warn(
      "[SUBSCRIBE] honeypot tripped — submission dropped:",
      JSON.stringify(Object.fromEntries(formData.entries())),
    );
    return { ok: true };
  }

  const email = String(formData.get("email") ?? "").trim();
  const audience = String(formData.get("audience") ?? "").trim();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 320) {
    return { ok: false, error: "That doesn't look like a valid email." };
  }
  if (!AUDIENCES.has(audience)) {
    return { ok: false, error: "Something went wrong. Please email hello@phrona.io." };
  }

  const stored = await persistSubscriber(email, audience);

  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  if (!smtpUser || !smtpPass) {
    console.error("[SUBSCRIBE] SMTP not configured. Sign-up:", email, audience);
    if (process.env.NODE_ENV === "production" && !stored) {
      return { ok: false, error: "Something went wrong. Please email hello@phrona.io." };
    }
    return { ok: true };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST ?? "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: false,
      auth: { user: smtpUser, pass: smtpPass },
    });
    await transporter.sendMail({
      from: smtpUser,
      to: process.env.INQUIRY_TO ?? "aaron@phrona.io",
      replyTo: email,
      subject: `[Phrona updates] ${email} (for ${audience})`,
      text: [
        `Email: ${email}`,
        `Signed up on: phrona.io/for-${audience}`,
        "",
        "Asked for product updates and new decision briefs.",
      ].join("\n"),
    });
  } catch (err) {
    console.error("[SUBSCRIBE] notification failed:", err);
    if (!stored) {
      return { ok: false, error: "Something went wrong. Please email hello@phrona.io." };
    }
  }
  return { ok: true };
}

/** Returns true when the sign-up is recorded (including an existing row). */
async function persistSubscriber(email: string, audience: string): Promise<boolean> {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.warn("[SUBSCRIBE] DATABASE_URL not set — sign-up NOT persisted.");
    return false;
  }
  try {
    const sql = neon(dbUrl);
    if (!tableReady) {
      await sql`
        CREATE TABLE IF NOT EXISTS landing_subscribers (
          id SERIAL PRIMARY KEY,
          email TEXT NOT NULL,
          audience TEXT NOT NULL,
          subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          UNIQUE (email, audience)
        )
      `;
      tableReady = true;
    }
    await sql`
      INSERT INTO landing_subscribers (email, audience)
      VALUES (${email.toLowerCase()}, ${audience})
      ON CONFLICT (email, audience) DO NOTHING
    `;
    return true;
  } catch (err) {
    console.error("[SUBSCRIBE] persistence failed:", err);
    return false;
  }
}

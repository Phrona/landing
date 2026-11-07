"use server";

import { randomUUID } from "node:crypto";
import { headers } from "next/headers";
import nodemailer from "nodemailer";
import { BRIEFS, addSubscriber, isBriefSlug, recordBriefRequest } from "@/lib/briefs";

export type RequestBriefResult = { ok: true; url: string; emailed: boolean } | { ok: false; error: string };

const GENERIC_ERROR = "Something went wrong. Please email hello@phrona.io and we'll send it.";

/**
 * Server action behind "Email me the brief" on /for-operators and /for-investors.
 *
 * The brief is offered for a work email. On submit: record the request with a
 * fresh token (Neon, `landing_brief_requests`), add the address to the mailing
 * list only if the reader ticked the opt-in box, email the reader a copy of the
 * download link, and notify Aaron. The page then shows the same link so the
 * reader can download straight away.
 *
 * Each step is best-effort against the others: a failed email must not cost the
 * reader the link on the page, and a failed write must not lose the
 * notification.
 */
export async function requestBrief(formData: FormData): Promise<RequestBriefResult> {
  const honeypot = formData.get("no_fill");
  if (honeypot && String(honeypot).trim().length > 0) {
    console.warn("[BRIEF] honeypot tripped — submission dropped.");
    return { ok: false, error: GENERIC_ERROR };
  }

  const email = String(formData.get("email") ?? "").trim();
  const brief = String(formData.get("brief") ?? "").trim();
  const wantsUpdates = formData.get("updates") === "on";
  const source = String(formData.get("from") ?? "").trim().slice(0, 120) || null;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 320) {
    return { ok: false, error: "That doesn't look like a valid email." };
  }
  if (!isBriefSlug(brief)) return { ok: false, error: GENERIC_ERROR };
  const meta = BRIEFS[brief];

  const token = randomUUID();
  const requestId = await recordBriefRequest({ token, email, brief, wantsUpdates, source });
  const subscribed = wantsUpdates ? await addSubscriber(email, meta.audience) : false;

  const path = `/download/${brief}?t=${token}`;
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "phrona.io";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const link = `${proto}://${host}${path}`;

  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  if (!smtpUser || !smtpPass) {
    console.error("[BRIEF] SMTP not configured. Request:", email, brief, requestId);
    return { ok: true, url: path, emailed: false };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: false,
    auth: { user: smtpUser, pass: smtpPass },
  });

  let emailed = false;
  try {
    await transporter.sendMail({
      from: `Aaron Chockla, Phrona <${smtpUser}>`,
      to: email,
      replyTo: process.env.INQUIRY_TO ?? "aaron@phrona.io",
      subject: `Your copy of ${meta.title}`,
      text: [
        "Thanks for your interest in Phrona.",
        "",
        `Here is ${meta.title}:`,
        link,
        "",
        "If it raises a question or a decision you're working through, reply to this email. I read every one.",
        "",
        "Aaron Chockla",
        "Founder, Phrona",
        "phrona.io",
      ].join("\n"),
    });
    emailed = true;
  } catch (err) {
    console.error("[BRIEF] reader email failed:", err);
  }

  try {
    await transporter.sendMail({
      from: smtpUser,
      to: process.env.INQUIRY_TO ?? "aaron@phrona.io",
      replyTo: email,
      subject: `[Phrona brief] ${email} (${meta.audience})`,
      text: [
        `Email: ${email}`,
        `Brief: ${meta.title}`,
        `Mailing list: ${wantsUpdates ? (subscribed ? "opted in" : "opted in, NOT recorded") : "no"}`,
        `Source: ${source ?? "none"}`,
        `Request recorded: ${requestId ? `yes (#${requestId})` : "NO"}`,
        `Copy emailed to reader: ${emailed ? "yes" : "NO"}`,
      ].join("\n"),
    });
  } catch (err) {
    console.error("[BRIEF] notification failed:", err);
  }

  return { ok: true, url: path, emailed };
}

"use server";

import { neon } from "@neondatabase/serverless";
import { addSubscriber, NEWSLETTER } from "@/lib/briefs";
import {
  CYAN,
  MUTED,
  NAVY,
  RULE,
  SURFACE,
  emailFooter,
  emailHeader,
  emailShell,
  escapeHtml,
  mailTransport,
  notifyAddress,
} from "@/lib/mail";

export type SnapshotResult = { ok: true; email: string } | { ok: false; error: string };

const GENERIC_ERROR = "Something went wrong. Please email hello@phrona.io and we'll take it from there.";

// A person filling the form in takes longer than this; a script does not.
const FASTEST_HUMAN_MS = 3000;

// Free mail providers. A founder may well use one, so it is accepted and flagged
// for Aaron rather than refused.
const PERSONAL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "msn.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "aol.com",
  "proton.me",
  "protonmail.com",
  "gmx.com",
  "gmx.de",
  "web.de",
  "yandex.com",
  "mail.com",
  "zoho.com",
]);

const AUDIENCES = new Set(["operator", "investor"]);

/** A website as typed, made into a full address, or null when it is not one. */
function normaliseWebsite(raw: string): string | null {
  const value = raw.trim();
  if (!value || value.length > 300) return null;
  try {
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    if (!url.hostname.includes(".")) return null;
    return url.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

/**
 * Server action behind phrona.io/snapshot: a request for a free, outside-in
 * Strategy Snapshot of a company.
 *
 * Each Snapshot is prepared by hand from public sources and sent as a PDF, so
 * the request is recorded (Neon, `landing_snapshot_requests`, the queue staff
 * work from under Instances › Snapshot requests), Aaron is notified, and the
 * requester gets an acknowledgement that promises no turnaround. The record is
 * written before any email, so a failed email never loses a request.
 */
export async function requestSnapshot(formData: FormData): Promise<SnapshotResult> {
  const honeypot = formData.get("no_fill");
  if (honeypot && String(honeypot).trim().length > 0) {
    console.warn("[SNAPSHOT] honeypot tripped — submission dropped.");
    return { ok: true, email: String(formData.get("email") ?? "") };
  }
  const startedAt = Number(formData.get("started") ?? 0);
  if (startedAt && Date.now() - startedAt < FASTEST_HUMAN_MS) {
    console.warn("[SNAPSHOT] submitted too fast — dropped.");
    return { ok: true, email: String(formData.get("email") ?? "") };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const websiteRaw = String(formData.get("website_address") ?? "").trim();
  const context = String(formData.get("context") ?? "").trim();
  const audience = String(formData.get("audience") ?? "operator").trim();
  const wantsNewsletter = formData.get("newsletter") === "on";

  if (!name || !email || !company || !websiteRaw) {
    return { ok: false, error: "Please fill in your name, email, the company and its website." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 320) {
    return { ok: false, error: "That doesn't look like a valid email." };
  }
  const website = normaliseWebsite(websiteRaw);
  if (!website) return { ok: false, error: "That doesn't look like a website address." };
  if (!AUDIENCES.has(audience)) return { ok: false, error: GENERIC_ERROR };
  if (name.length > 200 || company.length > 200) {
    return { ok: false, error: "Please shorten the name or company." };
  }
  if (context.length > 2000) {
    return { ok: false, error: "Please keep your note under 2000 characters." };
  }
  const personal = PERSONAL_DOMAINS.has(email.split("@")[1]?.toLowerCase() ?? "");

  const id = await persist({ name, email, company, website, context, audience, personal, wantsNewsletter });
  if (wantsNewsletter) await addSubscriber(email, NEWSLETTER);

  const mail = mailTransport();
  if (!mail) {
    console.error("[SNAPSHOT] SMTP not configured. Request:", { name, email, company, website, audience });
    await markStatus(id, "smtp_unconfigured");
    if (process.env.NODE_ENV === "production") return { ok: false, error: GENERIC_ERROR };
    return { ok: true, email };
  }

  const firstName = name.split(/\s+/)[0] ?? name;
  try {
    await mail.transporter.sendMail({
      from: mail.user,
      to: notifyAddress(),
      replyTo: email,
      subject: `[Snapshot request] ${company} — ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}${personal ? "  (personal address)" : ""}`,
        `Company: ${company}`,
        `Website: ${website}`,
        `For: ${audience === "investor" ? "a company they've invested in" : "their own company"}`,
        `Newsletter: ${wantsNewsletter ? "yes" : "no"}`,
        "",
        "Anything to look at:",
        context || "(nothing added)",
        "",
        "Track it under Instances › Snapshot requests. Reply to respond directly.",
      ].join("\n"),
      html: notificationHtml({ name, email, company, website, context, audience, personal, wantsNewsletter }),
    });
    await mail.transporter.sendMail({
      from: `"Phrona" <hello@phrona.io>`,
      to: email,
      replyTo: "hello@phrona.io",
      subject: "Your Strategy Snapshot request",
      text: [
        `Hi ${firstName},`,
        "",
        `Thanks for requesting a Strategy Snapshot of ${company}. We prepare each one ourselves from public sources, and we'll send it to this address when it's ready.`,
        "",
        "If there's a decision you'd like us to keep in mind, just reply to this email.",
        "",
        "— Phrona",
      ].join("\n"),
      html: autoReplyHtml(firstName, company),
    });
    await markStatus(id, "sent");
    return { ok: true, email };
  } catch (err) {
    console.error("[SNAPSHOT] SMTP send failed:", err);
    await markStatus(id, "send_failed");
    // The request is recorded; the person still sees it acknowledged when it was.
    return id !== null ? { ok: true, email } : { ok: false, error: GENERIC_ERROR };
  }
}

async function persist(r: {
  name: string;
  email: string;
  company: string;
  website: string;
  context: string;
  audience: string;
  personal: boolean;
  wantsNewsletter: boolean;
}): Promise<number | null> {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.warn("[SNAPSHOT] DATABASE_URL not set — request NOT persisted.");
    return null;
  }
  try {
    const sql = neon(url);
    const rows = (await sql`
      INSERT INTO landing_snapshot_requests
        (name, email, company, website, context, audience, personal_email, wants_newsletter)
      VALUES (${r.name}, ${r.email}, ${r.company}, ${r.website}, ${r.context || null},
              ${r.audience}, ${r.personal}, ${r.wantsNewsletter})
      RETURNING id
    `) as { id: number }[];
    return rows[0]?.id ?? null;
  } catch (err) {
    console.error("[SNAPSHOT] persistence failed:", err);
    return null;
  }
}

async function markStatus(id: number | null, status: string): Promise<void> {
  const url = process.env.DATABASE_URL;
  if (id === null || !url) return;
  try {
    await neon(url)`UPDATE landing_snapshot_requests SET email_status = ${status} WHERE id = ${id}`;
  } catch (err) {
    console.error("[SNAPSHOT] status update failed:", err);
  }
}

function autoReplyHtml(firstName: string, company: string): string {
  const p = (text: string, bottom = 18) =>
    `<p style="margin:0 0 ${bottom}px 0;font-size:16px;line-height:1.55;">${text}</p>`;
  return emailShell(
    `${emailHeader()}
    <div style="padding:40px 40px 36px 40px;">
      ${p(`Hi ${escapeHtml(firstName)},`)}
      ${p(
        `Thanks for requesting a Strategy Snapshot of ${escapeHtml(company)}. We prepare each one ourselves from public sources, and we'll send it to this address when it's ready.`,
      )}
      ${p("If there's a decision you'd like us to keep in mind, just reply to this email.", 28)}
      <p style="margin:0;font-size:16px;line-height:1.55;color:${NAVY};">&mdash; Phrona</p>
    </div>
    ${emailFooter()}`,
  );
}

function notificationHtml(d: {
  name: string;
  email: string;
  company: string;
  website: string;
  context: string;
  audience: string;
  personal: boolean;
  wantsNewsletter: boolean;
}): string {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 16px 6px 0;color:${MUTED};width:96px;vertical-align:top;">${label}</td><td style="padding:6px 0;color:${NAVY};font-weight:600;">${value}</td></tr>`;
  const email = escapeHtml(d.email);
  const website = escapeHtml(d.website);
  return emailShell(
    `${emailHeader("Strategy Snapshot request")}
    <div style="padding:32px 40px 24px 40px;">
      <table cellpadding="0" cellspacing="0" border="0" style="width:100%;font-size:14px;line-height:1.55;border-collapse:collapse;">
        ${row("Name", escapeHtml(d.name))}
        ${row("Email", `<a href="mailto:${email}" style="color:${NAVY};text-decoration:none;">${email}</a>${d.personal ? ` <span style="color:${MUTED};font-weight:400;">(personal address)</span>` : ""}`)}
        ${row("Company", escapeHtml(d.company))}
        ${row("Website", `<a href="${website}" style="color:${NAVY};">${website}</a>`)}
        ${row("For", d.audience === "investor" ? "A company they&rsquo;ve invested in" : "Their own company")}
        ${row("Newsletter", d.wantsNewsletter ? "Yes" : "No")}
      </table>
      <div style="margin-top:24px;padding-top:20px;border-top:1px solid ${RULE};">
        <div style="color:${MUTED};font-size:11px;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:10px;">Anything to look at</div>
        <div style="font-size:15px;line-height:1.6;color:${NAVY};white-space:pre-wrap;">${d.context ? escapeHtml(d.context) : "Nothing added."}</div>
      </div>
      <div style="margin-top:24px;padding:14px 16px;background:${SURFACE};border-left:3px solid ${CYAN};font-size:13px;color:${MUTED};line-height:1.5;">
        Track it under Instances &rsaquo; Snapshot requests. Reply to this email to respond directly.
      </div>
    </div>`,
  );
}

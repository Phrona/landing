"use server";

import { neon } from "@neondatabase/serverless";
import nodemailer from "nodemailer";
import { CYAN, MUTED, NAVY, RULE, SUBTLE, SURFACE, emailHeader as header, emailShell, escapeHtml } from "@/lib/mail";

export type InquiryResult =
  | { ok: true }
  | { ok: false; error: string };

/**
 * Server action — the founding-beta application on /for-operators and /for-investors.
 *
 * Flow: validate → anti-spam check → send to hello@phrona.io + auto-reply to applicant.
 *
 * SMTP config via env vars (Google Workspace App Password):
 *   SMTP_USER (e.g. aaron@phrona.io)
 *   SMTP_PASS (App Password — NOT the account login)
 *   INQUIRY_TO (where inquiries land — defaults to hello@phrona.io)
 *
 * If env vars not set, the action logs to server console and returns success
 * (useful in dev so the UX path can be tested without sending real mail).
 */
export async function submitInquiry(formData: FormData): Promise<InquiryResult> {
  // --- Anti-spam: honeypot field ---
  // Bots fill in every field; humans don't see this one. Field name must stay
  // meaningless to browser autofill heuristics (the original name company_url
  // was autofill bait — Chrome fills hidden "url"/"company" fields, which
  // silently dropped real submissions). Log every trip so a false positive is
  // at least recoverable from function logs.
  const honeypot = formData.get("no_fill");
  if (honeypot && String(honeypot).trim().length > 0) {
    console.warn(
      "[INQUIRY] honeypot tripped — submission dropped:",
      JSON.stringify(Object.fromEntries(formData.entries())),
    );
    // Pretend success; silently drop.
    return { ok: true };
  }

  const data = {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    company: String(formData.get("company") ?? "").trim(),
    role: String(formData.get("role") ?? "").trim(),
    context: String(formData.get("context") ?? "").trim(),
    // Operators and investors both apply to the founding beta (Aaron, 2026-11-09).
    audience: formData.get("audience") === "investor" ? "investor" : "operator",
  };

  // --- Validation ---
  if (!data.name || !data.email || !data.company || !data.role || !data.context) {
    return { ok: false, error: "Please fill in every field." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return { ok: false, error: "That doesn't look like a valid email." };
  }
  if (data.context.length > 2000) {
    return { ok: false, error: "Please keep your note under 2000 characters." };
  }

  // --- Persistence BEFORE send ---
  // The table (landing_inquiries, Neon) is the durable record; email is only
  // the notification channel. A delivery failure after this point means a
  // recoverable row, not a lost lead. No DATABASE_URL = persistence skipped
  // (logged), never blocks the email path.
  const inquiryId = await persistInquiry(data);

  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  // Default to aaron@phrona.io directly. hello@phrona.io is an alias of aaron@,
  // and Gmail filters self-sends-via-alias out of Inbox.
  const inquiryTo = process.env.INQUIRY_TO ?? "aaron@phrona.io";

  // --- No SMTP creds ---
  // Dev: log and return success so the UX path is testable without real mail.
  // Production: this is a misconfiguration, and faking success here silently
  // discards a real prospect — fail loudly instead.
  if (!smtpUser || !smtpPass) {
    console.error("[INQUIRY] SMTP not configured. Submission:");
    console.error(JSON.stringify(data, null, 2));
    await markInquiryStatus(inquiryId, "smtp_unconfigured");
    if (process.env.NODE_ENV === "production") {
      return {
        ok: false,
        error:
          "Something went wrong sending your inquiry. Please email hello@phrona.io directly.",
      };
    }
    return { ok: true };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: false, // 587 uses STARTTLS
    auth: { user: smtpUser, pass: smtpPass },
  });

  const subject = `[Phrona founding beta] ${data.company} — ${data.name} (${data.audience})`;
  const notificationText = [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Company: ${data.company}`,
    `Role: ${data.role}`,
    "",
    `What's prompting this:`,
    data.context,
  ].join("\n");

  const firstName = data.name.split(/\s+/)[0] ?? data.name;
  const autoReplyText = [
    `Hi ${firstName},`,
    "",
    "Thanks for applying to join Phrona's founding beta.",
    "",
    "We've received your note and will be in touch within 48 hours.",
    "",
    "— Phrona",
  ].join("\n");

  try {
    // 1. Notification to Phrona inbox
    await transporter.sendMail({
      from: smtpUser,
      to: inquiryTo,
      replyTo: data.email,
      subject,
      text: notificationText,
      html: notificationHtml(data),
    });

    // 2. Auto-reply to applicant — sent from the brand alias, signed as the brand.
    // SMTP authenticates as smtpUser; Workspace permits FROM to be any verified alias.
    await transporter.sendMail({
      from: `"Phrona" <hello@phrona.io>`,
      to: data.email,
      replyTo: "hello@phrona.io",
      subject: "Thanks for your interest in Phrona",
      text: autoReplyText,
      html: autoReplyHtml(firstName),
    });

    await markInquiryStatus(inquiryId, "sent");
    return { ok: true };
  } catch (err) {
    console.error("[INQUIRY] SMTP send failed:", err);
    await markInquiryStatus(inquiryId, "send_failed");
    // The submission is already persisted (if DB configured) — a delivery
    // failure is recoverable, but the user should still know we hiccupped.
    return {
      ok: false,
      error: "Something went wrong sending your inquiry. Please try emailing hello@phrona.io directly.",
    };
  }
}

const AUDIENCES = new Set(["operator", "investor", "other"]);

/**
 * Server action for /connect, where the header's Connect button, the briefs'
 * "Explore Phrona" link (via the /learn-more redirect) and every conversation
 * link on the site land.
 *
 * It asks for name, email, company, whether the person is an operator, an
 * investor or other, and the decision they are working through; Aaron replies by
 * hand. It shares the inquiries table so every lead sits in one record: `role` is
 * left empty, `audience` holds the selector, and `context` opens with "Decision:"
 * so these rows can be told apart from cohort applications.
 */
export async function submitConnect(formData: FormData): Promise<InquiryResult> {
  const honeypot = formData.get("no_fill");
  if (honeypot && String(honeypot).trim().length > 0) {
    console.warn(
      "[CONNECT] honeypot tripped — submission dropped:",
      JSON.stringify(Object.fromEntries(formData.entries())),
    );
    return { ok: true };
  }

  const data = {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    company: String(formData.get("company") ?? "").trim(),
    role: "",
    context: "",
    audience: String(formData.get("audience") ?? "").trim(),
  };
  const decision = String(formData.get("context") ?? "").trim();

  if (!data.name || !data.email || !data.company || !decision || !data.audience) {
    return { ok: false, error: "Please fill in every field." };
  }
  if (!AUDIENCES.has(data.audience)) {
    return { ok: false, error: "Please choose operator, investor or other." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return { ok: false, error: "That doesn't look like a valid email." };
  }
  if (decision.length > 2000) {
    return { ok: false, error: "Please keep your note under 2000 characters." };
  }
  data.context = `Decision: ${decision}`;

  const inquiryId = await persistInquiry(data);

  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const inquiryTo = process.env.INQUIRY_TO ?? "aaron@phrona.io";

  if (!smtpUser || !smtpPass) {
    console.error("[CONNECT] SMTP not configured. Submission:");
    console.error(JSON.stringify(data, null, 2));
    await markInquiryStatus(inquiryId, "smtp_unconfigured");
    if (process.env.NODE_ENV === "production") {
      return {
        ok: false,
        error: "Something went wrong. Please email hello@phrona.io directly.",
      };
    }
    return { ok: true };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: false,
    auth: { user: smtpUser, pass: smtpPass },
  });

  try {
    await transporter.sendMail({
      from: smtpUser,
      to: inquiryTo,
      replyTo: data.email,
      subject: `[Phrona connect] ${data.company} — ${data.name} (${data.audience})`,
      text: [
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        `Company: ${data.company}`,
        `They are: ${data.audience}`,
        "",
        "Decision they're working through:",
        decision,
        "",
        "Sent from phrona.io/connect. Reply to respond directly.",
      ].join("\n"),
    });
    await markInquiryStatus(inquiryId, "sent");
    return { ok: true };
  } catch (err) {
    console.error("[CONNECT] SMTP send failed:", err);
    await markInquiryStatus(inquiryId, "send_failed");
    return {
      ok: false,
      error: "Something went wrong. Please email hello@phrona.io directly.",
    };
  }
}

/**
 * Write the submission to the landing_inquiries table (Neon) before any
 * email attempt. Returns the row id, or null when the DB is unconfigured
 * or the write fails — persistence must never block the email path.
 */
async function persistInquiry(data: {
  name: string;
  email: string;
  company: string;
  role: string;
  context: string;
  audience: string;
}): Promise<number | null> {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.warn("[INQUIRY] DATABASE_URL not set — submission NOT persisted.");
    return null;
  }
  try {
    const sql = neon(dbUrl);
    const rows = await sql`
      INSERT INTO landing_inquiries (name, email, company, role, context, audience)
      VALUES (${data.name}, ${data.email}, ${data.company}, ${data.role}, ${data.context}, ${data.audience})
      RETURNING id
    `;
    return (rows[0]?.id as number) ?? null;
  } catch (err) {
    console.error("[INQUIRY] persistence failed:", err);
    return null;
  }
}

/** Record the delivery outcome on the persisted row (best-effort). */
async function markInquiryStatus(id: number | null, status: string): Promise<void> {
  const dbUrl = process.env.DATABASE_URL;
  if (id === null || !dbUrl) return;
  try {
    const sql = neon(dbUrl);
    await sql`UPDATE landing_inquiries SET email_status = ${status} WHERE id = ${id}`;
  } catch (err) {
    console.error("[INQUIRY] status update failed:", err);
  }
}

function autoReplyHtml(firstName: string): string {
  const safeName = escapeHtml(firstName);
  return emailShell(
    `${header()}
    <div style="padding:40px 40px 36px 40px;">
      <p style="margin:0 0 18px 0;font-size:16px;line-height:1.55;">Hi ${safeName},</p>
      <p style="margin:0 0 18px 0;font-size:16px;line-height:1.55;">Thanks for applying to join Phrona's founding beta.</p>
      <p style="margin:0 0 28px 0;font-size:16px;line-height:1.55;">We've received your note and will be in touch within 48 hours.</p>
      <p style="margin:0;font-size:16px;line-height:1.55;color:${NAVY};">&mdash; Phrona</p>
    </div>
    <div style="background:${SURFACE};padding:18px 40px;color:${SUBTLE};font-size:12px;line-height:1.5;">
      Phrona, Inc. &middot; <a href="https://phrona.io" style="color:${SUBTLE};text-decoration:underline;">phrona.io</a>
    </div>`,
  );
}

function notificationHtml(data: {
  name: string;
  email: string;
  company: string;
  role: string;
  context: string;
}): string {
  const name = escapeHtml(data.name);
  const email = escapeHtml(data.email);
  const company = escapeHtml(data.company);
  const role = escapeHtml(data.role);
  const context = escapeHtml(data.context);

  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 16px 6px 0;color:${MUTED};width:84px;vertical-align:top;">${label}</td><td style="padding:6px 0;color:${NAVY};font-weight:600;">${value}</td></tr>`;

  return emailShell(
    `${header("Founding-beta application")}
    <div style="padding:32px 40px 24px 40px;">
      <table cellpadding="0" cellspacing="0" border="0" style="width:100%;font-size:14px;line-height:1.55;border-collapse:collapse;">
        ${row("Name", name)}
        <tr><td style="padding:6px 16px 6px 0;color:${MUTED};vertical-align:top;">Email</td><td style="padding:6px 0;"><a href="mailto:${email}" style="color:${NAVY};font-weight:600;text-decoration:none;">${email}</a></td></tr>
        ${row("Company", company)}
        ${row("Role", role)}
      </table>
      <div style="margin-top:24px;padding-top:20px;border-top:1px solid ${RULE};">
        <div style="color:${MUTED};font-size:11px;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:10px;">What's prompting this</div>
        <div style="font-size:15px;line-height:1.6;color:${NAVY};white-space:pre-wrap;">${context}</div>
      </div>
      <div style="margin-top:24px;padding:14px 16px;background:${SURFACE};border-left:3px solid ${CYAN};font-size:13px;color:${MUTED};line-height:1.5;">
        Reply to this email to respond directly &mdash; replies route to <a href="mailto:${email}" style="color:${NAVY};text-decoration:none;">${email}</a>.
      </div>
    </div>`,
  );
}

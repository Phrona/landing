"use server";

import nodemailer from "nodemailer";

export type InquiryResult =
  | { ok: true }
  | { ok: false; error: string };

/**
 * Server action — handles founding-cohort inquiry form submissions.
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
  // Bots fill in every field; humans don't see this one.
  const honeypot = formData.get("company_url");
  if (honeypot && String(honeypot).trim().length > 0) {
    // Pretend success; silently drop.
    return { ok: true };
  }

  const data = {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    company: String(formData.get("company") ?? "").trim(),
    role: String(formData.get("role") ?? "").trim(),
    context: String(formData.get("context") ?? "").trim(),
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

  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  // Default to aaron@phrona.io directly. hello@phrona.io is an alias of aaron@,
  // and Gmail filters self-sends-via-alias out of Inbox.
  const inquiryTo = process.env.INQUIRY_TO ?? "aaron@phrona.io";

  // --- Dev fallback: no SMTP creds → log and return success ---
  if (!smtpUser || !smtpPass) {
    console.log("[INQUIRY] SMTP not configured. Submission logged:");
    console.log(JSON.stringify(data, null, 2));
    return { ok: true };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: false, // 587 uses STARTTLS
    auth: { user: smtpUser, pass: smtpPass },
  });

  const subject = `[Phrona inquiry] ${data.company} — ${data.name}`;
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
    "Thanks for inquiring about Phrona's founding cohort.",
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

    return { ok: true };
  } catch (err) {
    console.error("[INQUIRY] SMTP send failed:", err);
    return {
      ok: false,
      error: "Something went wrong sending your inquiry. Please try emailing hello@phrona.io directly.",
    };
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const NAVY = "#081122";
const CYAN = "rgb(120, 180, 255)";
const SURFACE = "#f4f5f7";
const RULE = "#e5e7eb";
const MUTED = "#6b7280";
const SUBTLE = "#9ca3af";
const FONT_STACK =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

function emailShell(inner: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light">
<title>Phrona</title>
</head>
<body style="margin:0;padding:0;background:${SURFACE};font-family:${FONT_STACK};color:${NAVY};-webkit-font-smoothing:antialiased;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;">
    ${inner}
  </div>
</body>
</html>`;
}

function header(eyebrow?: string): string {
  return `<div style="background:${NAVY};padding:32px 40px;">
    <img src="https://phrona.io/email-logo-phrona.png" width="140" height="55" alt="Phrona" style="display:block;border:0;outline:none;text-decoration:none;height:auto;line-height:100%;" />${
      eyebrow
        ? `<div style="color:#9aa3b3;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;margin-top:18px;">${escapeHtml(
            eyebrow,
          )}</div>`
        : ""
    }
  </div>`;
}

function autoReplyHtml(firstName: string): string {
  const safeName = escapeHtml(firstName);
  return emailShell(
    `${header()}
    <div style="padding:40px 40px 36px 40px;">
      <p style="margin:0 0 18px 0;font-size:16px;line-height:1.55;">Hi ${safeName},</p>
      <p style="margin:0 0 18px 0;font-size:16px;line-height:1.55;">Thanks for inquiring about Phrona's founding cohort.</p>
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
    `${header("Founding-cohort inquiry")}
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

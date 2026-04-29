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
  const inquiryTo = process.env.INQUIRY_TO ?? "hello@phrona.io";

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
  const body = [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Company: ${data.company}`,
    `Role: ${data.role}`,
    "",
    `What's prompting this:`,
    data.context,
  ].join("\n");

  try {
    // 1. Notification to Phrona inbox
    await transporter.sendMail({
      from: smtpUser,
      to: inquiryTo,
      replyTo: data.email,
      subject,
      text: body,
    });

    // 2. Auto-reply to applicant
    const firstName = data.name.split(/\s+/)[0] ?? data.name;
    await transporter.sendMail({
      from: smtpUser,
      to: data.email,
      subject: "Thanks for your interest in Phrona",
      text: [
        `Hi ${firstName},`,
        "",
        "Thanks for inquiring about Phrona's founding cohort.",
        "",
        "We've received your note and will be in touch within 48 hours.",
        "",
        "—",
        "Aaron Chockla",
        "Phrona",
        "hello@phrona.io",
      ].join("\n"),
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

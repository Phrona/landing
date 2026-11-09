/**
 * The shared pieces of the website's emails: the page shell, the navy header with
 * the Phrona mark, the colours, HTML escaping, and the Workspace SMTP transport.
 *
 * Every form on the site sends the same way (server action -> nodemailer over
 * Google Workspace SMTP, CLAUDE.md "Form backend"), so the look and the transport
 * live here once.
 */
import nodemailer from "nodemailer";

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export const NAVY = "#081122";
export const CYAN = "rgb(120, 180, 255)";
export const SURFACE = "#f4f5f7";
export const RULE = "#e5e7eb";
export const MUTED = "#6b7280";
export const SUBTLE = "#9ca3af";
const FONT_STACK =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

export function emailShell(inner: string): string {
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

export function emailHeader(eyebrow?: string): string {
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


/** Where Phrona's notifications land. hello@ is an alias of aaron@, and Gmail
 * filters self-sends through an alias out of the inbox, so aaron@ directly. */
export function notifyAddress(): string {
  return process.env.INQUIRY_TO ?? "aaron@phrona.io";
}

/** The Workspace SMTP transport and the login it sends as, or null when the
 * credentials are unset (development). */
export function mailTransport(): { transporter: nodemailer.Transporter; user: string } | null {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) return null;
  return {
    user,
    transporter: nodemailer.createTransport({
      host: process.env.SMTP_HOST ?? "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: false, // 587 uses STARTTLS
      auth: { user, pass },
    }),
  };
}

/** The grey strip that closes every email to someone outside Phrona. */
export function emailFooter(): string {
  return `<div style="background:${SURFACE};padding:18px 40px;color:${SUBTLE};font-size:12px;line-height:1.5;">
      Phrona, Inc. &middot; <a href="https://phrona.io" style="color:${SUBTLE};text-decoration:underline;">phrona.io</a>
    </div>`;
}

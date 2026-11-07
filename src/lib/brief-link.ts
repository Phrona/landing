import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import type { BriefSlug } from "@/lib/briefs";

/**
 * Signed download links for the decision briefs.
 *
 * A link is issued only after someone gives an email for the brief, and the
 * download route checks its signature without touching the database, so the
 * email gate holds even when the database is down. A valid link keeps working
 * when forwarded.
 *
 * Signed with BRIEF_LINK_SECRET (HMAC-SHA256). When the secret is missing no
 * link is issued and none is accepted: the gate never opens by default.
 */

type Payload = { b: BriefSlug; r: number | null; n: string };

function secret(): string | null {
  const s = process.env.BRIEF_LINK_SECRET;
  return s && s.length >= 32 ? s : null;
}

function sign(body: string, key: string): string {
  return createHmac("sha256", key).update(body).digest("base64url");
}

/** A random value that also identifies the request row the link belongs to. */
export function newNonce(): string {
  return randomBytes(12).toString("base64url");
}

export function linkSecretConfigured(): boolean {
  return secret() !== null;
}

/** Returns the `t` value for a download link, or null when links cannot be signed. */
export function issueBriefToken(brief: BriefSlug, requestId: number | null, nonce: string): string | null {
  const key = secret();
  if (!key) return null;
  const body = Buffer.from(JSON.stringify({ b: brief, r: requestId, n: nonce } satisfies Payload)).toString("base64url");
  return `${body}.${sign(body, key)}`;
}

export type TokenCheck =
  | { status: "valid"; requestId: number | null }
  | { status: "invalid" }
  | { status: "unavailable" };

/** Checks a `t` value against the brief being downloaded. */
export function verifyBriefToken(token: string | null, brief: BriefSlug): TokenCheck {
  const key = secret();
  if (!key) return { status: "unavailable" };
  if (!token) return { status: "invalid" };
  const [body, sig] = token.split(".");
  if (!body || !sig) return { status: "invalid" };
  const expected = Buffer.from(sign(body, key));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return { status: "invalid" };
  try {
    const p = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as Payload;
    if (p.b !== brief) return { status: "invalid" };
    return { status: "valid", requestId: typeof p.r === "number" ? p.r : null };
  } catch {
    return { status: "invalid" };
  }
}

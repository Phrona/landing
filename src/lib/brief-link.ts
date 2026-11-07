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
 *
 * Rotating the key: move the current value to BRIEF_LINK_SECRET_PREVIOUS and
 * set a new BRIEF_LINK_SECRET. New links use the new key; links already sent
 * keep working because the previous key is still accepted. Remove the previous
 * key only to revoke every link signed with it, for example after a leak.
 */

type Payload = { b: BriefSlug; r: number | null; n: string };

function usable(s: string | undefined): string | null {
  return s && s.length >= 32 ? s : null;
}

/** The key new links are signed with. */
function secret(): string | null {
  return usable(process.env.BRIEF_LINK_SECRET);
}

/** Every key a link may have been signed with: the current one, then the previous one. */
function acceptedSecrets(): string[] {
  return [secret(), usable(process.env.BRIEF_LINK_SECRET_PREVIOUS)].filter((k): k is string => k !== null);
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
  const keys = acceptedSecrets();
  if (!secret()) return { status: "unavailable" };
  if (!token) return { status: "invalid" };
  const [body, sig] = token.split(".");
  if (!body || !sig) return { status: "invalid" };
  const given = Buffer.from(sig);
  const signedByUs = keys.some((key) => {
    const expected = Buffer.from(sign(body, key));
    return expected.length === given.length && timingSafeEqual(expected, given);
  });
  if (!signedByUs) return { status: "invalid" };
  try {
    const p = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as Payload;
    if (p.b !== brief) return { status: "invalid" };
    return { status: "valid", requestId: typeof p.r === "number" ? p.r : null };
  } catch {
    return { status: "invalid" };
  }
}

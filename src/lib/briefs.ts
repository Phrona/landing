import { neon } from "@neondatabase/serverless";

/**
 * The decision briefs offered on /for-operators and /for-investors.
 *
 * The PDFs live in `private/briefs/`, outside `public/`, so they are reachable
 * only through `/download/[brief]` with a link issued when someone asks for the
 * brief by email. `next.config.ts` traces the folder into the download route.
 */
export const BRIEFS = {
  "operator-brief": {
    file: "phrona-operator-brief.pdf",
    downloadName: "Phrona-Operator-Brief.pdf",
    title: "the Phrona operator brief",
    page: "/for-operators",
    audience: "operators",
  },
  "investor-brief": {
    file: "phrona-investor-brief.pdf",
    downloadName: "Phrona-Investor-Brief.pdf",
    title: "the Phrona investor brief",
    page: "/for-investors",
    audience: "investors",
  },
} as const;

export type BriefSlug = keyof typeof BRIEFS;

export function isBriefSlug(value: string): value is BriefSlug {
  return Object.prototype.hasOwnProperty.call(BRIEFS, value);
}

let requestsReady = false;

function db() {
  const url = process.env.DATABASE_URL;
  return url ? neon(url) : null;
}

/**
 * Records a brief request and returns its id, or null when it could not be
 * stored. The token is what the download link carries.
 */
export async function recordBriefRequest(r: {
  token: string;
  email: string;
  brief: BriefSlug;
  wantsUpdates: boolean;
  source: string | null;
}): Promise<number | null> {
  const sql = db();
  if (!sql) {
    console.warn("[BRIEF] DATABASE_URL not set — request NOT persisted.");
    return null;
  }
  try {
    if (!requestsReady) {
      await sql`
        CREATE TABLE IF NOT EXISTS landing_brief_requests (
          id SERIAL PRIMARY KEY,
          token TEXT NOT NULL UNIQUE,
          email TEXT NOT NULL,
          brief TEXT NOT NULL,
          wants_updates BOOLEAN NOT NULL DEFAULT false,
          source TEXT,
          requested_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
      requestsReady = true;
    }
    const rows = (await sql`
      INSERT INTO landing_brief_requests (token, email, brief, wants_updates, source)
      VALUES (${r.token}, ${r.email.toLowerCase()}, ${r.brief}, ${r.wantsUpdates}, ${r.source})
      RETURNING id
    `) as { id: number }[];
    return rows[0]?.id ?? null;
  } catch (err) {
    console.error("[BRIEF] persistence failed:", err);
    return null;
  }
}

/**
 * What a download link resolves to:
 * - `valid`: the token was issued for this brief;
 * - `invalid`: the database answered and the token is not one of ours;
 * - `unchecked`: the database could not be reached. The route serves the file
 *   in that case, because a failed lookup must never cost a reader who asked
 *   for the brief their copy.
 */
export async function checkBriefToken(
  token: string | null,
  brief: BriefSlug,
): Promise<{ status: "valid"; requestId: number } | { status: "invalid" } | { status: "unchecked" }> {
  if (!token) return { status: "invalid" };
  const sql = db();
  if (!sql) return { status: "unchecked" };
  try {
    const rows = (await sql`
      SELECT id FROM landing_brief_requests WHERE token = ${token} AND brief = ${brief} LIMIT 1
    `) as { id: number }[];
    return rows[0] ? { status: "valid", requestId: rows[0].id } : { status: "invalid" };
  } catch (err) {
    console.error("[BRIEF] token lookup failed:", err);
    return { status: "unchecked" };
  }
}

let subscribersReady = false;

/**
 * Adds an address to the mailing list (`landing_subscribers`). Only called when
 * the reader ticked the opt-in box, which is never pre-ticked. Returns true when
 * the address is on the list, including when it already was.
 */
export async function addSubscriber(email: string, audience: string): Promise<boolean> {
  const sql = db();
  if (!sql) {
    console.warn("[SUBSCRIBE] DATABASE_URL not set — sign-up NOT persisted.");
    return false;
  }
  try {
    if (!subscribersReady) {
      await sql`
        CREATE TABLE IF NOT EXISTS landing_subscribers (
          id SERIAL PRIMARY KEY,
          email TEXT NOT NULL,
          audience TEXT NOT NULL,
          subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          UNIQUE (email, audience)
        )
      `;
      subscribersReady = true;
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

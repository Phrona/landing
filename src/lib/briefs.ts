import { neon } from "@neondatabase/serverless";

/**
 * The decision briefs offered on /for-operators and /for-investors.
 *
 * The PDFs live in `private/briefs/`, outside `public/`, so they are reachable
 * only through `/download/[brief]` with a signed link (`brief-link.ts`) issued
 * when someone asks for the brief by email. `next.config.ts` traces the folder into the download route.
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


function db() {
  const url = process.env.DATABASE_URL;
  return url ? neon(url) : null;
}

/**
 * Records a brief request and returns its id, or null when it could not be
 * stored. The nonce is the random part of the request's signed link.
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

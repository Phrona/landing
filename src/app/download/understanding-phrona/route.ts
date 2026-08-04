import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

/**
 * Download endpoint for the Understanding Phrona PDF.
 *
 * Exists so downloads are countable. Vercel Web Analytics can't see this —
 * a request for a static file isn't a page view, and custom events are a
 * Pro-plan feature — so the count is kept first-party in Neon instead.
 *
 * Attribution comes from `?from=` on either this link or the page that
 * linked here (same-origin navigations send the full referring URL, query
 * string included), so a per-recipient link works whether it points at the
 * page or straight at the download.
 *
 * No IP address and no cookie: country and city come from Vercel's edge
 * headers, which is enough to tell a forward apart from a repeat visit
 * without holding anything identifying.
 *
 * Logging is best-effort and never blocks the file — same posture as the
 * inquiry form, where a failed write must not cost you the lead.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ASSET = "understanding-phrona.pdf";
const FILE_PATH = "/understanding-phrona.pdf";

/**
 * Whether this instance has already ensured the table exists. The DDL runs
 * once per cold start rather than per request, and needs no manual Neon
 * setup — the table creates itself on the first download.
 */
let tableReady = false;

/** `?from=` on this request, else `?from=` on the page that linked here. */
function resolveSource(url: URL, referrer: string | null): string | null {
  const direct = url.searchParams.get("from");
  if (direct) return direct.slice(0, 120);
  if (!referrer) return null;
  try {
    return new URL(referrer).searchParams.get("from")?.slice(0, 120) ?? null;
  } catch {
    return null;
  }
}

export async function GET(request: Request): Promise<NextResponse> {
  const url = new URL(request.url);
  const referrer = request.headers.get("referer");

  try {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      console.warn("[DOWNLOAD] DATABASE_URL not set — download NOT logged.");
    } else {
      const sql = neon(dbUrl);
      if (!tableReady) {
        await sql`
          CREATE TABLE IF NOT EXISTS landing_downloads (
            id SERIAL PRIMARY KEY,
            asset TEXT NOT NULL,
            source TEXT,
            referrer TEXT,
            user_agent TEXT,
            country TEXT,
            city TEXT,
            downloaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
          )
        `;
        tableReady = true;
      }
      await sql`
        INSERT INTO landing_downloads
          (asset, source, referrer, user_agent, country, city)
        VALUES (
          ${ASSET},
          ${resolveSource(url, referrer)},
          ${referrer?.slice(0, 500) ?? null},
          ${request.headers.get("user-agent")?.slice(0, 500) ?? null},
          ${request.headers.get("x-vercel-ip-country")},
          ${request.headers.get("x-vercel-ip-city")}
        )
      `;
    }
  } catch (err) {
    console.error("[DOWNLOAD] logging failed:", err);
  }

  return NextResponse.redirect(new URL(FILE_PATH, url.origin), 307);
}

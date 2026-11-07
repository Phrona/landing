import { neon } from "@neondatabase/serverless";

/**
 * Records one download in Neon (`landing_downloads`).
 *
 * Downloads are counted first-party because Vercel Web Analytics cannot see
 * them: a request for a static file isn't a page view, and custom events are a
 * Pro-plan feature.
 *
 * Attribution comes from `?from=` on either the download link or the page that
 * linked to it (same-origin navigations send the full referring URL, query
 * string included), so a per-recipient link works whether it points at the
 * page or straight at the download.
 *
 * No IP address and no cookie: country and city come from Vercel's edge
 * headers, which is enough to tell a forward apart from a repeat visit
 * without holding anything identifying.
 *
 * Best-effort: a logging failure is reported and swallowed, because a failed
 * write must never cost the reader the file.
 */

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

/**
 * `source` overrides the `?from=` attribution, e.g. `request:42` for a brief
 * downloaded through the link issued for request 42.
 */
export async function logDownload(request: Request, asset: string, source?: string | null): Promise<void> {
  const url = new URL(request.url);
  const referrer = request.headers.get("referer");

  try {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      console.warn(`[DOWNLOAD] DATABASE_URL not set — ${asset} download NOT logged.`);
      return;
    }
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
        ${asset},
        ${source ?? resolveSource(url, referrer)},
        ${referrer?.slice(0, 500) ?? null},
        ${request.headers.get("user-agent")?.slice(0, 500) ?? null},
        ${request.headers.get("x-vercel-ip-country")},
        ${request.headers.get("x-vercel-ip-city")}
      )
    `;
  } catch (err) {
    console.error("[DOWNLOAD] logging failed:", err);
  }
}

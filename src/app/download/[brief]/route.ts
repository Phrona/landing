import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { verifyBriefToken } from "@/lib/brief-link";
import { BRIEFS, isBriefSlug } from "@/lib/briefs";
import { logDownload } from "@/lib/log-download";

/**
 * Download endpoint for the decision briefs on /for-operators and
 * /for-investors.
 *
 * A brief is served only with a signed link issued by "Email me the brief"
 * (`?t=`), checked without the database. Without a valid link the reader is
 * sent to the brief's page to ask for it. If the signing key is missing the
 * route returns an error rather than serving the file.
 *
 * Only the briefs listed in `BRIEFS` resolve; any other name is a 404, so this
 * route cannot be used to serve or log arbitrary paths.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ brief: string }> },
): Promise<NextResponse> {
  const { brief } = await params;
  if (!isBriefSlug(brief)) return new NextResponse("Not found", { status: 404 });
  const meta = BRIEFS[brief];

  const token = new URL(request.url).searchParams.get("t");
  const check = verifyBriefToken(token, brief);
  if (check.status === "unavailable") {
    console.error("[BRIEF] BRIEF_LINK_SECRET not set — download refused.");
    return new NextResponse(
      "The brief can't be downloaded right now. Please email hello@phrona.io and we'll send it.",
      { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } },
    );
  }
  if (check.status === "invalid") {
    return NextResponse.redirect(new URL(`${meta.page}#get-the-brief`, request.url), 307);
  }

  await logDownload(request, meta.file, `request:${check.requestId ?? "unrecorded"}`);

  const bytes = await readFile(path.join(process.cwd(), "private", "briefs", meta.file));
  return new NextResponse(new Uint8Array(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${meta.downloadName}"`,
      "Cache-Control": "private, no-store",
    },
  });
}

import { NextResponse } from "next/server";
import { logDownload } from "@/lib/log-download";

/**
 * Download endpoint for the decision briefs offered on /for-operators and
 * /for-investors. Counted the same way as the Understanding Phrona PDF.
 *
 * Only the briefs listed here resolve; any other name is a 404 rather than a
 * redirect, so this route cannot be used to log or serve arbitrary paths.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BRIEFS: Record<string, string> = {
  "operator-brief": "phrona-operator-brief.pdf",
  "investor-brief": "phrona-investor-brief.pdf",
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ brief: string }> },
): Promise<NextResponse> {
  const { brief } = await params;
  const file = BRIEFS[brief];
  if (!file) return new NextResponse("Not found", { status: 404 });

  await logDownload(request, file);
  return NextResponse.redirect(new URL(`/${file}`, request.url), 307);
}

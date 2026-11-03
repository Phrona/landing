import { NextResponse } from "next/server";
import { logDownload } from "@/lib/log-download";

/**
 * Download endpoint for the Understanding Phrona PDF. It exists so downloads
 * are countable; see `logDownload` for what is recorded and why.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<NextResponse> {
  await logDownload(request, "understanding-phrona.pdf");
  return NextResponse.redirect(new URL("/understanding-phrona.pdf", request.url), 307);
}

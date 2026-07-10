import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CONTENT_TYPES: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
};

/**
 * Serves user-uploaded images from public/uploads.
 * Next.js standalone only serves `public` files that exist at server start,
 * so runtime uploads must be streamed through this handler instead.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params;

  if (
    !segments ||
    segments.length === 0 ||
    segments.some(
      (segment) =>
        segment.includes("..") ||
        segment.includes("/") ||
        segment.includes("\\"),
    )
  ) {
    return new NextResponse("Not found", { status: 404 });
  }

  const baseDir = path.join(process.cwd(), "public", "uploads");
  const filePath = path.resolve(baseDir, segments.join("/"));

  if (!filePath.startsWith(baseDir)) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const data = await readFile(filePath);
    const ext = path.extname(filePath).slice(1).toLowerCase();
    const contentType = CONTENT_TYPES[ext] ?? "application/octet-stream";
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}

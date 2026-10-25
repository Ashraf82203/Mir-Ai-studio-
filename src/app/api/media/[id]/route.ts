import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { renders } from "@/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rows = await db.select().from(renders).where(eq(renders.id, id));
  const row = rows[0];
  if (!row) return NextResponse.json({ error: "not found" }, { status: 404 });
  const buf = Buffer.from(row.data, "base64");
  const headers: Record<string, string> = {
    "Content-Type": row.mime,
    "Accept-Ranges": "bytes",
    "Cache-Control": "public, max-age=31536000, immutable",
  };
  const range = req.headers.get("range");
  if (range) {
    const m = /bytes=(\d*)-(\d*)/.exec(range);
    const start = m && m[1] ? parseInt(m[1], 10) : 0;
    const end = m && m[2] ? parseInt(m[2], 10) : buf.length - 1;
    if (start >= buf.length) {
      return new NextResponse(null, { status: 416, headers: { ...headers, "Content-Range": `bytes */${buf.length}` } });
    }
    const slice = buf.subarray(start, Math.min(end, buf.length - 1) + 1);
    return new NextResponse(new Uint8Array(slice), {
      status: 206,
      headers: { ...headers, "Content-Range": `bytes ${start}-${start + slice.length - 1}/${buf.length}`, "Content-Length": String(slice.length) },
    });
  }
  return new NextResponse(new Uint8Array(buf), { status: 200, headers: { ...headers, "Content-Length": String(buf.length) } });
}

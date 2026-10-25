import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { renders } from "@/db/schema";

export const runtime = "nodejs";
export const maxDuration = 60;

// Upload a real rendered video (raw binary body, mime in Content-Type)
export async function POST(req: NextRequest) {
  try {
    const mime = req.headers.get("content-type") || "video/webm";
    const buf = Buffer.from(await req.arrayBuffer());
    if (buf.length === 0) return NextResponse.json({ error: "empty body" }, { status: 400 });
    if (buf.length > 60 * 1024 * 1024) return NextResponse.json({ error: "too large" }, { status: 413 });
    const id = crypto.randomUUID().replace(/-/g, "").slice(0, 20);
    const email = req.headers.get("x-mirai-email") || "demo@mirai.app";
    await db.insert(renders).values({ id, mime, data: buf.toString("base64"), size: buf.length, email });
    return NextResponse.json({ id, url: `/api/media/${id}`, mime, size: buf.length });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

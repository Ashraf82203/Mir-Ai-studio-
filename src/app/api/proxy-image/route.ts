import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const ALLOWED = ["images.pexels.com", "videos.pexels.com", "cdn.pixabay.com"];

// Same-origin image proxy so the canvas renderer never gets tainted by CORS
export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("url");
  if (!raw) return NextResponse.json({ error: "url required" }, { status: 400 });
  let target: URL;
  try { target = new URL(raw); } catch { return NextResponse.json({ error: "bad url" }, { status: 400 }); }
  if (!ALLOWED.includes(target.hostname)) return NextResponse.json({ error: "host not allowed" }, { status: 403 });
  try {
    const res = await fetch(target.toString(), { headers: { "User-Agent": "MirAI-Studio/1.0", Accept: "image/*" }, cache: "force-cache" });
    if (!res.ok) return NextResponse.json({ error: "upstream " + res.status }, { status: 502 });
    const buf = Buffer.from(await res.arrayBuffer());
    return new NextResponse(new Uint8Array(buf), {
      headers: {
        "Content-Type": res.headers.get("content-type") || "image/jpeg",
        "Cache-Control": "public, max-age=86400",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 502 });
  }
}

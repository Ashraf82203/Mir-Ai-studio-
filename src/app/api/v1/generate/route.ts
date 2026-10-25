import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { apiKeys, creditTx, projects, users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export const runtime = "nodejs";

// tiny in-memory rate limiter (per key, 60 req/min)
const hits = new Map<string, { n: number; reset: number }>();
function rateLimit(key: string) {
  const now = Date.now();
  const rec = hits.get(key);
  if (!rec || now > rec.reset) { hits.set(key, { n: 1, reset: now + 60_000 }); return { ok: true, remaining: 59 }; }
  rec.n += 1;
  return { ok: rec.n <= 60, remaining: Math.max(0, 60 - rec.n) };
}

const THUMBS = [
  "/images/hero-video.jpg", "/images/anime-scene.jpg", "/images/avatar-studio.jpg",
  "https://images.pexels.com/photos/31158869/pexels-photo-31158869.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
];

export async function POST(req: NextRequest) {
  const key = req.headers.get("x-api-key") || (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!key) return NextResponse.json({ error: "missing x-api-key header" }, { status: 401 });
  const keys = await db.select().from(apiKeys).where(eq(apiKeys.keyValue, key));
  const record = keys[0];
  if (!record) return NextResponse.json({ error: "invalid api key" }, { status: 403 });
  const rl = rateLimit(key);
  if (!rl.ok) return NextResponse.json({ error: "rate limit exceeded (60/min)" }, { status: 429 });

  let body: any = {};
  try { body = await req.json(); } catch { /* empty body */ }
  const prompt = String(body.prompt || "").trim();
  if (!prompt) return NextResponse.json({ error: "prompt is required" }, { status: 400 });

  const duration = Math.max(3, Math.min(Number(body.duration) || 10, 60));
  const resolution = ["480p", "720p", "1080p", "4K"].includes(body.resolution) ? body.resolution : "1080p";
  const cost = Math.round(duration * (resolution === "4K" ? 3 : resolution === "1080p" ? 2 : 1));
  const email = record.email;

  const userRows = await db.select().from(users).where(eq(users.email, email));
  const user = userRows[0];
  if (user && user.credits < cost) return NextResponse.json({ error: "insufficient credits", required: cost, balance: user.credits }, { status: 402 });

  const [project] = await db.insert(projects).values({
    title: String(body.title || prompt.slice(0, 46)),
    prompt,
    type: ["text-to-video", "image-to-video", "video-to-video", "avatar"].includes(body.type) ? body.type : "text-to-video",
    style: body.style || "Cinematic",
    duration, resolution,
    aspectRatio: ["9:16", "16:9", "1:1", "4:5"].includes(body.aspectRatio) ? body.aspectRatio : "16:9",
    status: "generating", progress: 8,
    thumbnail: THUMBS[Math.floor(Math.random() * THUMBS.length)],
    videoUrl: "https://videos.pexels.com/video-files/5849755/5849755-uhd_3840_2160_30fps.mp4",
    voice: body.voice || "Ayesha (Urdu Female)",
    language: body.language || "Urdu",
    subtitles: body.subtitles !== false,
    creditsUsed: cost,
    ownerEmail: email,
    seed: String(body.seed || Math.floor(Math.random() * 999999)),
    scenes: [
      { n: 1, title: "Hook", desc: prompt.slice(0, 70), dur: "0-3s" },
      { n: 2, title: "Story", desc: "AI visual storytelling + camera move", dur: "3-8s" },
      { n: 3, title: "CTA", desc: "Outro with subtitles", dur: "8-12s" },
    ],
  }).returning();

  if (user) {
    await db.update(users).set({ credits: sql`${users.credits} - ${cost}` }).where(eq(users.email, email));
    await db.insert(creditTx).values({ email, label: `API generate: ${project.title}`.slice(0, 80), amount: -cost, type: "usage" });
  }

  return NextResponse.json({
    id: project.id,
    status: project.status,
    title: project.title,
    credits_used: cost,
    render_url: `/api/v1/projects/${project.id}`,
    project,
  }, { status: 201, headers: { "X-RateLimit-Remaining": String(rl.remaining) } });
}

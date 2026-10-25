import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { apiKeys, projects } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const key = req.headers.get("x-api-key") || (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!key) return NextResponse.json({ error: "missing x-api-key header" }, { status: 401 });
  const known = (await db.select().from(apiKeys).where(eq(apiKeys.keyValue, key)))[0];
  if (!known) return NextResponse.json({ error: "invalid api key" }, { status: 403 });
  const { id } = await params;
  const [project] = await db.select().from(projects).where(eq(projects.id, Number(id)));
  if (!project) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({
    id: project.id, status: project.status, progress: project.progress,
    video_url: project.videoUrl, thumbnail: project.thumbnail,
    duration: project.duration, resolution: project.resolution, aspect_ratio: project.aspectRatio,
    style: project.style, title: project.title, credits_used: project.creditsUsed,
  });
}

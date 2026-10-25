import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { projectVersions, projects } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const projectId = Number(req.nextUrl.searchParams.get("projectId") || 0);
  const rows = projectId
    ? await db.select().from(projectVersions).where(eq(projectVersions.projectId, projectId)).orderBy(desc(projectVersions.createdAt)).limit(25)
    : await db.select().from(projectVersions).orderBy(desc(projectVersions.createdAt)).limit(40);
  return NextResponse.json({ versions: rows });
}

/** Restore a snapshot into the live project. */
export async function POST(req: NextRequest) {
  const b = await req.json();
  if (!b.versionId) return NextResponse.json({ error: "versionId required" }, { status: 400 });
  const [v] = await db.select().from(projectVersions).where(eq(projectVersions.id, Number(b.versionId)));
  if (!v || !v.snapshot) return NextResponse.json({ error: "version not found" }, { status: 404 });
  const snap: any = v.snapshot;
  const [row] = await db.update(projects).set({
    title: snap.title, prompt: snap.prompt, style: snap.style, status: snap.status,
    videoUrl: snap.videoUrl, thumbnail: snap.thumbnail, duration: snap.duration,
    resolution: snap.resolution, aspectRatio: snap.aspectRatio,
  }).where(eq(projects.id, v.projectId)).returning();
  return NextResponse.json({ project: row, note: v.note });
}

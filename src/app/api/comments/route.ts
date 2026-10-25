import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { comments } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const projectId = Number(req.nextUrl.searchParams.get("projectId") || 0);
  const rows = projectId
    ? await db.select().from(comments).where(eq(comments.projectId, projectId)).orderBy(desc(comments.createdAt))
    : await db.select().from(comments).orderBy(desc(comments.createdAt)).limit(60);
  return NextResponse.json({ comments: rows });
}

export async function POST(req: NextRequest) {
  const b = await req.json();
  if (!b.projectId || !String(b.body || "").trim()) return NextResponse.json({ error: "projectId & body required" }, { status: 400 });
  const [row] = await db.insert(comments).values({
    projectId: Number(b.projectId),
    author: b.author || "Demo Creator",
    body: String(b.body).slice(0, 800),
    timecode: b.timecode || "",
  }).returning();
  return NextResponse.json({ comment: row });
}

export async function PATCH(req: NextRequest) {
  const b = await req.json();
  if (!b.id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const [row] = await db.update(comments).set({ resolved: !!b.resolved }).where(eq(comments.id, Number(b.id))).returning();
  return NextResponse.json({ comment: row });
}

export async function DELETE(req: NextRequest) {
  const id = Number(req.nextUrl.searchParams.get("id") || 0);
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await db.delete(comments).where(and(eq(comments.id, id)));
  return NextResponse.json({ ok: true });
}

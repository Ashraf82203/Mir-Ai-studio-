import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { projects, projectVersions, webhooks } from "@/db/schema";
import { eq } from "drizzle-orm";
export async function PATCH(req:NextRequest,{params}:{params:Promise<{id:string}>}){
  const {id}=await params; const b=await req.json();
  const allowed:any={}; ["title","isFavorite","folder","status","prompt","style","videoUrl","thumbnail","progress","duration","resolution","aspectRatio","tags","deleted"].forEach(k=>{ if(b[k]!==undefined) allowed[k]=b[k]; });
  if(b.restore){ allowed.deleted=false; }
  if(b.trash){ allowed.deleted=true; }

  const existing=await db.select().from(projects).where(eq(projects.id,Number(id)));
  const before=existing[0];
  if(before){
    // keep a real version snapshot on meaningful edits
    const meaningful=["title","prompt","style","videoUrl","status","thumbnail","duration","resolution","aspectRatio"].some(k=>b[k]!==undefined && b[k]!==(before as any)[k]);
    if(meaningful){
      await db.insert(projectVersions).values({
        projectId: before.id, title: before.title, status: before.status, videoUrl: before.videoUrl,
        snapshot: before, note: b.note || (b.videoUrl && !before.videoUrl ? "First render" : "Auto-save"),
      });
    }
  }
  const [u]=await db.update(projects).set(allowed).where(eq(projects.id,Number(id))).returning();
  // fire real webhooks on render completion
  if(u && b.status==="completed" && b.videoUrl){
    try{
      const hooks=await db.select().from(webhooks).where(eq(webhooks.active,true));
      await Promise.allSettled(hooks.filter(h=>h.event==="render.completed").map(h=>fetch(h.url,{
        method:"POST",headers:{"Content-Type":"application/json","X-MirAI-Event":"render.completed"},
        body:JSON.stringify({event:"render.completed",project:{id:u.id,title:u.title,video_url:u.videoUrl,resolution:u.resolution,duration:u.duration},delivered_at:new Date().toISOString()}),
        signal:AbortSignal.timeout(4000),
      })));
    }catch{}
  }
  return NextResponse.json({project:u});
}
export async function DELETE(req:NextRequest,{params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  if(req.nextUrl.searchParams.get("hard")==="1"){ await db.delete(projects).where(eq(projects.id,Number(id))); return NextResponse.json({ok:true,hard:true}); }
  const [u]=await db.update(projects).set({deleted:true}).where(eq(projects.id,Number(id))).returning();
  return NextResponse.json({ok:true,project:u,trashed:true});
}

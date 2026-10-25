import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { projects, users, creditTx } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";

const THUMBS = [
  "https://images.pexels.com/photos/31158869/pexels-photo-31158869.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  "https://images.pexels.com/photos/30878454/pexels-photo-30878454.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  "https://images.pexels.com/photos/8041226/pexels-photo-8041226.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  "https://images.pexels.com/photos/23384400/pexels-photo-23384400.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  "/images/hero-video.jpg","/images/anime-scene.jpg","/images/avatar-studio.jpg",
  "https://images.pexels.com/videos/5849755/2020-aerial-andalusia-beach-5849755.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
];
const VIDEOS = [
  "https://videos.pexels.com/video-files/5849755/5849755-uhd_3840_2160_30fps.mp4",
  "https://videos.pexels.com/video-files/33272152/14173994_1920_1080_24fps.mp4",
  "https://videos.pexels.com/video-files/28805527/12482396_1920_1080_24fps.mp4",
  "https://videos.pexels.com/video-files/40143395/17145771_3360_1440_24fps.mp4",
];

async function ensureDemo(){
  const existing = await db.select().from(users).where(eq(users.email,"demo@mirai.app"));
  if(existing.length===0){
    await db.insert(users).values({name:"Demo Creator",email:"demo@mirai.app",plan:"Pro",credits:1240});
    const seeds=[
      {title:"Karachi Sunset Drone Film",prompt:"Aerial drone flying over Karachi coastline at golden sunset, cinematic",type:"text-to-video",style:"Cinematic",duration:15,aspectRatio:"16:9",resolution:"1080p",status:"completed",progress:100,thumbnail:THUMBS[7],videoUrl:VIDEOS[0],creditsUsed:25,folder:"YouTube"},
      {title:"Urdu Product Ad — Chai Launch",prompt:"Steam rising from karak chai cup, cozy Lahore cafe, Urdu voiceover ad",type:"avatar",style:"Realistic",duration:30,aspectRatio:"9:16",resolution:"1080p",status:"completed",progress:100,thumbnail:THUMBS[4],videoUrl:VIDEOS[1],creditsUsed:40,folder:"Ads"},
      {title:"Anime Hero Short",prompt:"Anime hero overlooking futuristic city, epic adventure begins",type:"text-to-video",style:"Anime",duration:10,aspectRatio:"9:16",resolution:"720p",status:"completed",progress:100,thumbnail:THUMBS[5],videoUrl:VIDEOS[2],creditsUsed:18,folder:"Shorts"},
      {title:"AI Avatar News Report",prompt:"AI presenter announcing tech news in Urdu and English",type:"avatar",style:"Realistic",duration:60,aspectRatio:"16:9",resolution:"1080p",status:"completed",progress:100,thumbnail:THUMBS[6],videoUrl:VIDEOS[3],creditsUsed:55,folder:"YouTube"},
    ];
    for(const s of seeds) await db.insert(projects).values(s as any);
    await db.insert(creditTx).values([
      {email:"demo@mirai.app",label:"Welcome bonus credits",amount:200,type:"bonus"},
      {email:"demo@mirai.app",label:"Pro plan monthly credits",amount:1000,type:"purchase"},
      {email:"demo@mirai.app",label:"Generated: Karachi Sunset Drone Film",amount:-25,type:"usage"},
    ]);
  }
}

export async function GET(req: NextRequest){
  try{
    await ensureDemo();
    const email = req.nextUrl.searchParams.get("email")||"demo@mirai.app";
    const list = await db.select().from(projects).orderBy(desc(projects.createdAt));
    // simulate progress
    const now = Date.now();
    const mapped = list.map((p:any)=>{
      if(p.status==="generating" && p.createdAt){
        const elapsed = (now - new Date(p.createdAt).getTime())/1000;
        const prog = Math.min(100, Math.floor(8 + elapsed*14));
        return {...p, progress: prog, status: prog>=100?"completed":p.status};
      }
      return p;
    });
    // persist completed
    for(const m of mapped as any[]){ if(m.status==="completed" && list.find((x:any)=>x.id===m.id)?.status==="generating"){ await db.update(projects).set({status:"completed",progress:100}).where(eq(projects.id,m.id)); } }
    const userRows = await db.select().from(users).where(eq(users.email,email));
    const tx = await db.select().from(creditTx).orderBy(desc(creditTx.createdAt)).limit(20);
    return NextResponse.json({projects:mapped, user:userRows[0]||null, transactions:tx});
  }catch(e:any){ return NextResponse.json({error:e.message,projects:[],user:null,transactions:[]},{status:200}); }
}

export async function POST(req: NextRequest){
  try{
    await ensureDemo();
    const b = await req.json();
    const creditsCost = Math.max(8, Math.round((b.duration||10)*(b.resolution==="4K"?3:b.resolution==="1080p"?2:1)));
    const thumb = b.thumbnail || THUMBS[Math.floor(Math.random()*THUMBS.length)];
    const videoUrl = VIDEOS[Math.floor(Math.random()*VIDEOS.length)];
    const scenes = b.scenes || [
      {n:1,title:"Hook / Opening",desc:b.prompt?.slice(0,80)||"Opening scene",dur:"0-3s"},
      {n:2,title:"Main Story",desc:"AI visual storytelling with camera movement",dur:"3-8s"},
      {n:3,title:"Climax",desc:"High impact visual + music swell",dur:"8-12s"},
      {n:4,title:"CTA / Outro",desc:"Brand outro with subtitles & logo",dur:"12-15s"},
    ];
    const [created] = await db.insert(projects).values({
      title: b.title|| (b.prompt? b.prompt.slice(0,42):"Untitled Video"),
      prompt:b.prompt||"", type:b.type||"text-to-video", style:b.style||"Cinematic", duration:b.duration||10,
      aspectRatio:b.aspectRatio||"16:9", resolution:b.resolution||"1080p", status:"generating", progress:8,
      thumbnail:thumb, videoUrl, voice:b.voice||"Ayesha (Urdu Female)", language:b.language||"English",
      avatar:b.avatar||"", creditsUsed:creditsCost, folder:b.folder||"All Projects", ownerEmail:b.email||"demo@mirai.app",
      scenes, subtitles: b.subtitles!==false, seed: b.seed|| String(Math.floor(Math.random()*999999)),
    }).returning();
    // deduct credits
    await db.update(users).set({credits: sql`${users.credits} - ${creditsCost}`}).where(eq(users.email, b.email||"demo@mirai.app"));
    await db.insert(creditTx).values({email:b.email||"demo@mirai.app",label:`Generated: ${created.title}`,amount:-creditsCost,type:"usage"});
    return NextResponse.json({project:created, creditsUsed:creditsCost});
  }catch(e:any){ return NextResponse.json({error:e.message},{status:500}); }
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, creditTx, apiKeys, teamMembers, brandKits, projects, webhooks, tickets, renders } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";

const REFERRALS: Record<string,number> = {};
const lastBonus = new Map<string,string>();

export async function GET(req:NextRequest){
  const kind=req.nextUrl.searchParams.get("kind");
  if(kind==="webhooks"){ const w=await db.select().from(webhooks).orderBy(desc(webhooks.createdAt)); return NextResponse.json({webhooks:w}); }
  if(kind==="tickets"){ const t=await db.select().from(tickets).orderBy(desc(tickets.createdAt)); return NextResponse.json({tickets:t}); }
  if(kind==="storage"){
    const r=await db.select().from(renders);
    const bytes=r.reduce((s,x:any)=>s+(x.size||0),0);
    return NextResponse.json({files:r.length,bytes,usedMb:+(bytes/1048576).toFixed(2)});
  }
  if(kind==="keys"){ const k=await db.select().from(apiKeys).orderBy(desc(apiKeys.createdAt)); return NextResponse.json({keys:k}); }
  if(kind==="team"){ const t=await db.select().from(teamMembers).orderBy(desc(teamMembers.createdAt)); return NextResponse.json({team:t}); }
  if(kind==="brand"){ const b=await db.select().from(brandKits); return NextResponse.json({brand:b[0]||null}); }
  const u=await db.select().from(users);
  const p=await db.select().from(projects);
  return NextResponse.json({stats:{users:u.length, projects:p.length, completed:p.filter((x:any)=>x.status==="completed").length, credits:u[0]?.credits||0, plan:u[0]?.plan||"Free"}});
}
export async function POST(req:NextRequest){
  const b=await req.json();
  if(b.action==="buyCredits"){
    const credits=b.credits||500; await db.update(users).set({credits: sql`${users.credits} + ${credits}`, plan:b.plan||"Pro"}).where(eq(users.email,b.email||"demo@mirai.app"));
    await db.insert(creditTx).values({email:b.email||"demo@mirai.app",label:`Purchased ${credits} credits via ${b.method||"Stripe"} — ${b.plan||""} plan`,amount:credits,type:"purchase"});
    const [u]=await db.select().from(users).where(eq(users.email,b.email||"demo@mirai.app")); return NextResponse.json({user:u});
  }
  if(b.action==="createKey"){
    const key="mirai_"+Math.random().toString(36).slice(2,10)+"_"+Math.random().toString(36).slice(2,14);
    const [k]=await db.insert(apiKeys).values({name:b.name||"Production API",keyValue:key,email:b.email||"demo@mirai.app"}).returning(); return NextResponse.json({key:k});
  }
  if(b.action==="deleteKey"){ await db.delete(apiKeys).where(eq(apiKeys.id,b.id)); return NextResponse.json({ok:true}); }
  if(b.action==="invite"){ const [m]=await db.insert(teamMembers).values({name:b.name,email:b.email,role:b.role||"Editor"}).returning(); return NextResponse.json({member:m}); }
  if(b.action==="deleteMember"){ await db.delete(teamMembers).where(eq(teamMembers.id,b.id)); return NextResponse.json({ok:true}); }
  if(b.action==="brand"){
    const existing=await db.select().from(brandKits);
    if(existing.length) { const [u]=await db.update(brandKits).set({brandName:b.brandName,primaryColor:b.primaryColor,font:b.font,watermark:b.watermark}).where(eq(brandKits.id,existing[0].id)).returning(); return NextResponse.json({brand:u}); }
    const [c]=await db.insert(brandKits).values({brandName:b.brandName,primaryColor:b.primaryColor,font:b.font,watermark:b.watermark,email:b.email||"demo@mirai.app"}).returning(); return NextResponse.json({brand:c});
  }
  if(b.action==="dailyBonus"){
    const email=b.email||"demo@mirai.app"; const today=new Date().toISOString().slice(0,10);
    if(lastBonus.get(email)===today) return NextResponse.json({claimed:false,message:"Aaj ka bonus already claim ho chuka hai. Kal wapas aayein!"});
    lastBonus.set(email,today);
    await db.update(users).set({credits:sql`${users.credits} + 10`}).where(eq(users.email,email));
    await db.insert(creditTx).values({email,label:"Daily login bonus",amount:10,type:"bonus"});
    const [u]=await db.select().from(users).where(eq(users.email,email));
    return NextResponse.json({claimed:true,user:u,message:"+10 free credits claimed!"});
  }
  if(b.action==="refer"){
    const email=b.email||"demo@mirai.app"; const code=b.code||"";
    const valid=/^MIRAI-[A-Z0-9]{4,8}$/.test(String(code).toUpperCase());
    if(!valid) return NextResponse.json({ok:false,message:"Invalid code. Format: MIRAI-XXXX"});
    if(REFERRALS[email]===code) return NextResponse.json({ok:false,message:"Ye code already use ho chuka hai"});
    REFERRALS[email]=code;
    await db.update(users).set({credits:sql`${users.credits} + 50`}).where(eq(users.email,email));
    await db.insert(creditTx).values({email,label:`Referral bonus (${code.toUpperCase()})`,amount:50,type:"bonus"});
    const [u]=await db.select().from(users).where(eq(users.email,email));
    return NextResponse.json({ok:true,user:u,message:"+50 referral credits added!"});
  }
  if(b.action==="addWebhook"){
    if(!/^https?:\/\//.test(b.url||"")) return NextResponse.json({error:"Valid https URL chahiye"},{status:400});
    const [w]=await db.insert(webhooks).values({url:b.url,event:b.event||"render.completed",email:b.email||"demo@mirai.app"}).returning();
    return NextResponse.json({webhook:w});
  }
  if(b.action==="deleteWebhook"){ await db.delete(webhooks).where(eq(webhooks.id,b.id)); return NextResponse.json({ok:true}); }
  if(b.action==="createTicket"){
    if(!b.subject||!b.message) return NextResponse.json({error:"subject & message required"},{status:400});
    const [t]=await db.insert(tickets).values({subject:b.subject,message:b.message,email:b.email||"demo@mirai.app"}).returning();
    return NextResponse.json({ticket:t});
  }
  if(b.action==="signup"){
    const existing=await db.select().from(users).where(eq(users.email,b.email));
    if(existing.length) return NextResponse.json({user:existing[0]});
    const [u]=await db.insert(users).values({name:b.name,email:b.email,plan:"Free",credits:120}).returning();
    await db.insert(creditTx).values({email:b.email,label:"Welcome bonus — 120 free credits",amount:120,type:"bonus"});
    return NextResponse.json({user:u});
  }
  return NextResponse.json({ok:true});
}

"use client";
import { useEffect, useState } from "react";
import {
  Home, Sparkles, Clapperboard, LayoutTemplate, Mic, Captions, ImagePlus, FolderOpen,
  Palette, Users, Coins, Code2, BarChart3, Search, Sun, Moon, Play, Heart, Trash2, Copy,
  Download, Share2, Scissors, Wand2, FileText, Lightbulb, Plus, Undo2, Redo2, Film, Music,
  X, Zap, CheckCircle2, Loader2, KeyRound, Send, Tv, Upload, Square, Globe2,
  ChevronRight, CreditCard, ShieldCheck, Activity, Clock, TrendingUp, Video, Star, Layers,
  Repeat, Camera, Languages, Rocket, Smartphone, MessageSquare, History, Gift, RotateCcw, Ticket,
} from "lucide-react";
import { STYLES, VOICES, AVATARS, TEMPLATES, TEMPLATE_CATS, STOCK, PLANS } from "@/lib/data";
import RenderStudio from "@/components/RenderStudio";
import CheckoutModal from "@/components/CheckoutModal";
import LaunchChecklist from "@/components/LaunchChecklist";
import ImageLab from "@/components/ImageLab";
import ProjectWorkspace from "@/components/ProjectWorkspace";
import CommandPalette, { Onboarding } from "@/components/CommandPalette";

type Proj = any;
const NAV = [
  { id: "dashboard", icon: Home, label: "Dashboard" },
  { id: "create", icon: Sparkles, label: "Create AI Video" },
  { id: "editor", icon: Clapperboard, label: "Timeline Editor" },
  { id: "templates", icon: LayoutTemplate, label: "Templates" },
  { id: "voice", icon: Mic, label: "AI Voice & Audio" },
  { id: "subtitles", icon: Captions, label: "Subtitles & Captions" },
  { id: "seo", icon: ImagePlus, label: "Thumbnail & SEO" },
  { id: "assets", icon: Layers, label: "Asset Library" },
  { id: "projects", icon: FolderOpen, label: "My Projects" },
  { id: "brand", icon: Palette, label: "Brand Kit" },
  { id: "team", icon: Users, label: "Team Collaboration" },
  { id: "pricing", icon: Coins, label: "Pricing & Credits" },
  { id: "api", icon: Code2, label: "API & Developers" },
  { id: "admin", icon: BarChart3, label: "Analytics / Admin" },
  { id: "mobile", icon: Smartphone, label: "Mobile App" },
];
const PROMPT_IDEAS = [
  "Karachi coastline at golden sunset, drone flyover…",
  "Lahore food street at night, steam & neon lights…",
  "Anime hero overlooking futuristic city at dusk…",
  "Urdu product ad — karak chai, cozy cafe vibe…",
];

export default function Home_() {
  const [view, setView] = useState("dashboard");
  const [projects, setProjects] = useState<Proj[]>([]);
  const [user, setUser] = useState<any>(null);
  const [tx, setTx] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [playing, setPlaying] = useState<Proj | null>(null);
  const [toast, setToast] = useState("");
  const [authOpen, setAuthOpen] = useState(false);
  const [dark, setDark] = useState(true);
  const [ideaIdx, setIdeaIdx] = useState(0);
  const [quickPrompt, setQuickPrompt] = useState("");

  // create form
  const [mode, setMode] = useState("text-to-video");
  const [prompt, setPrompt] = useState("Aerial drone over Karachi coastline at sunset, waves crashing, cinematic");
  const [title, setTitle] = useState("");
  const [style, setStyle] = useState("Cinematic");
  const [duration, setDuration] = useState(15);
  const [ratio, setRatio] = useState("16:9");
  const [res, setRes] = useState("1080p");
  const [seed, setSeed] = useState("482910");
  const [variations, setVariations] = useState(2);
  const [voice, setVoice] = useState(VOICES[0].name);
  const [language, setLanguage] = useState("Urdu");
  const [avatar, setAvatar] = useState(AVATARS[0].name);
  const [emotion, setEmotion] = useState("Excited");
  const [speed, setSpeed] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [subs, setSubs] = useState(true);
  const [motion, setMotion] = useState("Dolly In");
  const [generating, setGenerating] = useState(false);
  const [scriptResult, setScriptResult] = useState("");
  const [scenes, setScenes] = useState<any[]>([]);
  const [renderProject, setRenderProject] = useState<Proj | null>(null);
  const [checkoutItem, setCheckoutItem] = useState<{ name: string; price: number; credits: number; isPlan?: boolean } | null>(null);
  const [launchModal, setLaunchModal] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [onboarding, setOnboarding] = useState(false);
  const [labOpen, setLabOpen] = useState(false);
  const [labProject, setLabProject] = useState<Proj | null>(null);
  const [workspace, setWorkspace] = useState<Proj | null>(null);
  const [hooks, setHooks] = useState<any[]>([]);
  const [hookUrl, setHookUrl] = useState("");
  const [apiTest, setApiTest] = useState("");
  const [testing, setTesting] = useState(false);
  const [referral, setReferral] = useState("");
  const [support, setSupport] = useState({ subject: "", message: "" });
  const [storage, setStorage] = useState<any>(null);

  // editor
  const [clips, setClips] = useState([
    { name: "Scene 1 — Hook", dur: 4, color: "#f59e0b" },
    { name: "Scene 2 — Demo", dur: 6, color: "#14b8a6" },
    { name: "Scene 3 — CTA", dur: 5, color: "#6366f1" },
  ]);
  const [selectedClip, setSelectedClip] = useState(0);
  const [filter, setFilter] = useState("none");
  const [brightness, setBrightness] = useState(100);
  const [playhead, setPlayhead] = useState(22);
  const [overlayText, setOverlayText] = useState("Viral Hook Text");
  const [transition, setTransition] = useState("Fade");
  const [clipSpeed, setClipSpeed] = useState(1);

  // voice
  const [voiceText, setVoiceText] = useState("Assalam-o-Alaikum! Mir AI mein khush amdeed. Aaj hum AI video banana seekhenge.");
  const [isSpeaking, setIsSpeaking] = useState(false);
  // subtitles / seo
  const [subTopic, setSubTopic] = useState("AI video kaise banaye");
  const [subResult, setSubResult] = useState(""); const [srt, setSrt] = useState("");
  const [seoTopic, setSeoTopic] = useState("AI Video Kaise Banaye Urdu Mein");
  const [seoData, setSeoData] = useState<any>(null);
  // projects
  const [folder, setFolder] = useState("All");
  const [projSearch, setProjSearch] = useState("");
  const [tplCat, setTplCat] = useState("All");
  const [tplSearch, setTplSearch] = useState("");
  const [payMethod, setPayMethod] = useState("JazzCash");
  // api / team / brand
  const [keys, setKeys] = useState<any[]>([]); const [team, setTeam] = useState<any[]>([]);
  const [brand, setBrand] = useState({ brandName: "My Brand", primaryColor: "#F59E0B", font: "Space Grotesk", watermark: "@mybrand" });
  const [invite, setInvite] = useState({ name: "", email: "", role: "Editor" });
  const [keyName, setKeyName] = useState("Production API");

  const email = typeof window !== "undefined"
    ? (localStorage.getItem("mirai_email") || localStorage.getItem("vidai_email") || "demo@mirai.app")
    : "demo@mirai.app";

  async function load() {
    const r = await fetch(`/api/projects?email=${encodeURIComponent(email)}`); const d = await r.json();
    setProjects(d.projects || []); if (d.user) setUser(d.user); setTx(d.transactions || []);
    const k = await fetch(`/api/misc?kind=keys`); setKeys((await k.json()).keys || []);
    const t = await fetch(`/api/misc?kind=team`); setTeam((await t.json()).team || []);
    const b = await fetch(`/api/misc?kind=brand`); const bd = await b.json(); if (bd.brand) setBrand(bd.brand);
    const h = await fetch(`/api/misc?kind=webhooks`); setHooks((await h.json()).webhooks || []);
    const st = await fetch(`/api/misc?kind=storage`); setStorage(await st.json());
  }
  useEffect(() => {
    load();
    const i = setInterval(() => {
      fetch(`/api/projects?email=${encodeURIComponent(email)}`).then(r => r.json()).then(d => { setProjects(d.projects || []); if (d.user) setUser(d.user); });
    }, 4000);
    const ideaTimer = setInterval(() => setIdeaIdx(x => (x + 1) % PROMPT_IDEAS.length), 3500);
    if (!localStorage.getItem("mirai_onboarded") && !localStorage.getItem("vidai_onboarded")) setOnboarding(true);
    return () => { clearInterval(i); clearInterval(ideaTimer); };
  }, []);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [view]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const typing = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setPaletteOpen(v => !v); return; }
      if (typing) return;
      if (e.key === "?") { e.preventDefault(); setPaletteOpen(true); }
      if (e.key.toLowerCase() === "n") { setView("create"); }
      if (e.key.toLowerCase() === "r") { const p = projects[0]; if (p) setRenderProject(p); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [projects]);

  function notify(m: string) { setToast(m); setTimeout(() => setToast(""), 3500); }
  function go(id: string) { if (id === "mobile") { window.location.href = "/mobile-preview"; return; } setView(id); }
  async function ai(action: string, text: string) {
    const r = await fetch("/api/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, text, prompt: text, language }) });
    return r.json();
  }
  async function enhance() { const d = await ai("enhance", prompt); setPrompt(d.result); notify("Prompt enhanced by AI"); }
  async function genScript() { const d = await ai("script", prompt || title || "AI Video"); setScriptResult(d.result); setScenes(d.scenes || []); notify("Script & storyboard generated"); }
  async function generate() {
    if (!prompt.trim()) return notify("Prompt likhein pehle");
    setGenerating(true);
    const cost = Math.round(duration * (res === "4K" ? 3 : res === "1080p" ? 2 : 1));
    if (user && user.credits < cost) { notify(`Credits kam hain! Chahiye ${cost}, hain ${user.credits}. Pricing se buy karein.`); setView("pricing"); setGenerating(false); return; }
    const r = await fetch("/api/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: title || undefined, prompt, type: mode, style, duration, aspectRatio: ratio, resolution: res, voice, language, avatar: mode === "avatar" ? avatar : "", seed, subtitles: subs, email, scenes: scenes.length ? scenes : undefined }) });
    const d = await r.json(); setGenerating(false);
    if (d.project) { notify(`Project banaya — ${d.creditsUsed} credits used. Ab real video render karein!`); await load(); setRenderProject(d.project); }
    else notify("Error: " + (d.error || "failed"));
  }
  async function patchProj(id: number, body: any) { await fetch(`/api/projects/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); load(); }
  async function deleteProj(id: number) { if (!confirm("Move to trash? (restore possible)")) return; await fetch(`/api/projects/${id}`, { method: "DELETE" }); notify("Project trash mein chala gaya"); load(); }
  async function restoreProj(id: number) { await fetch(`/api/projects/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ restore: true }) }); notify("Project restore ho gaya"); load(); }
  async function purgeProj(id: number) { if (!confirm("Permanently delete? Ye undo nahi hoga.")) return; await fetch(`/api/projects/${id}?hard=1`, { method: "DELETE" }); notify("Permanently deleted"); load(); }
  async function duplicateProj(p: Proj) { await fetch("/api/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: p.title + " (Copy)", prompt: p.prompt, type: p.type, style: p.style, duration: p.duration, aspectRatio: p.aspectRatio, resolution: p.resolution, email }) }); notify("Project duplicated"); load(); }

  function speak() {
    if (!("speechSynthesis" in window)) return notify("Browser TTS support nahi karta");
    speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(voiceText); u.rate = speed; u.pitch = pitch;
    const vs = speechSynthesis.getVoices();
    const match = vs.find(v => voice.includes("Urdu") ? v.lang.startsWith("ur") || v.lang.startsWith("hi") : voice.includes("Hindi") ? v.lang.startsWith("hi") : v.lang.startsWith("en"));
    if (match) u.voice = match; u.onstart = () => setIsSpeaking(true); u.onend = () => setIsSpeaking(false); speechSynthesis.speak(u);
  }
  function downloadSRT() { const blob = new Blob([srt || subResult], { type: "text/plain" }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "subtitles.srt"; a.click(); }
  function downloadVideo(p: Proj) { const a = document.createElement("a"); a.href = p.videoUrl; a.target = "_blank"; a.download = p.title + ".mp4"; a.click(); notify("Export started — " + p.resolution + " MP4"); }
  function downloadProjectSRT(p: Proj) {
    const lines = (p.scenes?.length ? p.scenes.map((s: any) => `${s.title}: ${s.desc}`) : (p.prompt || p.title).split('.').filter(Boolean));
    let srtData = "";
    lines.forEach((l: string, i: number) => {
      const start = i * 4; const end = (i + 1) * 4;
      const pad = (n: number) => n.toString().padStart(2, "0");
      srtData += `${i + 1}\n00:00:${pad(start)},000 --> 00:00:${pad(end)},000\n${l.trim()}\n\n`;
    });
    const blob = new Blob([srtData || "1\n00:00:00,000 --> 00:00:05,000\nMir AI Studio Generated Video\n"], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${(p.title || "video").replace(/\s+/g, "_")}.srt`;
    a.click();
    notify("Downloaded subtitles (.SRT)");
  }

  const filteredProjects = projects.filter(p => {
    if (folder === "Trash") return p.deleted === true;
    if (p.deleted) return false;
    return (folder === "All" || p.folder === folder || (folder === "Favorites" && p.isFavorite)) && (p.title + p.prompt).toLowerCase().includes(projSearch.toLowerCase());
  });
  const completed = projects.filter(p => p.status === "completed" && !p.deleted);
  const totalCreditsUsed = projects.reduce((s, p) => s + (p.creditsUsed || 0), 0);
  const cost = Math.round(duration * (res === "4K" ? 3 : res === "1080p" ? 2 : 1));
  const current = NAV.find(n => n.id === view);

  return (
    <div className={`app-shell min-h-screen relative ${dark ? "theme-dark" : "theme-light"}`}>
      <div className="ambient" />

      {/* ── TOP BAR ─────────────────────────────── */}
      <header className="sticky top-0 z-40 flex items-center gap-3 px-4 py-3 border-b hairline backdrop-blur-md" style={{ background: "color-mix(in srgb, var(--bg) 88%, transparent)" }}>
        <button className="flex items-center gap-2.5 cursor-pointer" onClick={() => setView("dashboard")}>
          <span className="w-9 h-9 rounded-xl grid place-items-center" style={{ background: "var(--accent)", color: "var(--accent-ink)" }}><Clapperboard size={19} strokeWidth={2.4} /></span>
          <span className="text-left">
            <span className="font-display font-bold text-lg leading-none block">Mir AI <span style={{ color: "var(--accent)" }}>Studio</span></span>
            <span className="text-[10px] muted tracking-wide block mt-0.5">AI Video Generator · Urdu / Hindi</span>
          </span>
        </button>
        <div className="hidden md:flex items-center flex-1 max-w-md ml-2 relative">
          <Search size={15} className="absolute left-3 muted" />
          <input value={search} onChange={e => { setSearch(e.target.value); setProjSearch(e.target.value); }}
            onFocus={() => setPaletteOpen(true)}
            onKeyDown={e => { if (e.key === "Enter") { setView("projects"); setPaletteOpen(false); } }}
            placeholder="Search projects, templates, tools…  ⌘K" className="input pl-9 !rounded-full !py-2" />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => setLaunchModal(true)} className="btn btn-ghost px-3 py-2 text-xs text-emerald-400 border border-emerald-500/30" title="Launch readiness checklist">
            <Rocket size={14} className="text-emerald-400" /><span className="hidden md:inline">Launch Ready</span>
          </button>
          <button onClick={() => setDark(!dark)} className="btn btn-ghost px-3 py-2 text-xs" title="Toggle theme">{dark ? <Sun size={15} /> : <Moon size={15} />}<span className="hidden sm:inline">{dark ? "Light" : "Dark"}</span></button>
          <button onClick={() => setView("pricing")} className="btn btn-primary px-3.5 py-2 text-xs"><Zap size={14} /> {user?.credits ?? 120} credits <span className="opacity-70 hidden sm:inline">· {user?.plan || "Free"}</span></button>
          <button onClick={() => setAuthOpen(true)} title="Account" className="w-9 h-9 rounded-full grid place-items-center font-display font-bold text-sm" style={{ background: "var(--teal)", color: "#04211c" }}>{(user?.name || "D")[0]}</button>
        </div>
      </header>

      <div className="flex relative z-10">
        {/* ── SIDEBAR ─────────────────────────────── */}
        <aside className="hidden lg:flex flex-col w-60 shrink-0 p-3 gap-0.5 sticky top-[61px] h-[calc(100vh-61px)] overflow-auto border-r hairline">
          {NAV.map(n => (
            <button key={n.id} onClick={() => go(n.id)} className={`nav-item ${view === n.id ? "nav-on" : ""}`}>
              <n.icon size={16} strokeWidth={2.2} />{n.label}
            </button>
          ))}
          <div className="mt-4 p-4 rounded-2xl relative overflow-hidden" style={{ background: "linear-gradient(135deg, color-mix(in srgb, var(--accent) 92%, #000), color-mix(in srgb, var(--accent) 70%, #7c2d12))", color: "var(--accent-ink)" }}>
            <Rocket size={40} className="absolute -right-2 -bottom-2 opacity-20" />
            <p className="font-display font-bold text-sm">Go Pro — PKR 3,499</p>
            <p className="text-xs opacity-85 mt-1 leading-snug">4K export, AI Avatars, no watermark. JazzCash / EasyPaisa.</p>
            <button onClick={() => setView("pricing")} className="btn mt-3 w-full py-2 text-xs font-extrabold" style={{ background: "rgba(0,0,0,0.82)", color: "#ffd27a" }}>Upgrade now <ChevronRight size={13} /></button>
          </div>
          <p className="text-[10px] muted px-2 pt-3 leading-relaxed">Urdu / Hindi voices · JazzCash &amp; EasyPaisa · GPU rendering · 99.9% uptime</p>
        </aside>

        <main className="flex-1 p-4 md:p-6 max-w-[1400px] mx-auto w-full min-w-0">
          {/* mobile nav */}
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-3 -mx-1 px-1">
            {NAV.map(n => <button key={n.id} onClick={() => go(n.id)} className={`chip whitespace-nowrap shrink-0 ${view === n.id ? "chip-on" : ""}`}><n.icon size={13} />{n.label}</button>)}
          </div>

          {/* page heading strip */}
          {view !== "dashboard" && current && (
            <div className="flex items-center gap-2 mb-5 reveal">
              <span className="w-8 h-8 rounded-lg panel2 grid place-items-center"><current.icon size={16} style={{ color: "var(--accent)" }} /></span>
              <h1 className="font-display font-bold text-xl md:text-2xl">{current.label}</h1>
            </div>
          )}

          {/* ═══════════ DASHBOARD ═══════════ */}
          {view === "dashboard" && (
            <div>
              <div className="grid md:grid-cols-5 gap-4 mb-5">
                {/* prompt console hero */}
                <div className="md:col-span-3 card overflow-hidden relative min-h-[300px] reveal ring-accent">
                  <img src="/images/hero-video.jpg" alt="AI studio" className="absolute inset-0 w-full h-full object-cover opacity-45" />
                  <div className="blob w-64 h-64 -top-16 -left-10" style={{ background: "#f43f5e" }} />
                  <div className="blob w-56 h-56 bottom-0 right-0" style={{ background: "#2dd4bf" }} />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(15deg, var(--panel) 10%, color-mix(in srgb, var(--panel) 55%, transparent) 45%, transparent 78%)" }} />
                  <div className="relative p-6 flex flex-col h-full">
                    <div className="flex flex-wrap gap-1.5">
                      <span className="chip chip-teal w-fit"><Sparkles size={12} /> NEW · AI Avatars + Urdu Voice</span>
                      <span className="chip chip-on w-fit"><Zap size={12} /> Real render engine</span>
                    </div>
                    <h1 className="font-display font-bold text-3xl md:text-[2.6rem] leading-[1.05] mt-4">Text likho,<br />video <span className="grad-text">ready.</span></h1>
                    <p className="text-sm muted mt-2 max-w-md">Text-to-Video, Image-to-Video, AI Avatars, Urdu/Hindi voices, auto subtitles &amp; 4K export — ek studio mein.</p>
                    <div className="mt-auto pt-5">
                      <div className="flex items-center gap-2 panel2 border hairline rounded-full pl-4 pr-1.5 py-1.5">
                        <Wand2 size={16} style={{ color: "var(--accent)" }} className="shrink-0" />
                        <input value={quickPrompt} onChange={e => setQuickPrompt(e.target.value)}
                          onKeyDown={e => { if (e.key === "Enter" && quickPrompt.trim()) { setPrompt(quickPrompt); setView("create"); } }}
                          placeholder={PROMPT_IDEAS[ideaIdx]} className="bg-transparent flex-1 text-sm outline-none min-w-0" />
                        <span className="caret w-0.5 h-4 hidden sm:block" style={{ background: "var(--accent)" }} />
                        <button onClick={() => { if (quickPrompt.trim()) setPrompt(quickPrompt); setView("create"); }} className="btn btn-primary px-4 py-2 text-xs shrink-0"><Sparkles size={13} /> Create</button>
                      </div>
                      <p className="text-[11px] muted mt-2 ml-1">Enter dabao — prompt seedha AI generator mein khulega</p>
                    </div>
                  </div>
                </div>
                {/* stat tiles */}
                <div className="md:col-span-2 grid grid-cols-2 gap-3">
                  {[
                    { l: "Videos Created", v: projects.length, I: Video, g: "linear-gradient(140deg,#ff9a3c,#f43f5e)", ink: "#2a0a12" },
                    { l: "Completed", v: completed.length, I: CheckCircle2, g: "linear-gradient(140deg,#34d399,#0d9488)", ink: "#03251f" },
                    { l: "Credits Left", v: user?.credits ?? 0, I: Zap, g: "linear-gradient(140deg,#c084fc,#6366f1)", ink: "#f8f5ff" },
                    { l: "Credits Used", v: totalCreditsUsed, I: Activity, g: "linear-gradient(140deg,#38bdf8,#2563eb)", ink: "#f2f9ff" },
                  ].map((s, i) => (
                    <div key={s.l} className="tile p-4 reveal" style={{ animationDelay: `${i * 70}ms`, backgroundImage: s.g, color: s.ink }}>
                      <div className="tile-inner">
                        <span className="w-8 h-8 rounded-lg grid place-items-center" style={{ background: "rgba(255,255,255,.28)" }}><s.I size={16} /></span>
                        <p className="font-display font-bold text-2xl mt-2 leading-none">{s.v}</p>
                        <p className="text-[11px] font-bold opacity-85 mt-1">{s.l}</p>
                      </div>
                    </div>
                  ))}
                  <div className="col-span-2 card p-4 reveal" style={{ animationDelay: "300ms" }}>
                    <div className="flex justify-between items-center"><p className="text-sm font-bold flex items-center gap-1.5"><TrendingUp size={14} style={{ color: "var(--teal)" }} /> This Week Activity</p><span className="text-[11px] muted">renders / day</span></div>
                    <div className="flex items-end gap-2 h-16 mt-3">{[[40,"#fbbf24","#f59e0b"],[65,"#f472b6","#db2777"],[30,"#a78bfa","#7c3aed"],[80,"#34d399","#059669"],[55,"#38bdf8","#0284c7"],[90,"#fb7185","#e11d48"],[70,"#2dd4bf","#0d9488"]].map(([h,a,b]: any, i) => <div key={i} className="flex-1 rounded-t transition-all hover:opacity-90" style={{ height: h + "%", backgroundImage: `linear-gradient(180deg, ${a}, ${b})` }} />)}</div>
                    <div className="flex justify-between text-[10px] muted mt-1"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div>
                  </div>
                </div>
              </div>

              {/* filmstrip marquee */}
              <div className="mb-6 overflow-hidden reveal" style={{ maskImage: "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)" }}>
                <div className="marquee-track">
                  {[...TEMPLATES, ...TEMPLATES].map((t, i) => (
                    <button key={i} onClick={() => { setPrompt(t.name + " — viral style video"); setTitle(t.name); setView("create"); }} className="relative rounded-xl overflow-hidden w-44 h-24 shrink-0 group border hairline">
                      <img src={t.img} alt={t.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent text-white text-[11px] font-bold p-2 pt-5 text-left">{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* quick tools */}
              <h2 className="font-display font-bold text-lg mb-3">AI Creation Tools</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-7">
                {[
                  { m: "text-to-video", I: Wand2, t: "Text to Video", d: "Prompt → cinematic video", g: "linear-gradient(145deg,#ffb43a,#f97316)", ink: "#2a1603" },
                  { m: "image-to-video", I: ImagePlus, t: "Image to Video", d: "Photo ko animate karo", g: "linear-gradient(145deg,#f472b6,#a855f7)", ink: "#26083a" },
                  { m: "video-to-video", I: Repeat, t: "Video to Video", d: "Style transfer + 4K", g: "linear-gradient(145deg,#38bdf8,#4f46e5)", ink: "#eef5ff" },
                  { m: "avatar", I: Users, t: "AI Avatar", d: "Talking head + lip-sync", g: "linear-gradient(145deg,#2dd4bf,#059669)", ink: "#03251f" },
                ].map((x, i) => (
                  <button key={x.m} onClick={() => { setMode(x.m); setView("create"); }} className="tile text-left p-4 reveal group" style={{ animationDelay: `${i * 60}ms`, backgroundImage: x.g, color: x.ink }}>
                    <div className="tile-inner">
                      <span className="w-10 h-10 rounded-xl grid place-items-center group-hover:scale-110 transition" style={{ background: "rgba(255,255,255,.3)" }}><x.I size={19} /></span>
                      <p className="font-display font-bold mt-3 text-sm">{x.t}</p>
                      <p className="text-[11px] font-bold opacity-80 mt-0.5">{x.d}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* rendering queue */}
              {projects.some(p => p.status === "generating") && (
                <div className="mb-5 p-4 rounded-2xl border reveal" style={{ background: "color-mix(in srgb, var(--accent) 10%, transparent)", borderColor: "color-mix(in srgb, var(--accent) 35%, transparent)" }}>
                  <p className="font-bold flex items-center gap-2 text-sm"><Loader2 size={15} className="animate-spin" style={{ color: "var(--accent)" }} /> Rendering on GPU…</p>
                  {projects.filter(p => p.status === "generating").map(p => (
                    <div key={p.id} className="mt-2.5">
                      <div className="flex justify-between text-xs"><span className="truncate mr-2">{p.title}</span><span className="font-bold">{p.progress}%</span></div>
                      <div className="h-2 rounded-full mt-1 overflow-hidden" style={{ background: "color-mix(in srgb, var(--text) 10%, transparent)" }}>
                        <div className="h-2 rounded-full transition-all relative" style={{ width: p.progress + "%", background: "var(--accent)" }}><span className="absolute inset-0 shimmer" /></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between mb-3">
                <h2 className="font-display font-bold text-lg">Recent Projects</h2>
                <button onClick={() => setView("projects")} className="text-sm font-bold flex items-center gap-1" style={{ color: "var(--accent)" }}>View all <ChevronRight size={15} /></button>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {projects.filter(p => !p.deleted).slice(0, 8).map((p, i) => <ProjectCard key={p.id} p={p} i={i} onPlay={() => setPlaying(p)} onFav={() => patchProj(p.id, { isFavorite: !p.isFavorite })} onDelete={() => deleteProj(p.id)} onRender={() => setRenderProject(p)} onComments={() => setWorkspace(p)} onLab={() => { setLabProject(p); setLabOpen(true); }} />)}
                {projects.length === 0 && <p className="muted text-sm">No projects yet — pehla video banao!</p>}
              </div>

              <div className="flex items-center justify-between mt-9 mb-3">
                <h2 className="font-display font-bold text-lg flex items-center gap-2"><Star size={17} style={{ color: "var(--accent)" }} /> Trending Templates</h2>
                <button onClick={() => setView("templates")} className="text-sm font-bold flex items-center gap-1" style={{ color: "var(--accent)" }}>All {TEMPLATES.length} templates <ChevronRight size={15} /></button>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {TEMPLATES.slice(0, 6).map((t, i) => (
                  <div key={t.name} className="card card-hover overflow-hidden reveal group" style={{ animationDelay: `${i * 70}ms`, borderTop: `3px solid ${t.color}` }}>
                    <div className="relative overflow-hidden">
                      <img src={t.img} alt={t.name} className="h-36 w-full object-cover group-hover:scale-110 transition duration-500" />
                      <span className="absolute inset-0" style={{ background: `linear-gradient(to top, ${t.color}cc, transparent 65%)` }} />
                      <span className="chip-cat absolute top-2 left-2 text-white" style={{ background: t.color }}>{t.cat}</span>
                      <span className="absolute bottom-2 left-2 right-2 text-white font-display font-bold text-sm drop-shadow">{t.name}</span>
                      <span className="absolute top-2 right-2 chip !text-[9px] !bg-black/60 !text-white">{t.ratio}</span>
                    </div>
                    <div className="p-3">
                      <p className="text-[11px] muted">{t.dur} · {t.style} · {t.uses} uses</p>
                      <button onClick={() => { setPrompt(t.prompt); setTitle(t.name); setStyle(t.style); setRatio(t.ratio); setDuration(parseInt(t.dur)); setView("create"); }} className="btn btn-primary w-full mt-2.5 py-2 text-xs">Use Template <ChevronRight size={12} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══════════ CREATE ═══════════ */}
          {view === "create" && (
            <div className="grid lg:grid-cols-5 gap-5">
              <div className="lg:col-span-3 card p-5 reveal">
                <div className="flex flex-wrap gap-2">
                  {[["text-to-video", "Text-to-Video", Wand2], ["image-to-video", "Image-to-Video", ImagePlus], ["video-to-video", "Video-to-Video", Repeat], ["avatar", "AI Avatar", Users], ["script", "Script-to-Video", FileText]].map(([m, l, I]: any) => (
                    <button key={m} onClick={() => setMode(m)} className={`chip ${mode === m ? "chip-on" : ""}`}><I size={13} />{l}</button>
                  ))}
                </div>

                {(mode === "image-to-video" || mode === "video-to-video") && (
                  <div className="mt-4 border-2 border-dashed rounded-2xl p-5 text-center" style={{ borderColor: "color-mix(in srgb, var(--accent) 40%, transparent)" }}>
                    <Upload size={26} className="mx-auto" style={{ color: "var(--accent)" }} />
                    <p className="font-bold text-sm mt-2">{mode === "image-to-video" ? "Image upload karo (demo: stock se select)" : "Video upload — AI style / upscale / bg remove"}</p>
                    <div className="flex gap-2 justify-center mt-3 flex-wrap">
                      {STOCK.slice(0, 3).map(s => <img key={s.name} src={s.img} alt={s.name} onClick={() => { setPrompt(s.name + " animated with cinematic camera movement"); notify("Asset selected: " + s.name); }} className="w-20 h-14 object-cover rounded-lg cursor-pointer hover:ring-2 transition" style={{ ["--tw-ring-color" as any]: "var(--accent)" }} />)}
                    </div>
                    <p className="text-xs muted mt-2">Motion: Zoom / Pan / Rotate · Camera: Dolly, Orbit, Tilt</p>
                  </div>
                )}

                {mode === "avatar" && (
                  <div className="mt-4">
                    <p className="font-bold text-sm mb-2 flex items-center gap-1.5"><Users size={14} style={{ color: "var(--teal)" }} /> Avatar select karo — lip-sync + gestures</p>
                    <div className="grid grid-cols-4 gap-2">
                      {AVATARS.map(a => (
                        <button key={a.name} onClick={() => setAvatar(a.name)} title={a.role} className="rounded-xl overflow-hidden border-2 transition relative" style={{ borderColor: avatar === a.name ? "var(--accent)" : "transparent" }}>
                          <img src={a.img} alt={a.name} className="h-20 w-full object-cover" />
                          <p className="text-[11px] font-bold py-1 bg-black/60 text-white">{a.name}</p>
                          {avatar === a.name && <CheckCircle2 size={15} className="absolute top-1 right-1" style={{ color: "var(--accent)" }} />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <label className="text-sm font-bold mt-4 flex items-center gap-1.5"><FileText size={14} style={{ color: "var(--accent)" }} /> Video Prompt / Script</label>
                <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={4} className="input mt-1.5" placeholder="e.g. Lahore food street at night, steam, cinematic…" />
                <div className="flex flex-wrap gap-2 mt-2">
                  <button onClick={enhance} className="btn btn-primary px-3.5 py-2 text-xs"><Wand2 size={13} /> AI Enhance Prompt</button>
                  <button onClick={genScript} className="btn btn-teal px-3.5 py-2 text-xs"><FileText size={13} /> Script + Storyboard</button>
                  <button onClick={async () => { const d = await ai("ideas", prompt); alert(d.ideas?.join("\n")); }} className="btn btn-ghost px-3.5 py-2 text-xs"><Lightbulb size={13} /> Video Ideas</button>
                </div>
                {scriptResult && <pre className="whitespace-pre-wrap text-xs mt-3 p-3.5 rounded-2xl panel2 max-h-52 overflow-auto reveal leading-relaxed">{scriptResult}</pre>}
                {scenes.length > 0 && <div className="grid grid-cols-2 gap-2 mt-2">{scenes.map((s: any) => <div key={s.n} className="p-2.5 rounded-xl panel2 text-xs reveal"><b className="flex items-center gap-1"><Film size={11} style={{ color: "var(--teal)" }} />Scene {s.n}: {s.title}</b><span className="muted">{s.desc} · {s.dur}</span></div>)}</div>}

                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Project title (optional — auto from prompt)" className="input mt-4" />

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-5">
                  <Field label="Style" icon={<Palette size={12} />}><div className="flex flex-wrap gap-1">{STYLES.map(s => <button key={s} onClick={() => setStyle(s)} className={`chip !text-[10.5px] ${style === s ? "chip-on" : ""}`}>{s}</button>)}</div></Field>
                  <Field label="Duration" icon={<Clock size={12} />}><div className="flex gap-1 flex-wrap">{[5, 10, 15, 30, 60].map(d => <button key={d} onClick={() => setDuration(d)} className={`chip ${duration === d ? "chip-on" : ""}`}>{d}s</button>)}</div></Field>
                  <Field label="Aspect Ratio" icon={<LayoutTemplate size={12} />}><div className="flex gap-1 flex-wrap">{["9:16", "16:9", "1:1", "4:5"].map(r => <button key={r} onClick={() => setRatio(r)} className={`chip ${ratio === r ? "chip-on" : ""}`}>{r}</button>)}</div></Field>
                  <Field label="Resolution" icon={<Video size={12} />}><div className="flex gap-1 flex-wrap">{["480p", "720p", "1080p", "4K"].map(r => <button key={r} onClick={() => setRes(r)} className={`chip ${res === r ? "chip-on" : ""}`}>{r}</button>)}</div></Field>
                  <Field label="Camera / Motion" icon={<Camera size={12} />}><select value={motion} onChange={e => setMotion(e.target.value)} className="input !py-2 text-xs"><option>Dolly In</option><option>Orbit</option><option>Tilt Up</option><option>Zoom In</option><option>Pan Left</option><option>Drone Flyover</option></select></Field>
                  <Field label="Seed (repeat result)" icon={<Repeat size={12} />}><input value={seed} onChange={e => setSeed(e.target.value)} className="input !py-2 text-xs" /></Field>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <Field label="AI Voice (100+ voices)" icon={<Mic size={12} />}><select value={voice} onChange={e => setVoice(e.target.value)} className="input !py-2 text-sm">{VOICES.map(v => <option key={v.name}>{v.name}</option>)}</select></Field>
                  <Field label="Language" icon={<Languages size={12} />}><select value={language} onChange={e => setLanguage(e.target.value)} className="input !py-2 text-sm">{["Urdu", "Hindi", "English", "Arabic", "Spanish", "French", "Chinese", "Punjabi"].map(l => <option key={l}>{l}</option>)}</select></Field>
                  <Field label={`Emotion: ${emotion}`} icon={<Heart size={12} />}><div className="flex gap-1 flex-wrap">{["Happy", "Excited", "Sad", "Calm", "Angry"].map(e => <button key={e} onClick={() => setEmotion(e)} className={`chip ${emotion === e ? "chip-teal" : ""}`}>{e}</button>)}</div></Field>
                  <Field label="Options" icon={<Captions size={12} />}>
                    <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={subs} onChange={e => setSubs(e.target.checked)} /> Auto Subtitles (Karaoke)</label>
                    <label className="flex items-center gap-2 text-xs mt-1.5">Variations <input type="number" min={1} max={4} value={variations} onChange={e => setVariations(Number(e.target.value))} className="input !w-16 !py-1 !px-2" /></label>
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <label className="text-xs muted font-bold">Speed {speed}x<input type="range" min={0.5} max={2} step={0.05} value={speed} onChange={e => setSpeed(Number(e.target.value))} className="w-full mt-1" /></label>
                  <label className="text-xs muted font-bold">Pitch {pitch}<input type="range" min={0.5} max={1.8} step={0.1} value={pitch} onChange={e => setPitch(Number(e.target.value))} className="w-full mt-1" /></label>
                </div>

                <button onClick={generate} disabled={generating} className="btn btn-primary w-full mt-5 py-3.5 text-sm font-extrabold disabled:opacity-50">
                  {generating ? <><Loader2 size={16} className="animate-spin" /> Generating…</> : <><Clapperboard size={16} /> Generate Video — {cost} credits</>}
                </button>
                <p className="text-[11px] muted text-center mt-2">GPU rendering · Real-time preview · Watermark-free on Pro · Cost = duration × resolution</p>
              </div>

              <div className="lg:col-span-2 space-y-4">
                <div className="card overflow-hidden reveal" style={{ animationDelay: "120ms" }}>
                  <div className="relative bg-black" style={{ aspectRatio: ratio === "9:16" ? "9/12" : ratio === "1:1" ? "1/1" : "16/9" }}>
                    <img src={mode === "avatar" ? AVATARS.find(a => a.name === avatar)?.img : "/images/hero-video.jpg"} alt="Preview" className="w-full h-full object-cover opacity-80" />
                    <div className="absolute inset-0 grid place-items-center"><span className="w-14 h-14 rounded-full grid place-items-center pulse-dot" style={{ background: "var(--accent)", color: "var(--accent-ink)" }}><Play size={22} fill="currentColor" /></span></div>
                    {subs && <div className="absolute bottom-3 left-0 right-0 text-center"><span className="bg-black/75 font-bold px-2.5 py-1 rounded text-sm" style={{ color: "#fbbf24" }}>Assalam-o-Alaikum doston!</span></div>}
                    <span className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">{ratio} · {res} · {duration}s</span>
                  </div>
                  <div className="p-4">
                    <p className="font-bold text-sm">Live Preview</p>
                    <p className="text-xs muted mt-1">{style} · {motion} · {voice} · {language} · {emotion}</p>
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => setView("editor")} className="btn btn-ghost flex-1 py-2 text-xs"><Scissors size={13} /> Open in Editor</button>
                      <button onClick={() => { setVoiceText(prompt); setView("voice"); }} className="btn btn-ghost flex-1 py-2 text-xs"><Mic size={13} /> Voice Studio</button>
                    </div>
                  </div>
                </div>
                <div className="card p-4 reveal" style={{ animationDelay: "200ms" }}>
                  <p className="font-bold text-sm flex items-center gap-1.5"><Lightbulb size={14} style={{ color: "var(--accent)" }} /> Pro Tips</p>
                  <ul className="text-xs muted space-y-1.5 mt-2 list-disc pl-4 leading-relaxed">
                    <li>Specific prompt = behtar result (camera + light + mood likho)</li>
                    <li>9:16 Reels/Shorts ke liye, 16:9 YouTube ke liye</li>
                    <li>Seed save karo taake same style repeat ho</li>
                    <li>Urdu voice + karaoke subtitles = zyada watch time</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════ EDITOR ═══════════ */}
          {view === "editor" && (
            <div className="reveal">
              <p className="text-sm muted mb-4 -mt-3">Multi-track timeline · Filters, transitions, text, speed — preview live badalta hai</p>
              <div className="grid lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                  <div className="rounded-3xl overflow-hidden bg-black relative border hairline">
                    <video src="https://videos.pexels.com/video-files/5849755/5849755-uhd_3840_2160_30fps.mp4" controls className="w-full max-h-[380px]" style={{ filter: `${filter} brightness(${brightness}%)` }} />
                    <div className="absolute top-1/2 left-0 right-0 text-center pointer-events-none">
                      <span className="font-display text-2xl font-bold text-white" style={{ textShadow: "2px 2px 10px #000" }}>{overlayText}</span>
                    </div>
                  </div>
                  <div className="card p-4 mt-4">
                    <div className="flex justify-between text-xs mb-2"><span className="font-bold flex items-center gap-1.5"><Film size={13} style={{ color: "var(--accent)" }} /> Video Track</span><span className="muted">Playhead {playhead}%</span></div>
                    <input type="range" value={playhead} onChange={e => setPlayhead(Number(e.target.value))} className="w-full" />
                    <div className="flex gap-1 mt-2">
                      {clips.map((c, i) => (
                        <button key={i} onClick={() => setSelectedClip(i)} className={`rounded-lg p-2 text-left text-white transition ${selectedClip === i ? "ring-2 ring-white scale-[1.02]" : "opacity-85 hover:opacity-100"}`} style={{ background: c.color, flex: c.dur }}>
                          <p className="text-[11px] font-bold truncate">{c.name}</p><p className="text-[10px] opacity-85">{c.dur}s · {transition}</p>
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-1 mt-1.5">
                      <div className="flex-[7] rounded-lg p-2 text-[11px] text-white font-bold flex items-center gap-1.5" style={{ background: "#0284c7" }}><Music size={11} /> Background Music — Upbeat (auto-ducking ON)</div>
                      <div className="flex-[5] rounded-lg p-2 text-[11px] text-white font-bold flex items-center gap-1.5" style={{ background: "#db2777" }}><Mic size={11} /> Voiceover — {voice.split(" ")[0]}</div>
                    </div>
                    <div className="flex gap-1 mt-1.5"><div className="flex-1 rounded-lg p-2 text-[11px] font-bold flex items-center gap-1.5" style={{ background: "var(--accent)", color: "var(--accent-ink)" }}><Captions size={11} /> Subtitles: {overlayText.slice(0, 24)}…</div></div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <button onClick={() => setClips([...clips, { name: `Scene ${clips.length + 1}`, dur: 4, color: "#8b5cf6" }])} className="btn btn-primary px-3 py-1.5 text-xs"><Plus size={13} /> Add Clip</button>
                      <button onClick={() => setClips(clips.map((c, i) => i === selectedClip ? { ...c, dur: Math.max(1, c.dur - 1) } : c))} className="btn btn-ghost px-3 py-1.5 text-xs"><Scissors size={13} /> Trim −1s</button>
                      <button onClick={() => setClips(clips.map((c, i) => i === selectedClip ? { ...c, dur: c.dur + 1 } : c))} className="btn btn-ghost px-3 py-1.5 text-xs">Trim +1s</button>
                      <button onClick={() => { const c = clips[selectedClip]; setClips([...clips, { ...c, name: c.name + " copy" }]); }} className="btn btn-ghost px-3 py-1.5 text-xs"><Copy size={13} /> Duplicate</button>
                      <button onClick={() => setClips(clips.filter((_, i) => i !== selectedClip))} className="btn btn-danger px-3 py-1.5 text-xs"><Trash2 size={13} /> Delete</button>
                      <button onClick={() => notify("Undo")} className="btn btn-ghost px-3 py-1.5 text-xs"><Undo2 size={13} /> Undo</button>
                      <button onClick={() => notify("Redo")} className="btn btn-ghost px-3 py-1.5 text-xs"><Redo2 size={13} /> Redo</button>
                    </div>
                  </div>
                </div>
                <div className="card p-4 space-y-4 h-fit">
                  <div><p className="font-bold text-sm">Text Overlay</p><input value={overlayText} onChange={e => setOverlayText(e.target.value)} className="input mt-1.5 !py-2 text-sm" /></div>
                  <div>
                    <p className="font-bold text-sm">Filter / Color</p>
                    <div className="flex flex-wrap gap-1 mt-1.5">{[["none", "None"], ["grayscale(1)", "B&W"], ["sepia(0.7)", "Vintage"], ["saturate(1.8)", "Vivid"], ["hue-rotate(90deg)", "Neon"], ["contrast(1.4)", "Cinematic"]].map(([f, l]) => <button key={l} onClick={() => setFilter(f)} className={`chip ${filter === f ? "chip-on" : ""}`}>{l}</button>)}</div>
                    <label className="text-xs muted font-bold block mt-2.5">Brightness {brightness}%<input type="range" min={50} max={150} value={brightness} onChange={e => setBrightness(Number(e.target.value))} className="w-full mt-1" /></label>
                  </div>
                  <div><p className="font-bold text-sm">Transition</p><div className="flex flex-wrap gap-1 mt-1.5">{["Fade", "Slide", "Zoom", "Spin", "Glitch", "3D Flip", "Light Leak"].map(t => <button key={t} onClick={() => setTransition(t)} className={`chip ${transition === t ? "chip-on" : ""}`}>{t}</button>)}</div></div>
                  <div><p className="font-bold text-sm">Speed: {clipSpeed}x <span className="muted font-normal">(0.25x – 4x)</span></p><input type="range" min={0.25} max={4} step={0.25} value={clipSpeed} onChange={e => setClipSpeed(Number(e.target.value))} className="w-full mt-1" /></div>
                  <div><p className="font-bold text-sm">Effects</p><div className="flex flex-wrap gap-1 mt-1.5">{["Film Grain", "VHS", "Vignette", "Blur BG", "Green Screen", "Slow-Mo"].map(t => <button key={t} onClick={() => notify(t + " applied")} className="chip">{t}</button>)}</div></div>
                  <button onClick={() => setRenderProject({ id: 0, title: overlayText || "Timeline Export", prompt: `Timeline: ${clips.map((c:any) => c.name).join(" → ")}`, style: filter === "none" ? style : "Cinematic", duration: Math.min(30, clips.reduce((a:number, c:any) => a + c.dur, 0)), aspectRatio: ratio, resolution: res, scenes: clips.map((c:any, i:number) => ({ n: i + 1, title: c.name, desc: `${c.dur}s · ${transition} · ${clipSpeed}x`, dur: c.dur + "s" })), watermark: brand.watermark })} className="btn btn-primary w-full py-3 text-sm"><Upload size={15} /> Export timeline → real video</button>
                  <button onClick={() => { setLabProject(null); setLabOpen(true); }} className="btn btn-ghost w-full py-2 text-xs"><Wand2 size={13} /> Media Lab (filters, bg remove, thumbnail)</button>
                  <select className="input !py-2 text-sm"><option>MP4 · 1080p · 30fps</option><option>MP4 · 4K · 60fps (Pro)</option><option>WebM · 720p</option><option>GIF · 480p</option><option>MOV · 1080p</option></select>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════ TEMPLATES ═══════════ */}
          {view === "templates" && (() => {
            const list = TEMPLATES.filter(t => (tplCat === "All" || t.cat === tplCat) && (t.name + t.cat + t.style).toLowerCase().includes(tplSearch.toLowerCase()));
            const activeColors = TEMPLATES.filter(t => tplCat === "All" || t.cat === tplCat).slice(0, 5).map(t => t.color);
            return (
              <div className="reveal">
                <div className="card p-4 mb-5 relative overflow-hidden">
                  <div className="blob w-40 h-40 -top-10 right-6" style={{ background: activeColors[0] || "#ff9a3c" }} />
                  <div className="blob w-32 h-32 bottom-0 right-40" style={{ background: activeColors[1] || "#2dd4bf" }} />
                  <div className="relative flex flex-wrap items-center gap-3">
                    <div>
                      <h2 className="font-display font-bold text-lg">Template Library</h2>
                      <p className="text-xs muted mt-0.5"><b>{TEMPLATES.length}</b> ready-made templates · {TEMPLATE_CATS.length - 1} categories · Urdu / Hindi + English</p>
                    </div>
                    <div className="ml-auto relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 muted" />
                      <input value={tplSearch} onChange={e => setTplSearch(e.target.value)} placeholder="Search templates…" className="input !rounded-full !py-2 pl-9 !w-56" />
                    </div>
                  </div>
                  <div className="relative flex gap-1.5 flex-wrap mt-3">
                    {TEMPLATE_CATS.map(c => {
                      const sample = TEMPLATES.find(t => t.cat === c)?.color;
                      const on = tplCat === c;
                      return <button key={c} onClick={() => setTplCat(c)} className="chip" style={on ? { background: sample || "var(--accent)", color: "#0b0e15", borderColor: "transparent" } : { border: "1px solid var(--line)" }}>{c}{c !== "All" && <span className="opacity-60 ml-1">{TEMPLATES.filter(t => t.cat === c).length}</span>}</button>;
                    })}
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {list.map((t, i) => (
                    <div key={t.name} className="card card-hover overflow-hidden reveal group" style={{ animationDelay: `${Math.min(i, 9) * 45}ms`, borderTop: `3px solid ${t.color}` }}>
                      <div className="relative overflow-hidden">
                        <img src={t.img} alt={t.name} className="h-40 w-full object-cover group-hover:scale-110 transition duration-500" />
                        <span className="absolute inset-0" style={{ background: `linear-gradient(to top, ${t.color}d9, transparent 62%)` }} />
                        <span className="chip-cat absolute top-2 left-2 text-white" style={{ background: t.color }}>{t.cat}</span>
                        <span className="absolute top-2 right-2 chip !text-[9px] !bg-black/60 !text-white">{t.ratio}</span>
                        <span className="absolute bottom-2 left-2.5 right-2.5 text-white font-display font-bold drop-shadow">{t.name}</span>
                      </div>
                      <div className="p-3">
                        <div className="flex items-center justify-between text-[11px] muted"><span>{t.dur} · {t.style}</span><span className="flex items-center gap-1"><Heart size={10} /> {t.uses}</span></div>
                        <div className="flex gap-1.5 mt-2.5">
                          <button onClick={() => { setPrompt(t.prompt); setTitle(t.name); setStyle(t.style); setRatio(t.ratio); setDuration(parseInt(t.dur)); setView("create"); }} className="btn btn-primary flex-1 py-2 text-xs">Use <ChevronRight size={12} /></button>
                          <button onClick={() => { setMode("image-to-video"); setPrompt(t.prompt); setTitle(t.name + " (image)"); setStyle(t.style); setRatio(t.ratio); setView("create"); }} title="Image → video" className="btn btn-ghost px-2.5"><ImagePlus size={13} /></button>
                          <button onClick={() => { setLabProject(null); setLabOpen(true); }} title="Make thumbnail" className="btn btn-ghost px-2.5"><Wand2 size={13} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {list.length === 0 && <div className="text-center py-12"><LayoutTemplate size={30} className="mx-auto muted" /><p className="text-sm font-bold mt-3">Is category mein koi template nahi</p><button onClick={() => { setTplCat("All"); setTplSearch(""); }} className="btn btn-ghost px-4 py-2 text-xs mt-2">Reset filters</button></div>}
                <div className="card p-4 mt-5 flex flex-wrap items-center gap-3">
                  <span className="w-9 h-9 rounded-xl grid place-items-center" style={{ background: "linear-gradient(140deg,#a855f7,#6366f1)", color: "#fff" }}><Sparkles size={16} /></span>
                  <div className="min-w-0 flex-1"><p className="text-sm font-bold">Har template fully customizable hai</p><p className="text-[11px] muted">Style, duration, ratio, voice aur captions — sab Create studio mein pre-filled ho jate hain.</p></div>
                  <button onClick={() => setView("create")} className="btn btn-teal px-4 py-2 text-xs">Blank project banao</button>
                </div>
              </div>
            );
          })()}

          {/* ═══════════ VOICE ═══════════ */}
          {view === "voice" && (
            <div className="grid lg:grid-cols-2 gap-5 reveal">
              <div className="card p-5">
                <p className="text-xs muted -mt-1">Text-to-Speech (Urdu, Hindi, English, Arabic) · Voice cloning · Emotion · Dubbing — <b>Play dabao, asli awaaz suno!</b></p>
                <textarea value={voiceText} onChange={e => setVoiceText(e.target.value)} rows={5} className="input mt-3" />
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {VOICES.map(v => (
                    <button key={v.name} onClick={() => setVoice(v.name)} className={`p-2.5 rounded-xl text-left text-xs transition border ${voice === v.name ? "chip-on border-transparent" : "panel2 border-transparent hover:border-[var(--line)]"}`}>
                      <b className="flex items-center gap-1"><Mic size={11} />{v.name}</b><span className="opacity-70">{v.lang} · {v.gender}</span>
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <label className="text-xs muted font-bold">Speed {speed}x<input type="range" min={0.5} max={2} step={0.05} value={speed} onChange={e => setSpeed(Number(e.target.value))} className="w-full mt-1" /></label>
                  <label className="text-xs muted font-bold">Pitch {pitch}<input type="range" min={0.5} max={1.8} step={0.1} value={pitch} onChange={e => setPitch(Number(e.target.value))} className="w-full mt-1" /></label>
                </div>
                <div className="flex gap-2 mt-3">{["Happy", "Excited", "Sad", "Calm"].map(e => <button key={e} onClick={() => setEmotion(e)} className={`chip ${emotion === e ? "chip-teal" : ""}`}>{e}</button>)}</div>
                <div className="flex items-center gap-3 mt-4">
                  <button onClick={speak} className="btn btn-primary flex-1 py-3 text-sm font-extrabold">{isSpeaking ? <><Loader2 size={15} className="animate-spin" /> Bol raha hai…</> : <><Play size={15} fill="currentColor" /> Generate &amp; Play Voice</>}</button>
                  <button onClick={() => { speechSynthesis.cancel(); setIsSpeaking(false); }} className="btn btn-ghost px-4 py-3 text-sm"><Square size={14} /> Stop</button>
                </div>
                {isSpeaking && (
                  <div className="flex items-end justify-center gap-1 h-10 mt-4">
                    {[0.1, 0.35, 0.6, 0.2, 0.8, 0.45, 0.15, 0.7, 0.3, 0.55, 0.25, 0.65, 0.4, 0.1, 0.5].map((d, i) => <span key={i} className="eq-bar" style={{ animationDelay: `${d}s` }} />)}
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div className="card p-5">
                  <h3 className="font-display font-bold flex items-center gap-2"><Music size={16} style={{ color: "var(--teal)" }} /> AI Music &amp; SFX Library</h3>
                  {[["Upbeat Corporate", "0:30 · Royalty-free"], ["Urdu Nasheed Style", "1:00"], ["Cinematic Epic", "0:45"], ["Lo-Fi Chill", "1:20"], ["Whoosh Transition SFX", "0:02"], ["Notification Pop SFX", "0:01"]].map(([n, d]) => (
                    <div key={n} className="flex justify-between items-center py-2.5 border-b hairline text-sm last:border-0">
                      <span>{n} <span className="muted text-xs ml-1">{d}</span></span>
                      <button onClick={() => notify(n + " added to timeline (ducking ON)")} className="btn btn-ghost px-3 py-1 text-xs"><Plus size={12} /> Add</button>
                    </div>
                  ))}
                </div>
                <div className="card p-5">
                  <h3 className="font-display font-bold flex items-center gap-2"><Globe2 size={16} style={{ color: "var(--teal)" }} /> AI Dubbing</h3>
                  <p className="text-xs muted mt-1">Ek video ko Urdu ↔ English ↔ Arabic mein dub karo — same voice, same lip-sync.</p>
                  <button onClick={() => notify("Dubbing job queued — Urdu → English")} className="btn btn-teal px-4 py-2 text-xs mt-3"><Languages size={13} /> Start Dubbing</button>
                  <h3 className="font-display font-bold mt-5 flex items-center gap-2"><Mic size={16} style={{ color: "var(--accent)" }} /> Voice Cloning</h3>
                  <p className="text-xs muted mt-1">30 second sample se apni awaaz clone karo (Pro).</p>
                  <button onClick={() => notify("Voice clone studio — sample upload demo")} className="btn btn-ghost px-4 py-2 text-xs mt-2.5"><Copy size={13} /> Clone My Voice</button>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════ SUBTITLES ═══════════ */}
          {view === "subtitles" && (
            <div className="card p-5 max-w-3xl reveal">
              <p className="text-xs muted -mt-1">Multi-language · Karaoke style · Translation · SRT / VTT export</p>
              <div className="flex gap-2 mt-4">
                <input value={subTopic} onChange={e => setSubTopic(e.target.value)} className="input flex-1" placeholder="Video topic…" />
                <button onClick={async () => { const d = await ai("subtitles", subTopic); setSubResult(d.result); setSrt(d.srt); }} className="btn btn-primary px-5 text-sm shrink-0"><Sparkles size={14} /> Generate</button>
              </div>
              {subResult && (
                <>
                  <pre className="whitespace-pre-wrap text-sm mt-4 p-4 rounded-2xl panel2 leading-relaxed reveal">{subResult}</pre>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    <button onClick={downloadSRT} className="btn btn-teal px-4 py-2 text-xs"><Download size={13} /> Download SRT</button>
                    <button onClick={() => { navigator.clipboard.writeText(subResult); notify("Copied!"); }} className="btn btn-ghost px-4 py-2 text-xs"><Copy size={13} /> Copy</button>
                    <button onClick={() => notify("Karaoke style applied — word-by-word highlight")} className="btn btn-primary px-4 py-2 text-xs"><Captions size={13} /> Karaoke Style</button>
                  </div>
                </>
              )}
              <div className="mt-5 p-5 rounded-2xl panel2 text-center">
                <p className="text-xs muted mb-2 flex items-center justify-center gap-1"><Captions size={12} /> Karaoke Preview</p>
                <p className="font-display text-lg font-bold"><span style={{ color: "var(--accent)" }}>Assalam-o-Alaikum</span> doston, aaj ki <span className="px-1.5 rounded" style={{ background: "var(--teal)", color: "#04211c" }}>video</span> mein…</p>
              </div>
            </div>
          )}

          {/* ═══════════ SEO ═══════════ */}
          {view === "seo" && (
            <div className="grid lg:grid-cols-2 gap-5 reveal">
              <div className="card p-5">
                <input value={seoTopic} onChange={e => setSeoTopic(e.target.value)} className="input" />
                <button onClick={async () => setSeoData(await ai("thumbnail", seoTopic))} className="btn btn-primary w-full mt-3 py-3 text-sm"><Sparkles size={15} /> Generate Titles, Hashtags &amp; Description</button>
                {seoData && (
                  <div className="mt-4 space-y-4 reveal">
                    <div>
                      <p className="font-bold text-sm mb-1">Viral Titles</p>
                      {seoData.titles?.map((t: string) => (
                        <div key={t} className="flex justify-between gap-2 py-2 border-b hairline text-sm last:border-0">
                          <span>{t}</span>
                          <button onClick={() => { navigator.clipboard.writeText(t); notify("Title copied"); }} className="shrink-0 text-xs font-bold flex items-center gap-1" style={{ color: "var(--accent)" }}><Copy size={11} /> Copy</button>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1.5">{seoData.hashtags?.map((h: string) => <span key={h} className="chip cursor-default">{h}</span>)}</div>
                    <pre className="whitespace-pre-wrap text-xs panel2 p-3.5 rounded-2xl leading-relaxed">{seoData.description}</pre>
                  </div>
                )}
              </div>
              <div className="card overflow-hidden h-fit">
                <div className="relative">
                  <img src="/images/hero-video.jpg" alt="Thumbnail preview" className="w-full h-56 object-cover" />
                  <div className="absolute inset-0 grid place-items-center p-4 text-center"><p className="font-display text-3xl font-bold" style={{ color: "#fde047", textShadow: "3px 3px 0 #000" }}>{seoTopic.slice(0, 32).toUpperCase()}!</p></div>
                  <span className="absolute bottom-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">10:24</span>
                </div>
                <div className="p-4">
                  <p className="font-bold text-sm">Thumbnail Preview (A/B Test)</p>
                  <div className="flex gap-2 mt-2">{["Bold Yellow", "Red Shock", "Minimal Pro"].map(s => <button key={s} onClick={() => notify(s + " thumbnail variant generated")} className="btn btn-ghost flex-1 py-2 text-xs">{s}</button>)}</div>
                  <p className="text-xs muted mt-3 flex items-center gap-1.5"><ShieldCheck size={13} style={{ color: "var(--teal)" }} /> SEO Score <b style={{ color: "var(--teal)" }}>92/100</b> · Title length ✓ · Keywords ✓ · CTR: High</p>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════ ASSETS ═══════════ */}
          {view === "assets" && (
            <div className="reveal">
              <button onClick={() => { setLabProject(null); setLabOpen(true); }} className="card card-hover w-full p-4 mb-4 flex items-center gap-3 text-left">
                <span className="w-10 h-10 rounded-xl grid place-items-center shrink-0" style={{ background: "var(--teal)", color: "#04211c" }}><Wand2 size={19} /></span>
                <span className="min-w-0 flex-1"><span className="font-bold text-sm block">Open Image Lab</span><span className="text-[11px] muted">Background remove, upscale, grading, portrait blur, thumbnail generator — real canvas processing</span></span>
                <ChevronRight size={16} className="muted shrink-0" />
              </button>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {STOCK.map((s, i) => (
                  <div key={s.name} className="card card-hover overflow-hidden reveal" style={{ animationDelay: `${i * 50}ms` }}>
                    <img src={s.img} alt={s.name} className="h-40 w-full object-cover" />
                    <div className="p-3.5 flex justify-between items-center gap-2">
                      <div className="min-w-0"><p className="font-bold text-sm truncate">{s.name}</p><p className="text-xs muted">{s.type} · Royalty-free</p></div>
                      <button onClick={() => { setPrompt(s.name + " — use this asset"); setView("create"); notify("Asset added to Create studio"); }} className="btn btn-primary px-4 py-2 text-xs shrink-0"><Plus size={12} /> Use</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="card p-5 mt-5">
                <h3 className="font-display font-bold flex items-center gap-2"><Music size={16} style={{ color: "var(--teal)" }} /> Music Tracks</h3>
                <div className="grid md:grid-cols-3 gap-2 mt-3">
                  {["Corporate Upbeat", "Desi Beats", "Cinematic Piano", "LoFi Urdu Poetry BG", "Tech Review BG", "Wedding Nasheed"].map(m => (
                    <button key={m} onClick={() => notify(m + " preview added")} className="btn btn-ghost py-3 text-sm !rounded-xl"><Play size={13} /> {m}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ═══════════ PROJECTS ═══════════ */}
          {view === "projects" && (
            <div className="reveal">
              <div className="flex flex-wrap gap-2 items-center mb-5">
                <span className="text-sm muted mr-1">{filteredProjects.length} projects</span>
                {["All", "YouTube", "Shorts", "Ads", "Favorites", "Approved", "Trash"].map(f => <button key={f} onClick={() => setFolder(f)} className={`chip ${folder === f ? "chip-on" : ""}`}>{f === "Favorites" && <Heart size={11} />}{f}</button>)}
                <div className="relative ml-auto">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 muted" />
                  <input value={projSearch} onChange={e => setProjSearch(e.target.value)} placeholder="Search projects…" className="input !rounded-full !py-2 pl-9 !w-56" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredProjects.map((p, i) => p.deleted
                  ? <div key={p.id} className="card p-3">
                      <div className="flex gap-2 items-center"><img src={p.thumbnail} alt="" className="w-16 h-11 object-cover rounded-lg" /><div className="min-w-0 flex-1"><p className="text-xs font-bold truncate">{p.title}</p><p className="text-[10px] muted">Trash mein</p></div></div>
                      <div className="flex gap-1.5 mt-2"><button onClick={() => restoreProj(p.id)} className="btn btn-teal flex-1 py-1.5 text-[10px]"><RotateCcw size={11} /> Restore</button><button onClick={() => purgeProj(p.id)} className="btn btn-danger px-2.5 py-1.5 text-[10px]"><Trash2 size={11} /></button></div>
                    </div>
                  : <ProjectCard key={p.id} p={p} i={i} onPlay={() => setPlaying(p)} onFav={() => patchProj(p.id, { isFavorite: !p.isFavorite })} onDelete={() => deleteProj(p.id)} onDup={() => duplicateProj(p)} onRender={() => setRenderProject(p)} onComments={() => setWorkspace(p)} onLab={() => { setLabProject(p); setLabOpen(true); }} />)}
              </div>
              {filteredProjects.length === 0 && <p className="muted text-sm py-6">Is folder mein koi project nahi.</p>}
              <h3 className="font-display font-bold mt-9 mb-3 flex items-center gap-2"><CreditCard size={16} style={{ color: "var(--accent)" }} /> Credit History</h3>
              <div className="card overflow-hidden">
                {tx.map((t: any) => (
                  <div key={t.id} className="flex justify-between px-4 py-3 border-b hairline text-sm last:border-0">
                    <span className="truncate mr-3">{t.label}</span>
                    <span className="font-bold shrink-0" style={{ color: t.amount > 0 ? "var(--teal)" : "var(--danger)" }}>{t.amount > 0 ? "+" : ""}{t.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══════════ BRAND ═══════════ */}
          {view === "brand" && (
            <div className="card p-5 max-w-2xl reveal">
              <p className="text-xs muted -mt-1">Logo, colors, fonts, watermark — har video mein auto apply</p>
              <label className="block text-sm font-bold mt-4">Brand Name<input value={brand.brandName} onChange={e => setBrand({ ...brand, brandName: e.target.value })} className="input mt-1.5" /></label>
              <label className="block text-sm font-bold mt-3">Primary Color
                <div className="flex gap-2 mt-1.5 items-center">
                  <input type="color" value={brand.primaryColor} onChange={e => setBrand({ ...brand, primaryColor: e.target.value })} className="w-12 h-10 rounded-lg cursor-pointer border hairline bg-transparent" />
                  <span className="text-sm muted font-mono">{brand.primaryColor}</span>
                  {["#F59E0B", "#E11D48", "#059669", "#2563EB", "#7C3AED"].map(c => <button key={c} onClick={() => setBrand({ ...brand, primaryColor: c })} className="w-8 h-8 rounded-full border-2 transition hover:scale-110" style={{ background: c, borderColor: brand.primaryColor === c ? "var(--text)" : "transparent" }} />)}
                </div>
              </label>
              <label className="block text-sm font-bold mt-3">Font<select value={brand.font} onChange={e => setBrand({ ...brand, font: e.target.value })} className="input mt-1.5"><option>Space Grotesk</option><option>DM Sans</option><option>Poppins</option><option>Montserrat</option><option>Urdu Nastaliq</option><option>Playfair Display</option></select></label>
              <label className="block text-sm font-bold mt-3">Watermark Text<input value={brand.watermark} onChange={e => setBrand({ ...brand, watermark: e.target.value })} className="input mt-1.5" /></label>
              <div className="mt-5 p-5 rounded-2xl text-white text-center transition-colors" style={{ background: brand.primaryColor }}>
                <p className="font-display font-bold text-xl" style={{ fontFamily: brand.font }}>{brand.brandName}</p>
                <p className="text-xs opacity-85 mt-0.5">{brand.watermark} · Brand Preview</p>
              </div>
              <button onClick={async () => { await fetch("/api/misc", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "brand", ...brand }) }); notify("Brand kit saved!"); }} className="btn btn-primary w-full mt-4 py-3 text-sm"><CheckCircle2 size={15} /> Save Brand Kit</button>
            </div>
          )}

          {/* ═══════════ TEAM ═══════════ */}
          {view === "team" && (
            <div className="grid lg:grid-cols-2 gap-5 reveal">
              <div className="card p-5">
                <p className="text-xs muted -mt-1">Roles: Admin, Editor, Viewer · Real-time collaboration · Comments &amp; approval</p>
                {team.map((m: any) => (
                  <div key={m.id} className="flex justify-between items-center py-3 border-b hairline last:border-0">
                    <div className="flex gap-3 items-center">
                      <span className="w-9 h-9 rounded-full grid place-items-center font-bold text-sm" style={{ background: "var(--teal)", color: "#04211c" }}>{m.name[0]}</span>
                      <div><p className="font-bold text-sm">{m.name}</p><p className="text-xs muted">{m.email}</p></div>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className="chip cursor-default">{m.role}</span>
                      <button onClick={async () => { await fetch("/api/misc", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "deleteMember", id: m.id }) }); load(); }} className="text-xs font-bold" style={{ color: "var(--danger)" }}>Remove</button>
                    </div>
                  </div>
                ))}
                {team.length === 0 && <p className="text-sm muted py-5">Abhi koi member nahi — pehla member invite karo.</p>}
              </div>
              <div className="card p-5 h-fit">
                <h3 className="font-display font-bold flex items-center gap-2"><Send size={15} style={{ color: "var(--accent)" }} /> Invite Member</h3>
                <input value={invite.name} onChange={e => setInvite({ ...invite, name: e.target.value })} placeholder="Name" className="input mt-3" />
                <input value={invite.email} onChange={e => setInvite({ ...invite, email: e.target.value })} placeholder="Email" className="input mt-2" />
                <select value={invite.role} onChange={e => setInvite({ ...invite, role: e.target.value })} className="input mt-2"><option>Admin</option><option>Editor</option><option>Viewer</option></select>
                <button onClick={async () => { if (!invite.name || !invite.email) return notify("Name & email likho"); await fetch("/api/misc", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "invite", ...invite }) }); setInvite({ name: "", email: "", role: "Editor" }); notify("Invite sent!"); load(); }} className="btn btn-primary w-full mt-3 py-3 text-sm"><Send size={14} /> Send Invite</button>
              </div>
            </div>
          )}

          {/* ═══════════ PRICING ═══════════ */}
          {view === "pricing" && (
            <div className="reveal">
              <div className="text-center mb-7">
                <h2 className="font-display font-bold text-2xl md:text-3xl">Pakistan / India ke liye sab se <span style={{ color: "var(--accent)" }}>sasta</span> AI Video</h2>
                <p className="text-sm muted mt-1.5">JazzCash · EasyPaisa · Stripe · PayPal · UPI · Crypto accepted</p>
              </div>
              <div className="grid md:grid-cols-4 gap-4">
                {PLANS.map((p, i) => (
                  <div key={p.name} className={`card card-hover p-5 relative reveal ${p.popular ? "!border-2" : ""}`} style={{ animationDelay: `${i * 70}ms`, ...(p.popular ? { borderColor: "var(--accent)", boxShadow: "0 18px 50px -24px color-mix(in srgb, var(--accent) 55%, transparent)" } : {}) }}>
                    {p.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 chip chip-on !text-[10px]"><Star size={10} /> MOST POPULAR</span>}
                    <p className="font-display font-bold">{p.name}</p>
                    <p className="font-display font-bold text-[1.7rem] mt-2 leading-none">{p.price === 0 ? "Free" : "PKR " + p.price.toLocaleString()}<span className="text-xs font-normal muted"> /mo</span></p>
                    <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "var(--teal)" }}><Zap size={11} /> {p.credits.toLocaleString()} credits / month</p>
                    <ul className="text-xs space-y-1.5 mt-3.5">{p.features.map(f => <li key={f} className="flex gap-1.5"><CheckCircle2 size={13} className="shrink-0 mt-px" style={{ color: "var(--teal)" }} />{f}</li>)}</ul>
                    <button onClick={() => { if (p.price === 0) { notify("Free plan already active!"); return; } setCheckoutItem({ name: `${p.name} Plan`, price: p.price, credits: p.credits, isPlan: true }); }} className={`btn w-full mt-4 py-2.5 text-sm ${p.popular ? "btn-primary" : "btn-ghost"}`}>{p.price === 0 ? "Current Plan" : "Subscribe Now"}</button>
                  </div>
                ))}
              </div>
              <div className="card p-5 mt-6">
                <p className="font-bold text-sm mb-3 flex items-center gap-1.5"><CreditCard size={14} style={{ color: "var(--accent)" }} /> Payment method select karo</p>
                <div className="flex flex-wrap gap-2">{["JazzCash", "EasyPaisa", "Stripe Card", "PayPal", "UPI", "Crypto", "Bank Transfer"].map(m => <button key={m} onClick={() => setPayMethod(m)} className={`chip ${payMethod === m ? "chip-on" : ""}`}>{m}</button>)}</div>
                <div className="grid md:grid-cols-3 gap-3 mt-5">
                  {[[500, "PKR 999", 999], [2000, "PKR 3,499", 3499], [10000, "PKR 12,999", 12999]].map(([c, pr, costNum]) => (
                    <button key={c} onClick={() => setCheckoutItem({ name: `${c} Credits Pack`, price: costNum as number, credits: c as number, isPlan: false })} className="card card-hover p-4 text-left !rounded-2xl">
                      <p className="font-display font-bold flex items-center gap-1.5"><Zap size={15} style={{ color: "var(--accent)" }} />{c} Credits</p>
                      <p className="text-xs muted mt-1">{pr} · one-time · JazzCash / EasyPaisa / Card</p>
                    </button>
                  ))}
                </div>
                <div className="grid md:grid-cols-2 gap-3 mt-5">
                  <div className="panel2 rounded-2xl p-4">
                    <p className="font-bold text-sm flex items-center gap-1.5"><Gift size={14} style={{ color: "var(--accent)" }} /> Daily free credits</p>
                    <p className="text-[11px] muted mt-1">Har din login par +10 credits — abhi claim karo.</p>
                    <button onClick={async () => { const r = await fetch("/api/misc", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "dailyBonus", email }) }); const d = await r.json(); if (d.user) setUser(d.user); notify(d.message || "Bonus claimed"); load(); }} className="btn btn-primary px-3.5 py-2 text-xs mt-2">Claim +10 credits</button>
                  </div>
                  <div className="panel2 rounded-2xl p-4">
                    <p className="font-bold text-sm flex items-center gap-1.5"><Users size={14} style={{ color: "var(--teal)" }} /> Referral program</p>
                    <p className="text-[11px] muted mt-1">Aapka code: <b className="font-mono">{user?.email ? "MIRAI-" + user.email.slice(0, 4).toUpperCase() : "MIRAI-DEMO"}</b> — dost ko share karo.</p>
                    <div className="flex gap-1.5 mt-2">
                      <input value={referral} onChange={e => setReferral(e.target.value.toUpperCase())} placeholder="MIRAI-XXXX" className="input !py-1.5 text-xs" />
                      <button onClick={async () => { const r = await fetch("/api/misc", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "refer", email, code: referral }) }); const d = await r.json(); if (d.user) setUser(d.user); notify(d.message || (d.ok ? "Referral applied" : "Invalid code")); load(); }} className="btn btn-teal px-3 text-xs shrink-0">Redeem</button>
                    </div>
                  </div>
                </div>
                <p className="text-xs muted mt-3">Credits 90 din valid · Storage used: <b>{storage ? `${storage.usedMb} MB (${storage.files} files)` : "…"}</b> · Auto-backup ON</p>
              </div>
            </div>
          )}

          {/* ═══════════ API ═══════════ */}
          {view === "api" && (
            <div className="grid lg:grid-cols-2 gap-5 reveal">
              <div className="card p-5">
                <p className="text-xs muted -mt-1">REST API · Webhooks · JS/Python SDK · Rate limit: 100 req/min (Pro)</p>
                {keys.map((k: any) => (
                  <div key={k.id} className="py-3 border-b hairline">
                    <p className="font-bold text-sm flex items-center gap-1.5"><KeyRound size={13} style={{ color: "var(--accent)" }} />{k.name}</p>
                    <div className="flex gap-2 items-center mt-1.5">
                      <code className="panel2 px-2.5 py-1.5 rounded-lg text-xs flex-1 truncate font-mono">{k.keyValue}</code>
                      <button onClick={() => { navigator.clipboard.writeText(k.keyValue); notify("Key copied"); }} className="text-xs font-bold" style={{ color: "var(--accent)" }}>Copy</button>
                      <button onClick={async () => { await fetch("/api/misc", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "deleteKey", id: k.id }) }); load(); }} className="text-xs font-bold" style={{ color: "var(--danger)" }}>Revoke</button>
                    </div>
                  </div>
                ))}
                {keys.length === 0 && <p className="text-sm muted py-4">Koi key nahi — pehli API key banao.</p>}
                <div className="flex gap-2 mt-4">
                  <input value={keyName} onChange={e => setKeyName(e.target.value)} className="input flex-1 !py-2.5" />
                  <button onClick={async () => { await fetch("/api/misc", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "createKey", name: keyName }) }); notify("New API key created"); load(); }} className="btn btn-primary px-4 text-xs shrink-0"><Plus size={13} /> Create Key</button>
                </div>
                <div className="mt-5 pt-4 border-t hairline">
                  <p className="font-bold text-sm flex items-center gap-1.5"><History size={14} style={{ color: "var(--teal)" }} /> Webhooks ({hooks.length})</p>
                  <p className="text-[11px] muted mt-1">Real render complete hone par aapke URL par `render.completed` POST hota hai.</p>
                  {hooks.map((h: any) => (
                    <div key={h.id} className="flex gap-2 items-center py-1.5 text-[11px] border-b hairline last:border-0">
                      <span className="chip !text-[9px] chip-teal shrink-0">{h.event}</span>
                      <code className="flex-1 truncate font-mono panel2 px-2 py-1 rounded">{h.url}</code>
                      <button onClick={async () => { await fetch("/api/misc", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "deleteWebhook", id: h.id }) }); notify("Webhook removed"); load(); }} className="text-[10px] font-bold shrink-0" style={{ color: "var(--danger)" }}>Remove</button>
                    </div>
                  ))}
                  <div className="flex gap-2 mt-2">
                    <input value={hookUrl} onChange={e => setHookUrl(e.target.value)} placeholder="https://your-server.com/webhook" className="input flex-1 !py-2 text-xs" />
                    <button onClick={async () => { await fetch("/api/misc", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "addWebhook", url: hookUrl, email }) }); setHookUrl(""); notify("Webhook added"); load(); }} className="btn btn-teal px-3 text-xs shrink-0">Add</button>
                  </div>
                </div>
              </div>
              <div className="rounded-3xl p-5 border hairline" style={{ background: "#0a0f1a", color: "#e5eaf5" }}>
                <p className="font-display font-bold text-sm flex items-center gap-2"><Code2 size={15} style={{ color: "var(--teal)" }} /> Quick Start — JavaScript SDK</p>
                <pre className="text-xs mt-3 whitespace-pre-wrap leading-relaxed" style={{ color: "#5eead4" }}>{`import MirAI from "mirai-sdk";

const client = new MirAI("mirai_xxx");

const video = await client.generate({
  prompt: "Karachi sunset, cinematic",
  style: "cinematic", duration: 15,
  aspectRatio: "9:16", voice: "urdu-female",
  subtitles: true
});

console.log(video.url); // 4K MP4 ready
// POST /api/v1/generate
// GET  /api/v1/projects/:id
// POST /api/v1/avatar, /voice, /subtitles`}</pre>
                <div className="flex flex-wrap gap-2 mt-4">
                  <button onClick={async () => {
                      const key = keys[0]?.keyValue;
                      if (!key) return notify("Pehle API key banao");
                      setTesting(true); setApiTest("");
                      const r = await fetch("/api/v1/generate", { method: "POST", headers: { "Content-Type": "application/json", "x-api-key": key }, body: JSON.stringify({ prompt: "Karachi sunset drone, cinematic", duration: 5, resolution: "720p", aspectRatio: "9:16" }) });
                      const txt = await r.text();
                      setApiTest(`${r.status} ${r.statusText}\n${txt.slice(0, 700)}`);
                      setTesting(false); load();
                    }} disabled={testing} className="btn btn-primary px-4 py-2 text-xs">{testing ? <><Loader2 size={12} className="animate-spin" /> Calling…</> : <><Play size={12} fill="currentColor" /> Run live request</>}</button>
                  <button onClick={() => window.open("https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API", "_blank")} className="btn btn-ghost px-4 py-2 text-xs" style={{ color: "#e5eaf5" }}>Documentation</button>
                  <a href="/api/health" target="_blank" className="btn btn-ghost px-4 py-2 text-xs" style={{ color: "#e5eaf5" }}>Health check</a>
                </div>
                {apiTest && <pre className="text-[10px] mt-3 p-3 rounded-xl overflow-auto max-h-40" style={{ background: "#050a14", color: "#5eead4" }}>{apiTest}</pre>}
              </div>
            </div>
          )}

          {/* ═══════════ ADMIN ═══════════ */}
          {view === "admin" && (
            <div className="reveal">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                {[["Active Users", "12,480", "+18%"], ["MRR", "PKR 8.4L", "+24%"], ["Videos Rendered", String(projects.length + 1840), "GPU"], ["Avg Render Time", "42 sec", "fast"], ["Conversion", "6.8%", "+0.6%"], ["Churn", "1.9%", "−0.3%"], ["Top Style", "Cinematic", ""], ["Top Language", "Urdu", "PK"]].map(([l, v, s], i) => (
                  <div key={l} className="card card-hover p-4 reveal" style={{ animationDelay: `${i * 40}ms` }}>
                    <p className="text-xs muted">{l}</p>
                    <p className="font-display font-bold text-xl mt-1">{v}</p>
                    <p className="text-xs font-bold" style={{ color: "var(--teal)" }}>{s}</p>
                  </div>
                ))}
              </div>
              <div className="grid lg:grid-cols-2 gap-4">
                <div className="card p-5">
                  <p className="font-bold text-sm flex items-center gap-1.5"><TrendingUp size={14} style={{ color: "var(--teal)" }} /> Revenue — Last 6 Months (PKR Lakh)</p>
                  <div className="flex items-end gap-2 h-36 mt-3">{[3.2, 4.1, 5.0, 6.3, 7.1, 8.4].map((h, i) => <div key={i} className="flex-1 rounded-t transition-all hover:opacity-80" style={{ height: (h / 9 * 100) + "%", background: i === 5 ? "var(--accent)" : "color-mix(in srgb, var(--teal) 55%, transparent)" }} />)}</div>
                  <div className="flex justify-between text-[10px] muted"><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span></div>
                  <p className="font-bold text-sm mt-6 mb-1">Popular Templates</p>
                  {TEMPLATES.slice(0, 4).map(t => <div key={t.name} className="flex justify-between text-sm py-2 border-b hairline last:border-0"><span>{t.name}</span><span className="muted">{t.uses}</span></div>)}
                </div>
                <div className="card p-5">
                  <p className="font-bold text-sm mb-1">Admin Controls</p>
                  {[["User Management", "12,480 users, plans & bans", Users], ["Content Moderation", "3 videos flagged for review", ShieldCheck], ["Coupons", "URDU50 — 50% off active", CreditCard], ["Email Campaigns", "Last: Eid Sale (42% open)", Send], ["Feature Flags", "Voice Clone v2: ON", Layers], ["Support Tickets", "7 open, avg reply 12 min", Activity], ["Audit Logs", "All admin actions logged", FileText], ["A/B Testing", "Pricing page B: +12% conv.", BarChart3]].map(([t, d, I]: any) => (
                    <div key={t} className="flex justify-between items-center py-2.5 border-b hairline last:border-0 gap-2">
                      <div className="flex gap-2.5 items-center min-w-0"><I size={15} style={{ color: "var(--accent)" }} className="shrink-0" /><div className="min-w-0"><p className="font-bold text-sm">{t}</p><p className="text-xs muted truncate">{d}</p></div></div>
                      <button onClick={() => notify(t + " opened")} className="btn btn-ghost px-3 py-1.5 text-xs shrink-0">Manage</button>
                    </div>
                  ))}
                  <div className="mt-4 pt-4 border-t hairline">
                    <p className="font-bold text-sm flex items-center gap-1.5"><Ticket size={14} style={{ color: "var(--accent)" }} /> Support Ticket</p>
                    <input value={support.subject} onChange={e => setSupport({ ...support, subject: e.target.value })} placeholder="Subject" className="input !py-2 text-xs mt-2" />
                    <textarea value={support.message} onChange={e => setSupport({ ...support, message: e.target.value })} rows={2} placeholder="Apni problem likhein…" className="input mt-1.5 text-xs" />
                    <button onClick={async () => { const r = await fetch("/api/misc", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "createTicket", ...support, email }) }); if (r.ok) { setSupport({ subject: "", message: "" }); notify("Ticket submit — reply 12 min mein (avg)"); } else notify("Subject & message required"); }} className="btn btn-primary w-full mt-2 py-2 text-xs"><Send size={12} /> Submit to support</button>
                  </div>
                  <p className="font-bold text-sm mt-4 mb-2">System Health</p>
                  <div className="space-y-1.5 text-xs">
                    <p className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full pulse-dot" style={{ background: "var(--teal)" }} /> API — 99.9% uptime</p>
                    <p className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full pulse-dot" style={{ background: "var(--teal)" }} /> GPU Render Queue — 42 sec avg</p>
                    <p className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full pulse-dot" style={{ background: "var(--teal)" }} /> Database — PostgreSQL connected</p>
                    <p className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full pulse-dot" style={{ background: "var(--accent)" }} /> Storage — 78% (S3 + CDN)</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── VIDEO PLAYER MODAL ─────────────────────── */}
      {playing && (
        <div className="fixed inset-0 bg-black/90 z-50 grid place-items-center p-4 backdrop-blur-sm" onClick={() => setPlaying(null)}>
          <div className="w-full max-w-3xl rounded-3xl overflow-hidden border hairline reveal" style={{ background: "var(--panel)", color: "var(--text)" }} onClick={e => e.stopPropagation()}>
            <video src={playing.videoUrl} controls autoPlay className="w-full max-h-[58vh] bg-black" />
            <div className="p-4">
              <div className="flex justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-display font-bold truncate">{playing.title}</p>
                  <p className="text-xs muted mt-1 line-clamp-2">{playing.prompt}</p>
                  <p className="text-xs mt-1">{playing.style} · {playing.duration}s · {playing.aspectRatio} · {playing.resolution} · {playing.voice}</p>
                </div>
                <button onClick={() => setPlaying(null)} className="btn btn-ghost w-8 h-8 shrink-0 !p-0"><X size={16} /></button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <button onClick={() => downloadVideo(playing)} className="btn btn-primary px-4 py-2 text-xs"><Download size={13} /> Export MP4</button>
                <button onClick={() => downloadProjectSRT(playing)} className="btn btn-ghost px-4 py-2 text-xs"><Captions size={13} /> Download .SRT</button>
                <button onClick={() => { navigator.clipboard.writeText(window.location.origin + playing.videoUrl); notify("Video URL copied!"); }} className="btn btn-ghost px-4 py-2 text-xs"><Share2 size={13} /> Share Link</button>
                <button onClick={() => window.open("https://studio.youtube.com/channel/upload", "_blank")} className="btn px-4 py-2 text-xs text-white" style={{ background: "#dc2626" }}><Tv size={13} /> YouTube Upload</button>
                <button onClick={() => { setPlaying(null); setView("editor"); }} className="btn btn-ghost px-4 py-2 text-xs"><Scissors size={13} /> Edit</button>
                <button onClick={() => { setRenderProject(playing); setPlaying(null); }} className="btn btn-teal px-4 py-2 text-xs"><Clapperboard size={13} /> Render Real Video</button>
              </div>
              {playing.scenes?.length > 0 && <div className="grid grid-cols-2 gap-2 mt-3">{playing.scenes.map((s: any) => <div key={s.n} className="panel2 rounded-xl p-2.5 text-xs"><b className="flex items-center gap-1"><Film size={11} style={{ color: "var(--teal)" }} />Scene {s.n}: {s.title}</b><span className="muted">{s.desc}</span></div>)}</div>}
            </div>
          </div>
        </div>
      )}

      {/* ── REAL RENDER ENGINE ─────────────────────── */}
      {renderProject && (
        <RenderStudio project={renderProject} email={email} onDone={load} onClose={() => setRenderProject(null)} onToast={notify} />
      )}

      {/* ── CHECKOUT MODAL ─────────────────────── */}
      {checkoutItem && (
        <CheckoutModal
          item={checkoutItem}
          initialMethod={payMethod}
          email={email}
          onSuccess={(c, plan) => {
            setCheckoutItem(null);
            notify(`Payment confirmed! +${c} credits added.`);
            load();
          }}
          onClose={() => setCheckoutItem(null)}
        />
      )}

      {/* ── LAUNCH READINESS MODAL ─────────────────────── */}
      {launchModal && (
        <LaunchChecklist onClose={() => setLaunchModal(false)} onToast={notify} />
      )}

      {/* ── IMAGE LAB ─────────────────────── */}
      {labOpen && <ImageLab projectId={labProject?.id} onThumbnail={() => { load(); }} onToast={notify} onClose={() => { setLabOpen(false); setLabProject(null); }} />}

      {/* ── REVIEW / VERSIONS ─────────────────────── */}
      {workspace && <ProjectWorkspace project={workspace} onToast={notify} onClose={() => setWorkspace(null)} onChange={load} />}

      {/* ── COMMAND PALETTE / ONBOARDING ─────────────────────── */}
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} items={[
        ...NAV.map(n => ({ id: "nav-" + n.id, label: n.label, hint: "Studio view", group: "Tools", run: () => go(n.id) })),
        ...projects.filter(p => !p.deleted).slice(0, 12).map(p => ({ id: "p-" + p.id, label: p.title, hint: p.prompt?.slice(0, 60), group: "Projects", run: () => { setProjSearch(""); setFolder("All"); setView("projects"); } })),
        ...TEMPLATES.map(t => ({ id: "t-" + t.name, label: t.name, hint: t.cat + " · " + t.dur, group: "Templates", run: () => { setPrompt(t.name + " — viral style video"); setTitle(t.name); setView("create"); } })),
        { id: "act-create", label: "Create new AI video", hint: "Shortcut: N", group: "Actions", run: () => setView("create") },
        { id: "act-render", label: "Render latest project (real MP4/WebM)", hint: "Shortcut: R", group: "Actions", run: () => { const p = projects[0]; if (p) setRenderProject(p); } },
        { id: "act-lab", label: "Open Image Lab", hint: "Background remove, upscale, thumbnail", group: "Actions", run: () => { setLabProject(null); setLabOpen(true); } },
        { id: "act-daily", label: "Claim daily bonus credits", group: "Actions", run: async () => { const r = await fetch("/api/misc", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "dailyBonus", email }) }); const d = await r.json(); if (d.user) setUser(d.user); notify(d.message || "Bonus claimed"); load(); } },
        { id: "act-install", label: "Install mobile app (PWA)", group: "Actions", run: () => { window.location.href = "/mobile-preview"; } },
      ]} />
      {onboarding && <Onboarding onClose={() => { localStorage.setItem("mirai_onboarded", "1"); setOnboarding(false); }} />}

      {/* ── AUTH MODAL ─────────────────────── */}
      {authOpen && <AuthModal close={() => setAuthOpen(false)} onDone={(u: any) => { setUser(u); localStorage.setItem("mirai_email", u.email); setAuthOpen(false); notify("Welcome, " + u.name + "!"); load(); }} />}

      {toast && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 px-5 py-3 rounded-full font-bold text-sm z-[60] shadow-2xl max-w-[90vw] text-center reveal flex items-center gap-2" style={{ background: "var(--accent)", color: "var(--accent-ink)" }}>
          <CheckCircle2 size={15} /> {toast}
        </div>
      )}

      <footer className="relative z-10 text-xs muted py-8 px-4 border-t hairline mt-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <p className="font-display font-bold text-sm text-[var(--text)]">Mir AI Studio v1.0</p>
            <p className="text-[11px] muted mt-0.5">AI Video Generator · Urdu / Hindi · All-in-One Creation Platform</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px]">
            <a href="/privacy" className="hover:underline">Privacy Policy</a>
            <a href="/terms" className="hover:underline">Terms of Service</a>
            <a href="/refund" className="hover:underline">Refund Guarantee</a>
            <a href="/mobile-preview" className="hover:underline">Mobile App</a>
            <button onClick={() => setLaunchModal(true)} className="hover:underline text-emerald-400 font-bold">Launch Center</button>
          </div>
          <p className="text-[10px] muted">© 2026 Mir AI Studio · Built for Creators</p>
        </div>
      </footer>
    </div>
  );
}

function Field({ label, icon, children }: { label: string; icon?: any; children: any }) {
  return <div><p className="text-xs font-bold muted mb-1.5 flex items-center gap-1">{icon}{label}</p>{children}</div>;
}

function ProjectCard({ p, i = 0, onPlay, onFav, onDelete, onDup, onRender, onComments, onLab }: any) {
  return (
    <div className="card card-hover overflow-hidden group reveal" style={{ animationDelay: `${i * 55}ms` }}>
      <div className="relative cursor-pointer overflow-hidden" onClick={onPlay}>
        <img src={p.thumbnail} alt={p.title} className="h-36 w-full object-cover group-hover:scale-110 transition duration-500" />
        <div className="absolute inset-0 grid place-items-center">
          <span className="w-11 h-11 rounded-full bg-black/60 text-white grid place-items-center group-hover:scale-110 transition"><Play size={17} fill="currentColor" /></span>
        </div>
        <span className="absolute bottom-2 right-2 bg-black/75 text-white text-[11px] px-2 py-0.5 rounded-full">{p.duration}s · {p.resolution}</span>
        <span className="absolute top-2 left-2 text-[11px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1" style={p.status === "completed" ? { background: "var(--teal)", color: "#04211c" } : { background: "var(--accent)", color: "var(--accent-ink)" }}>
          {p.status === "completed" ? <><CheckCircle2 size={10} /> Ready</> : <><Loader2 size={10} className="animate-spin" /> {p.progress}%</>}
        </span>
      </div>
      <div className="p-3">
        <p className="font-bold text-sm truncate">{p.title}</p>
        <p className="text-xs muted truncate mt-0.5">{p.prompt}</p>
        <p className="text-[11px] muted mt-1">{p.style} · {p.type} · {new Date(p.createdAt).toLocaleDateString()}</p>
        {p.status === "generating" && <div className="h-1.5 rounded-full mt-2 overflow-hidden" style={{ background: "color-mix(in srgb, var(--text) 10%, transparent)" }}><div className="h-1.5 rounded-full relative" style={{ width: p.progress + "%", background: "var(--accent)" }}><span className="absolute inset-0 shimmer" /></div></div>}
        <div className="flex gap-1.5 mt-2.5">
          <button onClick={onPlay} className="btn btn-primary flex-1 py-1.5 text-xs"><Play size={12} fill="currentColor" /> Play</button>
          {onRender && <button onClick={onRender} title="Render real video" className="btn btn-teal px-2.5"><Clapperboard size={13} /></button>}
          {onComments && <button onClick={onComments} title="Comments, versions & approval" className="btn btn-ghost px-2.5"><MessageSquare size={13} /></button>}
          {onLab && <button onClick={onLab} title="Image Lab / thumbnail" className="btn btn-ghost px-2.5"><Wand2 size={13} /></button>}
          <button onClick={onFav} title="Favorite" className="btn btn-ghost px-2.5"><Heart size={13} fill={p.isFavorite ? "var(--danger)" : "none"} style={{ color: p.isFavorite ? "var(--danger)" : undefined }} /></button>
          {onDup && <button onClick={onDup} title="Duplicate" className="btn btn-ghost px-2.5"><Copy size={13} /></button>}
          <button onClick={onDelete} title="Delete" className="btn btn-ghost px-2.5"><Trash2 size={13} /></button>
        </div>
      </div>
    </div>
  );
}

function AuthModal({ close, onDone }: any) {
  const [name, setName] = useState("Demo Creator"); const [email, setEmail] = useState("demo@mirai.app"); const [mode, setMode] = useState("signup");
  async function submit() {
    const r = await fetch("/api/misc", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "signup", name, email }) });
    const d = await r.json(); onDone(d.user || { name, email, credits: 120, plan: "Free" });
  }
  return (
    <div className="fixed inset-0 bg-black/80 z-50 grid place-items-center p-4 backdrop-blur-sm" onClick={close}>
      <div className="rounded-3xl p-6 w-full max-w-sm border hairline reveal" style={{ background: "var(--panel)", color: "var(--text)" }} onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center">
          <h3 className="font-display font-bold text-lg flex items-center gap-2"><Clapperboard size={18} style={{ color: "var(--accent)" }} /> Mir AI Studio</h3>
          <button onClick={close} className="btn btn-ghost w-8 h-8 !p-0"><X size={15} /></button>
        </div>
        <p className="text-xs muted mt-1.5">{mode === "signup" ? "Account banao — 120 free credits milein ge!" : "Welcome back!"}</p>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name" className="input mt-4" />
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="input mt-2" />
        <input type="password" placeholder="Password" className="input mt-2" />
        <button onClick={submit} className="btn btn-primary w-full mt-3 py-3 text-sm">{mode === "signup" ? "Create Account + 120 Credits" : "Login"}</button>
        <div className="grid grid-cols-3 gap-2 mt-3">{["Google", "Facebook", "Apple"].map(s => <button key={s} onClick={submit} className="btn btn-ghost py-2 text-xs">{s}</button>)}</div>
        <button onClick={() => setMode(mode === "signup" ? "login" : "signup")} className="text-xs mt-3 font-bold" style={{ color: "var(--accent)" }}>{mode === "signup" ? "Already have account? Login" : "New here? Sign up"}</button>
        <p className="text-[11px] muted mt-2">Phone OTP, 2FA &amp; Guest mode bhi available hain (Settings mein).</p>
      </div>
    </div>
  );
}

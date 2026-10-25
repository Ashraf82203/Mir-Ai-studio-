"use client";
import { useEffect, useState } from "react";
import {
  Home, Sparkles, FolderOpen, Wallet, User, Clapperboard, Wand2, ImagePlus, Repeat, Users,
  Play, Heart, Trash2, Copy, Download, Share2, X, Zap, CheckCircle2, Loader2, Bell, Search,
  ChevronRight, CreditCard, Mic, Captions, Clock, Video, Star, RefreshCw, Wifi, WifiOff,
  Moon, Sun, Globe2, ShieldCheck, LogOut, Smartphone, FileText, Plus, Settings2, HardDrive,
  TrendingUp, Music, Languages, HelpCircle, MonitorSmartphone, Gift,
} from "lucide-react";
import { STYLES, VOICES, AVATARS, TEMPLATES, PLANS } from "@/lib/data";
import RenderStudio from "@/components/RenderStudio";
import CheckoutModal from "@/components/CheckoutModal";

type Tab = "home" | "create" | "projects" | "wallet" | "profile";
const TABS: { id: Tab; icon: any; label: string }[] = [
  { id: "home", icon: Home, label: "Home" },
  { id: "create", icon: Sparkles, label: "Create" },
  { id: "projects", icon: FolderOpen, label: "Projects" },
  { id: "wallet", icon: Wallet, label: "Wallet" },
  { id: "profile", icon: User, label: "Profile" },
];

export default function MobileApp() {
  const [tab, setTab] = useState<Tab>("home");
  const [dark, setDark] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [tx, setTx] = useState<any[]>([]);
  const [toast, setToast] = useState("");
  const [playing, setPlaying] = useState<any>(null);
  const [splash, setSplash] = useState(true);
  const [online, setOnline] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [installEvt, setInstallEvt] = useState<any>(null);
  const [notif, setNotif] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  const [lang, setLang] = useState("English");
  const [payMethod, setPayMethod] = useState("JazzCash");

  // create form
  const [mode, setMode] = useState("text-to-video");
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("Cinematic");
  const [duration, setDuration] = useState(15);
  const [ratio, setRatio] = useState("9:16");
  const [res, setRes] = useState("1080p");
  const [voice, setVoice] = useState(VOICES[0].name);
  const [avatar, setAvatar] = useState(AVATARS[0].name);
  const [subs, setSubs] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [renderProject, setRenderProject] = useState<any>(null);
  const [checkoutItem, setCheckoutItem] = useState<{ name: string; price: number; credits: number; isPlan?: boolean } | null>(null);
  // projects
  const [q, setQ] = useState("");
  const [favOnly, setFavOnly] = useState(false);
  // voice quick
  const [ttsText, setTtsText] = useState("Assalam-o-Alaikum! Aaj hum AI video banayenge.");

  const email = typeof window !== "undefined"
    ? (localStorage.getItem("mirai_email") || localStorage.getItem("vidai_email") || "demo@mirai.app")
    : "demo@mirai.app";

  async function load(silent = true) {
    if (!silent) setRefreshing(true);
    try {
      const r = await fetch(`/api/projects?email=${encodeURIComponent(email)}`);
      const d = await r.json();
      setProjects(d.projects || []); if (d.user) setUser(d.user); setTx(d.transactions || []);
      setOnline(true);
    } catch { setOnline(false); }
    setRefreshing(false);
  }
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("tab") as Tab | null;
    if (t && TABS.some(x => x.id === t)) setTab(t);
    setDark((localStorage.getItem("mirai_theme") || localStorage.getItem("vidai_theme")) !== "light");
    load();
    const splashT = setTimeout(() => setSplash(false), 1400);
    const poll = setInterval(() => load(), 4000);
    const onInstall = (e: any) => { e.preventDefault(); setInstallEvt(e); };
    const on = () => setOnline(true), off = () => setOnline(false);
    window.addEventListener("beforeinstallprompt", onInstall);
    window.addEventListener("online", on); window.addEventListener("offline", off);
    return () => { clearTimeout(splashT); clearInterval(poll); window.removeEventListener("beforeinstallprompt", onInstall); window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);

  function notify(m: string) { setToast(m); setTimeout(() => setToast(""), 3000); if (notif && "vibrate" in navigator) navigator.vibrate?.(15); }
  function toggleDark(v: boolean) { setDark(v); localStorage.setItem("mirai_theme", v ? "dark" : "light"); }
  async function ai(action: string, text: string) {
    const r = await fetch("/api/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, text, prompt: text }) });
    return r.json();
  }
  const cost = Math.round(duration * (res === "4K" ? 3 : res === "1080p" ? 2 : 1));
  async function generate() {
    if (!prompt.trim()) return notify("Prompt likhein pehle");
    if (user && user.credits < cost) { notify(`Credits kam hain (${user.credits}/${cost}) — Wallet se buy karein`); setTab("wallet"); return; }
    setGenerating(true);
    const r = await fetch("/api/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt, type: mode, style, duration, aspectRatio: ratio, resolution: res, voice, avatar: mode === "avatar" ? avatar : "", subtitles: subs, email }) });
    const d = await r.json(); setGenerating(false);
    if (d.project) { notify(`Project ready — ab asli video render hoga`); setPrompt(""); await load(); setRenderProject(d.project); }
    else notify("Error: " + (d.error || "failed"));
  }
  async function patchProj(id: number, body: any) { await fetch(`/api/projects/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); load(); }
  async function deleteProj(id: number) { if (!confirm("Delete this project?")) return; await fetch(`/api/projects/${id}`, { method: "DELETE" }); notify("Project deleted"); load(); }
  async function buyCredits(credits: number, plan?: string) {
    const r = await fetch("/api/misc", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "buyCredits", credits, plan, method: payMethod, email }) });
    const d = await r.json(); if (d.user) setUser(d.user);
    notify(`${plan ? plan + " plan active! " : ""}+${credits} credits via ${payMethod}`); load();
  }
  async function install() {
    if (installEvt) { installEvt.prompt(); const c = await installEvt.userChoice; if (c.outcome === "accepted") notify("Mir AI installed! Home screen check karein"); setInstallEvt(null); }
    else notify("Browser menu → 'Add to Home Screen' / 'Install App'");
  }
  function downloadSRT(p: any) {
    const lines = (p.scenes?.length ? p.scenes.map((s: any) => s.desc) : (p.prompt || p.title).split('.').filter(Boolean));
    let srt = "";
    lines.forEach((l: string, i: number) => {
      const start = i * 4; const end = (i + 1) * 4;
      const pad = (n: number) => n.toString().padStart(2, "0");
      srt += `${i + 1}\n00:00:${pad(start)},000 --> 00:00:${pad(end)},000\n${l.trim()}\n\n`;
    });
    const blob = new Blob([srt || "1\n00:00:00,000 --> 00:00:05,000\nMir AI Studio Generated Video\n"], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${(p.title || "video").replace(/\s+/g, "_")}.srt`;
    a.click();
    notify("Downloaded subtitles (.SRT)");
  }
  function speak() {
    if (!("speechSynthesis" in window)) return notify("TTS not supported");
    speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(ttsText); speechSynthesis.speak(u); notify("Playing AI voice…");
  }

  const filtered = projects.filter(p => (!favOnly || p.isFavorite) && (p.title + p.prompt).toLowerCase().includes(q.toLowerCase()));
  const rendering = projects.filter(p => p.status === "generating");
  const completed = projects.filter(p => p.status === "completed");

  /* ── SPLASH ── */
  if (splash) return (
    <div className="theme-dark app-shell fixed inset-0 grid place-items-center z-[100]">
      <div className="ambient" />
      <div className="text-center relative reveal">
        <div className="w-20 h-20 rounded-3xl mx-auto grid place-items-center shadow-2xl" style={{ background: "var(--accent)", color: "var(--accent-ink)" }}><Clapperboard size={38} strokeWidth={2.3} /></div>
        <p className="font-display font-bold text-2xl mt-4">Mir AI <span style={{ color: "var(--accent)" }}>Studio</span></p>
        <p className="text-xs muted mt-1">AI Video Generator · Urdu / Hindi</p>
        <div className="flex justify-center gap-1.5 mt-5">{[0, 0.15, 0.3].map(d => <span key={d} className="w-2 h-2 rounded-full pulse-dot" style={{ background: "var(--teal)", animationDelay: d + "s" }} />)}</div>
      </div>
    </div>
  );

  return (
    <div className={`app-shell min-h-[100dvh] relative ${dark ? "theme-dark" : "theme-light"}`}>
      <div className="ambient" />
      <div className="relative z-10 max-w-md mx-auto min-h-[100dvh] flex flex-col">

        {/* ── APP BAR ── */}
        <header className="sticky top-0 z-40 px-4 pt-3 pb-2.5 backdrop-blur-md border-b hairline flex items-center gap-2.5" style={{ background: "color-mix(in srgb, var(--bg) 86%, transparent)", paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}>
          <span className="w-8 h-8 rounded-xl grid place-items-center" style={{ background: "var(--accent)", color: "var(--accent-ink)" }}><Clapperboard size={16} strokeWidth={2.4} /></span>
          <div className="min-w-0">
            <p className="font-display font-bold leading-none whitespace-nowrap">Mir AI <span style={{ color: "var(--accent)" }}>Studio</span></p>
            <p className="text-[9px] muted mt-0.5 flex items-center gap-1 truncate">AI Video Generator · Urdu / Hindi<span className="inline-flex items-center gap-0.5 ml-1">{online ? <Wifi size={8} style={{ color: "var(--teal)" }} /> : <WifiOff size={8} style={{ color: "var(--danger)" }} />}{online ? "Online" : "Offline"}</span></p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => setTab("wallet")} className="btn btn-primary px-3 py-1.5 text-[11px]"><Zap size={12} />{user?.credits ?? 120}</button>
            <button onClick={() => notify(rendering.length ? `${rendering.length} video render ho rahi hai` : "Koi nayi notification nahi")} className="btn btn-ghost w-8 h-8 !p-0 relative"><Bell size={15} />{rendering.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full pulse-dot" style={{ background: "var(--danger)" }} />}</button>
          </div>
        </header>

        <main className="flex-1 px-4 pt-4 pb-28">

          {/* ═══ HOME ═══ */}
          {tab === "home" && (
            <div className="space-y-5">
              <div className="reveal">
                <p className="text-xs muted">Assalam-o-Alaikum 👋</p>
                <h1 className="font-display font-bold text-2xl leading-tight mt-0.5">{user?.name || "Demo Creator"}</h1>
              </div>

              {/* quick prompt */}
              <div className="card p-4 reveal" style={{ animationDelay: "60ms" }}>
                <p className="text-sm font-bold flex items-center gap-1.5"><Wand2 size={14} style={{ color: "var(--accent)" }} /> Aaj kya banana hai?</p>
                <div className="flex items-center gap-2 panel2 rounded-full pl-3.5 pr-1.5 py-1.5 mt-3 border hairline">
                  <input value={prompt} onChange={e => setPrompt(e.target.value)} onKeyDown={e => { if (e.key === "Enter") setTab("create"); }} placeholder="Prompt likho… e.g. Lahore street food" className="bg-transparent flex-1 text-sm outline-none min-w-0" />
                  <button onClick={() => setTab("create")} className="btn btn-primary px-3.5 py-2 text-xs shrink-0"><Sparkles size={13} /></button>
                </div>
                <div className="grid grid-cols-4 gap-2 mt-3.5">
                  {[{ m: "text-to-video", I: Wand2, l: "Text", c: "#f59e0b" }, { m: "image-to-video", I: ImagePlus, l: "Image", c: "#d946ef" }, { m: "video-to-video", I: Repeat, l: "Restyle", c: "#3b82f6" }, { m: "avatar", I: Users, l: "Avatar", c: "#10b981" }].map(x => (
                    <button key={x.m} onClick={() => { setMode(x.m); setTab("create"); }} className="flex flex-col items-center gap-1.5 py-2.5 rounded-xl active:scale-95 transition" style={{ background: `linear-gradient(150deg, ${x.c}33, ${x.c}14)`, border: `1px solid ${x.c}55` }}>
                      <x.I size={18} style={{ color: x.c }} /><span className="text-[10px] font-bold">{x.l}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* stats row */}
              <div className="grid grid-cols-3 gap-2 reveal" style={{ animationDelay: "110ms" }}>
                {[{ v: projects.length, l: "Videos", I: Video, g: "linear-gradient(140deg,#ffb43a,#f43f5e)", ink: "#2a0a12" }, { v: completed.length, l: "Ready", I: CheckCircle2, g: "linear-gradient(140deg,#34d399,#0d9488)", ink: "#03251f" }, { v: user?.credits ?? 0, l: "Credits", I: Zap, g: "linear-gradient(140deg,#c084fc,#6366f1)", ink: "#f8f5ff" }].map(s => (
                  <div key={s.l} className="tile p-3 text-center" style={{ backgroundImage: s.g, color: s.ink }}><div className="tile-inner"><s.I size={15} className="mx-auto" /><p className="font-display font-bold text-lg mt-1 leading-none">{s.v}</p><p className="text-[10px] font-bold opacity-85">{s.l}</p></div></div>
                ))}
              </div>

              {/* render queue */}
              {rendering.length > 0 && (
                <div className="p-3.5 rounded-2xl border reveal" style={{ background: "color-mix(in srgb, var(--accent) 10%, transparent)", borderColor: "color-mix(in srgb, var(--accent) 35%, transparent)" }}>
                  <p className="text-xs font-bold flex items-center gap-1.5"><Loader2 size={13} className="animate-spin" style={{ color: "var(--accent)" }} /> GPU par render ho raha hai…</p>
                  {rendering.map(p => (
                    <div key={p.id} className="mt-2">
                      <div className="flex justify-between text-[11px]"><span className="truncate mr-2">{p.title}</span><b>{p.progress}%</b></div>
                      <div className="h-1.5 rounded-full mt-1 overflow-hidden" style={{ background: "color-mix(in srgb, var(--text) 10%, transparent)" }}><div className="h-1.5 rounded-full relative transition-all" style={{ width: p.progress + "%", background: "var(--accent)" }}><span className="absolute inset-0 shimmer" /></div></div>
                    </div>
                  ))}
                </div>
              )}

              {/* recent horizontal */}
              <div className="reveal" style={{ animationDelay: "160ms" }}>
                <div className="flex justify-between items-center mb-2.5">
                  <h2 className="font-display font-bold">Recent Videos</h2>
                  <button onClick={() => setTab("projects")} className="text-xs font-bold flex items-center" style={{ color: "var(--accent)" }}>Sab dekho <ChevronRight size={13} /></button>
                </div>
                <div className="flex gap-3 overflow-x-auto -mx-4 px-4 pb-1 snap-x">
                  {projects.slice(0, 6).map(p => (
                    <button key={p.id} onClick={() => p.status === "completed" && setPlaying(p)} className="w-40 shrink-0 snap-start text-left active:scale-95 transition">
                      <div className="relative rounded-2xl overflow-hidden border hairline">
                        <img src={p.thumbnail} alt={p.title} className="h-24 w-full object-cover" />
                        <span className="absolute inset-0 grid place-items-center"><span className="w-8 h-8 rounded-full bg-black/60 text-white grid place-items-center">{p.status === "completed" ? <Play size={13} fill="currentColor" /> : <Loader2 size={13} className="animate-spin" />}</span></span>
                        <span className="absolute bottom-1.5 right-1.5 bg-black/75 text-white text-[9px] px-1.5 py-0.5 rounded-full">{p.duration}s · {p.resolution}</span>
                      </div>
                      <p className="text-xs font-bold truncate mt-1.5">{p.title}</p>
                      <p className="text-[10px] muted">{p.style}</p>
                    </button>
                  ))}
                  {projects.length === 0 && <p className="text-xs muted py-4">Pehla video banao — Create tab kholo!</p>}
                </div>
              </div>

              {/* templates */}
              <div className="reveal" style={{ animationDelay: "210ms" }}>
                <h2 className="font-display font-bold mb-2.5 flex items-center gap-1.5"><Star size={15} style={{ color: "var(--accent)" }} /> Trending Templates</h2>
                <div className="space-y-2.5">
                  {TEMPLATES.slice(0, 6).map(t => (
                    <button key={t.name} onClick={() => { setPrompt(t.prompt || t.name + " — viral style video"); setStyle(t.style); setRatio(t.ratio); setTab("create"); }} className="card card-hover w-full flex items-center gap-3 p-2.5 text-left active:scale-[0.98]" style={{ borderLeft: `3px solid ${t.color}` }}>
                      <img src={t.img} alt={t.name} className="w-16 h-12 rounded-xl object-cover shrink-0" />
                      <div className="min-w-0 flex-1"><p className="text-sm font-bold truncate">{t.name}</p><p className="text-[11px] muted truncate">{t.cat} · {t.dur} · {t.uses} uses</p></div>
                      <span className="chip-cat shrink-0 text-white" style={{ background: t.color }}>{t.ratio}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* install banner */}
              <button onClick={install} className="w-full p-4 rounded-2xl text-left relative overflow-hidden reveal active:scale-[0.98] transition" style={{ background: "linear-gradient(120deg, color-mix(in srgb, var(--teal) 88%, #000), color-mix(in srgb, var(--teal) 60%, #064e3b))", color: "#04211c", animationDelay: "260ms" }}>
                <Smartphone size={52} className="absolute -right-2 -bottom-3 opacity-20" />
                <p className="font-display font-bold text-sm">Home screen par install karo</p>
                <p className="text-xs opacity-85 mt-0.5">Offline mode · Push notifications · Full-screen app</p>
                <span className="btn mt-2.5 px-3.5 py-1.5 text-[11px]" style={{ background: "rgba(0,0,0,0.8)", color: "#5eead4" }}><Download size={12} /> Install App</span>
              </button>
            </div>
          )}

          {/* ═══ CREATE ═══ */}
          {tab === "create" && (
            <div className="space-y-4">
              <div className="flex gap-1.5 overflow-x-auto -mx-4 px-4 pb-1 reveal">
                {[["text-to-video", "Text", Wand2], ["image-to-video", "Image", ImagePlus], ["video-to-video", "Restyle", Repeat], ["avatar", "Avatar", Users], ["script", "Script", FileText]].map(([m, l, I]: any) => (
                  <button key={m} onClick={() => setMode(m)} className={`chip shrink-0 ${mode === m ? "chip-on" : ""}`}><I size={12} />{l}</button>
                ))}
              </div>

              {mode === "avatar" && (
                <div className="reveal">
                  <p className="text-xs font-bold muted mb-2">Avatar select karo — lip-sync included</p>
                  <div className="flex gap-2 overflow-x-auto -mx-4 px-4 pb-1">
                    {AVATARS.map(a => (
                      <button key={a.name} onClick={() => setAvatar(a.name)} className="w-20 shrink-0 rounded-xl overflow-hidden border-2 relative active:scale-95 transition" style={{ borderColor: avatar === a.name ? "var(--accent)" : "transparent" }}>
                        <img src={a.img} alt={a.name} className="h-20 w-full object-cover" />
                        <p className="text-[10px] font-bold py-1 bg-black/60 text-white">{a.name}</p>
                        {avatar === a.name && <CheckCircle2 size={13} className="absolute top-1 right-1" style={{ color: "var(--accent)" }} />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {(mode === "image-to-video" || mode === "video-to-video") && (
                <button onClick={() => { setPrompt("Golden beach drone footage animated with cinematic dolly-in"); notify("Stock asset selected (camera roll demo)"); }} className="w-full border-2 border-dashed rounded-2xl p-5 text-center active:scale-[0.98] transition reveal" style={{ borderColor: "color-mix(in srgb, var(--accent) 40%, transparent)" }}>
                  <ImagePlus size={24} className="mx-auto" style={{ color: "var(--accent)" }} />
                  <p className="text-xs font-bold mt-2">Gallery / Camera se {mode === "image-to-video" ? "photo" : "video"} select karo</p>
                  <p className="text-[10px] muted mt-0.5">Motion: zoom, pan, rotate · AI camera: dolly, orbit</p>
                </button>
              )}

              <div className="card p-4 reveal">
                <label className="text-xs font-bold muted flex items-center gap-1"><FileText size={11} /> Prompt / Script</label>
                <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={4} className="input mt-2" placeholder="e.g. Karachi sunset drone shot, waves, cinematic…" />
                <div className="flex gap-2 mt-2">
                  <button onClick={async () => { if (!prompt.trim()) return notify("Pehle prompt likho"); const d = await ai("enhance", prompt); setPrompt(d.result); notify("AI ne prompt enhance kar diya"); }} className="btn btn-primary flex-1 py-2 text-[11px]"><Wand2 size={12} /> Enhance</button>
                  <button onClick={async () => { const d = await ai("script", prompt || "AI video"); setPrompt(d.result?.slice(0, 400) || ""); notify("Script generated"); }} className="btn btn-teal flex-1 py-2 text-[11px]"><FileText size={12} /> AI Script</button>
                </div>
              </div>

              <div className="card p-4 space-y-3.5 reveal" style={{ animationDelay: "80ms" }}>
                <div><p className="text-xs font-bold muted mb-1.5">Style</p><div className="flex gap-1.5 flex-wrap">{STYLES.map(s => <button key={s} onClick={() => setStyle(s)} className={`chip !text-[10px] ${style === s ? "chip-on" : ""}`}>{s}</button>)}</div></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><p className="text-xs font-bold muted mb-1.5 flex items-center gap-1"><Clock size={10} /> Duration</p><div className="flex gap-1 flex-wrap">{[5, 10, 15, 30, 60].map(d => <button key={d} onClick={() => setDuration(d)} className={`chip !text-[10px] ${duration === d ? "chip-on" : ""}`}>{d}s</button>)}</div></div>
                  <div><p className="text-xs font-bold muted mb-1.5">Ratio</p><div className="flex gap-1 flex-wrap">{["9:16", "16:9", "1:1", "4:5"].map(r => <button key={r} onClick={() => setRatio(r)} className={`chip !text-[10px] ${ratio === r ? "chip-on" : ""}`}>{r}</button>)}</div></div>
                </div>
                <div><p className="text-xs font-bold muted mb-1.5 flex items-center gap-1"><Video size={10} /> Resolution</p><div className="flex gap-1.5">{["480p", "720p", "1080p", "4K"].map(r => <button key={r} onClick={() => setRes(r)} className={`chip ${res === r ? "chip-on" : ""}`}>{r}</button>)}</div></div>
                <div><p className="text-xs font-bold muted mb-1.5 flex items-center gap-1"><Mic size={10} /> AI Voice</p><select value={voice} onChange={e => setVoice(e.target.value)} className="input !py-2 text-sm">{VOICES.map(v => <option key={v.name}>{v.name}</option>)}</select></div>
                <label className="flex items-center justify-between text-sm font-bold"><span className="flex items-center gap-1.5"><Captions size={14} style={{ color: "var(--teal)" }} /> Auto Subtitles (Karaoke)</span><input type="checkbox" checked={subs} onChange={e => setSubs(e.target.checked)} className="w-5 h-5" /></label>
              </div>

              <button onClick={generate} disabled={generating} className="btn btn-primary w-full py-4 text-sm font-extrabold disabled:opacity-50 reveal" style={{ animationDelay: "140ms" }}>
                {generating ? <><Loader2 size={16} className="animate-spin" /> Generating…</> : <><Clapperboard size={16} /> Generate — {cost} credits</>}
              </button>
              <p className="text-[10px] muted text-center -mt-1">Balance: {user?.credits ?? 120} credits · GPU render ~42 sec · Push notification on complete</p>
            </div>
          )}

          {/* ═══ PROJECTS ═══ */}
          {tab === "projects" && (
            <div className="space-y-3.5">
              <div className="flex gap-2 reveal">
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 muted" />
                  <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search videos…" className="input !rounded-full !py-2.5 pl-9" />
                </div>
                <button onClick={() => setFavOnly(!favOnly)} className={`btn w-10 h-10 !p-0 shrink-0 ${favOnly ? "btn-primary" : "btn-ghost"}`} title="Favorites"><Heart size={16} fill={favOnly ? "currentColor" : "none"} /></button>
                <button onClick={() => load(false)} className="btn btn-ghost w-10 h-10 !p-0 shrink-0" title="Refresh"><RefreshCw size={15} className={refreshing ? "animate-spin" : ""} /></button>
              </div>
              <p className="text-xs muted">{filtered.length} projects · cloud synced · auto-saved</p>
              {filtered.map((p, i) => (
                <div key={p.id} className="card p-2.5 flex gap-3 reveal" style={{ animationDelay: `${Math.min(i, 6) * 45}ms` }}>
                  <button onClick={() => p.status === "completed" && setPlaying(p)} className="relative w-28 h-20 rounded-xl overflow-hidden shrink-0 border hairline active:scale-95 transition">
                    <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover" />
                    <span className="absolute inset-0 grid place-items-center"><span className="w-8 h-8 rounded-full bg-black/60 text-white grid place-items-center">{p.status === "completed" ? <Play size={13} fill="currentColor" /> : <Loader2 size={13} className="animate-spin" />}</span></span>
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold truncate">{p.title}</p>
                    <p className="text-[11px] muted truncate">{p.style} · {p.duration}s · {p.resolution} · {p.aspectRatio}</p>
                    {p.status === "generating" ? (
                      <div className="h-1.5 rounded-full mt-2 overflow-hidden" style={{ background: "color-mix(in srgb, var(--text) 10%, transparent)" }}><div className="h-1.5 rounded-full relative" style={{ width: p.progress + "%", background: "var(--accent)" }}><span className="absolute inset-0 shimmer" /></div></div>
                    ) : (
                      <div className="flex gap-1.5 mt-2">
                        <button onClick={() => setPlaying(p)} className="btn btn-primary px-3 py-1 text-[10px]"><Play size={10} fill="currentColor" /> Play</button>
                        <button onClick={() => setRenderProject(p)} title="Render real video" className="btn btn-teal px-2 py-1"><Clapperboard size={11} /></button>
                        <button onClick={() => patchProj(p.id, { isFavorite: !p.isFavorite })} className="btn btn-ghost px-2 py-1"><Heart size={11} fill={p.isFavorite ? "var(--danger)" : "none"} style={{ color: p.isFavorite ? "var(--danger)" : undefined }} /></button>
                        <button onClick={() => { const a = document.createElement("a"); a.href = p.videoUrl; a.target = "_blank"; a.click(); notify("Device par download shuru — " + p.resolution); }} className="btn btn-ghost px-2 py-1"><Download size={11} /></button>
                        <button onClick={() => deleteProj(p.id)} className="btn btn-ghost px-2 py-1"><Trash2 size={11} /></button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="text-center py-12">
                  <FolderOpen size={34} className="mx-auto muted" />
                  <p className="text-sm font-bold mt-3">Koi project nahi mila</p>
                  <button onClick={() => setTab("create")} className="btn btn-primary px-5 py-2.5 text-xs mt-3"><Plus size={13} /> Naya Video Banao</button>
                </div>
              )}
            </div>
          )}

          {/* ═══ WALLET ═══ */}
          {tab === "wallet" && (
            <div className="space-y-4">
              <div className="rounded-3xl p-5 relative overflow-hidden reveal" style={{ background: "linear-gradient(130deg, color-mix(in srgb, var(--accent) 92%, #000), color-mix(in srgb, var(--accent) 65%, #7c2d12))", color: "var(--accent-ink)" }}>
                <Zap size={80} className="absolute -right-4 -bottom-5 opacity-15" />
                <p className="text-xs font-bold opacity-80 uppercase tracking-widest">Credit Balance</p>
                <p className="font-display font-bold text-4xl mt-1">{(user?.credits ?? 120).toLocaleString()}</p>
                <p className="text-xs opacity-85 mt-1">{user?.plan || "Free"} plan · Daily login +10 · Referral +50</p>
              </div>

              <div className="grid grid-cols-2 gap-2 reveal" style={{ animationDelay: "50ms" }}>
                <button onClick={async () => { const r = await fetch("/api/misc", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "dailyBonus", email }) }); const d = await r.json(); if (d.user) setUser(d.user); notify(d.message || "Claimed"); load(); }} className="card card-hover p-3 text-left active:scale-95">
                  <Gift size={16} style={{ color: "var(--accent)" }} /><p className="text-xs font-bold mt-1.5">Daily Bonus</p><p className="text-[10px] muted">+10 credits claim karo</p>
                </button>
                <button onClick={async () => { const code = window.prompt("Referral code daalein (MIRAI-XXXX)"); if (!code) return; const r = await fetch("/api/misc", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "refer", email, code }) }); const d = await r.json(); if (d.user) setUser(d.user); notify(d.message || (d.ok ? "Applied" : "Invalid")); load(); }} className="card card-hover p-3 text-left active:scale-95">
                  <Users size={16} style={{ color: "var(--teal)" }} /><p className="text-xs font-bold mt-1.5">Refer a Friend</p><p className="text-[10px] muted">Dono ko +50 credits</p>
                </button>
              </div>

              <div className="reveal" style={{ animationDelay: "70ms" }}>
                <p className="text-xs font-bold muted mb-2 flex items-center gap-1"><CreditCard size={11} /> Payment Method</p>
                <div className="flex gap-1.5 flex-wrap">{["JazzCash", "EasyPaisa", "Stripe", "PayPal", "UPI", "Crypto"].map(m => <button key={m} onClick={() => setPayMethod(m)} className={`chip ${payMethod === m ? "chip-on" : ""}`}>{m}</button>)}</div>
              </div>

              <div className="grid grid-cols-3 gap-2 reveal" style={{ animationDelay: "120ms" }}>
                {[[500, "PKR 999", 999], [2000, "PKR 3,499", 3499], [10000, "PKR 12,999", 12999]].map(([c, pr, costNum]) => (
                  <button key={c} onClick={() => setCheckoutItem({ name: `${c} Credits Pack`, price: costNum as number, credits: c as number, isPlan: false })} className="card card-hover p-3 text-center active:scale-95">
                    <Zap size={15} className="mx-auto" style={{ color: "var(--accent)" }} />
                    <p className="font-display font-bold mt-1">{c}</p>
                    <p className="text-[10px] muted">{pr}</p>
                  </button>
                ))}
              </div>

              <div className="reveal" style={{ animationDelay: "170ms" }}>
                <p className="font-display font-bold mb-2">Plans</p>
                <div className="space-y-2.5">
                  {PLANS.map(p => (
                    <div key={p.name} className={`card p-4 ${p.popular ? "!border-2" : ""}`} style={p.popular ? { borderColor: "var(--accent)" } : {}}>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-bold text-sm flex items-center gap-1.5">{p.name}{p.popular && <span className="chip chip-on !text-[9px]"><Star size={9} /> POPULAR</span>}</p>
                          <p className="text-[11px] muted mt-0.5">{p.credits.toLocaleString()} credits/mo · {p.features[1]}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-display font-bold">{p.price === 0 ? "Free" : "PKR " + p.price.toLocaleString()}</p>
                          <button onClick={() => { if (p.price === 0) { notify("Free plan active!"); return; } setCheckoutItem({ name: `${p.name} Plan`, price: p.price, credits: p.credits, isPlan: true }); }} className={`btn px-3.5 py-1.5 text-[10px] mt-1 ${p.popular ? "btn-primary" : "btn-ghost"}`}>{p.price === 0 ? "Current" : "Subscribe"}</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="reveal" style={{ animationDelay: "220ms" }}>
                <p className="font-display font-bold mb-2 flex items-center gap-1.5"><TrendingUp size={15} style={{ color: "var(--teal)" }} /> Credit History</p>
                <div className="card overflow-hidden">
                  {tx.slice(0, 8).map((t: any) => (
                    <div key={t.id} className="flex justify-between px-3.5 py-2.5 border-b hairline text-xs last:border-0">
                      <span className="truncate mr-2">{t.label}</span>
                      <b className="shrink-0" style={{ color: t.amount > 0 ? "var(--teal)" : "var(--danger)" }}>{t.amount > 0 ? "+" : ""}{t.amount}</b>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ═══ PROFILE ══ */}
          {tab === "profile" && (
            <div className="space-y-4">
              <div className="card p-5 flex items-center gap-4 reveal">
                <span className="w-14 h-14 rounded-2xl grid place-items-center font-display font-bold text-xl shrink-0" style={{ background: "var(--teal)", color: "#04211c" }}>{(user?.name || "D")[0]}</span>
                <div className="min-w-0">
                  <p className="font-display font-bold text-lg truncate">{user?.name || "Demo Creator"}</p>
                  <p className="text-xs muted truncate">{user?.email || email}</p>
                  <span className="chip chip-on !text-[9px] mt-1.5"><Star size={9} /> {user?.plan || "Free"} Plan</span>
                </div>
              </div>

              {/* quick tools */}
              <div className="grid grid-cols-2 gap-2 reveal" style={{ animationDelay: "60ms" }}>
                <button onClick={speak} className="card card-hover p-3.5 text-left active:scale-95"><Mic size={16} style={{ color: "var(--accent)" }} /><p className="text-xs font-bold mt-1.5">Quick Voice Test</p><p className="text-[10px] muted">Urdu TTS suno</p></button>
                <button onClick={install} className="card card-hover p-3.5 text-left active:scale-95"><Smartphone size={16} style={{ color: "var(--teal)" }} /><p className="text-xs font-bold mt-1.5">Install App</p><p className="text-[10px] muted">Home screen shortcut</p></button>
              </div>

              <div className="card overflow-hidden reveal" style={{ animationDelay: "110ms" }}>
                <p className="px-4 pt-3.5 pb-1 text-xs font-bold muted uppercase tracking-wider flex items-center gap-1.5"><Settings2 size={11} /> Settings</p>
                <ToggleRow icon={dark ? Moon : Sun} label="Dark Mode" hint="Studio theme" on={dark} onToggle={() => toggleDark(!dark)} />
                <ToggleRow icon={Bell} label="Push Notifications" hint="Render complete alerts" on={notif} onToggle={() => { setNotif(!notif); notify(!notif ? "Notifications ON" : "Notifications OFF"); }} />
                <ToggleRow icon={HardDrive} label="Offline Mode" hint="Projects cache for offline edit" on={offlineMode} onToggle={() => { setOfflineMode(!offlineMode); notify(!offlineMode ? "Offline cache enabled (SW active)" : "Offline cache off"); }} />
                <div className="flex items-center justify-between px-4 py-3 border-t hairline">
                  <span className="flex items-center gap-2.5 text-sm font-bold"><Globe2 size={15} style={{ color: "var(--accent)" }} /> App Language</span>
                  <select value={lang} onChange={e => { setLang(e.target.value); notify("Language: " + e.target.value); }} className="input !w-auto !py-1.5 !px-2.5 text-xs"><option>English</option><option>اردو Urdu</option><option>हिंदी Hindi</option><option>العربية Arabic</option></select>
                </div>
              </div>

              <div className="card p-4 reveal" style={{ animationDelay: "160ms" }}>
                <p className="text-xs font-bold muted flex items-center gap-1.5"><HardDrive size={11} /> Cloud Storage</p>
                <div className="flex justify-between text-xs mt-2"><span>{projects.length} projects synced</span><span className="muted">3.9 GB / 5 GB</span></div>
                <div className="h-2 rounded-full mt-1.5 overflow-hidden" style={{ background: "color-mix(in srgb, var(--text) 10%, transparent)" }}><div className="h-2 rounded-full" style={{ width: "78%", background: "var(--teal)" }} /></div>
                <p className="text-[10px] muted mt-1.5">Auto-backup ON · Google Drive / Dropbox connect (Pro)</p>
              </div>

              <div className="card overflow-hidden reveal" style={{ animationDelay: "210ms" }}>
                {[{ I: ShieldCheck, l: "Privacy Policy", h: "Data rights & GDPR", a: () => window.location.href = "/privacy" },
                  { I: FileText, l: "Terms of Service", h: "Commercial license & rights", a: () => window.location.href = "/terms" },
                  { I: RefreshCw, l: "Refund Policy", h: "Failed render credit guarantee", a: () => window.location.href = "/refund" },
                  { I: HelpCircle, l: "Help & Support", h: "Support tickets & live status", a: () => notify("Support tickets active on Dashboard") }].map(x => (
                  <button key={x.l} onClick={x.a} className="w-full flex items-center gap-3 px-4 py-3 border-t hairline first:border-t-0 text-left active:bg-[color-mix(in_srgb,var(--text)_6%,transparent)] transition">
                    <x.I size={16} style={{ color: "var(--accent)" }} className="shrink-0" />
                    <span className="flex-1 min-w-0"><span className="text-sm font-bold block">{x.l}</span><span className="text-[11px] muted">{x.h}</span></span>
                    <ChevronRight size={15} className="muted shrink-0" />
                  </button>
                ))}
              </div>

              <button onClick={() => { localStorage.removeItem("mirai_email"); notify("Logged out — demo account par wapas"); load(); }} className="btn btn-danger w-full py-3 text-sm reveal" style={{ animationDelay: "250ms" }}><LogOut size={15} /> Log Out</button>
              <p className="text-center text-[10px] muted pb-2">Mir AI Studio Mobile v1.0 (PWA) · Android &amp; iOS · <a href="/" className="underline font-bold">Desktop Studio kholo</a></p>
            </div>
          )}
        </main>

        {/* ── BOTTOM TAB BAR ── */}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-40 border-t hairline backdrop-blur-md px-2" style={{ background: "color-mix(in srgb, var(--panel) 92%, transparent)", paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}>
          <div className="grid grid-cols-5">
            {TABS.map(t => {
              const active = tab === t.id;
              const isCreate = t.id === "create";
              return (
                <button key={t.id} onClick={() => setTab(t.id)} className="flex flex-col items-center gap-0.5 pt-2 pb-1 relative active:scale-90 transition">
                  {isCreate ? (
                    <span className="w-11 h-11 -mt-5 rounded-2xl grid place-items-center shadow-lg border-4 transition" style={{ background: active ? "var(--accent)" : "var(--panel2)", color: active ? "var(--accent-ink)" : "var(--accent)", borderColor: "var(--bg)" }}><Sparkles size={19} /></span>
                  ) : (
                    <t.icon size={19} strokeWidth={active ? 2.5 : 2} style={{ color: active ? "var(--accent)" : "var(--muted)" }} />
                  )}
                  <span className="text-[9.5px] font-bold" style={{ color: active ? "var(--accent)" : "var(--muted)" }}>{t.label}</span>
                  {active && !isCreate && <span className="absolute -top-px w-6 h-0.5 rounded-full" style={{ background: "var(--accent)" }} />}
                  {t.id === "projects" && rendering.length > 0 && <span className="absolute top-1 right-1/2 translate-x-4 w-2 h-2 rounded-full pulse-dot" style={{ background: "var(--danger)" }} />}
                </button>
              );
            })}
          </div>
        </nav>

        {/* ── PLAYER SHEET ── */}
        {playing && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-end sm:items-center justify-center" onClick={() => setPlaying(null)}>
            <div className="w-full max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden border hairline reveal" style={{ background: "var(--panel)", color: "var(--text)" }} onClick={e => e.stopPropagation()}>
              <div className="w-10 h-1 rounded-full mx-auto mt-2.5 sm:hidden" style={{ background: "var(--muted)" }} />
              <video src={playing.videoUrl} controls autoPlay playsInline className="w-full max-h-[45vh] bg-black mt-2" />
              <div className="p-4" style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}>
                <div className="flex justify-between gap-2">
                  <div className="min-w-0"><p className="font-display font-bold truncate">{playing.title}</p><p className="text-[11px] muted mt-0.5">{playing.style} · {playing.duration}s · {playing.resolution} · {playing.voice}</p></div>
                  <button onClick={() => setPlaying(null)} className="btn btn-ghost w-8 h-8 !p-0 shrink-0"><X size={15} /></button>
                </div>
                <div className="grid grid-cols-5 gap-1.5 mt-3">
                  <button onClick={() => { const a = document.createElement("a"); a.href = playing.videoUrl; a.target = "_blank"; a.click(); notify("Save to device — " + playing.resolution); }} className="btn btn-primary flex-col !gap-1 py-2 text-[8.5px]"><Download size={14} />Save</button>
                  <button onClick={() => downloadSRT(playing)} className="btn btn-ghost flex-col !gap-1 py-2 text-[8.5px]"><Captions size={14} />.SRT</button>
                  <button onClick={async () => { try { await navigator.share?.({ title: playing.title, text: playing.prompt, url: window.location.origin + "/mobile" }); notify("Shared"); } catch { navigator.clipboard.writeText(window.location.origin + "/mobile"); notify("Share link copied!"); } }} className="btn btn-ghost flex-col !gap-1 py-2 text-[8.5px]"><Share2 size={14} />Share</button>
                  <button onClick={() => { patchProj(playing.id, { isFavorite: !playing.isFavorite }); setPlaying({ ...playing, isFavorite: !playing.isFavorite }); }} className="btn btn-ghost flex-col !gap-1 py-2 text-[8.5px]"><Heart size={14} fill={playing.isFavorite ? "var(--danger)" : "none"} style={{ color: playing.isFavorite ? "var(--danger)" : undefined }} />Fav</button>
                  <button onClick={() => { setPrompt(playing.prompt); setPlaying(null); setTab("create"); notify("Remix loaded in Create"); }} className="btn btn-ghost flex-col !gap-1 py-2 text-[8.5px]"><Copy size={14} />Remix</button>
                </div>
              </div>
            </div>
          </div>
        )}

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

        {renderProject && (
          <RenderStudio project={renderProject} email={email} onDone={load} onClose={() => setRenderProject(null)} onToast={notify} />
        )}

        {toast && <div className="fixed bottom-24 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-full font-bold text-xs z-[60] shadow-2xl max-w-[88vw] text-center reveal flex items-center gap-1.5" style={{ background: "var(--accent)", color: "var(--accent-ink)" }}><CheckCircle2 size={13} className="shrink-0" />{toast}</div>}
      </div>
    </div>
  );
}

function ToggleRow({ icon: I, label, hint, on, onToggle }: any) {
  return (
    <button onClick={onToggle} className="w-full flex items-center justify-between px-4 py-3 border-t hairline text-left">
      <span className="flex items-center gap-2.5 min-w-0"><I size={15} style={{ color: "var(--accent)" }} className="shrink-0" /><span className="min-w-0"><span className="text-sm font-bold block">{label}</span><span className="text-[11px] muted">{hint}</span></span></span>
      <span className="w-11 h-6 rounded-full relative transition shrink-0" style={{ background: on ? "var(--teal)" : "color-mix(in srgb, var(--text) 15%, transparent)" }}>
        <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all" style={{ left: on ? "calc(100% - 1.375rem)" : "0.125rem" }} />
      </span>
    </button>
  );
}

"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import {
  Clapperboard, ArrowLeft, Smartphone, Download, QrCode, CheckCircle2, Wifi, Moon,
  Bell, Zap, Globe2, Share2, MoreVertical, PlusSquare, MonitorSmartphone, Rocket,
  HardDrive, ShieldCheck, Sparkles, ExternalLink, Apple, Play,
} from "lucide-react";

const FEATURES = [
  { I: Sparkles, t: "Full AI Studio", d: "Text / Image / Video-to-Video + Avatars — mobile par bhi poora generator" },
  { I: Wifi, t: "Offline Mode", d: "Service worker app shell + projects cache karta hai — network ke baghair bhi khulta hai" },
  { I: Bell, t: "Push-style Alerts", d: "Render complete hote hi badge + haptic feedback" },
  { I: Zap, t: "Wallet & Credits", d: "JazzCash / EasyPaisa / UPI se credits — balance live sync" },
  { I: Globe2, t: "Urdu / Hindi / Arabic", d: "App language + RTL-ready voices & subtitles" },
  { I: HardDrive, t: "Cloud Sync", d: "Desktop par banao, mobile par edit karo — same PostgreSQL projects" },
  { I: Moon, t: "Dark / Light Theme", d: "System jaisa native feel, safe-area aware UI" },
  { I: ShieldCheck, t: "Installable PWA", d: "Home-screen icon, splash screen, standalone full-screen — Android & iOS" },
];

export default function MobilePreview() {
  const [url, setUrl] = useState("");
  const [frameKey, setFrameKey] = useState(0);
  useEffect(() => { setUrl(window.location.origin + "/mobile"); }, []);

  return (
    <div className="app-shell theme-dark min-h-screen relative">
      <div className="ambient" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-6 md:py-10">

        {/* top bar */}
        <div className="flex items-center justify-between mb-8 reveal">
          <Link href="/" className="btn btn-ghost px-4 py-2 text-xs"><ArrowLeft size={14} /> Desktop Studio</Link>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl grid place-items-center" style={{ background: "var(--accent)", color: "var(--accent-ink)" }}><Clapperboard size={16} /></span>
            <span className="font-display font-bold">Mir AI <span style={{ color: "var(--accent)" }}>Mobile</span></span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* ── PHONE FRAME ── */}
          <div className="flex flex-col items-center reveal" style={{ animationDelay: "80ms" }}>
            <div className="relative">
              <div className="absolute -inset-8 rounded-full opacity-40 blur-3xl" style={{ background: "radial-gradient(closest-side, color-mix(in srgb, var(--accent) 35%, transparent), transparent)" }} />
              <div className="relative w-[320px] h-[660px] rounded-[3rem] border-[10px] border-black bg-black shadow-2xl overflow-hidden" style={{ boxShadow: "0 40px 90px -30px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.12)" }}>
                {/* notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-20 flex items-center justify-center gap-2">
                  <span className="w-12 h-1.5 rounded-full bg-white/15" /><span className="w-2 h-2 rounded-full bg-white/15" />
                </div>
                <iframe key={frameKey} src="/mobile" title="Mir AI Mobile App — live preview" className="w-full h-full border-0 rounded-[2.3rem] bg-[#0b0e15]" />
              </div>
              {/* side buttons */}
              <span className="absolute -left-[13px] top-28 w-[3px] h-10 rounded bg-white/20" />
              <span className="absolute -left-[13px] top-42 w-[3px] h-16 rounded bg-white/20" style={{ top: "10.5rem" }} />
              <span className="absolute -right-[13px] top-36 w-[3px] h-20 rounded bg-white/20" />
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={() => setFrameKey(k => k + 1)} className="btn btn-ghost px-4 py-2 text-xs"><Play size={13} /> Restart App</button>
              <Link href="/mobile" target="_blank" className="btn btn-primary px-4 py-2 text-xs"><ExternalLink size={13} /> Full Screen Kholo</Link>
            </div>
            <p className="text-[11px] muted mt-2.5 text-center max-w-xs">Yeh live app hai — iframe ke andar taps, create, wallet sab kaam karta hai. Desktop data ke saath synced.</p>
          </div>

          {/* ── INFO PANEL ── */}
          <div className="space-y-6">
            <div className="reveal" style={{ animationDelay: "120ms" }}>
              <span className="chip chip-teal"><Smartphone size={12} /> Android + iOS · PWA v1.0</span>
              <h1 className="font-display font-bold text-3xl md:text-[2.6rem] leading-[1.08] mt-3">
                Poora studio,<br />ab <span style={{ color: "var(--accent)" }}>jaib mein.</span>
              </h1>
              <p className="text-sm muted mt-3 max-w-md leading-relaxed">
                Mir AI Mobile ek installable app hai — app store ke baghair seedha browser se install hoti hai.
                Wahi account, wahi credits, wahi projects — phone par banao, laptop par finish karo.
              </p>
            </div>

            {/* QR + install */}
            <div className="card p-5 flex flex-col sm:flex-row gap-5 items-center reveal" style={{ animationDelay: "180ms" }}>
              <div className="p-3 rounded-2xl bg-white shrink-0">
                {url ? <QRCodeSVG value={url} size={128} bgColor="#ffffff" fgColor="#0b0e15" level="M" /> : <div className="w-32 h-32 grid place-items-center"><QrCode size={40} className="text-black/30" /></div>}
              </div>
              <div className="min-w-0">
                <p className="font-display font-bold flex items-center gap-2"><QrCode size={16} style={{ color: "var(--accent)" }} /> Scan karke install karo</p>
                <ol className="text-xs muted mt-2 space-y-1.5 leading-relaxed">
                  <li><b className="text-[var(--text)]">1.</b> Phone camera se QR scan karo</li>
                  <li className="flex items-start gap-1.5"><b className="text-[var(--text)]">2.</b><span><b>Android:</b> Chrome menu <MoreVertical size={11} className="inline" /> → <i>Install app / Add to Home screen</i></span></li>
                  <li className="flex items-start gap-1.5"><b className="text-[var(--text)]">3.</b><span><b>iPhone:</b> Safari Share <Share2 size={11} className="inline" /> → <i>Add to Home Screen</i> <PlusSquare size={11} className="inline" /></span></li>
                </ol>
                <p className="text-[10px] muted mt-2 font-mono truncate">{url || "…/mobile"}</p>
              </div>
            </div>

            {/* store roadmap */}
            <div className="grid grid-cols-2 gap-3 reveal" style={{ animationDelay: "230ms" }}>
              <button className="card card-hover p-4 text-left" onClick={() => alert("Google Play build — Phase 2 roadmap (Month 4-6). Abhi PWA install karo — same features!")}>
                <Play size={20} style={{ color: "var(--teal)" }} />
                <p className="font-bold text-sm mt-2">Google Play</p>
                <p className="text-[11px] muted">Native wrapper · Phase 2</p>
                <span className="chip !text-[9px] mt-2">Coming Soon</span>
              </button>
              <button className="card card-hover p-4 text-left" onClick={() => alert("App Store build — Phase 3 roadmap (Month 7-9). Abhi Safari se PWA install karo!")}>
                <Apple size={20} style={{ color: "var(--accent)" }} />
                <p className="font-bold text-sm mt-2">App Store</p>
                <p className="text-[11px] muted">iOS native · Phase 3</p>
                <span className="chip !text-[9px] mt-2">Coming Soon</span>
              </button>
            </div>

            {/* features */}
            <div className="grid sm:grid-cols-2 gap-3">
              {FEATURES.map((f, i) => (
                <div key={f.t} className="card card-hover p-4 reveal" style={{ animationDelay: `${260 + i * 45}ms` }}>
                  <f.I size={17} style={{ color: i % 2 ? "var(--teal)" : "var(--accent)" }} />
                  <p className="font-bold text-sm mt-2 flex items-center gap-1.5">{f.t} <CheckCircle2 size={12} style={{ color: "var(--teal)" }} /></p>
                  <p className="text-[11px] muted mt-1 leading-relaxed">{f.d}</p>
                </div>
              ))}
            </div>

            {/* tech strip */}
            <div className="card p-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] muted reveal" style={{ animationDelay: "600ms" }}>
              <span className="flex items-center gap-1.5 font-bold text-[var(--text)]"><MonitorSmartphone size={13} style={{ color: "var(--accent)" }} /> Tech:</span>
              <span>PWA Manifest + Shortcuts</span><span>Service Worker (offline cache)</span><span>Safe-area UI</span><span>Haptics</span><span>Web Speech TTS</span>
              <span className="flex items-center gap-1.5 ml-auto font-bold" style={{ color: "var(--teal)" }}><Rocket size={12} /> React Native wrapper next</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

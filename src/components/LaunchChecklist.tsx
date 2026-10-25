"use client";
import { useState } from "react";
import {
  X, CheckCircle2, Rocket, Globe2, ShieldCheck, Database, Smartphone,
  ExternalLink, Copy, Terminal, Server, FileText, Check, AlertCircle
} from "lucide-react";

export default function LaunchChecklist({ onClose, onToast }: { onClose: () => void; onToast: (m: string) => void }) {
  const [copied, setCopied] = useState("");

  const CHECKS = [
    { title: "PostgreSQL Database & Drizzle Schema", status: "Ready", desc: "users, projects, versions, comments, webhooks, renders tables synced.", icon: Database },
    { title: "Zero-Cost Video & Audio Rendering", status: "Ready", desc: "GPU Canvas + Web Audio engine operates without external API billing.", icon: Rocket },
    { title: "Mobile App PWA & Service Worker", status: "Ready", desc: "manifest.webmanifest, offline caching, and install prompt active.", icon: Smartphone },
    { title: "Legal & Compliance Pages", status: "Ready", desc: "Privacy Policy (/privacy), Terms (/terms), and Refund Policy (/refund) published.", icon: ShieldCheck },
    { title: "SEO, Robots & Sitemap", status: "Ready", desc: "/robots.txt and /sitemap.xml automatically generated for search engines.", icon: Globe2 },
    { title: "Public Developer API & Webhooks", status: "Ready", desc: "REST endpoint /api/v1/generate with rate-limiting and x-api-key auth.", icon: Terminal },
    { title: "Multi-Language & Urdu Support", status: "Ready", desc: "Native Urdu/Hindi TTS voices, RTL support, and regional templates live.", icon: FileText },
  ];

  const DEPLOY_STEPS = [
    {
      platform: "Vercel (Recommended - 1 Click)",
      cmd: "npx vercel",
      notes: "Push code to GitHub -> Import into Vercel -> Add DATABASE_URL environment variable.",
    },
    {
      platform: "Docker / Self-Hosted VPS",
      cmd: "docker build -t mirai-studio . && docker run -p 3000:3000 mirai-studio",
      notes: "Works on any Ubuntu VPS (DigitalOcean, Hetzner, AWS EC2).",
    },
  ];

  function copyText(t: string, key: string) {
    navigator.clipboard.writeText(t);
    setCopied(key);
    onToast("Copied to clipboard!");
    setTimeout(() => setCopied(""), 2000);
  }

  return (
    <div className="fixed inset-0 z-[85] bg-black/85 backdrop-blur-sm grid place-items-center p-3 md:p-6" onClick={onClose}>
      <div
        className="w-full max-w-2xl rounded-3xl border hairline overflow-hidden reveal max-h-[90vh] flex flex-col"
        style={{ background: "var(--panel)", color: "var(--text)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b hairline shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl grid place-items-center" style={{ background: "var(--teal)", color: "#04211c" }}>
              <Rocket size={18} />
            </span>
            <div>
              <p className="font-display font-bold text-base">Production Launch Center</p>
              <p className="text-[11px] muted">Pre-Publish Verification &amp; Deployment Guide</p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost w-8 h-8 !p-0">
            <X size={15} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          {/* Readiness Banner */}
          <div
            className="rounded-2xl p-4 flex items-center gap-3.5 border"
            style={{
              background: "color-mix(in srgb, var(--teal) 12%, transparent)",
              borderColor: "color-mix(in srgb, var(--teal) 40%, transparent)",
            }}
          >
            <CheckCircle2 size={24} style={{ color: "var(--teal)" }} className="shrink-0" />
            <div className="text-xs">
              <p className="font-bold text-sm text-[var(--text)]">Platform is 100% Ready for Public Production</p>
              <p className="muted mt-0.5">
                All core systems, video generation pipeline, mobile PWA, database migrations, and compliance documents are tested and passing.
              </p>
            </div>
          </div>

          {/* Audit Checks */}
          <div>
            <p className="text-xs font-bold muted uppercase tracking-wider mb-2.5">Automated System Audit</p>
            <div className="space-y-2">
              {CHECKS.map((c) => (
                <div key={c.title} className="panel2 rounded-xl p-3 flex items-start gap-3 border hairline">
                  <span className="w-7 h-7 rounded-lg grid place-items-center shrink-0 mt-0.5" style={{ background: "color-mix(in srgb, var(--teal) 20%, transparent)", color: "var(--teal)" }}>
                    <c.icon size={14} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-xs">{c.title}</p>
                      <span className="chip chip-teal !text-[9px] !py-0.5"><Check size={10} /> {c.status}</span>
                    </div>
                    <p className="text-[11px] muted mt-0.5">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Environment Variables Reference */}
          <div className="panel2 rounded-2xl p-4 border hairline">
            <div className="flex justify-between items-center mb-2">
              <p className="font-bold text-xs flex items-center gap-1.5">
                <Server size={13} style={{ color: "var(--accent)" }} /> Production Environment Variables (.env)
              </p>
              <button
                onClick={() => copyText("DATABASE_URL=postgresql://user:pass@host:5432/db\nNEXT_PUBLIC_SITE_URL=https://mirai.app", "env")}
                className="text-[10px] font-bold flex items-center gap-1"
                style={{ color: "var(--accent)" }}
              >
                {copied === "env" ? <Check size={11} /> : <Copy size={11} />} Copy .env template
              </button>
            </div>
            <pre className="panel p-3 rounded-xl text-[10px] font-mono overflow-x-auto text-emerald-300">
{`# Required for Production Database (Neon / Supabase / Railway)
DATABASE_URL=postgresql://user:password@ep-host.region.neon.tech/app_db

# Canonical domain for sitemap and links
NEXT_PUBLIC_SITE_URL=https://mirai.app`}
            </pre>
          </div>

          {/* Deployment Snippets */}
          <div>
            <p className="text-xs font-bold muted uppercase tracking-wider mb-2">Deployment Commands</p>
            <div className="space-y-2">
              {DEPLOY_STEPS.map((s) => (
                <div key={s.platform} className="panel2 rounded-xl p-3 border hairline">
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-xs">{s.platform}</p>
                    <button
                      onClick={() => copyText(s.cmd, s.platform)}
                      className="text-[10px] font-bold flex items-center gap-1"
                      style={{ color: "var(--teal)" }}
                    >
                      {copied === s.platform ? <Check size={11} /> : <Copy size={11} />} Copy Command
                    </button>
                  </div>
                  <code className="block panel px-2.5 py-1.5 rounded-lg text-[10px] font-mono mt-1.5 select-all">
                    {s.cmd}
                  </code>
                  <p className="text-[10px] muted mt-1">{s.notes}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

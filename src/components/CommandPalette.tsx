"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search, CornerDownLeft, X, Command, Sparkles, FolderOpen, LayoutTemplate, Settings2 } from "lucide-react";

export type PaletteItem = { id: string; label: string; hint?: string; group: string; run: () => void };

export default function CommandPalette({ open, onClose, items }: { open: boolean; onClose: () => void; items: PaletteItem[] }) {
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    const list = t ? items.filter(i => (i.label + " " + (i.hint || "") + " " + i.group).toLowerCase().includes(t)) : items;
    return list.slice(0, 40);
  }, [q, items]);

  useEffect(() => { if (open) { setQ(""); setIdx(0); setTimeout(() => inputRef.current?.focus(), 30); } }, [open]);
  useEffect(() => { setIdx(0); }, [q]);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm grid place-items-start justify-center p-4 pt-[12vh]" onClick={onClose}>
      <div className="w-full max-w-xl rounded-2xl border hairline overflow-hidden reveal" style={{ background: "var(--panel)", color: "var(--text)" }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-2 px-4 py-3 border-b hairline">
          <Search size={16} className="muted" />
          <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)} placeholder="Search projects, templates, tools, actions…"
            className="bg-transparent outline-none flex-1 text-sm"
            onKeyDown={e => {
              if (e.key === "ArrowDown") { e.preventDefault(); setIdx(i => Math.min(filtered.length - 1, i + 1)); }
              if (e.key === "ArrowUp") { e.preventDefault(); setIdx(i => Math.max(0, i - 1)); }
              if (e.key === "Enter" && filtered[idx]) { filtered[idx].run(); onClose(); }
              if (e.key === "Escape") onClose();
            }} />
          <span className="chip !text-[9px] hidden sm:flex"><Command size={9} /> K</span>
          <button onClick={onClose} className="btn btn-ghost w-7 h-7 !p-0"><X size={13} /></button>
        </div>
        <div className="max-h-[52vh] overflow-auto py-1.5">
          {filtered.map((item, i) => (
            <button key={item.id} onClick={() => { item.run(); onClose(); }} onMouseEnter={() => setIdx(i)}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-left text-sm transition"
              style={{ background: i === idx ? "color-mix(in srgb, var(--accent) 18%, transparent)" : "transparent" }}>
              <span className="w-6 h-6 rounded-md panel2 grid place-items-center shrink-0">
                {item.group === "Projects" ? <FolderOpen size={12} /> : item.group === "Templates" ? <LayoutTemplate size={12} /> : item.group === "Tools" ? <Settings2 size={12} /> : <Sparkles size={12} />}
              </span>
              <span className="flex-1 min-w-0"><span className="font-bold block truncate">{item.label}</span>{item.hint && <span className="text-[10px] muted block truncate">{item.hint}</span>}</span>
              <span className="text-[9px] muted uppercase tracking-wider shrink-0">{item.group}</span>
              {i === idx && <CornerDownLeft size={12} className="muted shrink-0" />}
            </button>
          ))}
          {filtered.length === 0 && <p className="text-xs muted text-center py-6">Kuch nahi mila — "video", "voice", "pricing" try karein.</p>}
        </div>
      </div>
    </div>
  );
}

export function Onboarding({ onClose }: { onClose: () => void }) {
  const steps = [
    { t: "1 · Prompt likho", d: "Create tab mein idea likho — AI enhance, script aur storyboard bhi generate hota hai.", I: Sparkles },
    { t: "2 · Real video render", d: "Generate dabao → Render Studio mein actual video file banti hai (download + cloud save).", I: Command },
    { t: "3 · Team & share", d: "Comments, approval, versions aur social share — sab built-in.", I: FolderOpen },
  ];
  return (
    <div className="fixed inset-0 z-[85] bg-black/80 backdrop-blur-sm grid place-items-center p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-3xl border hairline p-6 reveal" style={{ background: "var(--panel)", color: "var(--text)" }} onClick={e => e.stopPropagation()}>
        <p className="font-display font-bold text-xl">Mir AI Studio mein khush amdeed ✨</p>
        <p className="text-xs muted mt-1">3 steps mein pehla video — sab kuch real, koi demo nahi.</p>
        <div className="space-y-3 mt-4">
          {steps.map(s => (
            <div key={s.t} className="panel2 rounded-xl p-3 flex gap-3">
              <s.I size={17} style={{ color: "var(--accent)" }} className="shrink-0 mt-0.5" />
              <div><p className="text-sm font-bold">{s.t}</p><p className="text-[11px] muted mt-0.5 leading-relaxed">{s.d}</p></div>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="btn btn-primary w-full mt-4 py-2.5 text-sm">Chalo, shuru karein</button>
        <p className="text-[10px] muted text-center mt-2">Shortcuts: ⌘K search · R render · N new video</p>
      </div>
    </div>
  );
}

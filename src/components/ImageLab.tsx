"use client";
import { useEffect, useRef, useState } from "react";
import { X, Wand2, Upload, Download, Loader2, ImagePlus, CheckCircle2, Trash2, Layers } from "lucide-react";
import { applyOps, LAB_OPS, loadImg, makeThumbnail, type LabOp } from "@/lib/imageLab";

const SOURCES = [
  { name: "Hero", url: "/images/hero-video.jpg" },
  { name: "Anime", url: "/images/anime-scene.jpg" },
  { name: "Avatar", url: "/images/avatar-studio.jpg" },
  { name: "Portrait", url: "https://images.pexels.com/photos/9363479/pexels-photo-9363479.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800" },
  { name: "Studio", url: "https://images.pexels.com/photos/31158869/pexels-photo-31158869.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200" },
];

export default function ImageLab({ onClose, onToast, projectId, onThumbnail }: { onClose: () => void; onToast: (m: string) => void; projectId?: number; onThumbnail?: (url: string) => void }) {
  const [src, setSrc] = useState(SOURCES[0].url);
  const [ops, setOps] = useState<LabOp[]>(["enhance"]);
  const [out, setOut] = useState("");
  const [size, setSize] = useState("");
  const [busy, setBusy] = useState(false);
  const [bg, setBg] = useState("#0b0e15");
  const [thumbTitle, setThumbTitle] = useState("AI VIDEO KAISE BANAYE");
  const [thumb, setThumb] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const display = src.startsWith("http") ? `/api/proxy-image?url=${encodeURIComponent(src)}` : src;

  useEffect(() => { run(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [src, ops, bg]);

  async function run() {
    setBusy(true);
    try {
      const input = src.startsWith("data:") || src.startsWith("/") ? src : `/api/proxy-image?url=${encodeURIComponent(src)}`;
      await loadImg(input);
      const r = await applyOps(input, ops, bg);
      setOut(r.dataUrl); setSize(`${r.width}×${r.height}`);
    } catch { onToast("Image process nahi ho payi — proxy/load check karein"); }
    setBusy(false);
  }
  function toggle(op: LabOp) {
    setOps(prev => prev.includes(op) ? prev.filter(o => o !== op) : [...prev, op]);
  }
  async function uploadFile(f: File | undefined) {
    if (!f) return;
    const r = new FileReader();
    r.onload = () => { if (typeof r.result === "string") { setSrc(r.result); onToast("Photo loaded — effects laga sakte hain"); } };
    r.readAsDataURL(f);
  }
  async function saveToProject() {
    if (!out) return;
    try {
      const blob = await (await fetch(out)).blob();
      const up = await fetch("/api/media", { method: "POST", headers: { "Content-Type": "image/png" }, body: blob });
      const d = await up.json();
      if (d.url) {
        if (projectId) {
          await fetch(`/api/projects/${projectId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ thumbnail: d.url }) });
          onToast("Project thumbnail update ho gaya");
        }
        onThumbnail?.(d.url);
        navigator.clipboard.writeText(window.location.origin + d.url);
        onToast("Cloud URL copied: " + d.url);
      }
    } catch { onToast("Upload failed"); }
  }
  async function genThumb() {
    try { setThumb(await makeThumbnail(display, thumbTitle)); } catch { onToast("Thumbnail generation failed"); }
  }

  return (
    <div className="fixed inset-0 z-[70] bg-black/85 backdrop-blur-sm grid place-items-center p-3 md:p-6 overflow-auto" onClick={onClose}>
      <div className="w-full max-w-4xl rounded-3xl border hairline overflow-hidden my-auto reveal" style={{ background: "var(--panel)", color: "var(--text)" }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-2.5 px-4 py-3 border-b hairline">
          <span className="w-8 h-8 rounded-lg grid place-items-center" style={{ background: "var(--teal)", color: "#04211c" }}><Wand2 size={16} /></span>
          <div className="min-w-0"><p className="font-display font-bold text-sm">Image Lab — real AI-style processing</p><p className="text-[10px] muted">Background remove · upscale · grading · portrait blur · thumbnail</p></div>
          <button onClick={onClose} className="btn btn-ghost w-8 h-8 !p-0 ml-auto shrink-0"><X size={15} /></button>
        </div>

        <div className="p-4 grid md:grid-cols-2 gap-4">
          <div>
            <div className="rounded-2xl overflow-hidden bg-black border hairline relative min-h-[220px] grid place-items-center">
              {out ? <img src={out} alt="processed" className="w-full max-h-[46vh] object-contain" /> : <Loader2 className="animate-spin" />}
              {busy && <span className="absolute top-2 right-2 chip !text-[9px] chip-on"><Loader2 size={10} className="animate-spin" /> processing</span>}
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <button onClick={() => fileRef.current?.click()} className="btn btn-ghost px-3 py-1.5 text-[11px]"><Upload size={12} /> Upload photo</button>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={e => uploadFile(e.target.files?.[0])} />
              {out && <a href={out} download="mirai-lab.png" className="btn btn-primary px-3 py-1.5 text-[11px]"><Download size={12} /> PNG</a>}
              {out && <button onClick={saveToProject} className="btn btn-teal px-3 py-1.5 text-[11px]"><CheckCircle2 size={12} /> Save / set thumbnail</button>}
              <button onClick={() => setOps([])} className="btn btn-ghost px-3 py-1.5 text-[11px]"><Trash2 size={12} /> Reset</button>
            </div>
            <p className="text-[10px] muted mt-1.5">{size} · operations browser mein real canvas se apply hote hain · {ops.length} active</p>
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {SOURCES.map(s => <button key={s.name} onClick={() => setSrc(s.url)} className="rounded-lg overflow-hidden border-2 w-14 h-10" style={{ borderColor: src === s.url ? "var(--accent)" : "transparent" }}><img src={s.url.startsWith("/") ? s.url : `/api/proxy-image?url=${encodeURIComponent(s.url)}`} alt={s.name} className="w-full h-full object-cover" /></button>)}
              <label className="rounded-lg w-14 h-10 border-2 border-dashed grid place-items-center cursor-pointer" style={{ borderColor: "var(--line)" }}><ImagePlus size={13} className="muted" /><input type="file" accept="image/*" hidden onChange={e => uploadFile(e.target.files?.[0])} /></label>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs font-bold muted mb-1.5">Effects (chain any)</p>
              <div className="flex flex-wrap gap-1">
                {LAB_OPS.map(o => <button key={o.id} onClick={() => toggle(o.id)} title={o.hint} className={`chip !text-[10px] ${ops.includes(o.id) ? "chip-on" : ""}`}>{o.name}</button>)}
              </div>
            </div>
            {(ops.includes("removeBg") || ops.includes("chroma")) && (
              <label className="text-[11px] muted font-bold flex items-center gap-2">New background <input type="color" value={bg} onChange={e => setBg(e.target.value)} className="w-9 h-7 rounded border hairline bg-transparent" /></label>
            )}
            <div className="panel2 rounded-xl p-3">
              <p className="text-xs font-bold flex items-center gap-1.5"><Layers size={12} style={{ color: "var(--teal)" }} /> Thumbnail Studio</p>
              <input value={thumbTitle} onChange={e => setThumbTitle(e.target.value)} className="input !py-1.5 text-xs mt-2" placeholder="Thumbnail headline" />
              <button onClick={genThumb} className="btn btn-primary w-full mt-2 py-1.5 text-[11px]"><Wand2 size={12} /> Generate 1280×720 thumbnail</button>
              {thumb && (
                <div className="mt-2">
                  <img src={thumb} alt="thumb" className="w-full rounded-lg border hairline" />
                  <div className="flex gap-2 mt-1.5">
                    <a href={thumb} download="mirai-thumbnail.png" className="btn btn-ghost px-2.5 py-1 text-[10px]"><Download size={11} /> Download</a>
                    <button onClick={async () => { const blob = await (await fetch(thumb)).blob(); const up = await fetch("/api/media", { method: "POST", headers: { "Content-Type": "image/png" }, body: blob }); const d = await up.json(); if (d.url && projectId) { await fetch(`/api/projects/${projectId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ thumbnail: d.url }) }); } onThumbnail?.(d.url); onToast("Thumbnail applied"); }} className="btn btn-primary px-2.5 py-1 text-[10px]">Use it</button>
                  </div>
                </div>
              )}
            </div>
            <p className="text-[10px] muted leading-relaxed">Upscale output browser ki limit tak (1600px max long side). Background removal corner-color keying se hota hai — plain/green backgrounds par best.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

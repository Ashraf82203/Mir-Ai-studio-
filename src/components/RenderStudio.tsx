"use client";
import { useEffect, useRef, useState } from "react";
import {
  X, Clapperboard, Loader2, CheckCircle2, Download, Sparkles, ImagePlus,
  Play, AlertTriangle, Film, RotateCcw, Share2, Music, Pause, Square, ExternalLink, Tv,
} from "lucide-react";
import { renderVideo, proxied, type RenderResult } from "@/lib/renderVideo";
import { MUSIC_PRESETS, renderMusic, type MusicPreset } from "@/lib/renderAudio";
import { makeThumbnail } from "@/lib/imageLab";

const STYLE_VISUALS: Record<string, string> = {
  Anime: "/images/anime-scene.jpg",
  Realistic: "/images/hero-video.jpg",
  Cinematic: "/images/hero-video.jpg",
  "3D Animation": "/images/anime-scene.jpg",
  Cyberpunk: "https://images.pexels.com/photos/31158869/pexels-photo-31158869.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  Sketch: "/images/hero-video.jpg",
  Cartoon: "/images/anime-scene.jpg",
  Watercolor: "/images/anime-scene.jpg",
};
const EXTRA_VISUALS = [
  { name: "Neon studio", url: "https://images.pexels.com/photos/31158869/pexels-photo-31158869.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200" },
  { name: "Film set", url: "https://images.pexels.com/photos/8089662/pexels-photo-8089662.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200" },
  { name: "Beach drone", url: "https://images.pexels.com/videos/5849755/2020-aerial-andalusia-beach-5849755.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200" },
  { name: "Portrait", url: "https://images.pexels.com/photos/9363479/pexels-photo-9363479.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800" },
];

type Props = { project: any; email: string; onDone: () => void; onClose: () => void; onToast: (m: string) => void };

export default function RenderStudio({ project, email, onDone, onClose, onToast }: Props) {
  const style: string = project?.style || "Cinematic";
  const [images, setImages] = useState<string[]>([
    STYLE_VISUALS[style] || "/images/hero-video.jpg",
    project?.avatar ? "/images/avatar-studio.jpg" : "/images/anime-scene.jpg",
  ]);
  const [phase, setPhase] = useState<"setup" | "rendering" | "done" | "error">("setup");
  const [pct, setPct] = useState(0);
  const [status, setStatus] = useState("Ready");
  const [result, setResult] = useState<RenderResult | null>(null);
  const [url, setUrl] = useState("");
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);
  const [music, setMusic] = useState<MusicPreset>("cinematic");
  const [previewing, setPreviewing] = useState(false);
  const [thumbUrl, setThumbUrl] = useState("");
  const [brand, setBrand] = useState<any>(null);
  const [duration, setDuration] = useState(Math.min(project?.duration || 10, 30));
  const [res, setRes] = useState(project?.resolution || "1080p");
  const [aspect, setAspect] = useState(project?.aspectRatio || "16:9");
  const fileRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const musicBlobRef = useRef<Blob | null>(null);

  const captions = (() => {
    const fromScenes = Array.isArray(project?.scenes) ? project.scenes.map((s: any) => `${s.title}: ${s.desc}`) : [];
    const sentence = (project?.prompt || project?.title || "AI video").split(/[.!?]/).map((s: string) => s.trim()).filter(Boolean);
    return (fromScenes.length ? fromScenes : sentence).slice(0, 6);
  })();

  useEffect(() => {
    fetch("/api/misc?kind=brand").then(r => r.json()).then(d => { if (d.brand) setBrand(d.brand); }).catch(() => {});
  }, []);
  useEffect(() => () => { if (url) URL.revokeObjectURL(url); audioRef.current?.pause(); }, [url]);

  function toggleImage(u: string) {
    setImages(prev => prev.includes(u) ? (prev.length > 1 ? prev.filter(x => x !== u) : prev) : [...prev, u]);
  }
  function onUpload(files: FileList | null) {
    if (!files) return;
    Array.from(files).slice(0, 4).forEach(f => {
      const r = new FileReader();
      r.onload = () => { if (typeof r.result === "string") setImages(prev => [...prev, r.result as string]); };
      r.readAsDataURL(f);
    });
    onToast("Photos added to render");
  }

  async function previewMusic() {
    if (previewing) { audioRef.current?.pause(); setPreviewing(false); return; }
    setPreviewing(true);
    try {
      const blob = await renderMusic(music, 8);
      if (!blob) { setPreviewing(false); return onToast("No music selected"); }
      musicBlobRef.current = blob;
      const a = new Audio(URL.createObjectURL(blob));
      audioRef.current = a;
      a.onended = () => setPreviewing(false);
      await a.play();
      onToast("Generated track preview (real WAV)");
    } catch { setPreviewing(false); onToast("Audio preview failed"); }
  }

  async function run() {
    setPhase("rendering"); setPct(0); setErr(""); setStatus("Composing audio…");
    try {
      let audioBlob: Blob | null = null;
      if (music !== "none") {
        setPct(3); setStatus("Generating music bed…");
        audioBlob = await renderMusic(music, duration);
      }
      const res2 = await renderVideo({
        images: images.map(proxied),
        aspect, duration, resolution: res, style,
        title: project?.title || "AI Video",
        captions,
        watermark: brand?.watermark || "Mir AI Studio",
        accent: brand?.primaryColor,
        audioBlob,
        audioVolume: 0.75,
        onProgress: (p, s) => { setPct(p); setStatus(s); },
      });
      setResult(res2);
      setUrl(URL.createObjectURL(res2.blob));
      setPhase("done"); setStatus("Video ready");
      onToast(`Real video rendered — ${(res2.blob.size / 1048576).toFixed(1)} MB`);
      // real thumbnail PNG from the same visuals
      try {
        const t = await makeThumbnail(proxied(images[0]), project?.title || "AI Video", brand?.primaryColor || "#ffb43a");
        setThumbUrl(t);
      } catch { /* ignore */ }
      setSaving(true);
      const up = await fetch("/api/media", { method: "POST", headers: { "Content-Type": res2.mime, "x-mirai-email": email }, body: res2.blob });
      const data = await up.json();
      setSaving(false);
      if (data.url && project?.id) {
        await fetch(`/api/projects/${project.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "completed", progress: 100, videoUrl: data.url, note: `Rendered ${res} ${aspect}` }),
        });
        onToast("Saved to project — ab har device par chalega");
        onDone();
      }
    } catch (e: any) {
      setErr(e?.message || "Render failed");
      setPhase("error");
    }
  }

  async function shareVideo() {
    try {
      if (result && navigator.canShare?.({ files: [new File([result.blob], "mirai-video.webm", { type: result.mime })] })) {
        await navigator.share({ title: project?.title || "Mir AI video", files: [new File([result.blob], "mirai-video.webm", { type: result.mime })] });
        return;
      }
      await navigator.share?.({ title: project?.title, text: project?.prompt, url: window.location.origin + "/mobile" });
      onToast("Shared via device sheet");
    } catch {
      navigator.clipboard.writeText(window.location.origin);
      onToast("Share cancel — link copied");
    }
  }
  async function saveThumbToProject() {
    if (!thumbUrl) return;
    try {
      const blob = await (await fetch(thumbUrl)).blob();
      const up = await fetch("/api/media", { method: "POST", headers: { "Content-Type": "image/png" }, body: blob });
      const d = await up.json();
      if (d.url && project?.id) {
        await fetch(`/api/projects/${project.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ thumbnail: d.url }) });
        onToast("Thumbnail project par set ho gaya");
        onDone();
      }
    } catch { onToast("Thumbnail save failed"); }
  }

  return (
    <div className="fixed inset-0 z-[70] bg-black/85 backdrop-blur-sm grid place-items-center p-3 md:p-6 overflow-auto" onClick={() => phase !== "rendering" && onClose()}>
      <div className="w-full max-w-3xl rounded-3xl border hairline overflow-hidden my-auto reveal" style={{ background: "var(--panel)", color: "var(--text)" }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-2.5 px-4 py-3 border-b hairline">
          <span className="w-8 h-8 rounded-lg grid place-items-center" style={{ background: "var(--accent)", color: "var(--accent-ink)" }}><Clapperboard size={16} /></span>
          <div className="min-w-0">
            <p className="font-display font-bold text-sm truncate">Real Render Engine</p>
            <p className="text-[10px] muted truncate">{project?.title} · {res} · {aspect} · {duration}s</p>
          </div>
          <span className="ml-auto chip !text-[9px] chip-teal hidden sm:flex"><Sparkles size={10} /> On-device GPU</span>
          <button onClick={() => phase !== "rendering" && onClose()} className="btn btn-ghost w-8 h-8 !p-0 shrink-0"><X size={15} /></button>
        </div>

        <div className="p-4 grid md:grid-cols-2 gap-4">
          <div>
            <div className="rounded-2xl overflow-hidden bg-black border hairline relative" style={{ aspectRatio: aspect === "9:16" ? "9/14" : aspect === "1:1" ? "1/1" : "16/9" }}>
              {phase === "done" && url ? (
                <video src={url} controls playsInline className="w-full h-full object-contain bg-black" />
              ) : (
                <>
                  <img src={images[0]?.startsWith("data:") ? images[0] : proxied(images[0])} alt="preview" className="w-full h-full object-cover" style={{ filter: style === "Sketch" ? "grayscale(1) contrast(1.3)" : style === "Anime" ? "saturate(1.5)" : "saturate(1.15) contrast(1.1)" }} />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent 60%)" }} />
                  <div className="absolute top-2.5 left-2.5 chip !text-[9px]" style={{ background: brand?.primaryColor || "var(--accent)", color: "#160f02" }}>{brand?.watermark || "Mir AI Studio"}</div>
                  <div className="absolute bottom-9 left-3 right-3">
                    <p className="font-display font-bold text-white text-sm md:text-base leading-tight" style={{ textShadow: "0 2px 10px #000" }}>{project?.title}</p>
                    {captions[0] && <p className="text-[10px] md:text-[11px] mt-1 inline-block px-1.5 py-0.5 rounded bg-black/75" style={{ color: "#ffd25e" }}>{captions[0]}</p>}
                  </div>
                  <div className="absolute bottom-3 left-3 right-3"><div className="h-1 rounded-full bg-white/25 overflow-hidden"><div className="h-1 rounded-full" style={{ width: (phase === "rendering" ? pct : 0) + "%", background: brand?.primaryColor || "var(--accent)" }} /></div></div>
                  {phase === "rendering" && (
                    <div className="absolute inset-0 grid place-items-center bg-black/45">
                      <div className="text-center"><Loader2 size={30} className="animate-spin mx-auto" style={{ color: "var(--accent)" }} /><p className="text-xs font-bold mt-2 text-white">{pct}%</p><p className="text-[10px] text-white/70">{status}</p></div>
                    </div>
                  )}
                </>
              )}
            </div>

            {phase === "done" && result && (
              <>
                <div className="flex flex-wrap gap-2 mt-3">
                  <a href={url} download={(project?.title || "mirai-video") + (result.mime.includes("mp4") ? ".mp4" : ".webm")} className="btn btn-primary px-3.5 py-2 text-[11px]"><Download size={13} /> Download video</a>
                  <button onClick={shareVideo} className="btn btn-ghost px-3.5 py-2 text-[11px]"><Share2 size={13} /> Share</button>
                  <button onClick={() => window.open("https://studio.youtube.com/channel/upload", "_blank")} className="btn px-3.5 py-2 text-[11px] text-white" style={{ background: "#dc2626" }}><Tv size={13} /> YouTube Studio</button>
                  <button onClick={() => { setPhase("setup"); setPct(0); setResult(null); if (url) URL.revokeObjectURL(url); setUrl(""); }} className="btn btn-ghost px-3.5 py-2 text-[11px]"><RotateCcw size={13} /> Again</button>
                </div>
                <span className="text-[10px] muted flex items-center gap-1 mt-1.5"><CheckCircle2 size={11} style={{ color: "var(--teal)" }} />{(result.blob.size / 1048576).toFixed(1)} MB · {result.width}×{result.height} · {result.seconds}s</span>
                {thumbUrl && (
                  <div className="mt-3 flex gap-2 items-center">
                    <img src={thumbUrl} alt="thumbnail" className="w-24 h-14 object-cover rounded-lg border hairline" />
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold">Auto thumbnail ready</p>
                      <div className="flex gap-2 mt-1">
                        <a href={thumbUrl} download="mirai-thumbnail.png" className="btn btn-ghost px-2.5 py-1 text-[10px]"><Download size={11} /> PNG</a>
                        <button onClick={saveThumbToProject} className="btn btn-primary px-2.5 py-1 text-[10px]">Set as thumbnail</button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            {phase !== "done" && <p className="text-[10px] muted mt-2 leading-relaxed flex gap-1.5"><Film size={11} className="shrink-0 mt-0.5" />Asli video file: Ken Burns motion, style grading, captions, progress bar + generated music. Koi paid API nahi.</p>}
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs font-bold muted mb-1.5 flex items-center gap-1"><ImagePlus size={11} /> Visuals ({images.length}) — tap to toggle</p>
              <div className="grid grid-cols-4 gap-1.5">
                {[...Object.values(STYLE_VISUALS).filter((v, i, a) => a.indexOf(v) === i), ...EXTRA_VISUALS.map(e => e.url)].map((u, i) => (
                  <button key={u + i} onClick={() => toggleImage(u)} className="relative rounded-lg overflow-hidden border-2 aspect-square active:scale-95 transition" style={{ borderColor: images.includes(u) ? "var(--accent)" : "transparent" }}>
                    <img src={proxied(u)} alt="" className="w-full h-full object-cover" />
                    {images.includes(u) && <span className="absolute inset-0 bg-black/25 grid place-items-center"><CheckCircle2 size={15} style={{ color: "var(--accent)" }} /></span>}
                  </button>
                ))}
                <button onClick={() => fileRef.current?.click()} className="rounded-lg aspect-square border-2 border-dashed grid place-items-center active:scale-95" style={{ borderColor: "var(--line)" }}><ImagePlus size={16} className="muted" /></button>
                <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={e => onUpload(e.target.files)} />
              </div>
            </div>

            <div>
              <p className="text-xs font-bold muted mb-1.5 flex items-center gap-1"><Music size={11} /> AI Music (real generated WAV)</p>
              <div className="flex flex-wrap gap-1">
                {MUSIC_PRESETS.map(m => <button key={m.id} onClick={() => setMusic(m.id)} className={`chip !text-[10px] ${music === m.id ? "chip-on" : ""}`}>{m.name}</button>)}
              </div>
              <div className="flex gap-2 mt-1.5">
                <button onClick={previewMusic} className="btn btn-ghost px-3 py-1.5 text-[11px]">{previewing ? <><Pause size={12} /> Stop</> : <><Play size={12} /> Preview</>}</button>
                <span className="text-[10px] muted self-center">{MUSIC_PRESETS.find(m => m.id === music)?.mood}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              <label className="text-[10px] muted font-bold">Duration {duration}s<input type="range" min={3} max={30} value={duration} onChange={e => setDuration(Number(e.target.value))} className="w-full" /></label>
              <select value={res} onChange={e => setRes(e.target.value)} className="input !py-1.5 text-[11px]">{["480p", "720p", "1080p", "4K"].map(r => <option key={r}>{r}</option>)}</select>
              <select value={aspect} onChange={e => setAspect(e.target.value)} className="input !py-1.5 text-[11px]">{["9:16", "16:9", "1:1", "4:5"].map(r => <option key={r}>{r}</option>)}</select>
            </div>

            {phase === "rendering" && (
              <div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "color-mix(in srgb, var(--text) 10%, transparent)" }}><div className="h-2 rounded-full relative transition-all" style={{ width: pct + "%", background: "var(--accent)" }}><span className="absolute inset-0 shimmer" /></div></div>
                <p className="text-[10px] muted mt-1.5">{status} — tab khula rakhein, frames capture ho rahe hain</p>
              </div>
            )}
            {phase === "error" && <div className="rounded-xl p-3 text-[11px] flex gap-2" style={{ background: "color-mix(in srgb, var(--danger) 14%, transparent)", color: "var(--danger)" }}><AlertTriangle size={14} className="shrink-0" /><span>{err}<br />Chrome/Edge try karein ya resolution kam karein.</span></div>}

            <button onClick={run} disabled={phase === "rendering"} className="btn btn-primary w-full py-3 text-sm disabled:opacity-50">
              {phase === "rendering" ? <><Loader2 size={15} className="animate-spin" /> Rendering {pct}%</> : phase === "done" ? <><RotateCcw size={15} /> Render Again</> : <><Play size={15} fill="currentColor" /> Render Real Video</>}
            </button>
            {saving && <p className="text-[10px] muted flex items-center gap-1"><Loader2 size={10} className="animate-spin" /> Saving to cloud…</p>}
            {phase === "setup" && <p className="text-[10px] muted">Render ke baad file download, share ya project mein save ho jati hai — thumbnail bhi auto-generate hota hai.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

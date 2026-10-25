"use client";

export type RenderOptions = {
  images: string[];
  aspect: string;
  duration: number;
  resolution: string;
  style: string;
  title: string;
  captions: string[];
  watermark: string;
  accent?: string;
  audioBlob?: Blob | null;
  audioVolume?: number;
  onProgress?: (pct: number, phase: string) => void;
};

export type RenderResult = { blob: Blob; mime: string; width: number; height: number; seconds: number };

const STYLE_FILTER: Record<string, string> = {
  Realistic: "saturate(1.05) contrast(1.03)",
  Cinematic: "saturate(1.18) contrast(1.14) brightness(1.02)",
  Anime: "saturate(1.5) contrast(1.2) brightness(1.06)",
  "3D Animation": "saturate(1.3) contrast(1.1)",
  Cartoon: "saturate(1.7) contrast(1.15)",
  Sketch: "grayscale(1) contrast(1.35) brightness(1.08)",
  Cyberpunk: "saturate(1.6) contrast(1.25) hue-rotate(-12deg)",
  Watercolor: "saturate(0.85) contrast(0.95) brightness(1.08) sepia(0.15)",
};

function dims(aspect: string, resolution: string) {
  const short = resolution === "4K" ? 1440 : resolution === "1080p" ? 1080 : resolution === "720p" ? 720 : 480;
  let w = 16, h = 9;
  if (aspect === "9:16") { w = 9; h = 16; }
  else if (aspect === "1:1") { w = 1; h = 1; }
  else if (aspect === "4:5") { w = 4; h = 5; }
  const even = (n: number) => Math.max(2, Math.round(n / 2) * 2);
  if (w >= h) return { width: even(short * (w / h)), height: even(short) };
  return { width: even(short), height: even(short * (h / w)) };
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    if (!src.startsWith("data:")) img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function pickMime(): string {
  if (typeof MediaRecorder === "undefined") return "";
  const options = [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm;codecs=vp9",
    "video/webm",
    "video/mp4;codecs=avc1.42E01E,mp4a.40.2",
    "video/mp4",
  ];
  for (const m of options) {
    try { if (MediaRecorder.isTypeSupported(m)) return m; } catch { /* keep trying */ }
  }
  return "";
}

export async function renderVideo(opts: RenderOptions): Promise<RenderResult> {
  const { width, height } = dims(opts.aspect, opts.resolution);
  const duration = Math.min(Math.max(opts.duration, 3), 30);
  const canvas = document.createElement("canvas");
  canvas.width = width; canvas.height = height;
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) throw new Error("Canvas 2D not supported in this browser");

  opts.onProgress?.(2, "Loading visuals");
  const raw = opts.images.length ? opts.images : ["/images/hero-video.jpg"];
  const loaded = (await Promise.all(raw.map(loadImage))).filter(Boolean) as HTMLImageElement[];
  const pool = loaded.length ? loaded : (await Promise.all(["/images/hero-video.jpg"].map(loadImage))).filter(Boolean) as HTMLImageElement[];
  if (!pool.length) throw new Error("Visuals load nahi hoe — dobara koshish karein");

  const mime = pickMime();
  if (!mime) throw new Error("Is browser mein video recording support nahi hai (Chrome/Edge/Firefox try karein)");

  opts.onProgress?.(8, "Preparing audio bed");
  let audioCtx: AudioContext | null = null;
  const audioTracks: MediaStreamTrack[] = [];
  try {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AC();
    if (audioCtx.state === "suspended") await audioCtx.resume();
    const dest = audioCtx.createMediaStreamDestination();
    const master = audioCtx.createGain();
    master.gain.value = opts.audioBlob ? (opts.audioVolume ?? 0.85) : 0.16;
    master.connect(dest);
    if (opts.audioBlob) {
      // generated music track (WAV) mixed into the video
      try {
        const arr = await opts.audioBlob.arrayBuffer();
        const buffer = await audioCtx.decodeAudioData(arr);
        const src = audioCtx.createBufferSource();
        src.buffer = buffer; src.loop = true;
        src.connect(master); src.start();
      } catch { /* fall back to pad */ }
    }
    if (!opts.audioBlob) {
      const notes = opts.style === "Cyberpunk" ? [110, 164.81, 220, 329.63] : [130.81, 196, 261.63, 392];
      notes.forEach((freq, i) => {
        const osc = audioCtx!.createOscillator();
        osc.type = i % 2 ? "triangle" : "sine";
        osc.frequency.value = freq;
        const gain = audioCtx!.createGain();
        const lfo = audioCtx!.createOscillator();
        lfo.frequency.value = 0.12 + i * 0.05;
        const lfoGain = audioCtx!.createGain();
        lfoGain.gain.value = 0.028;
        lfo.connect(lfoGain).connect(gain.gain);
        gain.gain.value = 0.045;
        osc.connect(gain).connect(master);
        osc.start(); lfo.start();
      });
    }
    audioTracks.push(...dest.stream.getAudioTracks());
  } catch { audioCtx = null; }

  const videoStream = canvas.captureStream(30);
  const combined = new MediaStream([...videoStream.getVideoTracks(), ...audioTracks]);
  const recorder = new MediaRecorder(combined, { mimeType: mime, videoBitsPerSecond: 3_200_000, audioBitsPerSecond: 96_000 });
  const chunks: BlobPart[] = [];
  recorder.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };

  const stopPromise = new Promise<void>((resolve) => { recorder.onstop = () => resolve(); });

  const filter = STYLE_FILTER[opts.style] || STYLE_FILTER.Cinematic;
  const captions = opts.captions.filter(Boolean);
  const sceneCount = Math.max(pool.length, 2);
  const sceneDur = duration / sceneCount;
  const renderedAt = (t: number) => {
    const idx = Math.min(sceneCount - 1, Math.floor(t / sceneDur));
    const local = (t - idx * sceneDur) / sceneDur;
    return { idx, local };
  };

  function drawCover(img: HTMLImageElement, zoom: number, panX: number, panY: number, alpha = 1, blur = 0) {
    const cw = canvas.width, ch = canvas.height;
    const ir = img.width / img.height, cr = cw / ch;
    let dw: number, dh: number;
    if (ir > cr) { dh = ch * zoom; dw = dh * ir; } else { dw = cw * zoom; dh = dw / ir; }
    const x = (cw - dw) / 2 + panX * (dw - cw) * 0.5;
    const y = (ch - dh) / 2 + panY * (dh - ch) * 0.5;
    ctx!.save();
    ctx!.globalAlpha = alpha;
    ctx!.filter = `${filter} blur(${blur}px)`;
    ctx!.drawImage(img, x, y, dw, dh);
    ctx!.restore();
  }

  function roundedRect(x: number, y: number, w: number, h: number, r: number) {
    ctx!.beginPath();
    ctx!.moveTo(x + r, y);
    ctx!.arcTo(x + w, y, x + w, y + h, r);
    ctx!.arcTo(x + w, y + h, x, y + h, r);
    ctx!.arcTo(x, y + h, x, y, r);
    ctx!.arcTo(x, y, x + w, y, r);
    ctx!.closePath();
  }

  function drawFrame(t: number) {
    const { idx, local } = renderedAt(t);
    const zoom = 1.06 + local * 0.14;
    const dir = idx % 2 === 0 ? 1 : -1;
    const panX = dir * (local - 0.5) * 0.5;
    const panY = (idx % 3 === 0 ? 1 : -1) * (local - 0.5) * 0.35;

    ctx!.fillStyle = "#000";
    ctx!.fillRect(0, 0, canvas.width, canvas.height);

    // crossfade to next scene in the last 18% of each scene
    drawCover(pool[idx % pool.length], zoom, panX, panY, 1);
    const fade = local > 0.82 ? (local - 0.82) / 0.18 : 0;
    if (fade > 0) drawCover(pool[(idx + 1) % pool.length], 1.06, 0, 0, fade);

    // vignette
    const vg = ctx!.createRadialGradient(canvas.width / 2, canvas.height / 2, canvas.height * 0.25, canvas.width / 2, canvas.height / 2, canvas.height * 0.78);
    vg.addColorStop(0, "rgba(0,0,0,0)");
    vg.addColorStop(1, "rgba(0,0,0,0.55)");
    ctx!.fillStyle = vg;
    ctx!.fillRect(0, 0, canvas.width, canvas.height);

    // bottom gradient for captions
    const bg = ctx!.createLinearGradient(0, canvas.height * 0.55, 0, canvas.height);
    bg.addColorStop(0, "rgba(0,0,0,0)");
    bg.addColorStop(1, "rgba(0,0,0,0.82)");
    ctx!.fillStyle = bg;
    ctx!.fillRect(0, canvas.height * 0.55, canvas.width, canvas.height * 0.45);

    const pad = Math.round(canvas.width * 0.055);
    const titleSize = Math.round(canvas.width * (opts.aspect === "9:16" ? 0.072 : 0.05));
    const capSize = Math.round(canvas.width * (opts.aspect === "9:16" ? 0.055 : 0.036));
    const ui = Math.round(canvas.width * 0.026);

    // brand chip
    ctx!.font = `700 ${ui}px "Space Grotesk", system-ui, sans-serif`;
    const chip = "Mir AI Studio";
    const cw2 = ctx!.measureText(chip).width + ui * 2;
    ctx!.fillStyle = "rgba(255,180,58,0.92)";
    roundedRect(pad, pad, cw2, ui * 2.3, ui);
    ctx!.fill();
    ctx!.fillStyle = "#1a1204";
    ctx!.fillText(chip, pad + ui, pad + ui * 1.6);

    // title (fades in during first 1.2s, out at the end)
    const titleAlpha = t < 0.5 ? t / 0.5 : t > duration - 1 ? Math.max(0, (duration - t) / 1) : 1;
    ctx!.globalAlpha = titleAlpha;
    ctx!.font = `800 ${titleSize}px "Space Grotesk", system-ui, sans-serif`;
    ctx!.fillStyle = "#ffffff";
    ctx!.shadowColor = "rgba(0,0,0,0.85)";
    ctx!.shadowBlur = ui;
    const words = opts.title.split(" ");
    const lines: string[] = [];
    let line = "";
    for (const w of words) {
      const test = line ? line + " " + w : w;
      if (ctx!.measureText(test).width > canvas.width - pad * 2 && line) { lines.push(line); line = w; } else line = test;
    }
    if (line) lines.push(line);
    lines.slice(0, 3).forEach((l, i) => {
      ctx!.fillText(l, pad, pad + ui * 4.4 + titleSize * (i + 1));
    });
    ctx!.shadowBlur = 0;
    ctx!.globalAlpha = 1;

    // captions (karaoke box)
    if (captions.length) {
      const ci = Math.floor((t / duration) * captions.length) % captions.length;
      const text = (captions[ci] || "").slice(0, 95);
      ctx!.font = `800 ${capSize}px "DM Sans", system-ui, sans-serif`;
      const maxW = canvas.width - pad * 2;
      const tw = Math.min(ctx!.measureText(text).width, maxW);
      const boxH = capSize * 1.9;
      const boxY = canvas.height - pad - boxH - (opts.aspect === "9:16" ? canvas.height * 0.05 : 0);
      const boxX = (canvas.width - (tw + capSize * 1.2)) / 2;
      ctx!.fillStyle = "rgba(0,0,0,0.72)";
      roundedRect(boxX, boxY, tw + capSize * 1.2, boxH, capSize * 0.35);
      ctx!.fill();
      ctx!.fillStyle = "#ffd25e";
      ctx!.textAlign = "center";
      ctx!.fillText(text, canvas.width / 2, boxY + capSize * 1.32);
      ctx!.textAlign = "left";
    }

    // watermark
    if (opts.watermark) {
      ctx!.font = `600 ${ui * 0.9}px system-ui, sans-serif`;
      ctx!.fillStyle = "rgba(255,255,255,0.75)";
      const wm = opts.watermark;
      ctx!.textAlign = "right";
      ctx!.fillText(wm, canvas.width - pad, canvas.height - pad * 0.6);
      ctx!.textAlign = "left";
    }

    // progress bar
    const barW = canvas.width * 0.86, barX = (canvas.width - barW) / 2, barY = canvas.height - Math.round(pad * 0.55);
    ctx!.fillStyle = "rgba(255,255,255,0.22)";
    roundedRect(barX, barY, barW, ui * 0.42, ui * 0.21);
    ctx!.fill();
    const p = Math.min(1, t / duration);
    ctx!.fillStyle = "#ffb43a";
    roundedRect(barX, barY, barW * p, ui * 0.42, ui * 0.21);
    ctx!.fill();
  }

  drawFrame(0);
  recorder.start(200);
  const started = performance.now();
  opts.onProgress?.(12, "Rendering frames");

  await new Promise<void>((resolve) => {
    const loop = () => {
      const elapsed = (performance.now() - started) / 1000;
      const t = Math.min(duration, elapsed);
      drawFrame(t);
      const pct = 12 + Math.round((t / duration) * 82);
      opts.onProgress?.(pct, `Rendering ${t.toFixed(1)}s / ${duration}s`);
      if (elapsed >= duration) { resolve(); return; }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  });

  opts.onProgress?.(95, "Encoding video");
  recorder.stop();
  await stopPromise;
  try { audioCtx?.close(); } catch { /* noop */ }
  videoStream.getTracks().forEach((t) => t.stop());
  const blob = new Blob(chunks, { type: mime.split(";")[0] });
  if (!blob.size) throw new Error("Render failed — koi frame record nahi hua");
  opts.onProgress?.(100, "Done");
  return { blob, mime: blob.type || "video/webm", width, height, seconds: duration };
}

export function proxied(url: string) {
  if (url.startsWith("/") || url.startsWith("data:") || url.startsWith("blob:")) return url;
  return `/api/proxy-image?url=${encodeURIComponent(url)}`;
}

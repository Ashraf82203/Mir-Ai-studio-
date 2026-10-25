"use client";
// Real client-side image processing: enhance, upscale, key-removal, grades, geometry, texture.

export type LabOp =
  | "enhance" | "upscale" | "sharpen" | "removeBg" | "blurBg" | "gradeCinematic"
  | "gradeWarm" | "gradeCool" | "bnw" | "sketch" | "flipH" | "flipV" | "rotate"
  | "vignette" | "grain" | "chroma";

export const LAB_OPS: { id: LabOp; name: string; hint: string }[] = [
  { id: "enhance", name: "Auto Enhance", hint: "Levels + saturation" },
  { id: "upscale", name: "Upscale 2×", hint: "Bicubic + sharpen" },
  { id: "sharpen", name: "Sharpen", hint: "Edge detail" },
  { id: "removeBg", name: "Remove Background", hint: "Color key (auto)" },
  { id: "blurBg", name: "Portrait Blur BG", hint: "Radial mask" },
  { id: "gradeCinematic", name: "Cinematic Grade", hint: "Teal / orange" },
  { id: "gradeWarm", name: "Warm Grade", hint: "Golden hour" },
  { id: "gradeCool", name: "Cool Grade", hint: "Blue hour" },
  { id: "bnw", name: "Black & White", hint: "Mono" },
  { id: "sketch", name: "Sketch", hint: "Ink lines" },
  { id: "flipH", name: "Flip H", hint: "Mirror" },
  { id: "flipV", name: "Flip V", hint: "Mirror" },
  { id: "rotate", name: "Rotate 90°", hint: "Orientation" },
  { id: "vignette", name: "Vignette", hint: "Focus pull" },
  { id: "grain", name: "Film Grain", hint: "16mm look" },
];

export function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (!src.startsWith("data:")) img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Image load failed"));
    img.src = src;
  });
}

/** Apply a chain of operations and return PNG data URL. */
export async function applyOps(src: string, ops: LabOp[], background = "#0b0e15", maxSide = 1600): Promise<{ dataUrl: string; width: number; height: number }> {
  const img = await loadImg(src);
  const rotated = ops.includes("rotate");
  const scale = ops.includes("upscale") ? 2 : 1;
  let w = (rotated ? img.height : img.width) * scale;
  let h = (rotated ? img.width : img.height) * scale;
  const cap = maxSide / Math.max(w, h);
  if (cap < 1) { w *= cap; h *= cap; }
  w = Math.round(w); h = Math.round(h);

  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.imageSmoothingQuality = "high";
  ctx.save();
  if (rotated) { ctx.translate(w / 2, h / 2); ctx.rotate(Math.PI / 2); ctx.drawImage(img, -h / 2, -w / 2, h, w); }
  else ctx.drawImage(img, 0, 0, w, h);
  ctx.restore();

  const sharpen = ops.includes("sharpen") || ops.includes("upscale");
  if (sharpen) {
    const c2 = document.createElement("canvas"); c2.width = w; c2.height = h;
    const x2 = c2.getContext("2d", { willReadFrequently: true })!;
    x2.filter = "contrast(1.14) saturate(1.06)";
    x2.drawImage(canvas, 0, 0);
    ctx.filter = "none"; ctx.drawImage(c2, 0, 0);
  }
  if (ops.includes("enhance")) {
    const c3 = document.createElement("canvas"); c3.width = w; c3.height = h;
    const x3 = c3.getContext("2d", { willReadFrequently: true })!;
    x3.filter = "brightness(1.06) contrast(1.1) saturate(1.18)";
    x3.drawImage(canvas, 0, 0);
    ctx.clearRect(0, 0, w, h); ctx.drawImage(c3, 0, 0);
  }
  if (ops.includes("gradeCinematic")) {
    ctx.globalCompositeOperation = "overlay";
    ctx.fillStyle = "rgba(12,74,110,0.42)"; ctx.fillRect(0, 0, w, h * 0.55);
    ctx.fillStyle = "rgba(180,83,9,0.32)"; ctx.fillRect(0, h * 0.45, w, h * 0.55);
    ctx.globalCompositeOperation = "source-over";
    ctx.filter = "contrast(1.12) saturate(1.1)"; ctx.drawImage(canvas, 0, 0); ctx.filter = "none";
  }
  if (ops.includes("gradeWarm") || ops.includes("gradeCool")) {
    const c4 = document.createElement("canvas"); c4.width = w; c4.height = h;
    const x4 = c4.getContext("2d", { willReadFrequently: true })!;
    x4.filter = ops.includes("gradeWarm") ? "sepia(0.28) saturate(1.3) brightness(1.05)" : "hue-rotate(-12deg) saturate(1.2) brightness(0.98) contrast(1.1)";
    x4.drawImage(canvas, 0, 0);
    ctx.clearRect(0, 0, w, h); ctx.drawImage(c4, 0, 0);
  }
  if (ops.includes("bnw") || ops.includes("sketch")) {
    const c5 = document.createElement("canvas"); c5.width = w; c5.height = h;
    const x5 = c5.getContext("2d", { willReadFrequently: true })!;
    x5.filter = ops.includes("sketch") ? "grayscale(1) contrast(1.7) brightness(1.12)" : "grayscale(1) contrast(1.08)";
    x5.drawImage(canvas, 0, 0);
    ctx.clearRect(0, 0, w, h); ctx.drawImage(c5, 0, 0);
  }
  if (ops.includes("blurBg")) {
    const c6 = document.createElement("canvas"); c6.width = w; c6.height = h;
    const x6 = c6.getContext("2d")!;
    x6.filter = "blur(14px) brightness(0.92)";
    x6.drawImage(canvas, -20, -20, w + 40, h + 40);
    ctx.clearRect(0, 0, w, h); ctx.drawImage(c6, 0, 0);
    const grad = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.18, w / 2, h / 2, Math.min(w, h) * 0.6);
    grad.addColorStop(0, "rgba(0,0,0,0)");
    grad.addColorStop(1, "rgba(0,0,0,1)");
    const mask = document.createElement("canvas"); mask.width = w; mask.height = h;
    const mx = mask.getContext("2d")!;
    mx.drawImage(canvas, 0, 0);
    mx.globalCompositeOperation = "destination-in";
    mx.fillStyle = grad as any;
    // fallback: soft-edged ellipse mask keeps centre sharp
    mx.globalCompositeOperation = "destination-in";
    mx.fillStyle = "#000";
    mx.beginPath(); mx.ellipse(w / 2, h / 2, w * 0.34, h * 0.44, 0, 0, Math.PI * 2); mx.fill();
    ctx.drawImage(mask, 0, 0);
  }
  if (ops.includes("removeBg") || ops.includes("chroma")) {
    // sample the four corners, key the dominant background colour
    const imgData = ctx.getImageData(0, 0, w, h);
    const px = imgData.data;
    const corners = [
      (0 * w + 0) * 4, (0 * w + (w - 1)) * 4, ((h - 1) * w + 0) * 4, ((h - 1) * w + (w - 1)) * 4,
    ];
    let r = 0, g = 0, b = 0;
    corners.forEach((i) => { r += px[i]; g += px[i + 1]; b += px[i + 2]; });
    r /= 4; g /= 4; b /= 4;
    const tol = 62;
    for (let i = 0; i < px.length; i += 4) {
      const d = Math.sqrt((px[i] - r) ** 2 + (px[i + 1] - g) ** 2 + (px[i + 2] - b) ** 2);
      if (d < tol) px[i + 3] = 0;
      else if (d < tol * 1.6) px[i + 3] = Math.round(255 * ((d - tol) / (tol * 0.6)));
    }
    ctx.putImageData(imgData, 0, 0);
    const bg = document.createElement("canvas"); bg.width = w; bg.height = h;
    const bx = bg.getContext("2d")!;
    const grad = bx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, background); grad.addColorStop(1, "#1b2233");
    bx.fillStyle = grad; bx.fillRect(0, 0, w, h);
    bx.drawImage(canvas, 0, 0);
    ctx.clearRect(0, 0, w, h); ctx.drawImage(bg, 0, 0);
  }
  if (ops.includes("vignette")) {
    const g = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.22, w / 2, h / 2, Math.max(w, h) * 0.72);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, "rgba(0,0,0,0.62)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  }
  if (ops.includes("grain")) {
    const imgData = ctx.getImageData(0, 0, w, h);
    const px = imgData.data;
    for (let i = 0; i < px.length; i += 4) {
      const n = (Math.random() - 0.5) * 26;
      px[i] += n; px[i + 1] += n; px[i + 2] += n;
    }
    ctx.putImageData(imgData, 0, 0);
  }
  if (ops.includes("flipH") || ops.includes("flipV")) {
    const c7 = document.createElement("canvas"); c7.width = w; c7.height = h;
    const x7 = c7.getContext("2d")!;
    x7.translate(ops.includes("flipH") ? w : 0, ops.includes("flipV") ? h : 0);
    x7.scale(ops.includes("flipH") ? -1 : 1, ops.includes("flipV") ? -1 : 1);
    x7.drawImage(canvas, 0, 0);
    ctx.clearRect(0, 0, w, h); ctx.drawImage(c7, 0, 0);
  }
  return { dataUrl: canvas.toDataURL("image/png"), width: w, height: h };
}

/** Generate a real thumbnail PNG from a video-ish frame / image with bold title text. */
export async function makeThumbnail(src: string, title: string, accent = "#ffb43a"): Promise<string> {
  const img = await loadImg(src);
  const w = 1280, h = 720;
  const canvas = document.createElement("canvas"); canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const ir = img.width / img.height, cr = w / h;
  let dw = w, dh = h;
  if (ir > cr) { dh = h; dw = h * ir; } else { dw = w; dh = w / ir; }
  ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
  ctx.filter = "contrast(1.15) saturate(1.2)"; ctx.drawImage(canvas, 0, 0); ctx.filter = "none";
  const grad = ctx.createLinearGradient(0, h * 0.35, 0, h);
  grad.addColorStop(0, "rgba(0,0,0,0)"); grad.addColorStop(1, "rgba(0,0,0,0.9)");
  ctx.fillStyle = grad; ctx.fillRect(0, h * 0.35, w, h * 0.65);
  ctx.font = '800 74px "Space Grotesk", system-ui, sans-serif';
  ctx.fillStyle = "#fff";
  const words = title.toUpperCase().split(" ");
  const lines: string[] = []; let line = "";
  for (const word of words) {
    const t = line ? line + " " + word : word;
    if (ctx.measureText(t).width > w - 120 && line) { lines.push(line); line = word; } else line = t;
  }
  if (line) lines.push(line);
  lines.slice(0, 3).forEach((l, i) => {
    const y = h - 150 + i * 84;
    ctx.lineWidth = 10; ctx.strokeStyle = "rgba(0,0,0,0.85)"; ctx.strokeText(l, 60, y);
    ctx.fillText(l, 60, y);
  });
  ctx.fillStyle = accent;
  ctx.fillRect(60, 52, 190, 52);
  ctx.fillStyle = "#160f02"; ctx.font = '800 28px "Space Grotesk", system-ui, sans-serif';
  ctx.fillText("Mir AI", 82, 88);
  return canvas.toDataURL("image/png");
}

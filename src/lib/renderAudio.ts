"use client";
// Real procedural music + SFX generation using OfflineAudioContext, exported as WAV.
export type MusicPreset = "none" | "upbeat" | "cinematic" | "lofi" | "epic" | "nasheed";

export const MUSIC_PRESETS: { id: MusicPreset; name: string; mood: string }[] = [
  { id: "none", name: "No music", mood: "Voice only" },
  { id: "upbeat", name: "Corporate Upbeat", mood: "Vlog / Reels" },
  { id: "cinematic", name: "Cinematic Score", mood: "Trailers" },
  { id: "lofi", name: "Lo-Fi Chill", mood: "Story / Podcast" },
  { id: "epic", name: "Epic Orchestral", mood: "Ads / Reveal" },
  { id: "nasheed", name: "Desi Melody", mood: "Urdu / Wedding" },
];

const SR = 44100;

function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numCh = buffer.numberOfChannels;
  const len = buffer.length * numCh * 2 + 44;
  const view = new DataView(new ArrayBuffer(len));
  const writeStr = (o: number, s: string) => { for (let i = 0; i < s.length; i++) view.setUint8(o + i, s.charCodeAt(i)); };
  writeStr(0, "RIFF"); view.setUint32(4, len - 8, true); writeStr(8, "WAVE"); writeStr(12, "fmt ");
  view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, numCh, true);
  view.setUint32(24, buffer.sampleRate, true); view.setUint32(28, buffer.sampleRate * numCh * 2, true);
  view.setUint16(32, numCh * 2, true); view.setUint16(34, 16, true); writeStr(36, "data");
  view.setUint32(40, len - 44, true);
  const chans: Float32Array[] = [];
  for (let c = 0; c < numCh; c++) chans.push(buffer.getChannelData(c));
  let off = 44;
  for (let i = 0; i < buffer.length; i++) {
    for (let c = 0; c < numCh; c++) {
      const s = Math.max(-1, Math.min(1, chans[c][i]));
      view.setInt16(off, s < 0 ? s * 0x8000 : s * 0x7fff, true);
      off += 2;
    }
  }
  return new Blob([view.buffer], { type: "audio/wav" });
}

function note(ctx: OfflineAudioContext, freq: number, start: number, dur: number, type: OscillatorType, vol: number, cutoff?: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type; osc.frequency.value = freq;
  let node: AudioNode = osc;
  if (cutoff) {
    const filt = ctx.createBiquadFilter(); filt.type = "lowpass"; filt.frequency.value = cutoff; osc.connect(filt); node = filt;
  }
  node.connect(gain).connect(ctx.destination);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(vol, start + Math.min(0.05, dur * 0.2));
  gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  osc.start(start); osc.stop(start + dur + 0.05);
}

function drum(ctx: OfflineAudioContext, start: number, kind: "kick" | "snare" | "hat", vol = 0.3) {
  const dur = kind === "kick" ? 0.22 : kind === "snare" ? 0.14 : 0.05;
  if (kind === "kick") {
    const osc = ctx.createOscillator(); const g = ctx.createGain();
    osc.type = "sine"; osc.frequency.setValueAtTime(140, start); osc.frequency.exponentialRampToValueAtTime(45, start + dur);
    g.gain.setValueAtTime(vol, start); g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.connect(g).connect(ctx.destination); osc.start(start); osc.stop(start + dur + 0.02);
    return;
  }
  const len = Math.floor(SR * dur);
  const buf = ctx.createBuffer(1, len, SR);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = ctx.createBufferSource(); src.buffer = buf;
  const filt = ctx.createBiquadFilter(); filt.type = kind === "snare" ? "bandpass" : "highpass"; filt.frequency.value = kind === "snare" ? 1800 : 7000;
  const g = ctx.createGain(); g.gain.value = vol;
  src.connect(filt).connect(g).connect(ctx.destination); src.start(start);
}

/** Render a real audio track (WAV blob) for a preset. */
export async function renderMusic(preset: MusicPreset, seconds: number): Promise<Blob | null> {
  if (preset === "none") return null;
  const dur = Math.max(2, Math.min(seconds, 30));
  const ctx = new OfflineAudioContext(2, Math.ceil(SR * dur), SR);
  const bpm = preset === "upbeat" ? 120 : preset === "lofi" ? 80 : preset === "epic" ? 92 : preset === "nasheed" ? 96 : 64;
  const beat = 60 / bpm;
  const chordSets: Record<string, number[][]> = {
    cinematic: [[130.81, 196.0, 261.63], [116.54, 174.61, 233.08], [98.0, 146.83, 196.0], [110.0, 164.81, 220.0]],
    upbeat: [[261.63, 329.63, 392.0], [349.23, 440.0, 523.25], [392.0, 493.88, 587.33], [329.63, 415.3, 493.88]],
    lofi: [[174.61, 220.0, 261.63], [196.0, 246.94, 293.66], [146.83, 196.0, 246.94], [164.81, 220.0, 261.63]],
    epic: [[65.41, 98.0, 130.81], [77.78, 116.54, 155.56], [87.31, 130.81, 174.61], [65.41, 98.0, 196.0]],
    nasheed: [[220.0, 261.63, 329.63], [196.0, 246.94, 293.66], [174.61, 220.0, 261.63], [196.0, 261.63, 329.63]],
  };
  const chords = chordSets[preset] || chordSets.cinematic;
  const bars = Math.ceil(dur / (beat * 4));
  for (let bar = 0; bar < bars; bar++) {
    const t0 = bar * beat * 4;
    if (t0 > dur) break;
    const chord = chords[bar % chords.length];
    // pad / chord
    chord.forEach((f, i) => {
      const type: OscillatorType = preset === "upbeat" ? "triangle" : preset === "lofi" ? "sine" : preset === "epic" ? "sawtooth" : "triangle";
      note(ctx, f, t0, beat * 4 * 0.98, type, preset === "epic" ? 0.055 : 0.075, preset === "lofi" ? 1400 : preset === "upbeat" ? 5000 : 2600);
      if (preset === "epic" || preset === "cinematic") note(ctx, f / 2, t0, beat * 4, "sine", 0.06);
    });
    // melody / arp
    {
      const steps = preset === "upbeat" ? 8 : preset === "nasheed" ? 6 : 4;
      for (let s = 0; s < steps; s++) {
        const st = t0 + s * (beat * 4 / steps);
        if (st > dur) break;
        const f = chord[s % chord.length] * (preset === "upbeat" ? 2 : 1.5);
        if (preset === "lofi" && s % 2) continue;
        note(ctx, f, st, beat * 0.5, preset === "nasheed" ? "triangle" : "sine", preset === "upbeat" ? 0.07 : 0.05, 6000);
      }
    }
    // drums
    if (preset === "upbeat" || preset === "epic") {
      for (let b = 0; b < 4; b++) {
        const st = t0 + b * beat;
        if (st > dur) break;
        if (b % 2 === 0) drum(ctx, st, "kick", 0.42);
        else drum(ctx, st, "snare", 0.2);
        drum(ctx, st + beat / 2, "hat", 0.08);
      }
    } else if (preset === "lofi") {
      for (let b = 0; b < 4; b++) {
        const st = t0 + b * beat;
        if (st > dur) break;
        if (b === 0 || b === 2) drum(ctx, st, "kick", 0.3);
        drum(ctx, st + beat / 2, "hat", 0.05);
      }
    }
  }
  const buffer = await ctx.startRendering();
  return audioBufferToWav(buffer);
}

/** Short real SFX file (whoosh / pop / riser). */
export async function renderSfx(kind: "whoosh" | "pop" | "riser"): Promise<Blob> {
  const dur = kind === "pop" ? 0.18 : kind === "whoosh" ? 0.7 : 1.4;
  const ctx = new OfflineAudioContext(1, Math.ceil(SR * dur), SR);
  const g = ctx.createGain(); g.connect(ctx.destination);
  if (kind === "pop") {
    const osc = ctx.createOscillator(); osc.type = "sine";
    osc.frequency.setValueAtTime(880, 0); osc.frequency.exponentialRampToValueAtTime(260, dur);
    g.gain.setValueAtTime(0.4, 0); g.gain.exponentialRampToValueAtTime(0.0001, dur);
    osc.connect(g); osc.start(0); osc.stop(dur);
  } else {
    const len = Math.ceil(SR * dur);
    const buf = ctx.createBuffer(1, len, SR);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (kind === "riser" ? i / len : 1 - i / len);
    const src = ctx.createBufferSource(); src.buffer = buf;
    const filt = ctx.createBiquadFilter(); filt.type = "bandpass";
    filt.frequency.setValueAtTime(kind === "riser" ? 300 : 2400, 0);
    filt.frequency.exponentialRampToValueAtTime(kind === "riser" ? 6000 : 700, dur);
    filt.Q.value = 1.2;
    src.connect(filt).connect(g); src.start(0);
  }
  const buffer = await ctx.startRendering();
  return audioBufferToWav(buffer);
}

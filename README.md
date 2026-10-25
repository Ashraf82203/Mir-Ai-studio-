# Mir AI Studio — AI Video Generator · Urdu / Hindi

**Text-to-Video, Image-to-Video, AI Avatars, Urdu/Hindi AI voices, auto subtitles, timeline editor, 4K export, mobile PWA — zero paid external APIs required.**

---

## 🚀 Quick Start

```bash
npm install
cp .env.example .env      # add your DATABASE_URL
npx drizzle-kit push      # create tables
npm run dev               # http://localhost:3000
```

Production build:

```bash
npm run build && npm start
```

---

## ☁️ Deploy to Vercel (2 minutes)

### Step 1 — Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/mirai-studio.git
git branch -M main
git push -u origin main
```

### Step 2 — Import on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Add New…" → "Project"** → import your `mirai-studio` repo
3. Vercel auto-detects **Next.js** — framework preset, build command and output are pre-filled from `vercel.json`
4. Open **Settings → Environment Variables** and add:

   | Key | Value |
   |---|---|
   | `DATABASE_URL` | `postgresql://user:pass@host:5432/app_db` |
   | `NEXT_PUBLIC_SITE_URL` | `https://your-app.vercel.app` |

5. Click **Deploy** 🎉

Your live URL will be: **`https://your-app.vercel.app`**

### Step 3 — Custom domain

Vercel dashboard → **Settings → Domains** → add `mirai.app` (or any domain) → update DNS as instructed. SSL is automatic.

---

## 🗄️ Free PostgreSQL database (2 minutes)

Use **Neon** (free tier, no credit card):

1. Sign up at [neon.tech](https://neon.tech)
2. Create a project → **Connect** → copy the **Pooled** connection string
3. Paste into Vercel's `DATABASE_URL` env var
4. Locally: `npx drizzle-kit push` to create tables

Alternatives: **Supabase** (free 500 MB), **Railway**, **Aiven**.

---

## 🔌 REST API

```bash
# 1. Create a key in Studio → API & Developers
# 2. Generate a video
curl -X POST https://YOUR-APP.vercel.app/api/v1/generate \
  -H "Content-Type: application/json" \
  -H "x-api-key: mirai_xxxxxxxxxxxx" \
  -d '{"prompt":"Karachi sunset, cinematic","duration":15,"resolution":"1080p","aspectRatio":"9:16"}'

# 3. Poll status
curl https://YOUR-APP.vercel.app/api/v1/projects/1 -H "x-api-key: mirai_xxxxxxxxxxxx"
```

Rate limit: **60 requests/min** per key. Missing key → `401`, invalid key → `403`.

---

## 🎬 How rendering works (no paid API)

| Layer | Technology |
|---|---|
| Video | Browser `Canvas` + `MediaRecorder` (VP9/Opus WebM, MP4 fallback) |
| Motion | Ken Burns zoom/pan + scene crossfades |
| Styles | CSS filter grading (Cinematic, Anime, Cyberpunk, Sketch, Cartoon…) |
| Audio | `OfflineAudioContext` procedural music + Web Audio pad, mixed into the file |
| Captions | Karaoke caption boxes + auto `.SRT` export |
| Storage | PostgreSQL base64 + HTTP `Range` (206) seeking via `/api/media/:id` |
| Voice | Native Web Speech API (Urdu/Hindi/English/Arabic) |

---

## 📱 Mobile App

`/mobile` is an installable **PWA** (Android + iOS) with offline shell via service worker.

- **Android:** Chrome → ⋮ → *Install app*
- **iPhone:** Safari → Share → *Add to Home Screen*
- QR install page: **`/mobile-preview`**

---

## 🗂️ Feature Map

| Area | Features |
|---|---|
| **Generation** | Text-to-Video, Image-to-Video, Video-to-Video, AI Avatars, Script→Video, prompt enhance, storyboard, seed control, 8 styles, 5 durations, 4 ratios, 4 resolutions |
| **Media** | Real render engine, AI music generator (6 presets), Image Lab (16 ops incl. background removal), thumbnail generator, `.SRT` export |
| **Editor** | Multi-track timeline, trim/duplicate/delete, filters, transitions, speed 0.25–4×, text overlay, zoom/pan/rotate |
| **Collaboration** | Comments with timecodes, resolve, approval workflow, version history + restore, team roles, shared brand kit |
| **Business** | 4 pricing tiers, checkout (JazzCash/EasyPaisa/Card/UPI/Crypto), credits, daily bonus, referral, 7-day refund guarantee |
| **Developer** | API keys, REST API v1, webhooks (`render.completed`), live request tester, rate limiting |
| **Compliance** | Privacy, Terms, Refund policies, sitemap.xml, robots.txt, 404 page, security headers |

---

## 🔧 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `NEXT_PUBLIC_SITE_URL` | optional | Canonical domain for sitemap/robots/share links |

---

## 🧪 Scripts

```bash
npm run dev        # dev server
npm run build      # production build
npm start          # run production build
npm run typecheck  # tsc --noEmit
npx drizzle-kit push   # apply DB migrations
```

---

© 2026 Mir AI Studio · Built for Creators 🇵🇰🇮🇳

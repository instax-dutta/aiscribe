# 🎙️ AiScribe — AI Audio Transcription

Transcribe audio files instantly using AI. Free to start, no account needed. Powered by [Groq Whisper](https://groq.com).

## Features

- **Instant transcription** — drag & drop or browse to upload an audio file
- **5 free transcriptions** — no account required, uses a shared server-side key
- **Unlimited with your own key** — paste your free [Groq API key](https://console.groq.com) to remove the limit
- **Multiple models** — Whisper Large v3 Turbo (fast) or Whisper Large v3 (accurate)
- **Language support** — auto-detect or choose from 15 languages
- **Export** — copy to clipboard, download as `.txt` or `.srt`
- **Cancellable** — abort a long transcription mid-flight
- **Secure by default** — hardened API proxy with rate limiting, input validation, and security headers

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | TypeScript 5 |
| Styling | Vanilla CSS (dark mode, glassmorphism) |
| AI | [Groq Whisper](https://console.groq.com) via API |
| Deployment | [Vercel](https://vercel.com) |

## Getting Started

### 1. Clone & install

```bash
git clone https://github.com/your-username/aiscribe.git
cd aiscribe
npm install
```

### 2. Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|---|---|---|
| `GROQ_API_KEY` | ✅ Yes | Server-side Groq key for the free-tier proxy. Get one free at [console.groq.com](https://console.groq.com). |
| `NEXT_PUBLIC_BASE_URL` | Optional | Your deployed URL (e.g. `https://aiscribe.vercel.app`). Used for Open Graph metadata. |

> **Note:** `GROQ_API_KEY` has no `NEXT_PUBLIC_` prefix intentionally — it stays server-side only and is never sent to the browser.

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── api/transcribe/route.ts   # Secure server-side Groq proxy
│   ├── globals.css               # Design system & component styles
│   ├── layout.tsx                # Root layout + metadata
│   └── page.tsx                  # Main app page
├── components/
│   ├── DropZone.tsx              # Drag-and-drop upload area
│   ├── FreeUsageBanner.tsx       # Free usage progress indicator
│   ├── Header.tsx                # App header & settings button
│   ├── SettingsDrawer.tsx        # API key, model, language settings
│   ├── ToastContainer.tsx        # Toast notification system
│   ├── TranscriptResult.tsx      # Transcript display & export
│   ├── UploadCard.tsx            # File upload card with controls
│   └── UpgradeModal.tsx          # Upgrade prompt when free limit reached
├── hooks/
│   ├── useLocalStorage.ts        # Type-safe localStorage hook
│   ├── useToast.ts               # Toast state management
│   └── useTranscribe.ts          # Transcription logic + AbortController
└── lib/
    ├── constants.ts              # Allowed models, languages, file limits
    ├── srt.ts                    # SRT subtitle file generator
    └── utils.ts                  # File size & duration formatters
```

## Security

The `/api/transcribe` proxy route implements multiple layers of protection:

- **Rate limiting** — 10 requests per minute per IP (sliding window)
- **Input validation** — model and language are validated against strict allowlists
- **Server-side size cap** — 26 MB hard limit (defence-in-depth beyond client validation)
- **Content-Type enforcement** — only `multipart/form-data` accepted
- **Parameter sanitisation** — a clean `FormData` is rebuilt server-side; no user-supplied field names are forwarded
- **Request timeout** — 5-minute `AbortController` on the upstream Groq call
- **HTTP security headers** — CSP, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, no `X-Powered-By`

## Deployment

### Deploy to Vercel (recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push your repo to GitHub
2. Import it in [Vercel](https://vercel.com/new)
3. Add the `GROQ_API_KEY` environment variable in the Vercel dashboard
4. Deploy

### Self-hosted

```bash
npm run build
npm start
```

## Supported Audio Formats

`mp3` · `mp4` · `wav` · `m4a` · `ogg` · `flac` · `webm` — max **25 MB**

## License

MIT

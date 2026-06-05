import { NextRequest, NextResponse } from 'next/server';

// ─── Allowlists ───────────────────────────────────────────────────────────────
const ALLOWED_MODELS = new Set(['whisper-large-v3-turbo', 'whisper-large-v3']);
const ALLOWED_LANGUAGES = new Set([
  '', 'en', 'hi', 'es', 'fr', 'de', 'pt', 'ar', 'ja', 'ko', 'zh', 'it', 'ru',
  'nl', 'tr', 'pl',
]);

// ─── Server-side file limits ──────────────────────────────────────────────────
const MAX_BODY_BYTES = 26 * 1024 * 1024; // 26 MB (slightly above the 25 MB user limit)

// ─── Simple in-memory rate limiter (sliding window) ──────────────────────────
const RATE_LIMIT_WINDOW_MS = 60_000;  // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10;   // 10 requests per minute per IP

interface RateLimitEntry {
  count: number;
  windowStart: number;
}
const rateLimitStore = new Map<string, RateLimitEntry>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitStore.set(ip, { count: 1, windowStart: now });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) return true;

  entry.count += 1;
  return false;
}

// Clean up stale rate-limit entries every 5 minutes to prevent memory growth
setInterval(() => {
  const cutoff = Date.now() - RATE_LIMIT_WINDOW_MS;
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.windowStart < cutoff) rateLimitStore.delete(key);
  }
}, 5 * 60_000);

// ─── Request timeout ──────────────────────────────────────────────────────────
const UPSTREAM_TIMEOUT_MS = 5 * 60_000; // 5 minutes

function err(message: string, status: number) {
  return NextResponse.json({ error: { message } }, { status });
}

// ─── Route handler ────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  // 1. Server API key must be present
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return err('Server API key not configured.', 500);
  }

  // 2. Rate limiting by IP
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown';

  if (isRateLimited(ip)) {
    return err('Too many requests. Please slow down and try again.', 429);
  }

  // 3. Reject oversized bodies before parsing
  const contentLength = Number(request.headers.get('content-length') ?? '0');
  if (contentLength > MAX_BODY_BYTES) {
    return err('Request body too large. Maximum file size is 25 MB.', 413);
  }

  // 4. Must be multipart/form-data
  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.includes('multipart/form-data')) {
    return err('Expected multipart/form-data.', 400);
  }

  try {
    const formData = await request.formData();

    // 5. Validate required 'file' field
    const fileEntry = formData.get('file');
    if (!fileEntry || !(fileEntry instanceof File)) {
      return err('Missing or invalid "file" field.', 400);
    }

    // 6. Double-check file size server-side (defence-in-depth)
    if (fileEntry.size > MAX_BODY_BYTES) {
      return err('File exceeds the 25 MB limit.', 413);
    }

    // 7. Validate model (allowlist)
    const model = formData.get('model');
    if (typeof model !== 'string' || !ALLOWED_MODELS.has(model)) {
      return err('Invalid model specified.', 400);
    }

    // 8. Validate language (allowlist) — field is optional
    const language = formData.get('language');
    if (language !== null && (typeof language !== 'string' || !ALLOWED_LANGUAGES.has(language))) {
      return err('Invalid language specified.', 400);
    }

    // 9. Build a clean FormData containing only the fields we explicitly allow
    const safeFormData = new FormData();
    safeFormData.append('file', fileEntry);
    safeFormData.append('model', model);
    safeFormData.append('response_format', 'json');
    if (language) safeFormData.append('language', language);

    // 10. Forward to Groq with a timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

    let response: Response;
    try {
      response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}` },
        body: safeFormData,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (rawErr) {
    if (rawErr instanceof Error && rawErr.name === 'AbortError') {
      return err('Request timed out while waiting for transcription.', 504);
    }
    const message = rawErr instanceof Error ? rawErr.message : 'Internal server error';
    return NextResponse.json({ error: { message: `Proxy error: ${message}` } }, { status: 500 });
  }
}

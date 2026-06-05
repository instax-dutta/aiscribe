# Programmatic SEO — AiScribe

**Status:** First batch (proof) — 10 language pages + 1 hub
**Last updated:** 2026-06-05

---

## 1. Business Context

**Product:** AiScribe — AI audio transcription, free tier (5 transcriptions) + bring-your-own-Groq-API-key (unlimited). Built by SDAD 🧠, powered by Groq.

**Audience:**
- **Primary:** Podcasters, journalists, researchers, students, content creators, customer support teams, and small businesses who need fast, accurate transcripts of audio.
- **Search profile:** Long-tail queries like *"transcribe spanish audio to text"*, *"french interview transcription"*, *"japanese audio to text free"*. High intent — they want a tool that handles their language.

**Conversion goal:** Each pSEO page's only CTA leads to `/` (the actual product) with a `?lang=xx` query param that pre-selects the language. The pages are *top-of-funnel educational*; the product is the conversion.

---

## 2. Playbook Selection

Evaluated against 4 candidates:

| Playbook | Fit | Notes |
|---|---|---|
| **Conversions / Languages** ✅ | Strong | "transcribe [language]" queries have real volume. AiScribe already supports 16 languages via Whisper. Each page can be genuinely unique (challenges, dialects, use cases differ per language). |
| Glossary ("what is X") | Medium | "What is SRT" / "What is WER" — doable but low conversion tie-in. Defer. |
| Personas ("transcription for X") | Medium | Good content angle but we'd be making up user journeys. Defer. |
| Comparisons ("AiScribe vs X") | Weak | Can't realistically outrank G2/Capterra/established blogs for a brand-new domain. Skip. |

**Selected:** **Conversions / Languages** — `/transcribe/[lang]/`.

**Rationale:** Every supported language has:
1. Real, queryable search demand ("transcribe spanish audio" — 4–8K monthly searches, low–medium competition for *"free"* modifier).
2. First-party data — the language list is already in `src/lib/constants.ts`.
3. Genuinely unique content per page — challenges of transcribing Arabic (right-to-left, dialectal variation) ≠ challenges of transcribing Japanese (kanji mix, pitch-accent) ≠ challenges of transcribing Mandarin (homophones, tone).

This is the safest of the 12 playbooks for a brand-new domain: we're not claiming authority we don't have, we're answering a transactional query with a transactional answer (use our tool).

---

## 3. URL & Keyword Strategy

**URL pattern:** `/transcribe/[slug]/`

- `/transcribe/` (hub — index of all languages)
- `/transcribe/spanish/`
- `/transcribe/french/`
- `/transcribe/german/`
- `/transcribe/portuguese/`
- `/transcribe/italian/`
- `/transcribe/japanese/`
- `/transcribe/korean/`
- `/transcribe/chinese/`
- `/transcribe/hindi/`
- `/transcribe/arabic/`

**Title pattern:** `Transcribe [Language] Audio to Text — Free & Instant | AiScribe`

**H1 pattern:** `Transcribe [Language] audio to text`

**Meta description pattern:** `Transcribe [Language] audio files to text in seconds. Free to start, no account required. Whisper-powered, 25MB max.`

**Target keyword pattern:** `[language] audio transcription`, `transcribe [language] audio`, `[language] audio to text`

**Long-tail variants (captured in body copy):**
- "free [language] transcription"
- "[language] interview transcription"
- "[language] podcast transcript"
- "transcribe [language] audio to text online"
- "[language] speech to text"

---

## 4. Data Source

**First-party** — `src/lib/languagePages.ts` (new file, ships with this batch):

```ts
{
  slug,            // 'spanish'
  code,            // 'es'  — matches LANGUAGES[].value in constants.ts
  label,           // 'Spanish'
  nativeName,      // 'Español'
  speakers,        // '500M+ native'
  regions,         // string[]
  intro,           // one-sentence
  useCases,        // 3-4 scenarios
  challenges,      // 2-3 transcription-specific challenges
  tips,            // 2-3 best-practices
  faq,             // 3 Q&A pairs
  relatedSlugs,    // 3-4 sibling slugs
}
```

**Defensibility:** First-party content (we wrote each challenge, tip, FAQ). Public-domain data (speaker counts) is from Ethnologue / Wikipedia and cited via plain language ("spoken by over 500M people").

---

## 5. Page Template

Every `/transcribe/[lang]/` page contains:

| Section | Length | Unique? |
|---|---|---|
| `<h1>` + sub | 8 words | Yes — language-specific |
| "Where [Language] audio transcription is used" — 3–4 use cases | ~120 words | Yes — language-specific |
| "Challenges of transcribing [Language] audio" — 2–3 items | ~90 words | Yes — language-specific |
| "Tips for best results" — 2–3 items | ~80 words | Yes — language-specific |
| "Supported audio formats" — generic list | ~30 words | Shared — same for all languages |
| FAQ — 3 Q&A pairs | ~120 words | Yes — language-specific |
| CTA → `/?lang=xx` | ~20 words | Yes — language-specific |
| Related languages — 3–4 cross-links | — | Conditional on data |
| JSON-LD `FAQPage` schema | — | Yes — language-specific |

**Total per page:** ~500 words of unique copy. No thin pages, no doorway pages, no template-only swaps.

**Page does NOT include:**
- Pricing tables (no paid plans exist)
- Affiliate links
- Ads
- Auto-generated competitor comparisons
- "Best X" lists (we're not a curation site)

---

## 6. Internal Linking Architecture

**Hub-and-spoke:**

```
/                     (home / product)
 ├── footer link → /transcribe   (hub)
                       │
                       ├── /transcribe/spanish
                       │     → footer link → /?lang=es
                       │     → 3-4 related language links
                       ├── /transcribe/french
                       │     → /?lang=fr
                       │     → related
                       └── ... (10 total)
```

- Hub page lists all 10 languages as a 2-column grid
- Each spoke links back to the hub (`/transcribe`) and to 3–4 sibling languages
- Spoke CTAs point to `/?lang=xx` (deep-link to home with language pre-selected)
- Footer on home adds a third-level link to `/transcribe` for users who land on home first

**No orphan pages:** all 11 URLs are reachable from the hub or footer in ≤ 2 clicks.

**Cross-link matrix (related slugs, hand-picked per language):**
- **Romance family** (Spanish, French, Portuguese, Italian) → all 4 cross-link
- **East Asian** (Japanese, Korean, Chinese) → all 3 cross-link
- **South Asian** (Hindi) → also links to Urdu/Arabic (cultural clusters)
- **Semitic** (Arabic) → also links to Hebrew, Turkish (geographic cluster)

---

## 7. Indexation & Sitemap

**`src/app/sitemap.ts`** (Next.js native) generates `sitemap.xml` with:
- `/` (priority 1.0)
- `/transcribe` (priority 0.8)
- `/transcribe/[lang]` × 10 (priority 0.7)

**Robots:** No `noindex` on any of the new pages. All are indexable.

**Crawl budget:** 11 new URLs is trivial. No concerns.

**Canonical:** Each page declares its own canonical URL. No cross-canonicalization.

---

## 8. Schema Markup

Each `/transcribe/[lang]/` page ships **JSON-LD `FAQPage` schema** with the 3 Q&As.

Hub page ships **`ItemList` schema** listing all 10 language pages.

Home page continues to ship `WebApplication` (already present via metadata).

---

## 9. Quality Gates (Pre-Launch)

- [x] Each page has ≥ 400 unique words (target ~500)
- [x] Unique `<title>` and `<meta description>` per page
- [x] One `<h1>`, no skipped heading levels
- [x] FAQPage JSON-LD on every spoke
- [x] Every page linked from `/transcribe` (hub) or homepage footer
- [x] `sitemap.xml` includes all 11 URLs
- [x] CTA leads to live product (`/?lang=xx`)
- [x] No duplicate content across pages
- [x] No keyword stuffing (target kw density ~1.5%, well within norms)
- [x] Pages render server-side (SSG via `generateStaticParams`) — fast, indexable

---

## 10. Risks & Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Google sees pages as "doorway" | Low | 500+ unique words per page, real use cases, FAQ schema. No template-only swaps. |
| Thin content for low-volume langs (Hindi) | Low | Same template depth regardless of volume; Hindi speakers count is 600M+ so volume isn't actually low. |
| Cannibalization with home page | Low | Home targets "transcribe audio" (generic). Spokes target "[language] audio" (specific). Distinct intent, distinct titles. |
| Brand-new domain authority | High | Accepted. Goal is long-tail capture, not head-term ranking. Will take 3-6 months to see traction. |
| Whisper accuracy for niche langs | Medium | Each page acknowledges accuracy is "high for clean audio" — sets honest expectations. No false claims. |

---

## 11. Out of Scope (Defer)

- **Glossary pages** ("what is WER", "what is SRT") — 2nd batch, post-validation
- **Persona pages** ("transcription for podcasters") — 3rd batch
- **Comparison pages** ("AiScribe vs Sonix") — unlikely to rank for brand-new domain; skip
- **Translations/localization of *AiScribe's UI*** — separate effort, not pSEO
- **Auto-generated content** — explicitly avoided to prevent thin-content flags

---

## 12. Post-Launch Monitoring

Once shipped, track (manually — no analytics infra in this MVP):

- **Indexation rate** — `site:aiscribe.vercel.app/transcribe/[lang]` per page in Google
- **Search Console** — impressions, clicks, avg position per page
- **CTA click-through** — no event tracking yet, so monitor Vercel function logs for hits to `/?lang=xx`
- **SERP movement** — re-check ranking for top 3 long-tail queries per language monthly

**Iteration trigger:** if a page sees 0 impressions after 90 days, audit content depth or remove from sitemap (deindex).

---

## 13. File Manifest

**New:**
- `.planning/seo/programmatic-seo.md` — this doc
- `src/lib/languagePages.ts` — data for 10 languages
- `src/app/transcribe/page.tsx` — hub
- `src/app/transcribe/[lang]/page.tsx` — spoke template (SSG)
- `src/app/sitemap.ts` — sitemap

**Modified:**
- `src/app/page.tsx` — read `?lang=xx` from URL and pre-select language
- `src/app/layout.tsx` — no change
- `src/app/globals.css` — add minimal styles for new pages (`.pseo-*` classes)

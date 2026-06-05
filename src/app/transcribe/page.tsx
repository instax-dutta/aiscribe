import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingHeader from '@/components/MarketingHeader';
import { LANGUAGE_PAGES } from '@/lib/languagePages';
import { ACCEPTED_EXTENSIONS } from '@/lib/constants';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://aiscribe.vercel.app';

export const metadata: Metadata = {
  title: 'Transcribe Audio in 10 Languages — Free & Instant | AiScribe',
  description:
    'Transcribe audio to text in Spanish, French, German, Japanese, Korean, Chinese, Hindi, Arabic, Portuguese, and Italian. Free to start, no account required. Whisper-powered.',
  alternates: { canonical: `${BASE_URL}/transcribe` },
  openGraph: {
    title: 'Transcribe Audio in 10 Languages — Free & Instant | AiScribe',
    description:
      'Free, instant audio transcription for 10 major languages. Powered by Groq Whisper. Built by SDAD.',
    type: 'website',
    url: `${BASE_URL}/transcribe`,
  },
};

export default function TranscribeHubPage() {
  // JSON-LD ItemList of all language pages — helps Google understand the cluster
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Languages supported by AiScribe transcription',
    itemListElement: LANGUAGE_PAGES.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `Transcribe ${p.label} audio to text`,
      url: `${BASE_URL}/transcribe/${p.slug}`,
    })),
  };

  return (
    <>
      <MarketingHeader />

      <div id="app-container">
        <section className="hero" aria-label="Languages hub">
          <h1>Transcribe audio in 10 languages.</h1>
          <p className="hero-sub">
            AiScribe supports the world&apos;s most-spoken languages out of the box — from
            Spanish podcasts to Mandarin lectures to Arabic call-center audio. Free to
            start, no account required.
          </p>
        </section>

        <section className="pseo-hub" aria-label="Available languages">
          <h2 className="pseo-section-label">Pick a language</h2>
          <ul className="pseo-lang-grid">
            {LANGUAGE_PAGES.map((lang) => (
              <li key={lang.slug}>
                <Link
                  href={`/transcribe/${lang.slug}`}
                  className="pseo-lang-card"
                  aria-label={`Transcribe ${lang.label} audio to text`}
                >
                  <div className="pseo-lang-head">
                    <span className="pseo-lang-name">{lang.label}</span>
                    <span className="pseo-lang-native" aria-hidden="true">
                      {lang.nativeName}
                    </span>
                  </div>
                  <p className="pseo-lang-meta">{lang.speakers}</p>
                  <p className="pseo-lang-cta">
                    Transcribe {lang.label} audio
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="pseo-meta" aria-label="Why AiScribe">
          <h2 className="pseo-section-label">Why AiScribe</h2>
          <div className="pseo-meta-grid">
            <div>
              <div className="pseo-meta-num">10</div>
              <div className="pseo-meta-label">languages supported natively</div>
            </div>
            <div>
              <div className="pseo-meta-num">25 MB</div>
              <div className="pseo-meta-label">max file size per transcription</div>
            </div>
            <div>
              <div className="pseo-meta-num">5</div>
              <div className="pseo-meta-label">free transcriptions, no sign-up</div>
            </div>
            <div>
              <div className="pseo-meta-num">7</div>
              <div className="pseo-meta-label">audio formats: {ACCEPTED_EXTENSIONS.join(', ')}</div>
            </div>
          </div>

          <div className="pseo-cta-row">
            <Link href="/" className="btn btn-primary">Start transcribing</Link>
            <Link href="/transcribe/spanish" className="btn btn-ghost">Try Spanish first</Link>
          </div>
        </section>

        <footer className="app-footer" role="contentinfo">
          <span className="footer-line">
            Powered by{' '}
            <a href="https://groq.com" target="_blank" rel="noopener noreferrer" aria-label="Powered by Groq">
              Groq
            </a>
          </span>
          <span className="footer-sep" aria-hidden="true">·</span>
          <span className="footer-line">
            Built by{' '}
            <a
              href="https://sdad.pro"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-sdad"
              aria-label="Built by SDAD — opens in a new tab"
            >
              SDAD <span className="footer-brain" aria-hidden="true">🧠</span>
            </a>
          </span>
        </footer>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
    </>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import MarketingHeader from '@/components/MarketingHeader';
import {
  getAllLanguageSlugs,
  getLanguagePage,
  getRelatedLanguagePages,
} from '@/lib/languagePages';
import { ACCEPTED_EXTENSIONS } from '@/lib/constants';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://ais.sdad.pro';

// Primary region code per language — drives the OG `locale` field.
const REGION_BY_CODE: Record<string, string> = {
  es: 'ES',
  fr: 'FR',
  de: 'DE',
  pt: 'BR',
  it: 'IT',
  ja: 'JP',
  ko: 'KR',
  zh: 'CN',
  hi: 'IN',
  ar: 'SA',
};

type Params = Promise<{ lang: string }>;

/** Pre-render every language page at build time */
export function generateStaticParams(): { lang: string }[] {
  return getAllLanguageSlugs().map((lang) => ({ lang }));
}

/** Per-page metadata — unique title + description drives SERP CTR */
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang } = await params;
  const page = getLanguagePage(lang);
  if (!page) return { title: 'Language not found' };

  const title = `Transcribe ${page.label} Audio to Text — Free & Instant | AiScribe`;
  const description = `Transcribe ${page.label} (${page.nativeName}) audio to text in seconds. Free to start, no account required. Whisper-powered, ${page.speakers.toLowerCase()}, ${ACCEPTED_EXTENSIONS.length} audio formats supported.`;
  const url = `${BASE_URL}/transcribe/${page.slug}`;
  const region = REGION_BY_CODE[page.code] ?? 'US';
  const locale = `${page.code}_${region}`;

  return {
    title,
    description,
    authors: [{ name: 'SDAD', url: 'https://sdad.pro' }],
    keywords: [
      `${page.label} transcription`,
      `${page.nativeName} audio to text`,
      `transcribe ${page.label}`,
      `${page.label} speech to text`,
      `Whisper ${page.label}`,
      `AI transcription ${page.label}`,
      `free ${page.label} transcription`,
    ],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type: 'article',
      url,
      siteName: 'AiScribe',
      locale,
      determiner: '',
      images: [
        {
          url: '/og.png',
          secureUrl: `${BASE_URL}/og.png`,
          width: 1200,
          height: 630,
          alt: `AiScribe — Transcribe ${page.label} audio to text. Powered by Groq Whisper.`,
          type: 'image/png',
        },
      ],
      publishedTime: '2026-06-05T00:00:00Z',
      modifiedTime: '2026-06-05T00:00:00Z',
      authors: ['SDAD'],
      section: 'AI Transcription',
      tags: [
        page.label,
        page.nativeName,
        'transcription',
        'speech-to-text',
        'Whisper',
        'Groq',
        'AI',
        'multilingual',
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: {
        url: '/og.png',
        alt: `AiScribe — Transcribe ${page.label} audio to text`,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function LanguageTranscribePage({ params }: { params: Params }) {
  const { lang } = await params;
  const page = getLanguagePage(lang);
  if (!page) notFound();

  const related = getRelatedLanguagePages(page.slug);
  const ctaHref = `/?lang=${page.code}`;

  // JSON-LD: FAQPage schema (3 Q&As)
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faq.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  // JSON-LD: BreadcrumbList for SERP breadcrumb
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'AiScribe', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Transcribe', item: `${BASE_URL}/transcribe` },
      { '@type': 'ListItem', position: 3, name: page.label, item: `${BASE_URL}/transcribe/${page.slug}` },
    ],
  };

  // JSON-LD: Article schema for AI engines. Provides author, publisher,
  // datePublished, and dateModified — the four signals AI systems use
  // to weight freshness and authority.
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Transcribe ${page.label} audio to text`,
    description: page.intro,
    inLanguage: page.code,
    author: { '@type': 'Organization', name: 'SDAD', url: 'https://sdad.pro' },
    publisher: {
      '@type': 'Organization',
      name: 'AiScribe',
      url: BASE_URL,
    },
    datePublished: '2026-06-05',
    dateModified: '2026-06-05',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/transcribe/${page.slug}`,
    },
    keywords: [
      `transcribe ${page.label.toLowerCase()} audio`,
      `${page.label.toLowerCase()} audio to text`,
      `${page.label.toLowerCase()} transcription`,
      `${page.label.toLowerCase()} speech to text`,
      `whisper ${page.label.toLowerCase()}`,
    ],
  };

  return (
    <>
      <MarketingHeader />

      <div id="app-container">
        {/* Breadcrumb — visible + schema */}
        <nav className="pseo-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">AiScribe</Link>
          <span aria-hidden="true">/</span>
          <Link href="/transcribe">Transcribe</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{page.label}</span>
        </nav>

        {/* Hero */}
        <section className="hero" aria-label={`Transcribe ${page.label} audio`}>
          <div className="hero-eyebrow-text" aria-hidden="true">
            <span className="hero-eyebrow-native">{page.nativeName}</span>
            <span className="hero-eyebrow-dot" />
            <span className="hero-eyebrow-meta">{page.speakers}</span>
          </div>
          <h1>Transcribe {page.label} audio to text</h1>
          <p className="hero-sub">{page.intro}</p>
          <p className="pseo-freshness" aria-label="Last updated">
            <time dateTime="2026-06-05">Last updated: 5 June 2026</time>
          </p>
        </section>

        <main>
          {/* Use cases */}
          <section className="pseo-section" aria-labelledby="use-cases-h">
            <h2 className="pseo-section-label" id="use-cases-h">
              Where {page.label} audio transcription is used
            </h2>
            <ul className="pseo-list">
              {page.useCases.map((u, i) => (
                <li key={i}>{u}</li>
              ))}
            </ul>
          </section>

          {/* Challenges */}
          <section className="pseo-section" aria-labelledby="challenges-h">
            <h2 className="pseo-section-label" id="challenges-h">
              Challenges of transcribing {page.label} audio
            </h2>
            <ul className="pseo-list">
              {page.challenges.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </section>

          {/* Tips */}
          <section className="pseo-section" aria-labelledby="tips-h">
            <h2 className="pseo-section-label" id="tips-h">
              Tips for best results
            </h2>
            <ul className="pseo-list pseo-list--ordered">
              {page.tips.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </section>

          {/* Supported formats */}
          <section className="pseo-section" aria-labelledby="formats-h">
            <h2 className="pseo-section-label" id="formats-h">
              Supported audio formats
            </h2>
            <p className="pseo-prose">
              Upload any audio file in <strong>{ACCEPTED_EXTENSIONS.join(', ')}</strong> format,
              up to 25 MB. Files are processed securely and never stored on our servers.
            </p>
          </section>

          {/* FAQ */}
          <section className="pseo-section" aria-labelledby="faq-h">
            <h2 className="pseo-section-label" id="faq-h">
              Frequently asked questions
            </h2>
            <dl className="pseo-faq">
              {page.faq.map(({ q, a }, i) => (
                <div key={i} className="pseo-faq-item">
                  <dt>{q}</dt>
                  <dd>{a}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* CTA */}
          <section className="pseo-cta-card" aria-label="Try the tool">
            <h2>Ready to transcribe your {page.label} audio?</h2>
            <p>
              Drop your file below and get a clean transcript in seconds. Your language
              ({page.label}) is pre-selected.
            </p>
            <Link href={ctaHref} className="btn btn-primary" aria-label={`Open the transcription tool with ${page.label} pre-selected`}>
              Transcribe {page.label} audio free
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </section>

          {/* Related languages — cross-link siblings */}
          {related.length > 0 && (
            <section className="pseo-section" aria-labelledby="related-h">
              <h2 className="pseo-section-label" id="related-h">
                Other languages you can transcribe
              </h2>
              <ul className="pseo-related-grid">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/transcribe/${r.slug}`} className="pseo-related-card">
                      <span className="pseo-related-name">{r.label}</span>
                      <span className="pseo-related-native" aria-hidden="true">{r.nativeName}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </main>

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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
    </>
  );
}

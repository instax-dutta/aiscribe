import Link from 'next/link';

/**
 * MarketingHeader — server-renderable header for /transcribe/* pages.
 *
 * Differs from the product Header:
 *   - No settings button (settings live inside the product, not on marketing pages)
 *   - No 'use client' boundary — fully server-rendered for SEO + fast TTFB
 *   - CTAs route to "/" (the product) rather than opening in-page drawers
 */
export default function MarketingHeader() {
  return (
    <nav className="navbar" aria-label="Site navigation">
      <div className="navbar-inner">
        <Link href="/" className="nav-brand" aria-label="AiScribe home">
          <div className="nav-logo-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="22" />
            </svg>
          </div>
          <span className="nav-brand-name">AiScribe</span>
          <span className="nav-badge" aria-label="AI powered">AI</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Link href="/transcribe" className="btn-icon" aria-label="Browse all languages">
            Languages
          </Link>
          <Link href="/" className="btn btn-primary btn-sm" aria-label="Open the AiScribe transcription tool">
            Transcribe
          </Link>
        </div>
      </div>
    </nav>
  );
}

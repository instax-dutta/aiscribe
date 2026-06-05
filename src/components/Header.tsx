'use client';

interface HeaderProps {
  onSettingsClick: () => void;
}

export default function Header({ onSettingsClick }: HeaderProps) {
  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="navbar-inner">
        {/* Brand — ElevenLabs uses a simple wordmark, not a colorful icon */}
        <a href="/" className="nav-brand" aria-label="AiScribe home">
          <div className="nav-logo-icon" aria-hidden="true">
            {/* Minimal waveform mark on near-white square — dark inversion of EL */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="22" />
            </svg>
          </div>
          {/* Editorial wordmark — EB Garamond, weight 400, no bold */}
          <span className="nav-brand-name">AiScribe</span>
          <span className="nav-badge" aria-label="AI powered">AI</span>
        </a>

        {/* Settings — icon only, subtle */}
        <div className="nav-actions" style={{ display: 'flex', alignItems: 'center' }}>
          <button
            type="button"
            className="nav-btn"
            onClick={onSettingsClick}
            aria-label="Open settings"
            title="Settings"
          >
            {/* Sliders icon — more editorial than gear */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="21" x2="4" y2="14" />
              <line x1="4" y1="10" x2="4" y2="3" />
              <line x1="12" y1="21" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12" y2="3" />
              <line x1="20" y1="21" x2="20" y2="16" />
              <line x1="20" y1="12" x2="20" y2="3" />
              <line x1="1" y1="14" x2="7" y2="14" />
              <line x1="9" y1="8" x2="15" y2="8" />
              <line x1="17" y1="16" x2="23" y2="16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}

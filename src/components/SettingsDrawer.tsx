'use client';

import { useState, useCallback } from 'react';
import { LANGUAGES, MODELS } from '@/lib/constants';

interface SettingsDrawerProps {
  open: boolean;
  onClose: () => void;
  apiKey: string | null;
  onApiKeySave: (key: string) => void;
  onApiKeyRemove: () => void;
  model: string;
  onModelChange: (model: string) => void;
  language: string;
  onLanguageChange: (lang: string) => void;
  freeUsageCount: number;
  onResetFreeUsage: () => void;
}

const MODEL_DESCRIPTIONS: Record<string, string> = {
  'whisper-large-v3-turbo': 'Fast, lower latency',
  'whisper-large-v3': 'Most accurate',
};

export default function SettingsDrawer({
  open,
  onClose,
  apiKey,
  onApiKeySave,
  onApiKeyRemove,
  model,
  onModelChange,
  language,
  onLanguageChange,
  freeUsageCount,
  onResetFreeUsage,
}: SettingsDrawerProps) {
  const [keyInput, setKeyInput] = useState(apiKey || '');
  const [showKey, setShowKey] = useState(false);

  const handleSave = useCallback(() => {
    const trimmed = keyInput.trim();
    if (!trimmed) return;
    onApiKeySave(trimmed);
  }, [keyInput, onApiKeySave]);

  const handleRemove = useCallback(() => {
    setKeyInput('');
    onApiKeyRemove();
  }, [onApiKeyRemove]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  return (
    <div
      className={`drawer-backdrop${open ? ' open' : ''}`}
      id="settings-drawer"
      role="dialog"
      aria-modal="true"
      aria-label="Settings"
      onKeyDown={handleKeyDown}
    >
      <div className="drawer-overlay" onClick={onClose} aria-hidden="true" />
      <div className="drawer-panel" aria-hidden={!open}>
        <div className="drawer-header">
          <h2>Settings</h2>
          <button
            type="button"
            className="nav-btn"
            onClick={onClose}
            aria-label="Close settings"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* API Key */}
        <div className="drawer-section">
          <div className="drawer-section-label">Groq API Key</div>

          <div className="key-input-wrap">
            <input
              type={showKey ? 'text' : 'password'}
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="gsk_… your Groq API key"
              autoComplete="off"
              aria-label="Groq API key"
              onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }}
            />
            <button
              type="button"
              className="key-toggle-btn"
              onClick={() => setShowKey((v) => !v)}
              aria-label={showKey ? 'Hide API key' : 'Show API key'}
            >
              {showKey ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          <div className="drawer-btns">
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleSave}
              disabled={!keyInput.trim()}
            >
              Save Key
            </button>
            {apiKey && (
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={handleRemove}
              >
                Remove
              </button>
            )}
          </div>

          <div className={`key-status${apiKey ? ' has-key' : ''}`}>
            <div className={`key-status-dot${apiKey ? ' active' : ' inactive'}`} aria-hidden="true" />
            {apiKey
              ? 'Using your API key — unlimited transcriptions'
              : 'Using shared key — 5 free transcriptions'}
          </div>

          <a
            href="https://console.groq.com"
            target="_blank"
            rel="noopener noreferrer"
            className="drawer-link"
          >
            Get a free key at console.groq.com
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </a>
        </div>

        {/* Model */}
        <div className="drawer-section">
          <div className="drawer-section-label">Model</div>
          <div className="model-toggle-group">
            {MODELS.map((m) => (
              <button
                key={m.value}
                type="button"
                className={`model-toggle-btn${model === m.value ? ' active' : ''}`}
                onClick={() => onModelChange(m.value)}
                aria-pressed={model === m.value}
              >
                <span className="model-name">{m.label}</span>
                <span className="model-desc">{MODEL_DESCRIPTIONS[m.value] ?? ''}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Language */}
        <div className="drawer-section">
          <div className="drawer-section-label">Default Language</div>
          <select
            className="drawer-select"
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            aria-label="Default transcription language"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>{lang.label}</option>
            ))}
          </select>
        </div>

        {/* Developer */}
        <div className="drawer-section">
          <div className="drawer-section-label">Developer</div>
          <p style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '10px', lineHeight: 1.5 }}>
            Free usage count: <strong style={{ color: 'var(--text-2)' }}>{freeUsageCount}</strong>
          </p>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onResetFreeUsage}
          >
            Reset free usage counter
          </button>
        </div>
      </div>
    </div>
  );
}

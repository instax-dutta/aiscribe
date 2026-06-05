'use client';

import { useState, useCallback } from 'react';

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  onApiKeySave: (key: string) => void;
}

export default function UpgradeModal({ open, onClose, onApiKeySave }: UpgradeModalProps) {
  const [keyInput, setKeyInput] = useState('');

  const handleSave = useCallback(() => {
    const trimmed = keyInput.trim();
    if (!trimmed) return;
    onApiKeySave(trimmed);
    setKeyInput('');
  }, [keyInput, onApiKeySave]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleSave();
      if (e.key === 'Escape') onClose();
    },
    [handleSave, onClose]
  );

  if (!open) return null;

  return (
    <div
      className="modal-backdrop"
      id="upgrade-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onKeyDown={handleKeyDown}
    >
      <div className="modal-overlay" onClick={onClose} aria-hidden="true" />
      <div className="modal-panel">
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="modal-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
        </div>

        <h2 id="modal-title">Unlock unlimited transcriptions</h2>
        <p>
          You&apos;ve used all 5 free transcriptions. Add your own free Groq API key — no credit
          card required, takes under 2 minutes.
        </p>

        <div className="modal-steps">
          <ol>
            <li>Go to <strong>console.groq.com</strong></li>
            <li>Create a free account</li>
            <li>Navigate to <strong>API Keys → Create API Key</strong></li>
            <li>Paste your key below</li>
          </ol>
        </div>

        <div className="modal-input-row">
          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="gsk_… paste your API key"
            autoComplete="off"
            autoFocus
            aria-label="Groq API key"
            onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }}
          />
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSave}
            disabled={!keyInput.trim()}
            aria-label="Save API key"
          >
            Save
          </button>
        </div>

        <p className="modal-privacy">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Stored locally in your browser only — we never see your key
        </p>
      </div>
    </div>
  );
}

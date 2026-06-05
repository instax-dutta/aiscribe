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
  }, [keyInput, onApiKeySave]);

  if (!open) return null;

  return (
    <div id="upgrade-modal" style={{ display: 'block' }}>
      <div id="modal-overlay" onClick={onClose} />
      <div id="modal-content">
        <button type="button" className="modal-close" onClick={onClose}>&times;</button>
        <h2>You&apos;ve used all 5 free transcriptions</h2>
        <p>Get your own free Groq API key — no credit card needed. Takes 2 minutes.</p>
        <div className="modal-steps">
          <ol>
            <li>Go to <strong>console.groq.com</strong></li>
            <li>Sign up (free)</li>
            <li>Navigate to <strong>API Keys → Create API Key</strong></li>
            <li>Paste it below</li>
          </ol>
        </div>
        <div className="modal-input-group">
          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="gsk_... paste your key"
            autoComplete="off"
            onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }}
          />
          <button type="button" className="btn btn-primary" onClick={handleSave}>
            Save
          </button>
        </div>
        <p className="modal-privacy">🔒 Your key is stored locally in your browser only. We never see it.</p>
      </div>
    </div>
  );
}

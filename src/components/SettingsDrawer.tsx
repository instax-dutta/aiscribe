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

  return (
    <>
      <div
        id="settings-drawer"
        className={open ? 'open' : ''}
        style={{ display: open ? 'block' : 'none' }}
      >
        <div id="drawer-overlay" onClick={onClose} />
        <div id="drawer-panel">
          <h2>
            Settings
            <button type="button" className="btn-ghost" onClick={onClose} aria-label="Close settings">
              &times;
            </button>
          </h2>

          <div className="drawer-section">
            <h3>API Key</h3>
            <div className="api-key-input-wrap">
              <input
                type={showKey ? 'text' : 'password'}
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="gsk_... your Groq API key"
                autoComplete="off"
              />
              <button
                type="button"
                className="toggle-vis"
                onClick={() => setShowKey((v) => !v)}
                aria-label="Toggle API key visibility"
              >
                {showKey ? '🙈' : '👁'}
              </button>
            </div>
            <div className="drawer-btns">
              <button type="button" className="btn btn-primary btn-sm" onClick={handleSave}>
                Save Key
              </button>
              <button type="button" className="btn btn-outline btn-sm" onClick={handleRemove}>
                Remove Key
              </button>
            </div>
            <div className="drawer-api-status">
              {apiKey ? (
                <span className="green">Using your key</span>
              ) : (
                <span className="red">
                  Using base shared key ({Math.max(0, 5 - freeUsageCount)} free left)
                </span>
              )}
            </div>
            <a
              href="https://console.groq.com"
              target="_blank"
              rel="noopener noreferrer"
              className="drawer-link"
            >
              Get a free key at console.groq.com →
            </a>
          </div>

          <div className="drawer-section">
            <h3>Model</h3>
            <div className="toggle-group">
              {MODELS.map((m) => (
                <button
                  type="button"
                  key={m.value}
                  className={`toggle-btn${model === m.value ? ' active' : ''}`}
                  onClick={() => onModelChange(m.value)}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="drawer-section">
            <h3>Language</h3>
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          <div className="drawer-section">
            <h3>Developer</h3>
            <button type="button" className="btn btn-outline btn-sm" onClick={onResetFreeUsage}>
              Reset free usage counter
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

'use client';

import { useCallback } from 'react';
import { generateSrt } from '@/lib/srt';

interface TranscriptResultProps {
  text: string;
  onClear: () => void;
}

export default function TranscriptResult({ text, onClear }: TranscriptResultProps) {
  const words = text.split(/\s+/).filter(Boolean).length;
  const chars = text.length;
  const readTime = Math.max(1, Math.ceil(words / 200));

  const copy = useCallback(() => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
  }, [text]);

  const downloadTxt = useCallback(() => {
    const blob = new Blob([text], { type: 'text/plain' });
    downloadBlob(blob, 'transcript.txt');
  }, [text]);

  const downloadSrt = useCallback(() => {
    const srt = generateSrt(text);
    const blob = new Blob([srt], { type: 'text/plain' });
    downloadBlob(blob, 'transcript.srt');
  }, [text]);

  return (
    <div className="card" id="results-card">
      <div className="results-header">
        <div className="results-title">
          <div className="results-title-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2>Transcript ready</h2>
        </div>
        <div className="results-actions">
          <button
            type="button"
            className="btn-icon"
            onClick={copy}
            title="Copy to clipboard"
            aria-label="Copy transcript to clipboard"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            Copy
          </button>
          <button
            type="button"
            className="btn-icon"
            onClick={downloadTxt}
            title="Download as .txt"
            aria-label="Download transcript as text file"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            .txt
          </button>
          <button
            type="button"
            className="btn-icon"
            onClick={downloadSrt}
            title="Download as .srt subtitle"
            aria-label="Download transcript as SRT subtitle file"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            .srt
          </button>
        </div>
      </div>

      <div id="transcript-text" className="transcript-box" role="region" aria-label="Transcript text">
        {text}
      </div>

      <div className="results-stats" aria-label="Transcript statistics">
        <div className="results-stat">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 6h16M4 12h16M4 18h7" />
          </svg>
          {words.toLocaleString()} words
        </div>
        <div className="results-stat">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          {chars.toLocaleString()} characters
        </div>
        <div className="results-stat">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          ~{readTime} min read
        </div>
      </div>

      <div className="results-footer">
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={onClear}
          aria-label="Clear transcript and start a new transcription"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" width="14" height="14">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 .49-3.97" />
          </svg>
          Start new transcription
        </button>
      </div>
    </div>
  );
}

function fallbackCopy(text: string) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); } catch { /* noop */ }
  document.body.removeChild(ta);
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

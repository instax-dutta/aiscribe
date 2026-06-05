'use client';

import { useCallback } from 'react';
import { generateSrt } from '@/lib/srt';

interface TranscriptResultProps {
  text: string;
  onClear: () => void;
}

export default function TranscriptResult({ text, onClear }: TranscriptResultProps) {
  const words = text.split(/\s+/).filter(Boolean).length;
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
    <div className="card" id="results-card" style={{ display: 'block' }}>
      <div className="results-header">
        <h2>Transcript</h2>
        <div className="results-actions">
          <button type="button" className="btn btn-outline btn-sm" onClick={copy} title="Copy to clipboard">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            Copy
          </button>
          <button type="button" className="btn btn-outline btn-sm" onClick={downloadTxt}>
            Download .txt
          </button>
          <button type="button" className="btn btn-outline btn-sm" onClick={downloadSrt}>
            Download .srt
          </button>
        </div>
      </div>
      <div id="transcript-text">{text}</div>
      <div id="transcript-stats">
        <span>{words} words</span>
        <span>~{readTime} min read</span>
      </div>
      <div className="results-footer">
        <button type="button" className="btn btn-ghost" onClick={onClear}>
          Clear &amp; start new
        </button>
      </div>
    </div>
  );
}

function fallbackCopy(text: string) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.left = '-9999px';
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

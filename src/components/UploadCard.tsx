'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import DropZone from './DropZone';
import { LANGUAGES, ACCEPTED_EXTENSIONS, MAX_FILE_SIZE } from '@/lib/constants';
import { formatFileSize, formatDuration } from '@/lib/utils';

interface UploadCardProps {
  onTranscribe: () => void;
  onCancel: () => void;
  isTranscribing: boolean;
  error: string | null;
  elapsedSeconds: number;
  language: string;
  onLanguageChange: (lang: string) => void;
  onFileChange: (file: File | null) => void;
  disabled?: boolean;
}

export default function UploadCard({
  onTranscribe,
  onCancel,
  isTranscribing,
  error,
  elapsedSeconds,
  language,
  onLanguageChange,
  onFileChange,
  disabled,
}: UploadCardProps) {
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [duration, setDuration] = useState<number | undefined>();
  const audioRef = useRef<HTMLAudioElement>(null);
  const objectUrlRef = useRef<string | null>(null);

  // Revoke object URL on unmount
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  const validateFile = useCallback((f: File): string | null => {
    const ext = f.name.split('.').pop()?.toLowerCase();
    if (!ext || !ACCEPTED_EXTENSIONS.includes(ext as typeof ACCEPTED_EXTENSIONS[number])) {
      return `Unsupported format. Accepted: ${ACCEPTED_EXTENSIONS.join(', ')}.`;
    }
    if (f.size > MAX_FILE_SIZE) {
      return 'File exceeds 25 MB. Please choose a smaller file.';
    }
    return null;
  }, []);

  const handleFile = useCallback(
    (f: File) => {
      const err = validateFile(f);
      if (err) {
        setFileError(err);
        onFileChange(null);
        setFile(null);
        return;
      }
      setFileError(null);
      setFile(f);
      onFileChange(f);

      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      const url = URL.createObjectURL(f);
      objectUrlRef.current = url;

      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.onloadedmetadata = () => {
          setDuration(audioRef.current?.duration);
        };
      }
    },
    [validateFile, onFileChange]
  );

  const removeFile = useCallback(() => {
    setFile(null);
    setFileError(null);
    setDuration(undefined);
    onFileChange(null);
    if (audioRef.current) audioRef.current.src = '';
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }, [onFileChange]);

  const canTranscribe = !!file && !isTranscribing && !disabled;

  return (
    <div className="card" id="upload-card">
      {/* Drop zone — shown when no file selected */}
      {!file && <DropZone onFileSelected={handleFile} disabled={isTranscribing} />}

      {/* File preview */}
      {file && (
        <>
          <div className="file-preview">
            <div className="file-icon-wrap" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
            </div>
            <div className="file-info-text">
              <div className="file-name" title={file.name}>{file.name}</div>
              <div className="file-meta">
                <span>{formatFileSize(file.size)}</span>
                {duration !== undefined && <span>{formatDuration(duration)}</span>}
              </div>
            </div>
            <button
              type="button"
              className="file-remove-btn"
              onClick={removeFile}
              disabled={isTranscribing}
              aria-label={`Remove file ${file.name}`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Audio preview */}
          <audio ref={audioRef} id="audio-preview" controls preload="metadata" />

          {/* Language + Transcribe */}
          <div className="controls-row">
            <div className="select-wrap">
              <select
                value={language}
                onChange={(e) => onLanguageChange(e.target.value)}
                disabled={isTranscribing}
                aria-label="Select transcription language"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.value} value={lang.value}>{lang.label}</option>
                ))}
              </select>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onTranscribe}
              disabled={!canTranscribe}
              aria-label={isTranscribing ? 'Transcription in progress' : 'Start transcription'}
            >
              {isTranscribing ? (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  </svg>
                  Processing…
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  Transcribe
                </>
              )}
            </button>
          </div>
        </>
      )}

      {/* Loading indicator */}
      {isTranscribing && (
        <div className="loading-wrap" aria-live="polite" aria-label={`Transcribing, ${elapsedSeconds} seconds elapsed`}>
          <div className="waveform" aria-hidden="true">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="waveform-bar" />
            ))}
          </div>
          <div className="loading-meta">
            <span className="loading-label">Transcribing your audio…</span>
            <span className="loading-elapsed">{elapsedSeconds}s elapsed</span>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onCancel}
            aria-label="Cancel transcription"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" width="14" height="14">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Cancel
          </button>
        </div>
      )}

      {/* Errors */}
      {(error || fileError) && (
        <div className="error-banner" role="alert">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{fileError || error}</span>
        </div>
      )}
    </div>
  );
}

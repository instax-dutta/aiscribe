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

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const validateFile = useCallback((f: File): string | null => {
    const ext = f.name.split('.').pop()?.toLowerCase();
    if (!ext || !ACCEPTED_EXTENSIONS.includes(ext as typeof ACCEPTED_EXTENSIONS[number])) {
      return `Unsupported format. Accepted: ${ACCEPTED_EXTENSIONS.join(', ')}.`;
    }
    if (f.size > MAX_FILE_SIZE) {
      return 'File exceeds 25MB limit. Please choose a smaller file.';
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
    if (audioRef.current) {
      audioRef.current.src = '';
    }
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }, [onFileChange]);

  const canTranscribe = !!file && !isTranscribing && !disabled;

  return (
    <div className="card" id="upload-card">
      {!file && <DropZone onFileSelected={handleFile} disabled={isTranscribing} />}

      {file && (
        <div id="file-info" style={{ display: 'block' }}>
          <div className="file-row">
            <div>
              <div className="file-name">{file.name}</div>
              <div className="file-meta">
                <span>{formatFileSize(file.size)}</span>
                <span>{formatDuration(duration)}</span>
              </div>
            </div>
            <button type="button" className="remove-file" onClick={removeFile} title="Remove file" disabled={isTranscribing}>
              &times;
            </button>
          </div>
          <audio ref={audioRef} id="audio-preview" controls />
        </div>
      )}

      {file && (
        <div className="controls-row">
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            disabled={isTranscribing}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onTranscribe}
            disabled={!canTranscribe}
          >
            {isTranscribing ? 'Transcribing...' : 'Transcribe'}
          </button>
        </div>
      )}

      {isTranscribing && (
        <div id="loading-indicator" style={{ display: 'block' }}>
          <div className="waveform">
            <span /><span /><span /><span /><span />
          </div>
          <p className="loading-text">
            Transcribing... <span className="elapsed">{elapsedSeconds}s</span>
          </p>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            style={{ marginTop: 12 }}
            onClick={onCancel}
            aria-label="Cancel transcription"
          >
            Cancel
          </button>
        </div>
      )}

      {(error || fileError) && (
        <div id="error-inline" style={{ display: 'block' }}>
          {fileError || error}
        </div>
      )}
    </div>
  );
}

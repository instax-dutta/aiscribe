'use client';

import { useState, useRef, useCallback } from 'react';
import { GROQ_API_URL, PROXY_API_URL, MAX_FREE_USAGE } from '@/lib/constants';

function classifyError(status: number | null, message: string): string {
  if (status === 401) return 'Invalid API key. Please check your key and try again.';
  if (status === 429) return 'Rate limit reached. Please wait a moment and try again.';
  if (message === 'Failed to fetch' || message.includes('NetworkError') || message.includes('network'))
    return 'Network error. Check your connection and retry.';
  if (status !== null) return `Transcription failed (${status}): ${message}`;
  return message || 'An unknown error occurred.';
}

export type ApiErrorCode = 'invalid-key' | 'rate-limited' | 'network' | 'empty' | 'unknown';

export interface TranscribeResult {
  text: string;
}

export function useTranscribe() {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TranscribeResult | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    setElapsedSeconds(0);
    const start = Date.now();
    timerRef.current = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - start) / 1000));
    }, 200);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const transcribe = useCallback(
    async (
      file: File,
      apiKey: string | null,
      model: string,
      language: string,
      freeUsageCount: number
    ): Promise<{ success: boolean; key?: string }> => {
      if (!apiKey && freeUsageCount >= MAX_FREE_USAGE) {
        return { success: false };
      }

      setError(null);
      setResult(null);
      setIsTranscribing(true);
      startTimer();

      const isBaseKey = !apiKey;
      const targetUrl = isBaseKey ? PROXY_API_URL : GROQ_API_URL;

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('model', model);
        formData.append('response_format', 'json');
        if (language) formData.append('language', language);

        const headers: Record<string, string> = {};
        if (!isBaseKey && apiKey) {
          headers['Authorization'] = 'Bearer ' + apiKey;
        }

        const response = await fetch(targetUrl, {
          method: 'POST',
          headers,
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          const msg = data.error?.message || `HTTP ${response.status}`;
          throw { status: response.status, message: msg };
        }

        const text = (data.text || '').trim();
        if (!text) {
          throw { status: null, message: 'No transcription content received.' };
        }

        setResult({ text });
        return { success: true, key: isBaseKey ? 'base' : apiKey! };
      } catch (err: unknown) {
        let status: number | null = null;
        let message = '';

        if (err && typeof err === 'object' && 'status' in err && 'message' in err) {
          const e = err as { status: number | null; message: string };
          status = e.status;
          message = e.message;
        } else if (err instanceof TypeError) {
          message = err.message;
        } else if (err instanceof Error) {
          message = err.message;
        }

        const displayMsg = classifyError(status, message);
        setError(displayMsg);
        return { success: false };
      } finally {
        setIsTranscribing(false);
        stopTimer();
      }
    },
    [startTimer, stopTimer]
  );

  const reset = useCallback(() => {
    setError(null);
    setResult(null);
    setElapsedSeconds(0);
  }, []);

  return { isTranscribing, error, result, elapsedSeconds, transcribe, reset };
}

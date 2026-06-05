'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { GROQ_API_URL, PROXY_API_URL, MAX_FREE_USAGE } from '@/lib/constants';

function classifyError(status: number | null, message: string): string {
  if (status === 401) return 'Invalid API key. Please check your key and try again.';
  if (status === 413) return 'File too large. Please choose a file under 25 MB.';
  if (status === 429) return 'Rate limit reached. Please wait a moment and try again.';
  if (status === 504) return 'Transcription timed out. Please try again with a shorter file.';
  if (message === 'Failed to fetch' || message.includes('NetworkError') || message.includes('network'))
    return 'Network error. Check your connection and retry.';
  if (message.toLowerCase().includes('aborted') || message.toLowerCase().includes('abort'))
    return 'Transcription was cancelled.';
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
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup on unmount to prevent state updates on unmounted component and timer leaks
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      abortControllerRef.current?.abort();
    };
  }, []);

  const startTimer = useCallback(() => {
    setElapsedSeconds(0);
    const start = Date.now();
    // 1-second precision is plenty — reduces re-renders from 5/sec to 1/sec
    timerRef.current = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - start) / 1000));
    }, 1000);
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

      // Cancel any in-flight request before starting a new one
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

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
          signal: controller.signal,
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
        // Silently swallow deliberate cancellation
        if (err instanceof Error && err.name === 'AbortError') {
          setError(null);
          return { success: false };
        }

        let status: number | null = null;
        let message = '';

        if (err && typeof err === 'object' && 'status' in err && 'message' in err) {
          const e = err as { status: number | null; message: string };
          status = e.status;
          message = e.message;
        } else if (err instanceof Error) {
          message = err.message;
        }

        const displayMsg = classifyError(status, message);
        setError(displayMsg);
        return { success: false };
      } finally {
        setIsTranscribing(false);
        stopTimer();
        // Clear the ref so we don't accidentally abort future requests
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
        }
      }
    },
    [startTimer, stopTimer]
  );

  const cancel = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setResult(null);
    setElapsedSeconds(0);
  }, []);

  return { isTranscribing, error, result, elapsedSeconds, transcribe, cancel, reset };
}

'use client';

import { useState, useCallback } from 'react';
import { LS_PREFIX } from '@/lib/constants';

function safeGet<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = localStorage.getItem(LS_PREFIX + key);
    return raw !== null ? (JSON.parse(raw) as T) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function safeSet(key: string, value: unknown): void {
  try {
    localStorage.setItem(LS_PREFIX + key, JSON.stringify(value));
  } catch { /* quota exceeded */ }
}

function safeRemove(key: string): void {
  try {
    localStorage.removeItem(LS_PREFIX + key);
  } catch { /* noop */ }
}

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => safeGet(key, defaultValue));

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const next = value instanceof Function ? value(prev) : value;
        safeSet(key, next);
        return next;
      });
    },
    [key]
  );

  const removeValue = useCallback(() => {
    safeRemove(key);
    setStoredValue(defaultValue);
  }, [key, defaultValue]);

  return [storedValue, setValue, removeValue] as const;
}

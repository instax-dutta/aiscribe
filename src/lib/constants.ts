export const GROQ_API_URL = "https://api.groq.com/openai/v1/audio/transcriptions";
export const PROXY_API_URL = "/api/transcribe";
export const MAX_FREE_USAGE = 5;
export const MAX_FILE_SIZE = 25 * 1024 * 1024;
export const ACCEPTED_EXTENSIONS = ['mp3', 'mp4', 'wav', 'm4a', 'ogg', 'flac', 'webm'] as const;
export const LS_PREFIX = 'aiscribe_';

export const LANGUAGES = [
  { value: '', label: 'Auto-detect' },
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'Hindi' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ar', label: 'Arabic' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'zh', label: 'Chinese' },
  { value: 'it', label: 'Italian' },
  { value: 'ru', label: 'Russian' },
  { value: 'nl', label: 'Dutch' },
  { value: 'tr', label: 'Turkish' },
  { value: 'pl', label: 'Polish' },
] as const;

export const MODELS = [
  { value: 'whisper-large-v3-turbo', label: 'Turbo (faster)' },
  { value: 'whisper-large-v3', label: 'Large v3 (accurate)' },
] as const;

export type Language = (typeof LANGUAGES)[number]['value'];
export type Model = (typeof MODELS)[number]['value'];

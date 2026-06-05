'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import FreeUsageBanner from '@/components/FreeUsageBanner';
import UploadCard from '@/components/UploadCard';
import TranscriptResult from '@/components/TranscriptResult';
import SettingsDrawer from '@/components/SettingsDrawer';
import UpgradeModal from '@/components/UpgradeModal';
import ToastContainer from '@/components/ToastContainer';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useTranscribe } from '@/hooks/useTranscribe';
import { useToast } from '@/hooks/useToast';
import { LANGUAGES } from '@/lib/constants';

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeInner />
    </Suspense>
  );
}

function HomeInner() {
  const searchParams = useSearchParams();
  const [freeUsageCount, setFreeUsageCount] = useLocalStorage('freeUsageCount', 0);
  const [userApiKey, setUserApiKey] = useLocalStorage<string | null>('groq_user_api_key', null);
  const [model, setModel] = useLocalStorage('selectedModel', 'whisper-large-v3-turbo');
  const [language, setLanguage] = useLocalStorage('selectedLanguage', '');

  const fileRef = useRef<File | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [uploadKey, setUploadKey] = useState(0);

  const { isTranscribing, error, result, elapsedSeconds, transcribe, cancel, reset: resetTranscribe } = useTranscribe();
  const { toasts, showToast, dismissToast } = useToast();

  // pSEO deep-link: /?lang=es pre-selects the Spanish language dropdown.
  // Validates against the allowlist; only persists if the code is recognized.
  useEffect(() => {
    const requested = searchParams.get('lang');
    if (!requested) return;
    const isValid = LANGUAGES.some((l) => l.value === requested);
    if (isValid && requested !== language) {
      setLanguage(requested);
    }
  }, [searchParams, language, setLanguage]);

  const handleTranscribe = useCallback(async () => {
    const file = fileRef.current;
    if (!file || isTranscribing) return;

    const isBaseKey = !userApiKey;

    if (isBaseKey && freeUsageCount >= 5) {
      setModalOpen(true);
      return;
    }

    const outcome = await transcribe(file, userApiKey, model, language, freeUsageCount);

    if (outcome.success && isBaseKey) {
      setFreeUsageCount((prev) => prev + 1);
      showToast('Transcription complete!', 'success');
    } else if (!outcome.success && outcome.key === undefined) {
      setModalOpen(true);
    }
  }, [isTranscribing, userApiKey, freeUsageCount, transcribe, model, language, setFreeUsageCount, showToast]);

  useEffect(() => {
    if (error) showToast(error, 'error');
  }, [error, showToast]);

  const handleClear = useCallback(() => {
    resetTranscribe();
    fileRef.current = null;
    setUploadKey((k) => k + 1);
  }, [resetTranscribe]);

  const handleFileChange = useCallback((f: File | null) => {
    fileRef.current = f;
  }, []);

  const handleApiKeySave = useCallback(
    (key: string) => {
      setUserApiKey(key);
      setModalOpen(false);
      showToast('API key saved! Unlimited transcriptions unlocked.', 'success');
    },
    [setUserApiKey, showToast]
  );

  const handleApiKeyRemove = useCallback(() => {
    setUserApiKey(null);
    showToast('API key removed', 'info');
  }, [setUserApiKey, showToast]);

  const handleResetFreeUsage = useCallback(() => {
    setFreeUsageCount(0);
    showToast('Free usage counter reset', 'info');
  }, [setFreeUsageCount, showToast]);

  return (
    <>
      {/* Floating navbar */}
      <Header onSettingsClick={() => setDrawerOpen(true)} />

      <div id="app-container">
        {/* Hero — editorial, left-aligned, no eyebrow */}
        <section className="hero" aria-label="Product introduction">
          <h1>
            Transcribe audio.<br />
            Instantly.
          </h1>
          <p className="hero-sub">
            Drop any audio file and receive an accurate, AI-generated transcript in seconds.
            Free to start — no account required.
          </p>
        </section>

        {/* Free usage meter */}
        <FreeUsageBanner freeUsageCount={freeUsageCount} hasUserKey={!!userApiKey} />

        {/* Upload + Transcribe */}
        <main>
          <UploadCard
            key={uploadKey}
            onTranscribe={handleTranscribe}
            onCancel={cancel}
            isTranscribing={isTranscribing}
            error={error}
            elapsedSeconds={elapsedSeconds}
            language={language}
            onLanguageChange={setLanguage}
            onFileChange={handleFileChange}
          />

          {result && !isTranscribing && (
            <TranscriptResult text={result.text} onClear={handleClear} />
          )}
        </main>

        {/* Footer — Powered by Groq · Built by SDAD */}
        <footer className="app-footer" role="contentinfo">
          <span className="footer-line">
            <Link href="/transcribe" aria-label="Browse transcription by language">
              Languages
            </Link>
          </span>
          <span className="footer-sep" aria-hidden="true">·</span>
          <span className="footer-line">
            Powered by{' '}
            <a
              href="https://groq.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Powered by Groq"
            >
              Groq
            </a>
          </span>
          <span className="footer-sep" aria-hidden="true">·</span>
          <span className="footer-line">
            Built by{' '}
            <a
              href="https://sdad.pro"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-sdad"
              aria-label="Built by SDAD — opens in a new tab"
            >
              SDAD <span className="footer-brain" aria-hidden="true">🧠</span>
            </a>
          </span>
        </footer>
      </div>

      {/* Settings drawer */}
      <SettingsDrawer
        key={userApiKey || 'none'}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        apiKey={userApiKey}
        onApiKeySave={(key) => {
          setUserApiKey(key);
          showToast('API key saved', 'success');
        }}
        onApiKeyRemove={handleApiKeyRemove}
        model={model}
        onModelChange={setModel}
        language={language}
        onLanguageChange={setLanguage}
        freeUsageCount={freeUsageCount}
        onResetFreeUsage={handleResetFreeUsage}
      />

      {/* Upgrade modal */}
      <UpgradeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onApiKeySave={handleApiKeySave}
      />

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Structured data: WebApplication schema for AI engines + Google Rich Results.
          Helps non-Google AI engines (ChatGPT, Perplexity, Claude) extract product
          info, pricing, supported formats, and language list as machine-readable
          context when users ask about audio transcription tools. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'AiScribe',
            url: 'https://aiscribe.vercel.app',
            applicationCategory: 'MultimediaApplication',
            applicationSubCategory: 'Speech-to-Text Transcription',
            operatingSystem: 'Web (any modern browser)',
            description:
              'Free, instant AI audio transcription powered by Groq Whisper. Supports 15 languages. No account required for 5 free transcriptions; bring your own Groq API key for unlimited.',
            inLanguage: ['en', 'es', 'fr', 'de', 'pt', 'it', 'ja', 'ko', 'zh', 'hi', 'ar', 'ru', 'nl', 'tr', 'pl'],
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
              description:
                '5 free transcriptions with no account. Unlimited with a user-supplied Groq API key (free from Groq).',
            },
            featureList: [
              'Drag-and-drop audio upload',
              '15 supported languages with auto-detect',
              'Two Whisper models: turbo (fast) and large-v3 (accurate)',
              'Export as TXT or SRT',
              'Cancellable mid-transcription',
              'Local-storage only API key handling — never sent to our server',
            ],
            aggregateRating: undefined,
            author: {
              '@type': 'Organization',
              name: 'SDAD',
              url: 'https://sdad.pro',
            },
            publisher: {
              '@type': 'Organization',
              name: 'Groq',
              url: 'https://groq.com',
            },
          }),
        }}
      />
    </>
  );
}

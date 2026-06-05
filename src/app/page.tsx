'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
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

export default function Home() {
  const [freeUsageCount, setFreeUsageCount] = useLocalStorage('freeUsageCount', 0);
  const [userApiKey, setUserApiKey] = useLocalStorage<string | null>('groq_user_api_key', null);
  const [model, setModel] = useLocalStorage('selectedModel', 'whisper-large-v3-turbo');
  const [language, setLanguage] = useLocalStorage('selectedLanguage', '');

  const fileRef = useRef<File | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [uploadKey, setUploadKey] = useState(0);

  const { isTranscribing, error, result, elapsedSeconds, transcribe, reset: resetTranscribe } = useTranscribe();
  const { toasts, showToast, dismissToast } = useToast();

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
      showToast('API key saved! You can now transcribe unlimited files.', 'success');
    },
    [setUserApiKey, showToast]
  );

  const handleApiKeyRemove = useCallback(() => {
    setUserApiKey(null);
    showToast('API key removed', 'info');
  }, [setUserApiKey, showToast]);

  const handleResetFreeUsage = useCallback(() => {
    setFreeUsageCount(0);
    showToast('Free usage counter reset to 0', 'info');
  }, [setFreeUsageCount, showToast]);

  return (
    <div id="app-container">
      <Header onSettingsClick={() => setDrawerOpen(true)} />

      <FreeUsageBanner freeUsageCount={freeUsageCount} hasUserKey={!!userApiKey} />

      <main>
        <UploadCard
          key={uploadKey}
          onTranscribe={handleTranscribe}
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

      <UpgradeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onApiKeySave={handleApiKeySave}
      />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

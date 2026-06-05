import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

// Specify only the weights we actually use — reduces font payload
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: true,
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://aiscribe.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: 'AiScribe — AI Audio Transcription',
  description:
    'Transcribe audio files instantly using AI. Free to start, no account needed. Powered by Groq Whisper.',
  keywords: ['transcription', 'audio', 'AI', 'Whisper', 'Groq', 'speech to text'],
  robots: { index: true, follow: true },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎙️</text></svg>",
  },
  openGraph: {
    title: 'AiScribe — AI Audio Transcription',
    description:
      'Transcribe audio files instantly using AI. Free to start, no account needed. Powered by Groq Whisper.',
    type: 'website',
    url: BASE_URL,
    siteName: 'AiScribe',
  },
  twitter: {
    card: 'summary',
    title: 'AiScribe — AI Audio Transcription',
    description: 'Transcribe audio files instantly using AI. Powered by Groq Whisper.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        {children}
        {/* Polite aria-live region for toast / status announcements */}
        <div
          id="sr-announcer"
          aria-live="polite"
          aria-atomic="true"
          style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap' }}
        />
      </body>
    </html>
  );
}

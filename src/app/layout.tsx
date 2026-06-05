import type { Metadata } from 'next';
import { Inter, EB_Garamond } from 'next/font/google';
import './globals.css';

// Inter — body, navigation, captions, buttons (ElevenLabs body font)
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
});

// EB Garamond — editorial display serif (open-source substitute for Waldenburg Light)
const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
  preload: true,
  variable: '--font-display',
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
    <html lang="en" className={`${inter.variable} ${ebGaramond.variable} ${inter.className}`}>
      <body>
        <div id="app-root">
          {children}
        </div>
        {/* Polite aria-live region for screen-reader announcements */}
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

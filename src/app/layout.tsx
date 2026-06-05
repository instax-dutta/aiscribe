import type { Metadata } from 'next';
import { Inter, EB_Garamond } from 'next/font/google';
import './globals.css';
import SmoothScroll from '@/components/SmoothScroll';

// Inter — body, navigation, captions, buttons
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
});

// EB Garamond — editorial display serif
const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
  preload: true,
  variable: '--font-display',
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://ais.sdad.pro';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: 'AiScribe — AI Audio Transcription · Powered by Groq',
  description:
    'Transcribe audio files instantly using AI. Free to start, no account needed. Powered by Groq Whisper. Built by SDAD.',
  applicationName: 'AiScribe',
  keywords: [
    'transcription',
    'audio transcription',
    'speech to text',
    'AI transcription',
    'Whisper',
    'Groq',
    'free transcription',
    'podcast transcript',
    'interview transcription',
    'multilingual transcription',
  ],
  authors: [{ name: 'SDAD', url: 'https://sdad.pro' }],
  creator: 'SDAD',
  publisher: 'AiScribe',
  category: 'productivity',
  classification: 'Multimedia Application · Speech-to-Text',
  abstract: 'Free, instant AI audio transcription powered by Groq Whisper. 15 languages. No account required.',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎙️</text></svg>",
    apple: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎙️</text></svg>",
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      en: `${BASE_URL}`,
      es: `${BASE_URL}/transcribe/spanish`,
      fr: `${BASE_URL}/transcribe/french`,
      de: `${BASE_URL}/transcribe/german`,
      pt: `${BASE_URL}/transcribe/portuguese`,
      it: `${BASE_URL}/transcribe/italian`,
      ja: `${BASE_URL}/transcribe/japanese`,
      ko: `${BASE_URL}/transcribe/korean`,
      zh: `${BASE_URL}/transcribe/chinese`,
      hi: `${BASE_URL}/transcribe/hindi`,
      ar: `${BASE_URL}/transcribe/arabic`,
    },
  },
  openGraph: {
    title: 'AiScribe — AI Audio Transcription',
    description:
      'Transcribe audio files instantly using AI. Free to start, no account needed. Powered by Groq Whisper. Built by SDAD.',
    type: 'website',
    url: BASE_URL,
    siteName: 'AiScribe',
    locale: 'en_US',
    alternateLocale: ['es_ES', 'fr_FR', 'de_DE', 'pt_BR', 'it_IT', 'ja_JP', 'ko_KR', 'zh_CN', 'hi_IN', 'ar_SA'],
    determiner: '',
    images: [
      {
        url: '/og.png',
        secureUrl: `${BASE_URL}/og.png`,
        width: 1200,
        height: 630,
        alt: 'AiScribe — Transcribe audio. Instantly. Powered by Groq Whisper.',
        type: 'image/png',
      },
    ],
    countryName: 'United States',
    emails: [],
    phoneNumbers: [],
    faxNumbers: [],
    ttl: 60 * 60 * 24,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AiScribe — AI Audio Transcription',
    description: 'Transcribe audio files instantly using AI. Powered by Groq Whisper. Built by SDAD.',
    images: {
      url: '/og.png',
      alt: 'AiScribe — Transcribe audio. Instantly. Powered by Groq Whisper.',
    },
  },
  appleWebApp: {
    capable: true,
    title: 'AiScribe',
    statusBarStyle: 'black-translucent',
  },
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
    url: false,
  },
  referrer: 'strict-origin-when-cross-origin',
  other: {
    'og:see_also': `${BASE_URL}/transcribe`,
    'article:author': 'SDAD',
    'twitter:label1': 'Free tier',
    'twitter:data1': '5 transcriptions, no sign-up',
    'twitter:label2': 'Languages',
    'twitter:data2': '15 supported',
    'twitter:label3': 'Inference',
    'twitter:data3': 'Groq Whisper',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0c0a09',
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${ebGaramond.variable}`}
      suppressHydrationWarning
    >
      <body>
        <div id="app-root">
          {children}
        </div>
        <SmoothScroll />
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

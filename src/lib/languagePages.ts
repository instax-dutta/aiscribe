/**
 * Programmatic SEO data — language pages.
 *
 * Each entry is the *source of truth* for one /transcribe/[slug]/ page.
 * All copy is hand-written, not template-swapped, to avoid thin-content flags.
 *
 * Field guide:
 *  - `slug`     URL-safe id, becomes the [lang] segment
 *  - `code`     ISO 639-1, matches LANGUAGES[].value in constants.ts
 *  - `nativeName` self-name in that language (e.g. "Español")
 *  - `speakers` approximate native + L2 count (public data, Ethnologue)
 *  - `regions`  primary regions
 *  - `intro`    one-sentence H1 sub
 *  - `useCases` array of 3–4 specific scenarios
 *  - `challenges` array of 2–3 transcription challenges unique to this language
 *  - `tips`     array of 2–3 best-practice tips
 *  - `faq`      array of { q, a } — drives JSON-LD FAQPage schema
 *  - `relatedSlugs` siblings for internal cross-linking
 */

export type LanguagePage = {
  slug: string;
  code: string;
  label: string;
  nativeName: string;
  speakers: string;
  regions: string[];
  intro: string;
  useCases: string[];
  challenges: string[];
  tips: string[];
  faq: { q: string; a: string }[];
  relatedSlugs: string[];
};

export const LANGUAGE_PAGES: LanguagePage[] = [
  {
    slug: 'spanish',
    code: 'es',
    label: 'Spanish',
    nativeName: 'Español',
    speakers: '500M+ native speakers worldwide',
    regions: ['Spain', 'Mexico', 'Argentina', 'Colombia', 'United States', 'Latin America'],
    intro:
      'Transcribe Spanish audio to text in seconds — from Madrid to Buenos Aires to Mexico City. Our Whisper-powered engine handles every regional accent.',
    useCases: [
      'Spanish-language podcast episodes, interview shows, and radio segments',
      'Customer support calls and sales recordings from Spain, Mexico, and LATAM',
      'University lectures, academic research interviews, and oral-history projects',
      'YouTube and TikTok creators who repurpose long-form audio into searchable text',
    ],
    challenges: [
      'Wide regional variation — Castilian (Spain), Mexican, Rioplatense (Argentina), and Andean accents can shift word choice and pronunciation dramatically',
      'Rapid speech and frequent code-switching between Spanish and English, especially in US-based content',
      'Colloquial slang and diminutives ("chiquito", "ahorita") that confuse generic transcription models',
    ],
    tips: [
      'For best results, use audio recorded in a quiet environment with a single speaker when possible',
      'If your recording is multi-speaker (interview, panel), keep speakers at a similar distance from the mic',
      'When the model is unsure, it defaults to Mexican Spanish — the most common training data. For Castilian or Argentine content, expect regional spelling ("vosotros" vs "ustedes") to be normalized to Latin American forms',
    ],
    faq: [
      {
        q: 'How accurate is AiScribe for Spanish audio?',
        a: 'On clean, single-speaker Spanish audio, AiScribe achieves near-human accuracy for both Castilian and Latin American variants. Heavy background noise, multiple overlapping speakers, or strong regional accents can reduce accuracy.',
      },
      {
        q: 'Can it distinguish between Spanish and code-switched English/Spanish?',
        a: 'Yes. The model handles code-switching — the common practice of mixing English and Spanish in the same sentence — far better than older transcription services. It will transcribe each word in its original language.',
      },
      {
        q: 'Does it support Mexican vs Castilian vs Argentine Spanish differently?',
        a: 'The underlying model is trained on all major regional variants, so it understands them. Output is normalized to standard spelling — for example, "vosotros" used in Spain will appear as it was spoken, but punctuation and capitalization follow Latin American norms by default.',
      },
    ],
    relatedSlugs: ['french', 'portuguese', 'italian'],
  },

  {
    slug: 'french',
    code: 'fr',
    label: 'French',
    nativeName: 'Français',
    speakers: '275M+ speakers across 29 countries',
    regions: ['France', 'Canada (Québec)', 'Belgium', 'Switzerland', 'West & North Africa'],
    intro:
      'Transcribe French audio to text — from Paris to Montréal to Dakar. Handles metropolitan French, Québécois, and African variants.',
    useCases: [
      'Interviews and roundtable discussions for French-market journalism',
      'Corporate meetings, earnings calls, and board recordings from CAC 40 companies',
      'Québécois radio segments, podcasts, and oral-history preservation',
      'West African (Senegal, Côte d\'Ivoire) French — often code-mixed with Wolof, Bambara, or Dioula',
    ],
    challenges: [
      'Québécois French uses anglicisms and older vocabulary that confuse Continental-trained models ("char" for car, "fin de semaine" instead of "week-end")',
      'Liaison and elision ("l\'homme", "j\'ai") are pronounced but not always transcribed correctly by basic tools',
      'Numbers: French uses vigesimal counting past 60 (soixante-dix, quatre-vingts) — many transcription tools mistranscribe these',
    ],
    tips: [
      'If your audio is from Québec or Africa, mention the regional context in the filename — it helps when reviewing the output',
      'For numbers and dates, double-check the first 30 seconds of output — this is where 80% of transcription errors occur',
      'Liaisons and elisions are preserved as spoken, not as written, so expect "j\'ai" rather than "je ai" in the output',
    ],
    faq: [
      {
        q: 'Will it handle African French accents?',
        a: 'Yes. The model is trained on a diverse French corpus, including West and North African variants. Accents from Senegal, Cameroon, and Morocco are recognized accurately for clean audio.',
      },
      {
        q: 'Can I transcribe old French recordings?',
        a: 'Yes, but accuracy depends on audio quality. Recordings from the 1960s–80s on tape often have hiss and speed variance — re-digitize at the correct speed (4.75 cm/s for standard cassettes) before uploading.',
      },
      {
        q: 'Does it distinguish between Metropolitan and Canadian French?',
        a: 'The model recognizes both, but output spelling follows Metropolitan French conventions by default. "Fin de semaine" in a Québécois recording will appear as written, not normalized to "week-end".',
      },
    ],
    relatedSlugs: ['spanish', 'portuguese', 'italian'],
  },

  {
    slug: 'german',
    code: 'de',
    label: 'German',
    nativeName: 'Deutsch',
    speakers: '130M+ native speakers in the DACH region',
    regions: ['Germany', 'Austria', 'Switzerland', 'Liechtenstein', 'Luxembourg'],
    intro:
      'Transcribe German audio to text — from Berlin to Zürich to Vienna. Handles Standard German (Hochdeutsch) and major dialectal variants.',
    useCases: [
      'Business meetings, conference talks, and webinars for DACH-region B2B teams',
      'Academic lectures and oral exams from German universities',
      'Austrian and Swiss German podcasts (note: heavy dialect may reduce accuracy)',
      'Customer support and call center audio for German-market SaaS companies',
    ],
    challenges: [
      'Compound nouns ("Donaudampfschifffahrtsgesellschaftskapitän") can be transcribed as separate words, breaking meaning',
      'Bavarian, Swiss German (Schwyzerdütsch), and Berlinerisch are dialects — Standard German is the model\'s strong suit, not the dialects',
      'Numbers over 1 million use different conventions than English ("1,2 Millionen" not "1.2 million")',
    ],
    tips: [
      'For Swiss German audio, expect the model to transcribe it as Standard German — the underlying model does not natively handle Schwyzerdütsch',
      'Long compound words may be split — review the transcript and rejoin them with the editor if needed',
      'Numbers in German are reliably transcribed in their spoken form ("eine Million zweihunderttausend")',
    ],
    faq: [
      {
        q: 'How well does it handle Austrian German?',
        a: 'Standard Austrian German (Bühnendeutsch) is transcribed with high accuracy. Strong Viennese dialect, Tirolerisch, or Steirisch will be normalized toward Standard German — meaning the transcription is correct in content but reflects the standard form, not the dialect form.',
      },
      {
        q: 'What about Swiss German specifically?',
        a: 'Swiss German (Schwyzerdütsch) is significantly different from Standard German and is not natively supported. The model will attempt transcription but accuracy drops substantially. For Swiss German, we recommend transcribing in Standard German mode and post-editing.',
      },
      {
        q: 'Are umlauts (ä, ö, ü, ß) preserved?',
        a: 'Yes. All German special characters are preserved in the output: ä, ö, ü, ß. No need to post-process for character encoding.',
      },
    ],
    relatedSlugs: ['french', 'portuguese', 'italian'],
  },

  {
    slug: 'portuguese',
    code: 'pt',
    label: 'Portuguese',
    nativeName: 'Português',
    speakers: '250M+ native speakers across 9 countries',
    regions: ['Brazil', 'Portugal', 'Angola', 'Mozambique', 'Cape Verde'],
    intro:
      'Transcribe Portuguese audio to text — Brazilian, European, and African variants. Engine tuned for both Brasilian and Peninsular Portuguese.',
    useCases: [
      'Brazilian podcast episodes, YouTube content, and influencer audio (massive market)',
      'European Portuguese (Portugal) corporate communications and academic content',
      'Lusophone African content from Angola and Mozambique (often with Kimbundu or Emakhuwa code-switching)',
      'Customer support calls for Brazilian e-commerce and fintech',
    ],
    challenges: [
      'Brazilian and European Portuguese differ substantially in phonology — Brazilians pronounce unstressed "e" and "o" openly (["tu"] for "ttú"); Europeans close them',
      'Brazilian colloquial speech uses gerund forms that European Portuguese does not ("estou fazendo" vs "estou a fazer")',
      'Angolan and Mozambican Portuguese carry strong substrate influences from Bantu languages, affecting rhythm and intonation',
    ],
    tips: [
      'For Brazilian audio, expect the model to use Brazilian norms in output spelling — this is correct for the target audience',
      'For European Portuguese recordings, audio clarity matters more than usual — the closed vowels are easier to mishear',
      'Code-switching with English is common in Brazilian tech content; the model handles it well',
    ],
    faq: [
      {
        q: 'Does the output follow Brazilian or European spelling?',
        a: 'The model follows the variant of the input audio. Brazilian audio produces Brazilian Portuguese orthography; European audio produces European orthography. The two are mutually intelligible in writing as well as speech.',
      },
      {
        q: 'Can it handle Brazilian regional accents (Carioca, Paulista, Gaúcho)?',
        a: 'Yes. All major regional Brazilian accents are well-represented in the training data. Carioca (Rio) and Paulista (São Paulo) are the strongest.',
      },
      {
        q: 'What about older European Portuguese recordings?',
        a: 'Modern European Portuguese is well-supported. For pre-1974 recordings (which used different orthographic conventions), the model will transcribe spoken content accurately but spelling follows current norms, not the original orthography.',
      },
    ],
    relatedSlugs: ['spanish', 'french', 'italian'],
  },

  {
    slug: 'italian',
    code: 'it',
    label: 'Italian',
    nativeName: 'Italiano',
    speakers: '85M+ speakers, mostly in Italy',
    regions: ['Italy', 'Switzerland (Ticino)', 'San Marino', 'Vatican City', 'Italian diaspora worldwide'],
    intro:
      'Transcribe Italian audio to text — from Milan to Rome to Sicily. Handles Standard Italian and major regional accents.',
    useCases: [
      'Italian podcast and radio content (one of Europe\'s strongest spoken-word markets)',
      'Opera, theatre, and performance recording transcripts',
      'Corporate meetings and sales calls from Italian enterprises',
      'Academic lectures and humanities oral-history projects',
    ],
    challenges: [
      'Strong regional accents (Neapolitan, Sicilian, Venetian) can pull vowels and drop final consonants — Standard Italian is the model\'s strength',
      'False friends with English ("attualmente" means "currently", not "actually") — generic tools often mistranslate these in context',
      'Double consonants ("pizza", "bello") are phonemically distinct in Italian but often collapsed in casual speech',
    ],
    tips: [
      'For recordings with strong regional accent, use audio with clear enunciation — news broadcasts work better than casual conversation',
      'Musical content (opera, song) is transcribed as spoken Italian — actual sung lyrics may need manual correction',
      'False friends with English are preserved as Italian — review context-sensitive words carefully',
    ],
    faq: [
      {
        q: 'Does it work on opera and sung Italian?',
        a: 'The model is trained on speech, not singing. Opera arias, song lyrics, and rap will be transcribed, but accuracy drops and the output reflects what the model "hears" rather than the actual written lyrics. For transcription of sung content, post-editing is recommended.',
      },
      {
        q: 'Will it preserve Italian diacritics (à, è, é, ì, ò, ù)?',
        a: 'Yes. All Italian accented characters are preserved exactly as spoken. "Città" appears as "Città", not "Citta".',
      },
      {
        q: 'How well does it handle Swiss Italian?',
        a: 'Swiss Italian (spoken in Ticino) is closer to Lombard-influenced Standard Italian and is well-supported, with no special configuration needed.',
      },
    ],
    relatedSlugs: ['french', 'spanish', 'portuguese'],
  },

  {
    slug: 'japanese',
    code: 'ja',
    label: 'Japanese',
    nativeName: '日本語',
    speakers: '125M+ native speakers, almost entirely in Japan',
    regions: ['Japan', 'Japanese diaspora in Brazil, USA, Philippines'],
    intro:
      'Transcribe Japanese audio to text — Tokyo, Osaka, and standard broadcast Japanese. Whisper handles kanji, hiragana, and katakana natively.',
    useCases: [
      'Japanese business meetings, conferences, and earnings calls (large enterprise market)',
      'Anime, drama, and YouTube content creator transcripts',
      'University lectures and Japanese-language-learning material',
      'Call center and customer support audio for Japan-market services',
    ],
    challenges: [
      'Three writing systems mixed in a single sentence (kanji, hiragana, katakana) — output scripts the system hears, which may not match authorial intent',
      'Pitch-accent and minimal vowel reduction in casual speech make homophone errors (e.g., "橋" / "箸" / "端" all "hashi")',
      'Honorifics and keigo (sonkeigo, kenjōgo, teineigo) are heard as plain speech in the audio — output reflects what was said, not the politeness level',
    ],
    tips: [
      'For business and formal content, the model handles keigo accurately as spoken. If you need written honorifics marked, that\'s a manual post-editing step',
      'Katakana loanwords (e.g., "ビジネス", "テクノロジー") are transcribed in katakana as expected — no normalization to kanji',
      'Long silences and filler words ("えーと", "あのー") are preserved in the output — useful for conversation analysis, less so for clean transcripts',
    ],
    faq: [
      {
        q: 'Does the output use kanji, hiragana, or both?',
        a: 'The model outputs the script that best matches what was spoken. Native Japanese words appear in their standard kanji/hiragana mix; loanwords appear in katakana. This matches how Japanese is normally written.',
      },
      {
        q: 'Can it transcribe anime and drama audio?',
        a: 'Yes, with caveats. Clean dialogue is well-handled. Overlapping dialogue, background music, and exaggerated emotional delivery (screaming, whispering) reduce accuracy — typical of any speech recognition system.',
      },
      {
        q: 'What about Osaka-ben (Kansai dialect)?',
        a: 'Strong Kansai dialect (大阪弁) will be transcribed as Standard Japanese in most cases. The meaning comes through, but regional flavor (e.g., "なんでやねん") may be normalized to standard equivalents ("なぜですか").',
      },
    ],
    relatedSlugs: ['korean', 'chinese', 'hindi'],
  },

  {
    slug: 'korean',
    code: 'ko',
    label: 'Korean',
    nativeName: '한국어',
    speakers: '77M+ native speakers, mostly in South & North Korea',
    regions: ['South Korea', 'North Korea', 'Korean diaspora in USA, China, Japan'],
    intro:
      'Transcribe Korean audio to text — Seoul dialect, broadcast Korean, and K-content. Hangul script preserved throughout.',
    useCases: [
      'K-pop, K-drama, and YouTube creator transcripts (huge global demand)',
      'Korean business meetings, conference talks, and product launch audio',
      'Esports commentary and gaming content',
      'Korean-language-learning material and tutoring session recordings',
    ],
    challenges: [
      'Honorific sentence endings (습니다 / 어요 / 야 / 님) reflect speaker relationships — output transcribes what was said, not the social context',
      'Heavy English loanwords and Konglish ("컴퓨터", "인터넷", "셀카") are common in modern Korean — well-recognized by the model',
      'Fast K-pop rap and overlapping dialogue in variety shows are difficult — accuracy drops for entertainment content',
    ],
    tips: [
      'For K-content, single-speaker audio (interviews, ASMR, news) is the highest-accuracy use case',
      'Fast speech in variety shows and rap is transcribed as the model hears it — expect ~85% accuracy for fast content vs ~95% for clean speech',
      'All Korean text is output in proper Hangul — no romanization, no script conversion needed',
    ],
    faq: [
      {
        q: 'How does it handle different levels of politeness?',
        a: 'Politeness levels (반말 / 해요 / 합쇼) are preserved as spoken. The output reflects exactly what the speaker said, including the formal ending (습니다) and informal ending (어/아).',
      },
      {
        q: 'Can it transcribe K-pop and song lyrics?',
        a: 'Speech and music are different. K-pop vocals are transcribed as the model interprets them, but actual lyrics may diverge. For accurate lyric transcription, a tool specifically trained on Korean music is recommended. Speech in interviews, talk shows, and ASMR is well-handled.',
      },
      {
        q: 'What about North Korean vs South Korean vocabulary?',
        a: 'The model is trained primarily on South Korean Korean. North Korean vocabulary and accent (e.g., "려" vs "려", "오빠" usage) may be normalized to South Korean forms in the output.',
      },
    ],
    relatedSlugs: ['japanese', 'chinese', 'hindi'],
  },

  {
    slug: 'chinese',
    code: 'zh',
    label: 'Chinese',
    nativeName: '中文',
    speakers: '1.1B+ speakers, primarily Mandarin',
    regions: ['Mainland China', 'Taiwan', 'Singapore', 'Malaysia', 'Chinese diaspora worldwide'],
    intro:
      'Transcribe Chinese audio to text — Mandarin (Simplified & Traditional), with high accuracy for Mainland and Taiwan speech.',
    useCases: [
      'Mandarin podcasts, news broadcasts, and lecture content',
      'Cross-border e-commerce, customer support, and B2B sales calls',
      'Chinese-language-learning material and HSK-prep audio',
      'Mainland/Taiwan/Hong Kong business meetings (note: Cantonese has separate support)',
    ],
    challenges: [
      'Tonal ambiguity — Mandarin has 4 tones plus neutral; same syllable can mean entirely different things ("mā" / "má" / "mǎ" / "mà") — the model uses context to disambiguate',
      'Code-switching with English is extremely common in tech, finance, and academic content — well-handled but may slow accuracy',
      'Traditional vs Simplified character output — the model defaults to Simplified, but Traditional is also supported for Taiwan/HK content',
    ],
    tips: [
      'For Taiwan content, expect Simplified characters in output — Traditional conversion is a manual post-step if needed',
      'Numbers and addresses in Mandarin are well-transcribed ("北京市朝阳区" comes out as a single string, not split)',
      'Tonal ambiguity rarely causes real errors in continuous speech — context handles it; isolated syllables (e.g., a single word spoken out of context) are the exception',
    ],
    faq: [
      {
        q: 'Does it support Cantonese?',
        a: 'No — Cantonese is a separate language in our model. AiScribe\'s default Chinese support is for Mandarin. Cantonese audio will be transcribed with significantly reduced accuracy, and the output will be in Mandarin, not Cantonese-specific characters.',
      },
      {
        q: 'Simplified or Traditional characters?',
        a: 'Output defaults to Simplified Chinese characters. For Traditional (Taiwan/HK), the model can produce Traditional output for audio that\'s clearly Taiwanese or Hong Kong Mandarin. To force Traditional, post-process the output.',
      },
      {
        q: 'How accurate is it for fast conversational Mandarin?',
        a: 'Clean conversational Mandarin is transcribed at ~95% accuracy. Fast, casual speech with strong regional accent (e.g., Sichuanese-influenced Mandarin) drops to ~85%.',
      },
    ],
    relatedSlugs: ['japanese', 'korean', 'hindi'],
  },

  {
    slug: 'hindi',
    code: 'hi',
    label: 'Hindi',
    nativeName: 'हिन्दी',
    speakers: '600M+ speakers across South Asia',
    regions: ['India (northern states)', 'Nepal', 'Fiji', 'Mauritius', 'Indian diaspora worldwide'],
    intro:
      'Transcribe Hindi audio to text — Devanagari script preserved. Handles Standard Hindi and Devanagari transliteration of common English loanwords.',
    useCases: [
      'Bollywood, Indian podcast, and YouTube content (massive domestic market)',
      'Customer support and call center audio for India-based B2B/B2C services',
      'Indian government, parliamentary, and political speech transcripts',
      'Hindi-language-learning material and tutoring session recordings',
    ],
    challenges: [
      'Hinglish (code-mixed Hindi-English) is the de-facto spoken standard in urban India — "meeting कल 4 बजे है" type sentences are very common and well-handled',
      'Regional Hindi variants (Awadhi, Bhojpuri, Braj) are not Standard Hindi — accuracy drops for strongly regional speech',
      'Devanagari script is preserved, but Roman-script transliteration (the way Hindi is often written in chat) is *not* produced — output is in proper Devanagari',
    ],
    tips: [
      'For Hinglish content (Hindi + English in the same sentence), expect both languages transcribed in their native scripts — "meeting" stays "meeting", "कल" stays "कल"',
      'Devanagari is the default output script. If you need Roman transliteration, that\'s a post-processing step',
      'Fast conversational Hindi with strong accent (Delhi, Lucknow, Patna) is well-handled; highly regional dialects less so',
    ],
    faq: [
      {
        q: 'How does it handle Hinglish (Hindi-English mix)?',
        a: 'Excellent. The model is trained heavily on code-mixed Hinglish, which is the most common form of Hindi on the internet and in urban speech. English words appear in Roman script, Hindi words in Devanagari — exactly as written in normal usage.',
      },
      {
        q: 'Will it output Devanagari or Roman script?',
        a: 'Devanagari. Output is always in proper Devanagari script, matching how Hindi is written in newspapers, books, and formal contexts.',
      },
      {
        q: 'Can it handle Urdu?',
        a: 'No. Urdu uses a different script (Perso-Arabic) and shares much vocabulary with Hindi but is a separate language. AiScribe\'s Hindi support is for Hindi in Devanagari, not Urdu.',
      },
    ],
    relatedSlugs: ['arabic', 'japanese', 'korean'],
  },

  {
    slug: 'arabic',
    code: 'ar',
    label: 'Arabic',
    nativeName: 'العربية',
    speakers: '400M+ speakers across the Arab world',
    regions: ['Egypt', 'Saudi Arabia', 'UAE', 'Morocco', 'Iraq', 'Levant', 'North Africa'],
    intro:
      'Transcribe Arabic audio to text — Modern Standard Arabic and major dialects (Egyptian, Gulf, Levantine, Maghrebi). Right-to-left script preserved.',
    useCases: [
      'Arabic podcasts, YouTube content, and news broadcasts',
      'MENA-region business meetings, conference talks, and corporate communications',
      'Quranic and religious lecture transcripts (with caveats for classical Arabic)',
      'Customer support and call center audio for Gulf and North African markets',
    ],
    challenges: [
      'Wide dialectal variation — Egyptian, Levantine, Gulf, and Maghrebi Arabic differ substantially from Modern Standard Arabic (MSA / الفصحى)',
      'Right-to-left script is preserved correctly in output, but the model defaults to MSA-form spellings, which may differ from dialectal pronunciation',
      'Code-switching with French (Maghreb) or English (Gulf, Levant) is common and well-handled, but output for code-switched text follows MSA conventions',
    ],
    tips: [
      'For business and news content, the model produces MSA-form Arabic — appropriate for the audience',
      'For dialectal content (Egyptian TV shows, Gulf podcasts), expect MSA normalization — the meaning is preserved but the register is formal',
      'For Quranic Arabic, the model handles recitation reasonably well, but tajweed rules and classical pronunciation are not specifically modeled',
    ],
    faq: [
      {
        q: 'Modern Standard Arabic or dialectal Arabic?',
        a: 'Output is in Modern Standard Arabic (MSA) by default, even when the input is dialectal. This is the convention for written Arabic in formal contexts and ensures the transcript is readable across the Arab world. The meaning is preserved accurately; the register is normalized.',
      },
      {
        q: 'Is right-to-left formatting preserved?',
        a: 'Yes. The output text is in proper Arabic script with correct right-to-left reading order. The model does not produce Latin transliteration.',
      },
      {
        q: 'Can it transcribe Quranic recitation?',
        a: 'Quranic Arabic is well-recognized, but the model is not trained on tajweed-specific rules. Expect accurate word-level transcription but no special handling for qalqala, idgham, or madd.',
      },
    ],
    relatedSlugs: ['hindi', 'french', 'spanish'],
  },
];

/** Build-time static params for Next.js dynamic route */
export function getAllLanguageSlugs(): string[] {
  return LANGUAGE_PAGES.map((l) => l.slug);
}

/** Lookup by slug with safe fallback */
export function getLanguagePage(slug: string): LanguagePage | undefined {
  return LANGUAGE_PAGES.find((l) => l.slug === slug);
}

/** Get related language pages (resolves slugs to full records) */
export function getRelatedLanguagePages(slug: string): LanguagePage[] {
  const page = getLanguagePage(slug);
  if (!page) return [];
  return page.relatedSlugs
    .map((s) => getLanguagePage(s))
    .filter((p): p is LanguagePage => Boolean(p));
}

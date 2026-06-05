import type { MetadataRoute } from 'next';
import { LANGUAGE_PAGES } from '@/lib/languagePages';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://ais.sdad.pro';

/**
 * Dynamic sitemap — Next.js will serve this at /sitemap.xml.
 *
 * Priority is set by page type:
 *   - /                          1.0  (product, top of funnel)
 *   - /transcribe                0.8  (hub, pSEO top of cluster)
 *   - /transcribe/[lang]         0.7  (spokes — equal weight per language)
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const langPages = LANGUAGE_PAGES.map((p) => ({
    url: `${BASE_URL}/transcribe/${p.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/transcribe`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...langPages,
  ];
}

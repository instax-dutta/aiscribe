import type { NextConfig } from 'next';

const securityHeaders = [
  // Prevent MIME-type sniffing
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Disallow embedding in iframes (clickjacking)
  { key: 'X-Frame-Options', value: 'DENY' },
  // Strict referrer policy
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Disable DNS prefetching
  { key: 'X-DNS-Prefetch-Control', value: 'off' },
  // Restrict browser features
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=()',
  },
  // Content-Security-Policy — tightened for this app
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // Next.js inline scripts + hydration
      "script-src 'self' 'unsafe-inline'",
      // Inline styles used by Next.js font injection
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Google Fonts font files
      "font-src 'self' https://fonts.gstatic.com",
      // Only connect to Groq (user API key path) and our own origin
      "connect-src 'self' https://api.groq.com",
      // Audio src uses blob: object URLs
      "media-src 'self' blob:",
      // No objects or embeds
      "object-src 'none'",
      // Disallow framing
      "frame-ancestors 'none'",
      // Only load images from same origin and data URIs (used by SVG favicon)
      "img-src 'self' data:",
      // Enforce HTTPS upgrades
      'upgrade-insecure-requests',
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
  // Compress responses
  compress: true,

  // Strict mode for catching React issues early
  reactStrictMode: true,

  // Power-user: surface all type errors at build time
  typescript: {
    ignoreBuildErrors: false,
  },

  // Apply security headers to every response
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },

  // Remove X-Powered-By header (information disclosure)
  poweredByHeader: false,
};

export default nextConfig;

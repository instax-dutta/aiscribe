'use client';

import { MAX_FREE_USAGE } from '@/lib/constants';

interface FreeUsageBannerProps {
  freeUsageCount: number;
  hasUserKey: boolean;
}

export default function FreeUsageBanner({ freeUsageCount, hasUserKey }: FreeUsageBannerProps) {
  if (hasUserKey) {
    return (
      <div className="usage-bar-wrap" role="status" aria-label="API key status">
        <div className="usage-bar-badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Using your own API key — unlimited transcriptions
        </div>
      </div>
    );
  }

  const pct = Math.min(100, (freeUsageCount / MAX_FREE_USAGE) * 100);
  const remaining = Math.max(0, MAX_FREE_USAGE - freeUsageCount);

  return (
    <div className="usage-bar-wrap" role="status" aria-label={`Free usage: ${freeUsageCount} of ${MAX_FREE_USAGE} used`}>
      <span className="usage-bar-label">
        <strong>{remaining}</strong> free left
      </span>
      <div className="usage-bar-track" aria-hidden="true">
        <div className="usage-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="usage-bar-label" style={{ color: 'var(--text-3)', fontSize: '11px' }}>
        {freeUsageCount}/{MAX_FREE_USAGE}
      </span>
    </div>
  );
}

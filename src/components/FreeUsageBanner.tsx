'use client';

import { MAX_FREE_USAGE } from '@/lib/constants';

interface FreeUsageBannerProps {
  freeUsageCount: number;
  hasUserKey: boolean;
}

export default function FreeUsageBanner({ freeUsageCount, hasUserKey }: FreeUsageBannerProps) {
  if (hasUserKey) {
    return (
      <div id="free-usage-banner">
        <span className="badge" style={{ display: 'inline' }}>Using your API key ✓</span>
      </div>
    );
  }

  const pct = (freeUsageCount / MAX_FREE_USAGE) * 100;

  return (
    <div id="free-usage-banner">
      <span className="label">
        <span className="usage-count">{freeUsageCount}</span> of {MAX_FREE_USAGE} free transcriptions used
      </span>
      <div id="free-progress-track">
        <div id="free-progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

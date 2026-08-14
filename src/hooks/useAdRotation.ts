import { useEffect, useState } from 'react';

const ROTATION_INTERVAL_MS = 2 * 60 * 1000; // 2 minutes

function getIndexForNow(length: number): number {
  return Math.floor(Date.now() / ROTATION_INTERVAL_MS) % length;
}

/**
 * Cycles through a list of ads, advancing to the next one every
 * ROTATION_INTERVAL_MS while the component stays mounted. The index is
 * derived from the current time, so it's naturally consistent across tabs
 * and page reloads without needing any persisted storage.
 */
export function useAdRotation<Ad>(ads: Ad[]): Ad | null {
  const [index, setIndex] = useState(() => (ads.length ? getIndexForNow(ads.length) : 0));

  useEffect(() => {
    if (!ads.length) return;

    const interval = setInterval(() => {
      setIndex(getIndexForNow(ads.length));
    }, ROTATION_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [ads.length]);

  return ads.length ? ads[index] : null;
}

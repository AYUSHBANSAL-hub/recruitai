import { useState, useEffect } from 'react';

export function useBearImages() {
  const [watchBearImages, setWatchBearImages] = useState<string[]>([]);
  const [hideBearImages, setHideBearImages] = useState<string[]>([]);

  useEffect(() => {
    const loadImages = (type: 'watch' | 'hide', count: number) => {
      return Array.from({ length: count }).map((_, i) => `/bear/${type}_bear_${i}.png`);
    };

    // Adjust numbers to match actual available image counts
    setWatchBearImages(loadImages('watch', 21)); // Assuming 21 watch bear images
    setHideBearImages(loadImages('hide', 5)); // Corrected to 5 hide bear images
  }, []);

  return { watchBearImages, hideBearImages };
}

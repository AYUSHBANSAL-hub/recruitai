import { useState, useEffect } from 'react';

type InputFocus = 'EMAIL' | 'PASSWORD';

interface UseBearAnimationProps {
  watchBearImages: string[];
  hideBearImages: string[];
  emailLength: number;
}

export function useBearAnimation({ watchBearImages, hideBearImages, emailLength }: UseBearAnimationProps) {
  const [currentFocus, setCurrentFocus] = useState<InputFocus>('EMAIL');
  const [currentBearImage, setCurrentBearImage] = useState<string | null>(null);

  useEffect(() => {
    if (currentFocus === 'EMAIL' && watchBearImages.length > 0) {
      const progress = Math.min(emailLength / 30, 1);
      const index = Math.floor(progress * (watchBearImages.length - 1));
      setCurrentBearImage(watchBearImages[index]);
    } else if (currentFocus === 'PASSWORD' && hideBearImages.length > 0) {
      hideBearImages.forEach((img, index) => 
        setTimeout(() => setCurrentBearImage(img), index * 40)
      );
    }
  }, [currentFocus, hideBearImages, watchBearImages, emailLength]);

  return {
    currentFocus,
    setCurrentFocus,
    currentBearImage: currentBearImage ?? watchBearImages[0],
  };
}

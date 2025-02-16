import React, { memo } from 'react';

interface BearAvatarProps {
  currentImage: string;
  size?: number;
}

const BearAvatar = memo(function BearAvatar({ currentImage, size = 130 }: BearAvatarProps) {
  return (
    <img
      src={currentImage}
      className="rounded-full transition-all duration-200 ease-in-out"
      width={size}
      height={size}
      alt="Animated bear avatar"
    />
  );
});

export default BearAvatar;

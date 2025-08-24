'use client'

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import React from 'react';
import { useTerminalLocations } from '@entities/locations/context/TerminalLocationsContext';
import { 
  REGION_IMAGES, 
  REGION_TITLE_KEYS, 
  isValidRegionSlug 
} from '@entities/locations/helpers/regions';

// Константы по умолчанию
const DEFAULT_IMAGE = '/background/welcomeTerminal.png';
const DEFAULT_IMAGE_ALT = 'Terminal Background';
const DEFAULT_TITLE_KEY = 'MainTerminal.heroTitle';

/**
 * Автономный компонент баннера с изображением и текстом
 * Автоматически определяет контент в зависимости от выбранного региона
 * 
 * @example
 * ```tsx
 * <HeroBanner />
 * ```
 */
export const HeroBanner: React.FC = () => {
  const t = useTranslations();
  const { currentRegionSlug } = useTerminalLocations();
  
  // Определяем контент на основе текущего региона
  const imageSrc = isValidRegionSlug(currentRegionSlug) 
    ? REGION_IMAGES[currentRegionSlug] 
    : DEFAULT_IMAGE;

  const title = isValidRegionSlug(currentRegionSlug)
    ? t(REGION_TITLE_KEYS[currentRegionSlug])
    : t(DEFAULT_TITLE_KEY);

  return (
    <div className="relative flex items-end justify-center h-full max-h-[384px]">
      {/* Фоновое изображение */}
      <div className="w-full h-full absolute top-0 left-0">
        <Image
          className="w-full h-full object-cover rounded-[32px] p-3"
          src={imageSrc}
          alt={DEFAULT_IMAGE_ALT}
          fill
          quality={100}
          priority
        />
      </div>

      {/* Заголовок */}
      <h2 className="font-decorative relative z-10 text-center text-white font-bold text-[48px] leading-[59px] mb-[60px]">
        {title}
      </h2>
    </div>
  );
};

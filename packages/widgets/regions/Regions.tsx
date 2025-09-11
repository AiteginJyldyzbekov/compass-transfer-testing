'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { useTerminalLocations } from '@entities/locations/context/TerminalLocationsContext';
import { REGIONS } from '@entities/locations/helpers/regions';
import { LocationGroups } from '@widgets/location-groups';

const Regions = () => {
  const t = useTranslations();
  const router = useRouter();
  const { loadLocations } = useTerminalLocations();
  const [selectedCity, setSelectedCity] = useState<string | null>('Бишкек');

  const handleClick = (slug: string) => {
    // Получаем название города из slug
    const cityName = REGIONS(t).find(region => region.slug === slug)?.name;
    if (cityName) {
      setSelectedCity(cityName);
    }
  };

  const handleBack = () => {
    setSelectedCity(null);
  };

  // Если выбран город, показываем группы
  if (selectedCity) {
    return <LocationGroups city={selectedCity} onBack={handleBack} />;
  }

  // Иначе показываем города
  return (
    <div className="w-full max-w-3xl mx-auto flex flex-wrap justify-center gap-x-[16px] gap-y-[22px]">
      {REGIONS(t).map(region => (
        <button
          key={region.slug}
          onClick={() => handleClick(region.slug)}
          className="flex items-end gap-[10px] cursor-pointer relative w-[177px] h-[181px]"
        >
          <Image
            className="w-[177px] h-[181px] absolute top-0 left-0"
            src={region.image}
            alt={region.name}
            width={100}
            height={100}
          />
          <p className="p-3 text-[24px] text-white leading-[118%] font-semibold relative z-10">
            {region.name}
          </p>
        </button>
      ))}
    </div>
  );
};

export default Regions;

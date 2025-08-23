'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React from 'react';
import { APP_ROUTES } from '@shared/api/constants';
import { REGIONS } from '@entities/locations';
import { useTerminalLocations } from '@entities/locations/context';

const Regions = () => {
  const t = useTranslations();
  const router = useRouter();
  const { loadLocations } = useTerminalLocations();

  const handleClick = (slug: string) => {
    // Загружаем локации для региона через контекст
    loadLocations({ regionSlug: slug });
    // Переходим на страницу выбора локаций
    router.push(APP_ROUTES.LOCATIONS.TERMINAL_LOCATION);
  };

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

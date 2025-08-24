import { useTranslations } from 'next-intl';
import React, { lazy, Suspense } from 'react';
import type { GetLocationDTO } from '@entities/locations';
import { useTerminalData } from '@entities/users/context/TerminalDataContext';

// Lazy импорты иконок
const LocationIcon = lazy(() => import('@shared/icons/LocationIcon'));
const ClearIcon = lazy(() => import('@shared/icons/ClearIcon'));

type LocationItemProps = {
  locationName?: string;
  location?: GetLocationDTO;
  handleClick?: () => void;
  disabled?: boolean;
  showDeleteButton?: boolean;
  onDelete?: () => void;
};


const LocationItem = ({ location, locationName, handleClick, disabled, showDeleteButton, onDelete }: LocationItemProps) => {
  const t = useTranslations();
  const { terminalLocation: terminal } = useTerminalData();

  // Не показываем расстояние на главной и странице локаций
  const distance = null;

  return (
    <div
      onClick={handleClick}
      className={`flex gap-[36px] items-center ${disabled ? 'text-start w-full opacity-75' : 'text-start w-full cursor-pointer'}`}
    >
      {/* Иконка для всех элементов (и терминал, и локации) */}
      <Suspense fallback={<div className="w-[42px] h-[42px]" />}>
        <LocationIcon
          size={42}
          className={locationName ? 'text-[#0866FF]' : 'text-[#363538]'}
        />
      </Suspense>
      
      <div className="flex justify-between items-center flex-1">
        {location ? (
          <div className="flex flex-col gap-[2px]">
            <h4 className="text-[32px] text-[#1E1E1E] leading-[150%] font-semibold">
              {location.name}
            </h4>
            <p className="text-[27px] text-[#A3A5AE] leading-[150%]">{location.city}</p>
          </div>
        ) : locationName ? (
          <div className="flex flex-col gap-[2px]">
            <h4 className="text-[32px] text-[#1E1E1E] leading-[150%] font-semibold">
              {terminal?.name}
            </h4>
            <p className="text-[27px] text-[#A3A5AE] leading-[150%]">{terminal?.city || 'Терминал'}</p>
          </div>
        ) : (
          <h4 className="text-[32px] text-[#0866FF] leading-[150%] font-semibold">
            Локация не определена
          </h4>
        )}

        {/* Отображение расстояния или кнопки удаления */}
        {showDeleteButton && onDelete ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="cursor-pointer"
          >
            <Suspense fallback={<div className="w-6 h-6" />}>
              <ClearIcon />
            </Suspense>
          </button>
        ) : distance !== null ? (
          <p className="text-[27px] text-[#A3A5AE] leading-[150%]">
            {Math.round(distance / 1000)} {t('MainTerminal.distanceKm')}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default LocationItem;
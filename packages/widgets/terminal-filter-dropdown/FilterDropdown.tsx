'use client';

import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import { LocationType } from '@entities/locations/enums';
import { locationTypeHelpers } from '@entities/locations/helpers/location-type-helpers';
import { 
  KYRGYZSTAN_ADMINISTRATIVE, 
  getCitiesByRegion, 
  getDistrictsByCity,
  getAllCities
} from './constants/kyrgyzstan-administrative';

export interface FilterState {
  selectedRegions: string[]; // Массив выбранных регионов (slug)
  selectedCities: string[];  // Массив выбранных городов (slug)
  selectedDistricts: string[]; // Массив выбранных районов (slug)
  selectedTypes: LocationType[]; // Массив выбранных типов локации
}

interface FilterDropdownProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onApplyFilters: () => void;
  onReset?: () => void; // Кастомный обработчик сброса
  onCancel?: () => void;
  embedded?: boolean; // Новый пропс для встроенного режима
  className?: string;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  filters,
  onFiltersChange,
  onApplyFilters,
  onReset,
  onCancel,
  embedded = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Закрываем dropdown при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);

      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Проверяем есть ли активные фильтры
  const hasActiveFilters = filters.selectedRegions.length > 0 || 
                          filters.selectedCities.length > 0 || 
                          filters.selectedDistricts.length > 0 ||
                          filters.selectedTypes.length > 0;

  const handleReset = () => {
    if (onReset) {
      // Используем кастомный обработчик сброса
      onReset();
    } else {
      // Стандартное поведение
    const resetFilters: FilterState = {
        selectedRegions: [],
        selectedCities: [],
        selectedDistricts: [],
        selectedTypes: []
    };

    onFiltersChange(resetFilters);
    onApplyFilters();
    }
  };

  const handleApply = () => {
    onApplyFilters();
    if (!embedded) {
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    if (!embedded) {
    setIsOpen(false);
    }
  };

  // Встроенный режим - показываем только содержимое фильтра
  if (embedded) {
    const handleRegionToggle = (regionSlug: string) => {
      const newSelectedRegions = filters.selectedRegions.includes(regionSlug)
        ? filters.selectedRegions.filter(slug => slug !== regionSlug)
        : [...filters.selectedRegions, regionSlug];
      
      onFiltersChange({ ...filters, selectedRegions: newSelectedRegions });
    };

    const handleCityToggle = (citySlug: string) => {
      const newSelectedCities = filters.selectedCities.includes(citySlug)
        ? filters.selectedCities.filter(slug => slug !== citySlug)
        : [...filters.selectedCities, citySlug];
      
      onFiltersChange({ ...filters, selectedCities: newSelectedCities });
    };

    const handleDistrictToggle = (districtSlug: string) => {
      const newSelectedDistricts = filters.selectedDistricts.includes(districtSlug)
        ? filters.selectedDistricts.filter(slug => slug !== districtSlug)
        : [...filters.selectedDistricts, districtSlug];
      
      onFiltersChange({ ...filters, selectedDistricts: newSelectedDistricts });
    };

    const handleTypeToggle = (locationType: LocationType) => {
      const newSelectedTypes = filters.selectedTypes.includes(locationType)
        ? filters.selectedTypes.filter(type => type !== locationType)
        : [...filters.selectedTypes, locationType];
      
      onFiltersChange({ ...filters, selectedTypes: newSelectedTypes });
    };

    // Получаем доступные города на основе выбранных регионов
    const availableCities = filters.selectedRegions.length > 0 
      ? filters.selectedRegions.flatMap(regionSlug => getCitiesByRegion(regionSlug))
      : [];

    // Получаем доступные районы на основе выбранных городов с информацией о городе
    const availableDistricts = filters.selectedCities.length > 0
      ? filters.selectedCities.flatMap(citySlug => {
          const city = getAllCities().find(c => c.slug === citySlug);
          const districts = getDistrictsByCity(citySlug);

          return districts.map(district => ({
            ...district,
            cityName: city?.name || '',
            citySlug: citySlug
          }));
        })
      : [];

    const renderRegions = () => (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
          <h4 className="text-[24px] font-bold text-[#1E1E1E]">
            🌍 Выберите регион
          </h4>
          {hasActiveFilters && (
            <span className="text-[14px] bg-[#0866FF] text-white px-3 py-1 rounded-full font-medium">
              {filters.selectedRegions.length + filters.selectedCities.length + filters.selectedDistricts.length + filters.selectedTypes.length}
            </span>
          )}
        </div>
        <div className="flex flex-row gap-3 overflow-x-auto scrollbar-hide pb-2">
          {KYRGYZSTAN_ADMINISTRATIVE.map(region => {
            const isSelected = filters.selectedRegions.includes(region.slug);

            return (
              <div key={region.slug} className="flex-shrink-0">
                <button
                  onClick={() => handleRegionToggle(region.slug)}
                  className={`relative w-[120px] h-[120px] rounded-xl overflow-hidden transition-all duration-200 ${
                    isSelected 
                      ? 'ring-3 ring-[#0866FF] ring-offset-2' 
                      : 'hover:ring-2 hover:ring-gray-300'
                  } shadow-lg hover:shadow-xl`}
                >
                  <Image
                    className="w-full h-full object-cover"
                    src={region.image}
                    alt={region.name}
                    width={120}
                    height={120}
                  />
                  
                  {/* Галочка в правом верхнем углу */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-[#0866FF] rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Название региона */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                    <p className="text-[12px] text-white font-bold text-center">
                      {region.name}
                    </p>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );

    const renderCities = () => {
      if (availableCities.length === 0) {
        return (
          <div className="flex flex-col gap-4">
            <h4 className="text-[24px] font-bold text-[#1E1E1E] border-b border-gray-200 pb-3">
              🏙️ Города
            </h4>
            <div className="text-center py-8">
              <p className="text-[18px] text-gray-500">
                👆 Сначала выберите регион
              </p>
            </div>
          </div>
        );
      }

      return (
        <div className="flex flex-col gap-4">
          <h4 className="text-[24px] font-bold text-[#1E1E1E] border-b border-gray-200 pb-3">
            🏙️ Города ({availableCities.length})
          </h4>
          <div className="grid grid-cols-3 gap-3 max-h-[300px] overflow-y-auto">
            {availableCities.map(city => {
              const isSelected = filters.selectedCities.includes(city.slug);

              return (
                <button
                  key={city.slug}
                  onClick={() => handleCityToggle(city.slug)}
                  className={`border-2 rounded-xl p-3 transition-all duration-200 text-left ${
                    isSelected 
                      ? 'border-[#0866FF] bg-blue-50 shadow-md' 
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[14px] font-semibold  truncate">{city.name}</span>
                      {isSelected && (
                        <div className="w-5 h-5 bg-[#0866FF] rounded-full flex items-center justify-center flex-shrink-0 ml-1">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <p className="text-[12px] text-gray-500">
                      📍 {city.districts.length} районов
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      );
    };

    const renderDistricts = () => {
      if (availableDistricts.length === 0) {
        return (
          <div className="flex flex-col gap-4">
            <h4 className="text-[24px] font-bold text-[#1E1E1E] border-b border-gray-200 pb-3">
              🏘️ Районы
            </h4>
            <div className="text-center py-8">
              <p className="text-[18px] text-gray-500">
                👆 Сначала выберите город
              </p>
            </div>
          </div>
        );
      }

      return (
        <div className="flex flex-col gap-4">
          <h4 className="text-[24px] font-bold text-[#1E1E1E] border-b border-gray-200 pb-3">
            🏘️ Районы ({availableDistricts.length})
          </h4>
          <div className="grid grid-cols-3 gap-3 max-h-[300px] overflow-y-auto">
            {availableDistricts.map((district) => {
              const isSelected = filters.selectedDistricts.includes(district.slug);
              const uniqueKey = `${district.citySlug}-${district.slug}`;

              return (
                <button
                  key={uniqueKey}
                  onClick={() => handleDistrictToggle(district.slug)}
                  className={`border-2 rounded-xl p-3 transition-all duration-200 text-left ${
                    isSelected 
                      ? 'border-[#0866FF] bg-blue-50 shadow-md' 
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[14px] font-semibold  truncate">{district.name}</span>
                      {isSelected && (
                        <div className="w-5 h-5 bg-[#0866FF] rounded-full flex items-center justify-center flex-shrink-0 ml-1">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <span className="text-[12px] text-gray-500">{district.cityName}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      );
    };

    const renderTypes = () => (
      <div className="flex flex-col gap-4">
        <h4 className="text-[24px] font-bold text-[#1E1E1E] border-b border-gray-200 pb-3">
          🏢 Типы мест
        </h4>
        <div className="grid grid-cols-3 gap-3 max-h-[300px] overflow-y-auto">
          {Object.values(LocationType).map(locationType => {
            const isSelected = filters.selectedTypes.includes(locationType);

            return (
              <button
                key={locationType}
                onClick={() => handleTypeToggle(locationType)}
                className={`border-2 rounded-xl p-3 transition-all duration-200 text-left ${
                  isSelected 
                    ? 'border-[#0866FF] bg-blue-50 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[14px] font-semibold  truncate">{locationTypeHelpers.getLabel(locationType)}</span>
                    {isSelected && (
                      <div className="w-5 h-5 bg-[#0866FF] rounded-full flex items-center justify-center flex-shrink-0 ml-1">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <span className="text-[12px] text-gray-500">{locationType}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
    
    return (
      <div className={`w-full bg-white rounded-2xl shadow-lg ${className}`}>
        <div className="flex flex-col gap-8 p-6">
          {/* Вертикальный layout - все уровни видны одновременно */}
          <div className="flex flex-col gap-8">
            {renderRegions()}
            {renderCities()}
            {renderDistricts()}
            {renderTypes()}
          </div>
            
          {/* Кнопки действий */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            {embedded && onCancel && (
              <button
                onClick={handleCancel}
                className="flex-1 px-6 py-4 text-[16px] font-medium  border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                ❌ Отмена
              </button>
            )}
            <button
              onClick={handleReset}
              className="flex-1 px-6 py-4 text-[16px] font-medium  border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              🔄 Сбросить
            </button>
            <button
              onClick={handleApply}
              className="flex-1 px-6 py-4 text-[16px] font-bold text-white bg-[#0866FF] rounded-xl hover:bg-[#0866FF]/90 transition-colors shadow-lg"
            >
              ✅ Применить
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Обычный dropdown режим - пока не используется
  return null;
}; 
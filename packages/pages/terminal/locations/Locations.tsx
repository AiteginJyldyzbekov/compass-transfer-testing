'use client';

import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React, { useState, useEffect, useCallback } from 'react';
import { useDebounce } from '@shared/hooks/use-debounce';
import { AddIcon, ChevronLeftIcon } from '@shared/icons';
import type { GetLocationDTO } from '@entities/locations';
import { useTerminalLocations, type LoadLocationsParams } from '@entities/locations/context/TerminalLocationsContext';
import { useTerminalData } from '@entities/users/context/TerminalDataContext';
import LocationContainer from '@widgets/location/ui/LocationContainer';
import LocationItem from '@widgets/location/ui/LocationItem';
import { FilterDropdown, type FilterState } from '@widgets/terminal-filter-dropdown';
import { VirtualKeyboard } from '@widgets/virtual-keyboard';
import { FixedLanguageButtons } from '@widgets/header';

export const Locations: NextPage = () => {
  const { terminalLocation: terminal } = useTerminalData();
  const { 
    selectedLocations, 
    addLocation, 
    removeLocation, 
    clearLocations,
    allLocations,
    isLoadingLocations: _isLoadingLocations,
    loadLocations,
    reloadRegionLocations
  } = useTerminalLocations();
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchingLocation, setIsSearchingLocation] = useState<boolean>(true);
  const [isShowingFilter, setIsShowingFilter] = useState<boolean>(false);
  const [showVirtualKeyboard, setShowVirtualKeyboard] = useState<boolean>(false);
  
  // Состояние для фильтров
  const [filters, setFilters] = useState<FilterState>({
    selectedRegions: [],
    selectedCities: [],
    selectedDistricts: [],
    selectedTypes: []
  });

  // Проверяем параметр openKeyboard при загрузке страницы
  useEffect(() => {
    const openKeyboard = searchParams.get('openKeyboard');

    if (openKeyboard === 'true') {
      setShowVirtualKeyboard(true);
    }
  }, [searchParams]);

  // Вычисляем отфильтрованные локации напрямую (как в Main.tsx)
  const displayLocations = allLocations.filter(location => {
    // Исключаем терминал
    if (location.id === terminal?.id) return false;
    
    // Исключаем уже выбранные локации
    if (selectedLocations.some(selected => selected.id === location.id)) return false;
    
    return true;
  });

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Простой обработчик изменения поискового запроса
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Обработчики виртуальной клавиатуры
  const handleVirtualKeyPress = (key: string) => {
    setSearchQuery(prev => prev + key);
  };

  const handleVirtualBackspace = () => {
    setSearchQuery(prev => prev.slice(0, -1));
  };

  const handleVirtualClear = () => {
    setSearchQuery('');
  };

  const handleVirtualKeyboardClose = () => {
    setShowVirtualKeyboard(false);
  };

  // Показываем клавиатуру при клике на поле поиска
  const handleSearchClick = () => {
    setShowVirtualKeyboard(true);
  };

  const handleSelectLocation = (location: GetLocationDTO) => {
    // Проверяем, что локация еще не добавлена
    if (!selectedLocations.some((l: GetLocationDTO) => l.id === location.id)) {
      addLocation(location);
    }
    // После выбора локации скрываем поиск и клавиатуру
    setIsSearchingLocation(false);
    setShowVirtualKeyboard(false);
  };

  const deleteSelectedLocation = (id: string) => {
    removeLocation(id);
    // После удаления поиск появится автоматически если selectedLocations.length === 0
  };

  const handleBack = () => {
    clearLocations();
    setShowVirtualKeyboard(false);
    // Всегда переходим на главную страницу
    router.push('/');
  };

  // Данные уже загружены через контекст при клике на регион

  // Обработчик применения фильтров
  const handleApplyFilters = useCallback(() => {
    const hasFilters = filters.selectedRegions.length > 0 || 
                      filters.selectedCities.length > 0 || 
                      filters.selectedDistricts.length > 0 ||
                      filters.selectedTypes.length > 0;
    
    if (hasFilters) {
      // Применяем фильтры используя прямые параметры API
      const params: LoadLocationsParams = {};
      
      // Используем первый выбранный регион (API принимает string, не массив)
      if (filters.selectedRegions.length > 0) {
        params.region = filters.selectedRegions[0];
      }
      
      // Используем первый выбранный город (API принимает string, не массив)
      if (filters.selectedCities.length > 0) {
        params.city = filters.selectedCities[0];
      }
      
      // Используем первый выбранный район (API принимает string, не массив)
      if (filters.selectedDistricts.length > 0) {
        params.district = filters.selectedDistricts[0];
      }
      
      // Используем первый выбранный тип (API принимает LocationType, не массив)
      if (filters.selectedTypes.length > 0) {
        params.type = filters.selectedTypes[0];
      }
      
      loadLocations(params);
    }
    setIsShowingFilter(false);
  }, [filters.selectedRegions, filters.selectedCities, filters.selectedDistricts, filters.selectedTypes, loadLocations]);

  // Обработчик сброса фильтров
  const handleResetFilters = useCallback(() => {
    // Очищаем фильтры
    setFilters({ 
      selectedRegions: [],
      selectedCities: [],
      selectedDistricts: [],
      selectedTypes: []
    });
    // Восстанавливаем изначальные данные региона
    reloadRegionLocations();
    setIsShowingFilter(false);
  }, [reloadRegionLocations]);

  useEffect(() => {
    // ВАЖНО: загружаем локации только если есть реальный поисковый запрос
    // Пустые строки и строки из одних пробелов игнорируем
    if (debouncedSearchQuery.trim().length > 0) {
      // Поиск по запросу
      loadLocations({ address: debouncedSearchQuery });
    }
  }, [debouncedSearchQuery, loadLocations]);

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto gap-14">
        {/* Выбранные локации */}
        <LocationContainer>
          <LocationItem locationName={terminal?.name} />
          {selectedLocations.map((location: GetLocationDTO) => (
            <React.Fragment key={location.id}>
              <div className="border-b border-gray-200" />
              <LocationItem
                location={location}
                showDeleteButton
                onDelete={() => deleteSelectedLocation(location.id)}
              />
            </React.Fragment>
          ))}
        </LocationContainer>

        {/* Поиск ОТДЕЛЬНО от выбранных локаций */}
        {(selectedLocations.length === 0 || isSearchingLocation) && (
          <LocationContainer>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onClick={handleSearchClick}
              placeholder={t('Locations.searchPlaceholder')}
              className="text-[32px] text-[#1E1E1E] leading-[150%] font-semibold w-full outline-none cursor-pointer"
              readOnly
            />
          </LocationContainer>
        )}

        {/* Список локаций или фильтр */}
        {(selectedLocations.length === 0 || isSearchingLocation) && (
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <h3 className="text-[32px] text-[#090A0B] font-bold leading-[150%]">
                {t('Locations.locationsTitle')}
              </h3>
              
              {/* Кнопка фильтра/списка */}
              <button
                onClick={() => setIsShowingFilter(!isShowingFilter)}
                className="flex items-center gap-2 text-white text-[28px] font-bold bg-blue-500 p-4 rounded-2xl cursor-pointer hover:bg-[#0A205760] transition-colors"
                >
                {isShowingFilter ? 'Список' : 'Фильтр'}
              </button>
            </div>
            
            {/* Показываем либо фильтр, либо список локаций */}
            {isShowingFilter ? (
              <LocationContainer>
                <FilterDropdown
                  filters={filters}
                  onFiltersChange={setFilters}
                  onApplyFilters={handleApplyFilters}
                  onReset={handleResetFilters}
                  onCancel={() => setIsShowingFilter(false)}
                  embedded
                />
              </LocationContainer>
            ) : (
              <LocationContainer 
                className="max-h-[403px] overflow-y-auto scrollbar-hide"
                showEmptyMessage
                emptyMessage="Локации не найдены"
              >
                {displayLocations.map((location, i) => (
                  <React.Fragment key={location.id}>
                    {i > 0 && <div className="border-b border-gray-200" />}
                    <LocationItem
                      handleClick={() => handleSelectLocation(location)}
                      location={location}
                    />
                  </React.Fragment>
                ))}
              </LocationContainer>
            )}
          </div>
        )}

        {/* Кнопка добавления точки */}
        {selectedLocations.length > 0 && !isSearchingLocation && (
          <div className="flex justify-center">
            <button
              onClick={() => setIsSearchingLocation(true)}
              className="h-[92px] px-[40px] flex items-center gap-[14px] bg-gradient-to-r from-[#1943E6] to-[#0866FF] rounded-[100px] cursor-pointer"
            >
              <AddIcon />
              <span className="text-[38px] text-white font-semibold leading-[150%]">
                {t('Locations.addPoint')}
              </span>
            </button>
          </div>
        )}

        {/* Кнопки навигации */}
        <div className="flex gap-[30px]">
          <button
            onClick={handleBack}
            className="w-32 h-32 relative bg-black/30 rounded-[100px] backdrop-blur-md flex items-center justify-center cursor-pointer"
          >
            <ChevronLeftIcon 
              size={40} 
              className="text-white" 
            />
          </button>
          
          {selectedLocations.length > 0 && (
            <Link
              href="/payment"
              className="h-[124px] flex items-center justify-center flex-1 rounded-[100px] bg-gradient-to-r from-[#0053BF] to-[#2F79D8]"
            >
              <span className="text-[46px] text-[#F5F6F7] font-bold leading-[100%]">{t('Locations.goToPayment')}</span>
            </Link>
          )}
        </div>

        {/* Виртуальная клавиатура */}
        {showVirtualKeyboard && (
          <VirtualKeyboard
            onKeyPress={handleVirtualKeyPress}
            onBackspace={handleVirtualBackspace}
            onClear={handleVirtualClear}
            onClose={handleVirtualKeyboardClose}
          />
        )}
      </div>

      {/* Фиксированные кнопки языков и FAQ */}
      <FixedLanguageButtons />
    </div>
  );
};

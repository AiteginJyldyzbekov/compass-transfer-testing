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
import { VirtualKeyboard } from '@widgets/virtual-keyboard';
import clsx from 'clsx';

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
  const [showVirtualKeyboard, setShowVirtualKeyboard] = useState<boolean>(false);


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


  useEffect(() => {
    // ВАЖНО: загружаем локации только если есть реальный поисковый запрос
    // Пустые строки и строки из одних пробелов игнорируем
    if (debouncedSearchQuery.trim().length > 0) {
      // Elastic search по всем полям локации (FTS.Query для автодополнения)
      loadLocations({ searchQuery: debouncedSearchQuery });
    } else {
      // При пустом поиске загружаем все локации региона
      reloadRegionLocations();
    }
  }, [debouncedSearchQuery, loadLocations, reloadRegionLocations]);

  return (
    <>
      <div className="flex flex-col w-full max-w-3xl mx-auto gap-10">
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
        <div className="flex justify-between items-center">
          <h3 className="text-[28px] text-[#090A0B] font-bold leading-[130%]">
            {t('Locations.locationsTitle')}
          </h3>
        </div>
        {(selectedLocations.length === 0 || isSearchingLocation) && (
          <LocationContainer>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onClick={handleSearchClick}
              placeholder={t('Locations.searchPlaceholder')}
              className="text-[32px] text-[#1E1E1E] leading-[150%] font-semibold w-full outline-none cursor-pointer placeholder:text-[#1E1E1E]"
              readOnly
            />
          </LocationContainer>
        )}

        {/* Список локаций */}
        {(selectedLocations.length === 0 || isSearchingLocation) && (
          <div className="flex flex-col gap-3">
            <LocationContainer
              className="max-h-[300px] overflow-y-auto scrollbar-hide"
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
          </div>
        )}

        {/* Кнопка добавления точки */}
        {selectedLocations.length > 0 && !isSearchingLocation && (
          <div className="flex justify-center">
            <button
              onClick={() => setIsSearchingLocation(true)}
              className="h-[80px] px-[35px] flex items-center gap-[12px] bg-gradient-to-r from-[#1943E6] to-[#0866FF] rounded-[100px] cursor-pointer"
            >
              <AddIcon />
              <span className="text-[32px] text-white font-semibold leading-[130%]">
                {t('Locations.addPoint')}
              </span>
            </button>
          </div>
        )}

        {/* Кнопки навигации */}
        <div className="flex gap-[30px]">
          <button
            onClick={handleBack}
            className={clsx(
              // Основные стили контейнера
              'h-32 relative rounded-[100px] backdrop-blur-md flex-1',
              // Цвет фона с прозрачностью #00000059 ≈ bg-black/35
              'bg-black/35',
              // Состояния
              'transition-all duration-200',
              'hover:bg-black/40 active:bg-black/50',
              // Фокус
              'focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-transparent'
            )}
          >
            {/* Иконка стрелки строго слева */}
            <div className="absolute left-16 top-1/2 transform -translate-y-1/2">
              <ChevronLeftIcon
                size={52}
                className="text-white"
              />
            </div>

            {/* Текст по центру */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-3xl font-medium leading-10" style={{ fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif' }}>
              {t('Common.back')}
            </div>
          </button>

          {selectedLocations.length > 0 && (
            <Link
              href="/payment"
              className="h-[124px] flex items-center justify-center flex-1 rounded-[100px] bg-gradient-to-r from-[#0053BF] to-[#2F79D8]"
            >
              <span className="text-3xl text-[#F5F6F7] font-bold leading-[100%]">{t('Locations.goToPayment')}</span>
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
    </>
  );
};

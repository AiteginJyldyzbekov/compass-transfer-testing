'use client';

import type { NextPage } from 'next';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React, { useEffect, useMemo, useState } from 'react';
import { MagnifyingGlassIcon, QuestionCircleIcon } from '@shared/icons';
import { useLanguages } from '@shared/language';
import { useTerminalLocations } from '@entities/locations/context/TerminalLocationsContext';
import type { GetLocationDTO } from '@entities/locations/interface';
import { useTerminalData } from '@entities/users/context/TerminalDataContext';
import { FAQModal } from '@widgets/footer/modal';
import { IdleVideoPlayer } from '@widgets/idle-video-player';
import LocationContainer from '@widgets/location/ui/LocationContainer';
import LocationItem from '@widgets/location/ui/LocationItem';
import Regions from '@widgets/regions/Regions';

export const Main: NextPage = () => {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  
  // Используем хук для работы с языками
  const { languages, handleLanguageChange, currentLanguage } = useLanguages();
  const [showFAQModal, setShowFAQModal] = useState(false);
  const { terminalLocation: terminal } = useTerminalData();
  const { 
    addLocation, 
    clearLocations, 
    allLocations, 
    isLoadingLocations, 
    loadLocations
  } = useTerminalLocations();

  // Мемоизируем отфильтрованные локации для избежания пересчетов
  const displayLocations = useMemo(() => 
    allLocations.filter(location => 
      !(terminal?.id && location.id === terminal.id)
    ), [allLocations, terminal?.id]
  );

  // Обработчик клика по локации из быстрого доступа
  const handleLocationClick = (location: GetLocationDTO) => {    
    if (!terminal) {
      return;
    }
    // Очищаем предыдущие выбранные локации
    clearLocations();
    // Добавляем выбранную локацию в контекст
    addLocation(location as GetLocationDTO);
    // Перенаправляем сразу на оплату
    router.push('/payment');
  };

  // Обработчик клика по кнопке поиска - переход на страницу локаций
  const handleSearchClick = () => {
    router.push('/locations?openKeyboard=true');
  };

  // Обработчик клика по кнопке помощи
  const handleHelpClick = () => {
    setShowFAQModal(true);
  };

  // Инициализация главной страницы (ИСПРАВЛЕНО - избегаем циклических обновлений)
  useEffect(() => {
    // Загружаем популярные локации ТОЛЬКО при первом монтировании главной страницы
    // и ТОЛЬКО если мы действительно на главной странице
    const isMainPage = pathname === '/' || pathname === '';
    
    if (isMainPage) {
      // 1. Очищаем выбранные локации при заходе на главную
      clearLocations();
      
      // 2. Загружаем популярные локации только если их еще нет И мы не в процессе загрузки
      if (allLocations.length === 0 && !isLoadingLocations) {
        loadLocations({ popularOnly: true });
      }
    }
  }, [pathname, clearLocations, loadLocations, isLoadingLocations, allLocations.length]);

  return (
    <div className="w-full flex flex-col gap-[55px]">
      {/* Заголовок и описание */}
      <div className="text-center flex flex-col gap-[10px]">
        <h3 className="text-[32px] text-[#090A0B] leading-[150%] font-bold">
          {t('MainTerminal.welcomeMessage')}
        </h3>
        <p className="text-[24px] text-[#9EA1A8] leading-[130%]">
          {t('MainTerminal.clickRegionMessage')}
        </p>
      </div>

      {/* Регионы */}
      <Regions />

      {/* Кнопка поиска и локации */}
      <div className="flex flex-col gap-[42px] w-full max-w-3xl mx-auto">
        {/* Кнопка поиска */}
        <button
          onClick={handleSearchClick}
          className="h-[100px] flex items-center rounded-[24px] shadow-[0px_52px_74.9px_-31px_rgba(0,19,56,0.15)] bg-[#FFFFFF5C] hover:bg-[#FFFFFF80] transition-colors cursor-pointer"
        >
          <div className="h-full flex-1 flex items-center px-[30px]">
            <span className="text-[32px] text-[#B0B6CE] font-medium">
              {t('MainTerminal.searchPlaceholder')}
            </span>
          </div>
          <div className="pr-[37px]">
            <MagnifyingGlassIcon
              size={32}
              className="text-[#0866FF]"
            />
          </div>
        </button>

        {/* Контейнер локаций */}
        <LocationContainer>
          {displayLocations.length > 0 ? (
            displayLocations.map((item, i) => (
              <React.Fragment key={item.id}>
                {i > 0 && <div className="border-b border-gray-200" />}
                <LocationItem
                  location={item}
                  handleClick={() => handleLocationClick(item as GetLocationDTO)}
                />
              </React.Fragment>
            ))
          ) : (
            <div className="text-center flex flex-col gap-2">
              <p className="text-[24px] text-[#666666]">
                {isLoadingLocations ? 'Загрузка локаций...' : 'Локации не найдены'}
              </p>
              {!isLoadingLocations && (
                <p className="text-[18px] text-[#999999]">
                  Всего локаций: {displayLocations.length || 0}
                </p>
              )}
            </div>
          )}
        </LocationContainer>
      </div>

      {/* Описание такси */}
      <div className="max-w-[600px] mx-auto text-center">
        <span className="text-[24px] text-[#9EA1A8] leading-[130%]">
          {t('MainTerminal.taxiDescription')}
        </span>
      </div>

      {/* Языки и помощь */}
      <div className="flex justify-between pb-4 px-[80px]">
        <div className="flex gap-4">
          {languages.map(item => (
            <button
              onClick={() => handleLanguageChange(item.locale)}
              key={item.locale}
              className={`w-[150px] max-w-[150px] p-4 text-[#FFFFFF] text-[28px] font-bold rounded-2xl flex items-center gap-3 cursor-pointer ${
                item.locale === currentLanguage ? 'bg-[#0047FF]' : 'bg-[#0A205747]'
              }`}
            >
              {/* Флаг языка с оптимизацией */}
              <Image
                src={item.icon}
                alt={`${item.name} flag`}
                width={32}
                height={24}
                className="rounded-sm"
                priority={item.locale === currentLanguage}
                loading={item.locale === currentLanguage ? 'eager' : 'lazy'}
              />
              {item.name}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleHelpClick}
          className="flex items-center gap-2 text-white text-[28px] font-bold bg-[#0A205747] p-4 rounded-2xl cursor-pointer hover:bg-[#0A205760] transition-colors"
        >
          {t('MainTerminal.helpButton')}{' '}
          <QuestionCircleIcon
            size={28}
            className="text-white"
          />
        </button>
      </div>

      {/* IdleVideoPlayer - работает только на главной странице */}
      <IdleVideoPlayer />
      
      {/* FAQ Modal */}
      <FAQModal 
        isOpen={showFAQModal} 
        onClose={() => setShowFAQModal(false)} 
      />
    </div>
  );
};
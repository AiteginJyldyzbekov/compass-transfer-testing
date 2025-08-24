'use client';

import { useRouter, usePathname } from 'next/navigation';
import React, { useState, useCallback, useEffect, type ReactNode } from 'react';
import { locationsApi } from '@shared/api/locations';
import { TerminalLocationsContext, type TerminalLocationsContextType, type LoadLocationsParams } from '@entities/locations/context/TerminalLocationsContext';
import { CITY_MAPPING } from '@entities/locations/helpers/regions';
import type { GetLocationDTO, GetLocationDTOKeysetPaginationResult } from '@entities/locations/interface';
import { useTerminalTariff } from '@entities/tariffs/context/TerminalTariffContext';
import { useTerminalData } from '@entities/users/context/TerminalDataContext';
import { CITY_SLUG_MAPPING, DISTRICT_SLUG_MAPPING } from '@widgets/terminal-filter-dropdown/constants/mappings';

interface TerminalLocationsProviderProps {
  children: ReactNode;
}

/**
 * Провайдер локаций для терминала
 * Загружает популярные локации для главной страницы и все локации по региону для страницы выбора
 * Также проверяет готовность к созданию заказа и делает редирект при отсутствии данных
 */
export const TerminalLocationsProvider: React.FC<TerminalLocationsProviderProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { terminalLocation: terminal, isLoading: isLoadingTerminal } = useTerminalData();
  const { economyTariff, isLoading: isLoadingTariff } = useTerminalTariff();
  
  const [selectedLocations, setSelectedLocations] = useState<GetLocationDTO[]>([]);
  const [allLocations, setAllLocations] = useState<GetLocationDTO[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [locationsError, setLocationsError] = useState<string | null>(null);
  const [lastLoadParams, setLastLoadParams] = useState<LoadLocationsParams | null>(null);
  const [regionParams, setRegionParams] = useState<LoadLocationsParams | null>(null);
  const [currentRegionSlug, setCurrentRegionSlug] = useState<string | null>(null);

  // Проверка готовности к созданию заказа и сброс региона на главной
  useEffect(() => {
    // Проверяем только на страницах кроме главной
    const isMainPage = pathname === '/' || pathname === '';
    
    // Сбрасываем выбранный регион при возврате на главную
    if (isMainPage) {
      setCurrentRegionSlug(null);

      return;
    }

    // Ждем загрузки данных - НЕ делаем редирект пока идет загрузка
    if (isLoadingTerminal || isLoadingTariff) {
      return;
    }
    
    // Проверяем критически важные данные ТОЛЬКО после завершения загрузки
    // И ТОЛЬКО для страницы payment, где данные критичны
    if (pathname === '/payment') {
      if (!terminal || !economyTariff) {
        router.push('/');
      }
    }
    
    // Для других страниц (locations) не делаем принудительный редирект
    // Позволяем пользователю находиться на странице даже без полных данных
  }, [terminal, economyTariff, isLoadingTerminal, isLoadingTariff, pathname, router]);

  // Универсальная загрузка локаций с гибкими параметрами
  const loadLocations = useCallback(async (params?: LoadLocationsParams) => {
    // ЗАЩИТА ОТ ДУБЛИРОВАНИЯ: если уже идет загрузка, не запускаем новую
    if (isLoadingLocations) {
      return;
    }

    // ЗАЩИТА ОТ БЕСКОНЕЧНЫХ ЗАПРОСОВ: проверяем что параметры изменились
    if (lastLoadParams && JSON.stringify(lastLoadParams) === JSON.stringify(params)) {
      return;
    }
    
    setIsLoadingLocations(true);
    setLocationsError(null);
    
    // Сохраняем параметры для возможности восстановления
    if (params) {
      setLastLoadParams(params);
      
      // Если это запрос региона (есть regionSlug или city, но НЕТ address/searchQuery)
      // то сохраняем как regionParams для восстановления при очистке поиска
      if ((params.regionSlug || params.city) && !params.address && !params.searchQuery) {
        setRegionParams(params);
        // Обновляем текущий регион для HeroBanner
        setCurrentRegionSlug(params.regionSlug || null);
      }
    }
    
    try {
      const requestParams: Record<string, unknown> = {
        size: 10,
        isActive: params?.isActive ?? true, // По умолчанию только активные
        ...params?.customFilters, // Позволяет передать любые дополнительные фильтры
      };

      // Фильтр популярных локаций (для обратной совместимости)
      if (params?.popularOnly) {
        requestParams.popular1 = true;
      }

      // Все параметры API
      if (params?.type) requestParams.type = params.type;
      
      // Фильтр по типам локации (из фильтра)
      if (params?.customFilters?.locationTypes && Array.isArray(params.customFilters.locationTypes)) {
        if (params.customFilters.locationTypes.length > 0) {
          requestParams.type = params.customFilters.locationTypes;
        }
      }
      if (params?.name) requestParams.name = params.name;
      if (params?.address) requestParams.address = params.address;
      if (params?.district) requestParams.district = params.district;
      if (params?.city) requestParams.city = params.city;
      if (params?.country) requestParams.country = params.country;
      if (params?.region) requestParams.region = params.region;
      if (params?.latitude !== undefined) requestParams.latitude = params.latitude;
      if (params?.longitude !== undefined) requestParams.longitude = params.longitude;
      if (params?.popular1 !== undefined) requestParams.popular1 = params.popular1;
      if (params?.popular2 !== undefined) requestParams.popular2 = params.popular2;

      // Фильтр по региону (для обратной совместимости с regionSlug)
      if (params?.regionSlug && !params?.city) {
        const cityName = CITY_MAPPING[params.regionSlug as keyof typeof CITY_MAPPING] || params.regionSlug;

        requestParams.city = cityName;
      }

      // Фильтр по множественным регионам (из фильтра)
      if (params?.customFilters?.regionSlugs && Array.isArray(params.customFilters.regionSlugs)) {
        const cityNames = params.customFilters.regionSlugs.map((slug: string) => 
          CITY_MAPPING[slug as keyof typeof CITY_MAPPING] || slug
        );

        // Теперь API поддерживает массивы городов!
        if (cityNames.length > 0) {
          requestParams.city = cityNames;
        }
      }

      // Фильтр по множественным городам
      if (params?.customFilters?.citySlugs && Array.isArray(params.customFilters.citySlugs)) {
        // Теперь API поддерживает массивы городов!
        if (params.customFilters.citySlugs.length > 0) {
          const cityNames = params.customFilters.citySlugs.map((citySlug: string) => 
            CITY_SLUG_MAPPING[citySlug] || citySlug
          );

          requestParams.city = cityNames;
        }
      }

      // Фильтр по множественным районам
      if (params?.customFilters?.districtSlugs && Array.isArray(params.customFilters.districtSlugs)) {
        // Теперь API поддерживает массивы районов!
        if (params.customFilters.districtSlugs.length > 0) {
          const districtNames = params.customFilters.districtSlugs.map((districtSlug: string) => 
            DISTRICT_SLUG_MAPPING[districtSlug] || districtSlug
          );

          requestParams.district = districtNames;
        }
      }

      // Поиск по адресу (для обратной совместимости с searchQuery)
      if (params?.searchQuery && params.searchQuery.trim() && !params?.address) {
        requestParams.address = params.searchQuery;
      }

      const result: GetLocationDTOKeysetPaginationResult = await locationsApi.getLocations(requestParams);
      const locations = result.data || [];

      setAllLocations(locations);
      

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки локаций';

      setLocationsError(errorMessage);
    } finally {
      setIsLoadingLocations(false);
    }
  }, [isLoadingLocations, lastLoadParams]);

  // Поиск локаций (клиентская фильтрация)
  const searchLocations = useCallback(async (query: string): Promise<GetLocationDTO[]> => {
    if (!query.trim()) {
      return allLocations;
    }
    
    const searchTerm = query.toLowerCase();

    return allLocations.filter(location => 
      location.name?.toLowerCase().includes(searchTerm) ||
      location.address?.toLowerCase().includes(searchTerm)
    );
  }, [allLocations]);

  // Получить локацию по ID из загруженных
  const getLocationById = useCallback((id: string): GetLocationDTO | undefined => {
    return allLocations.find(location => location.id === id);
  }, [allLocations]);

  // Получить локацию по ID через сервис (если не найдена в кэше)
  const fetchLocationById = useCallback(async (id: string): Promise<GetLocationDTO | null> => {
    try {
      // Сначала проверяем в кэше
      const cachedLocation = getLocationById(id);

      if (cachedLocation) {
        return cachedLocation;
      }
      const location = await locationsApi.getLocationById(id);

      return location;
    } catch {
      return null;
    }
  }, [getLocationById]);

  // Добавить локацию в выбранные
  const addLocation = useCallback((location: GetLocationDTO) => {
    setSelectedLocations(prev => {
      // Проверяем, что локация еще не добавлена
      if (prev.some(l => l.id === location.id)) {
        return prev;
      }

      return [...prev, location];
    });
  }, []);

  // Удалить локацию из выбранных
  const removeLocation = useCallback((locationId: string) => {
    setSelectedLocations(prev => prev.filter(l => l.id !== locationId));
  }, []);

  // Очистить все выбранные локации
  const clearLocations = useCallback(() => {
    setSelectedLocations([]);
  }, []);

  // Восстановить последнюю загрузку (для очистки поиска)
  const reloadLastLocations = useCallback(async () => {
    if (lastLoadParams) {
      await loadLocations(lastLoadParams);
    }
  }, [lastLoadParams, loadLocations]);

  // Восстановить изначальные параметры региона (для очистки поиска)
  const reloadRegionLocations = useCallback(async () => {
    if (regionParams) {
      await loadLocations(regionParams);
    }
  }, [regionParams, loadLocations]);

      const value: TerminalLocationsContextType = {
      selectedLocations,
      addLocation,
      removeLocation,
      clearLocations,
      allLocations,
      isLoadingLocations,
      locationsError,
      currentRegionSlug,
      searchLocations,
      getLocationById,
      fetchLocationById,
      // Универсальная функция для загрузки локаций
      loadLocations,
      // Восстановление последней загрузки
      reloadLastLocations,
      // Восстановление изначальных параметров региона
      reloadRegionLocations,
    };

  return (
    <TerminalLocationsContext.Provider value={value}>
      {children}
    </TerminalLocationsContext.Provider>
  );
}; 
'use client';

import { createContext, useContext } from 'react';
import type { LocationType } from '@entities/locations/enums/LocationType.enum';
import type { GetLocationDTO } from '@entities/locations/interface';

// Параметры для загрузки локаций
export interface LoadLocationsParams {
  // Основные фильтры
  regionSlug?: string;
  searchQuery?: string; // Используется для FTS.Query (elastic search)
  popularOnly?: boolean;
  
  // Все доступные параметры API
  type?: LocationType;
  name?: string;
  address?: string; // Точный поиск по адресу
  district?: string;
  city?: string;
  country?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  isActive?: boolean;
  popular1?: boolean;
  popular2?: boolean;
  
  // Elastic search параметры
  'FTS.Query'?: string; // Полнотекстовый поиск для автодополнения
  'FTS.Plain'?: string; // Простой полнотекстовый поиск
  
  // Для дополнительных параметров (если появятся новые)
  customFilters?: Record<string, unknown>;
}

export interface TerminalLocationsContextType {
  // Выбранные локации для заказа
  selectedLocations: GetLocationDTO[];
  
  // Методы для управления выбранными локациями
  addLocation: (location: GetLocationDTO) => void;
  removeLocation: (locationId: string) => void;
  clearLocations: () => void;
  
  // Данные из хука useLocations
  allLocations: GetLocationDTO[];
  isLoadingLocations: boolean;
  locationsError: string | null;
  
  // Текущий выбранный регион для отображения в HeroBanner
  currentRegionSlug: string | null;
  
  // Методы поиска (локальная фильтрация)
  searchLocations: (query: string) => Promise<GetLocationDTO[]>;
  getLocationById: (id: string) => GetLocationDTO | undefined;
  fetchLocationById: (id: string) => Promise<GetLocationDTO | null>;
  
  // Универсальная загрузка локаций с гибкими параметрами
  loadLocations: (params?: LoadLocationsParams) => Promise<void>;
  
  // Восстановить последнюю загрузку (для очистки поиска)
  reloadLastLocations: () => Promise<void>;
  
  // Восстановить изначальные параметры региона (для очистки поиска)
  reloadRegionLocations: () => Promise<void>;
}

export const TerminalLocationsContext = createContext<TerminalLocationsContextType>({
  selectedLocations: [],
  addLocation: () => {},
  removeLocation: () => {},
  clearLocations: () => {},
  allLocations: [],
  isLoadingLocations: false,
  locationsError: null,
  currentRegionSlug: null,
  searchLocations: async () => [],
  getLocationById: () => undefined,
  fetchLocationById: async () => null,
  loadLocations: async (_params?: LoadLocationsParams) => {},
  reloadLastLocations: async () => {},
  reloadRegionLocations: async () => {},
});

export const useTerminalLocations = () => useContext(TerminalLocationsContext);

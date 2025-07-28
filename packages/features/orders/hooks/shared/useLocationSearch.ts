'use client';

import { useState, useCallback } from 'react';
import { locationsApi } from '@shared/api/locations';
import { logger } from '@shared/lib/logger';
import type { GetLocationDTO } from '@entities/locations/interface';

/**
 * Хук для поиска и выбора локаций
 * SRP: отвечает только за логику поиска локаций
 */
export const useLocationSearch = (selectedLocations: GetLocationDTO[] = []) => {
  // Простая реализация поиска локаций
  const [isLoading, setIsLoading] = useState(false);

  const searchLocations = useCallback(async (query: string): Promise<GetLocationDTO[]> => {
    try {
      setIsLoading(true);
      const response = await locationsApi.searchLocations(query);

      return response || [];
    } catch (error) {
      logger.error('Ошибка поиска локаций:', error);

      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);
  // Состояние для селектора локаций
  const [activePointIndex, setActivePointIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GetLocationDTO[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  // Функция для фильтрации доступных локаций (исключаем уже выбранные)
  const getAvailableLocations = (allLocations: GetLocationDTO[]): GetLocationDTO[] => {
    const selectedLocationIds = selectedLocations.map(loc => loc.id);

    return allLocations.filter(location => !selectedLocationIds.includes(location.id));
  };

  /**
   * Обработчик поиска локаций
   */
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
    try {
      const allResults = await searchLocations(query.trim());
      const availableResults = getAvailableLocations(allResults);

      setSearchResults(availableResults);
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };
  /**
   * Открыть селектор для выбора локации
   */
  const openLocationSelector = async (pointIndex: number) => {
    setActivePointIndex(pointIndex);
    setSearchQuery('');
    setIsSearching(true);

    try {
      // Загружаем локации через поиск (пустой запрос = все локации)
      const allLocations = await searchLocations('');
      const availableLocations = getAvailableLocations(allLocations);

      setSearchResults(availableLocations);
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };
  /**
   * Добавить дополнительную точку - сразу открывает селектор
   */
  const addAdditionalPoint = async () => {
    // Устанавливаем специальный индекс для создания новой точки
    setActivePointIndex(-1); // -1 означает создание новой точки
    setSearchQuery('');
    setIsSearching(true);

    try {
      // Загружаем локации через поиск (пустой запрос = все локации)
      const allLocations = await searchLocations('');
      const availableLocations = getAvailableLocations(allLocations);

      setSearchResults(availableLocations);
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };
  /**
   * Закрыть селектор
   */
  const closeLocationSelector = () => {
    setActivePointIndex(null);
    setSearchQuery('');
    setSearchResults([]);
  };

  return {
    activePointIndex,
    searchQuery,
    searchResults,
    isSearching: isSearching || isLoading,
    handleSearch,
    openLocationSelector,
    addAdditionalPoint,
    closeLocationSelector,
  };
};

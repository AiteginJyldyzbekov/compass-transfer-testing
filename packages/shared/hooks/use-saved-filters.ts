'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';

interface SavedFiltersConfig<T> {
  key: string; // Уникальный ключ для localStorage (например, 'cars-filters')
  defaultFilters: T;
  currentFilters: T;
  onFiltersLoad: (filters: T) => void;
}

export function useSavedFilters<T extends Record<string, unknown>>({
  key,
  defaultFilters,
  currentFilters,
  onFiltersLoad,
}: SavedFiltersConfig<T>) {
  const [hasSaved, setHasSaved] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Используем ref для стабильной ссылки на onFiltersLoad
  const onFiltersLoadRef = useRef(onFiltersLoad);

  onFiltersLoadRef.current = onFiltersLoad;

  // Загрузка фильтров при инициализации (только один раз)
  useEffect(() => {
    if (isInitialized) return;

    try {
      const savedFilters = localStorage.getItem(key);

      if (savedFilters) {
        const parsedFilters = JSON.parse(savedFilters);
        // Объединяем сохраненные фильтры с дефолтными (на случай если структура изменилась)
        const mergedFilters = { ...defaultFilters, ...parsedFilters };

        onFiltersLoadRef.current(mergedFilters);
        setHasSaved(true);
      } else {
        setHasSaved(false);
      }
    } catch {
      toast.error(`Ошибка при загрузке сохраненных фильтров для ${key}:`);
      setHasSaved(false);
    }

    setIsInitialized(true);
  }, [key, defaultFilters, isInitialized]);

  // Сохранение текущих фильтров
  const saveFilters = useCallback(() => {
    try {
      // Фильтруем только значимые фильтры (не пустые строки, не пустые массивы)
      const filtersToSave = Object.entries(currentFilters).reduce((acc, [filterKey, value]) => {
        // Сохраняем только непустые значения
        if (value !== '' && value !== null && value !== undefined) {
          if (Array.isArray(value) && value.length > 0) {
            acc[filterKey] = value;
          } else if (!Array.isArray(value)) {
            acc[filterKey] = value;
          }
        }

        return acc;
      }, {} as Record<string, unknown>);

      localStorage.setItem(key, JSON.stringify(filtersToSave));

      // Обновляем состояние
      setHasSaved(true);
      setJustSaved(true);

      // Убираем индикацию "только что сохранено" через 2 секунды
      setTimeout(() => setJustSaved(false), 2000);

      // Показываем уведомление об успешном сохранении
      // Можно заменить на toast уведомление
      toast.success(`Фильтры сохранены для ${key}`);

      return true;
    } catch {
      toast.error(`Ошибка при сохранении фильтров для ${key}:`);

      return false;
    }
  }, [key, currentFilters]);

  // Очистка сохраненных фильтров
  const clearSavedFilters = useCallback(() => {
    try {
      localStorage.removeItem(key);
      onFiltersLoadRef.current(defaultFilters);
      setHasSaved(false);
      setJustSaved(false);

      return true;
    } catch {
      toast.error(`Ошибка при очистке сохраненных фильтров для ${key}:`);

      return false;
    }
  }, [key, defaultFilters]);

  // Проверка наличия сохраненных фильтров
  const hasSavedFilters = useCallback(() => {
    try {
      const savedFilters = localStorage.getItem(key);

      return savedFilters !== null;
    } catch {
      return false;
    }
  }, [key]);

  return {
    saveFilters,
    clearSavedFilters,
    hasSavedFilters,
    hasSaved,
    justSaved,
  };
}

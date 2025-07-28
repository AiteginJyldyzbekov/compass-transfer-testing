'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { usersApi } from '@shared/api/users';
import { logger } from '@shared/lib/logger';
import type { GetTariffDTO } from '@entities/tariffs/interface';
import type { GetDriverDTO } from '@entities/users/interface';

/**
 * Хук для выбора водителей с валидацией и поиском
 * SRP: отвечает только за логику выбора, поиска и валидации водителей
 * ✅ ДОБАВЛЕНО: Фильтрация по типу автомобиля из тарифа
 */
export const useDriverSelection = (
  selectedDriverId?: string,
  onDriverSelect?: (driverOrId: GetDriverDTO | string) => void,
  selectedTariff?: GetTariffDTO | null,
) => {
  // Простая реализация состояния водителей
  const [drivers, setDrivers] = useState<GetDriverDTO[]>([]);

  // Простые функции для работы с водителями
  const getDriverById = useCallback((id: string) => {
    return drivers.find(driver => driver.id === id) || null;
  }, [drivers]);

  const searchDrivers = useCallback(async (query: string): Promise<GetDriverDTO[]> => {
    // Простой поиск по имени
    return drivers.filter(driver =>
      driver.fullName.toLowerCase().includes(query.toLowerCase())
    );
  }, [drivers]);

  // Загрузка водителей при инициализации
  useEffect(() => {
    const loadDrivers = async () => {
      try {
        const response = await usersApi.getDrivers({
          first: true,
          size: 100,
        });
        
        setDrivers(response.data);
      } catch (error) {
        logger.error('Ошибка загрузки водителей:', error);
      }
    };

    loadDrivers();
  }, []);
  // Состояние для панели водителей
  const [isDriverListExpanded, setIsDriverListExpanded] = useState(false); // Список водителей закрыт по умолчанию
  const [driverSearchQuery, setDriverSearchQuery] = useState('');
  const [driverSearchResults, setDriverSearchResults] = useState<GetDriverDTO[]>([]);
  const [isDriverSearching, setIsDriverSearching] = useState(false);
  const isInitialized = useRef(false);

  /**
   * Фильтрует водителей по типу автомобиля из тарифа
   * ✅ НОВОЕ: Фильтрация по carType
   */
  const filterDriversByTariff = useCallback(
    (driversToFilter: GetDriverDTO[]) => {
      if (!selectedTariff?.carType) {
        // Если тариф не выбран или у него нет типа автомобиля, возвращаем всех
        return driversToFilter;
      }

      return driversToFilter.filter(driver => {
        // Проверяем тип автомобиля водителя
        const carType = driver.activeCar?.type;

        // Если у водителя нет информации об автомобиле, не показываем его
        if (!carType) {
          return false;
        }

        // Сравниваем тип автомобиля с типом из тарифа
        return carType === selectedTariff.carType;
      });
    },
    [selectedTariff?.carType],
  );

  /**
   * Сортирует водителей так, чтобы выбранный был сверху
   */
  const sortDriversWithSelectedFirst = useCallback(
    (driversToSort: GetDriverDTO[]) => {
      if (!selectedDriverId) return driversToSort;
      const selectedDriver = driversToSort.find(d => d.id === selectedDriverId);
      const otherDrivers = driversToSort.filter(d => d.id !== selectedDriverId);

      return selectedDriver ? [selectedDriver, ...otherDrivers] : driversToSort;
    },
    [selectedDriverId],
  );

  // ✅ ИСПРАВЛЕНИЕ: Стабильные ссылки на функции
  const sortDriversWithSelectedFirstRef = useRef(sortDriversWithSelectedFirst);
  const filterDriversByTariffRef = useRef(filterDriversByTariff);

  sortDriversWithSelectedFirstRef.current = sortDriversWithSelectedFirst;
  filterDriversByTariffRef.current = filterDriversByTariff;

  /**
   * Обработчик поиска водителей
   */
  const handleDriverSearch = useCallback(
    async (query: string) => {
      setDriverSearchQuery(query);
      // Если начинаем поиск, автоматически раскрываем список
      if (query.trim() && !isDriverListExpanded) {
        setIsDriverListExpanded(true);
      }
      setIsDriverSearching(true);
      try {
        let results: GetDriverDTO[];

        if (!query.trim()) {
          // Если запрос пустой, показываем всех водителей
          results = drivers;
        } else {
          // Ищем по запросу
          results = await searchDrivers(query);
          // ВАЖНО: Если есть выбранный водитель, добавляем его в результаты поиска
          // даже если он не соответствует запросу, чтобы пользователь не потерял выбор
          if (selectedDriverId) {
            const selectedDriver = getDriverById(selectedDriverId);

            if (selectedDriver && !results.find(d => d.id === selectedDriverId)) {
              // Добавляем выбранного водителя в начало списка
              results = [selectedDriver, ...results];
            }
          }
        }

        // ✅ НОВОЕ: Фильтруем по типу автомобиля из тарифа
        const filteredResults = filterDriversByTariffRef.current(results);

        // Сортируем так, чтобы выбранный водитель был сверху
        const sortedResults = sortDriversWithSelectedFirstRef.current(filteredResults);

        setDriverSearchResults(sortedResults);
      } catch (error) {
        logger.error('Ошибка при поиске водителей:', error);
        // Даже при ошибке показываем выбранного водителя, если он есть
        if (selectedDriverId) {
          const selectedDriver = getDriverById(selectedDriverId);

          setDriverSearchResults(selectedDriver ? [selectedDriver] : []);
        } else {
          setDriverSearchResults([]);
        }
      } finally {
        setIsDriverSearching(false);
      }
    },
    [drivers, searchDrivers, selectedDriverId, getDriverById, isDriverListExpanded], // ✅ Убираем sortDriversWithSelectedFirst и filterDriversByTariff
  );

  // ✅ ИСПРАВЛЕНИЕ: Стабильная ссылка на handleDriverSearch
  const handleDriverSearchRef = useRef(handleDriverSearch);

  handleDriverSearchRef.current = handleDriverSearch;

  // ✅ ИСПРАВЛЕНИЕ: Убираем handleDriverSearch из зависимостей
  useEffect(() => {
    if (drivers.length > 0 && !isInitialized.current) {
      handleDriverSearchRef.current('');
      isInitialized.current = true;
    }
  }, [drivers.length]); // ✅ Убираем handleDriverSearch

  // ✅ ИСПРАВЛЕНИЕ: Убираем sortDriversWithSelectedFirst из зависимостей
  useEffect(() => {
    if (drivers.length > 0) {
      // ✅ НОВОЕ: Сначала фильтруем по тарифу, потом сортируем
      const filteredDrivers = filterDriversByTariffRef.current(drivers);
      const sortedDrivers = sortDriversWithSelectedFirstRef.current(filteredDrivers);

      setDriverSearchResults(sortedDrivers);
    } else {
      // Если водителей нет, очищаем результаты поиска
      setDriverSearchResults([]);
    }
  }, [drivers, selectedDriverId, selectedTariff?.carType]); // ✅ Добавляем selectedTariff?.carType

  /**
   * Выбор водителя (внутренняя функция)
   */
  const selectDriver = useCallback(
    (driverOrId: GetDriverDTO | string) => {
      // Если передана пустая строка - это отписка от водителя
      if (driverOrId === '' || driverOrId === null || driverOrId === undefined) {
        onDriverSelect?.('');

        return;
      }
      // Если передан объект водителя
      if (typeof driverOrId === 'object' && driverOrId?.id) {
        const driver = driverOrId;

        // ✅ ИСПРАВЛЕНИЕ: ВСЕГДА выбираем водителя, даже если он уже выбран
        // Это нужно для режима редактирования, чтобы можно было "переустановить" водителя
        logger.info('🎯 selectDriver: выбираем водителя', driver.fullName, driver.id);
        onDriverSelect?.(driver);
        setIsDriverListExpanded(false);
      } else {
        // Если передан ID (для обратной совместимости)
        const driverId = driverOrId as string;

        // ✅ ИСПРАВЛЕНИЕ: ВСЕГДА выбираем водителя по ID
        logger.info('🎯 selectDriver: выбираем водителя по ID', driverId);
        onDriverSelect?.(driverId);
        setIsDriverListExpanded(false);
      }
    },
    [onDriverSelect], // ✅ Убираем selectedDriverId из зависимостей
  );

  /**
   * Обработчик выбора водителя с валидацией
   */
  const handleDriverSelection = useCallback(
    (driver: GetDriverDTO | string) => {
      // Если передана пустая строка - это отписка от водителя
      if (driver === '' || driver === null || driver === undefined) {
        onDriverSelect?.('');

        return;
      }
      // Если передан объект водителя
      if (typeof driver === 'object') {
        // Проверяем, есть ли у водителя автомобиль (activeCar или activeCarId)
        if (!driver.activeCar && !driver.activeCarId) {
          logger.error('Нельзя выбрать водителя без автомобиля');

          return;
        }
        // Если водитель не онлайн, показываем предупреждение
        if (!driver.online && !driver.isAvailable) {
          logger.warn('Водитель не в сети, но вы можете его выбрать');
        }
      }
      // Выбираем водителя - передаем объект, а не только ID
      selectDriver(driver);
    },
    [selectDriver, onDriverSelect],
  );

  // Убеждаемся, что выбранный водитель всегда есть в списке для отображения
  const driversWithSelected = useCallback(() => {
    if (!selectedDriverId) return driverSearchResults;
    // Проверяем, есть ли выбранный водитель в текущих результатах
    const hasSelectedDriver = driverSearchResults.some(d => d.id === selectedDriverId);

    if (hasSelectedDriver) {
      return driverSearchResults;
    }
    // Если выбранного водителя нет в результатах, добавляем его
    const selectedDriver = getDriverById(selectedDriverId);

    if (selectedDriver) {
      return [selectedDriver, ...driverSearchResults];
    }

    return driverSearchResults;
  }, [driverSearchResults, selectedDriverId, getDriverById]);

  return {
    drivers: driversWithSelected(), // Возвращаем водителей с гарантированным включением выбранного
    getDriverById,
    isDriverListExpanded,
    setIsDriverListExpanded,
    driverSearchQuery,
    isDriverSearching,
    handleDriverSearch,
    handleDriverSelection,
  };
};

'use client';

import { useEffect, useRef } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { tariffsApi } from '@shared/api/tariffs';
import { usersApi } from '@shared/api/users';
import { logger } from '@shared/lib/logger';
import type { GetLocationDTO } from '@entities/locations/interface';
import type { GetScheduledOrderDTO } from '@entities/orders/interface';
import type { CreateScheduledOrderDTOType } from '@entities/orders/schemas';
import type { GetTariffDTO } from '@entities/tariffs/interface';
import type { GetDriverDTO } from '@entities/users/interface';

// Временные типы
type RouteMode = 'manual' | 'template';

export interface UseScheduledOrderInitializationProps {
  mode: 'create' | 'edit';
  orderData: CreateScheduledOrderDTOType | null;
  rawOrderData: GetScheduledOrderDTO | null;
  tariffs: GetTariffDTO[];
  selectedTariff: GetTariffDTO | null;
  routeMode: RouteMode;
  hasMainPartner: boolean;
  stableOrderLocations: GetLocationDTO[];
  isLocationsInitialized: { current: boolean };
  isDataInitialized: { current: boolean };
  methods: UseFormReturn<CreateScheduledOrderDTOType>;
  setSelectedTariff: (tariff: GetTariffDTO | null) => void;
  setRouteLocations: (locations: GetLocationDTO[]) => void;
  setSelectedRouteId: (id: string) => void;
  setRouteMode: (mode: RouteMode) => void;
  setSelectedDriverId: (id: string) => void;
}

/**
 * Логика инициализации для ScheduledOrderForm
 * Обрабатывает автовыбор тарифа, инициализацию при редактировании и переключение режимов
 */
export const useScheduledOrderInitialization = ({
  mode,
  orderData,
  rawOrderData,
  tariffs,
  selectedTariff,
  routeMode,
  hasMainPartner,
  stableOrderLocations,
  isLocationsInitialized,
  isDataInitialized,
  methods,
  setSelectedTariff,
  setRouteLocations,
  setSelectedRouteId,
  setRouteMode,
  setSelectedDriverId,
}: UseScheduledOrderInitializationProps) => {
  // ✅ ИСПРАВЛЕНИЕ: Стабильные ссылки на функции
  const setSelectedTariffRef = useRef(setSelectedTariff);
  const setRouteLocationsRef = useRef(setRouteLocations);
  const setSelectedRouteIdRef = useRef(setSelectedRouteId);
  const setRouteModeRef = useRef(setRouteMode);
  const setSelectedDriverIdRef = useRef(setSelectedDriverId);

  setSelectedTariffRef.current = setSelectedTariff;
  setRouteLocationsRef.current = setRouteLocations;
  setSelectedRouteIdRef.current = setSelectedRouteId;
  setRouteModeRef.current = setRouteMode;
  setSelectedDriverIdRef.current = setSelectedDriverId;

  // ✅ ИСПРАВЛЕНИЕ: Стабильные ключи для объектов
  const orderDataKey = orderData ? `${orderData.tariffId}-${mode}` : null;
  const rawOrderDataKey = rawOrderData
    ? `${rawOrderData.id}-${rawOrderData.rides?.length || 0}`
    : null;
  const locationsKey = stableOrderLocations.map(loc => loc?.id).join(',');
  const selectedTariffKey = selectedTariff?.id || null;

  // === СБРОС ФЛАГОВ ПРИ ИЗМЕНЕНИИ РЕЖИМА/ID ===
  useEffect(() => {
    isLocationsInitialized.current = false;
    isDataInitialized.current = false;
  }, [mode, orderDataKey, isLocationsInitialized, isDataInitialized]); // Используем стабильный ключ

  // === ИНИЦИАЛИЗАЦИЯ ЛОКАЦИЙ В РЕЖИМЕ РЕДАКТИРОВАНИЯ ===
  useEffect(() => {
    if (mode === 'edit' && stableOrderLocations.length > 0 && !isLocationsInitialized.current) {
      setRouteLocationsRef.current([...stableOrderLocations]);
      isLocationsInitialized.current = true;
    }
  }, [mode, stableOrderLocations, locationsKey, isLocationsInitialized]); // Используем стабильные ключи

  // === АВТОМАТИЧЕСКИЙ ВЫБОР ПЕРВОГО ТАРИФА ПРИ СОЗДАНИИ ===
  useEffect(() => {
    if (mode === 'create' && tariffs.length > 0 && !selectedTariff) {
      const firstTariff = tariffs[0];

      setSelectedTariffRef.current(firstTariff);
      methods.setValue('tariffId', firstTariff.id);
    }
  }, [mode, tariffs, selectedTariff, selectedTariffKey]); // Убираем methods из зависимостей

  // === ИНИЦИАЛИЗАЦИЯ ДАННЫХ ПРИ РЕДАКТИРОВАНИИ ===
  useEffect(() => {
    if (orderData && rawOrderData && mode === 'edit' && !isDataInitialized.current) {
      // ✅ ИСПРАВЛЕНИЕ: Улучшенная инициализация тарифа
      if (orderData.tariffId) {
        const tariffIdToUse = rawOrderData.tariffId || orderData.tariffId;
        const tariff = tariffs.find(t => t.id === tariffIdToUse);

        if (tariff) {
          setSelectedTariffRef.current(tariff);
          methods.setValue('tariffId', tariffIdToUse);
        } else {
          // Загружаем тариф отдельно
          tariffsApi
            .getTariffById(tariffIdToUse)
            .then((loadedTariff: GetTariffDTO) => {
              logger.info('✅ Тариф загружен отдельно:', loadedTariff);
              setSelectedTariffRef.current(loadedTariff as GetTariffDTO);
              methods.setValue('tariffId', tariffIdToUse);
            })
            .catch((error: unknown) => {
              logger.error('❌ Ошибка загрузки тарифа:', error);
            });
        }
      } else {
        logger.warn('⚠️ tariffId не найдено в orderData');
      }

      // ✅ ИСПРАВЛЕНИЕ: Улучшенная инициализация времени
      if (orderData.scheduledTime) {
        logger.info('🕐 Инициализация времени:', {
          originalTime: orderData.scheduledTime,
          rawTime: rawOrderData.scheduledTime,
        });

        // Используем время из rawOrderData для точности
        const timeToUse = rawOrderData.scheduledTime || orderData.scheduledTime;

        try {
          // Создаем Date объект и конвертируем в локальное время для input[type="datetime-local"]
          const date = new Date(timeToUse);

          // Проверяем валидность даты
          if (!isNaN(date.getTime())) {
            // Получаем локальное время в формате YYYY-MM-DDTHH:mm
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');

            const localDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;

            logger.info('✅ Устанавливаем время в форму:', localDateTime);
            methods.setValue('scheduledTime', localDateTime);
          } else {
            logger.error('❌ Невалидная дата:', timeToUse);
          }
        } catch (error) {
          logger.error('❌ Ошибка при парсинге времени:', error, timeToUse);
        }
      } else {
        logger.warn('⚠️ scheduledTime не найдено в orderData');
      }

      // Инициализация маршрута
      if (orderData.routeType === 'template' && orderData.routeId) {
        setSelectedRouteIdRef.current(orderData.routeId);
        setRouteModeRef.current('template');
        methods.setValue('routeId', orderData.routeId);
        methods.setValue('routeType', 'template');
      } else if (orderData.routeType === 'manual') {
        setRouteModeRef.current('manual');
        methods.setValue('startLocationId', orderData.startLocationId);
        methods.setValue('endLocationId', orderData.endLocationId);
        methods.setValue('routeType', 'manual');
        methods.setValue('additionalStops', orderData.additionalStops || []);
      }

      // Инициализация водителя из rides
      if (rawOrderData.rides && rawOrderData.rides.length > 0) {
        const ride = rawOrderData.rides[0];

        logger.info('🚗 Найдена поездка с водителем:', ride);

        if (ride.driverId) {
          logger.info('🔍 Загружаем полную информацию о водителе:', ride.driverId);

          // Используем новый метод getDriverById
          usersApi
            .getDriver(ride.driverId)
            .then((driverData: GetDriverDTO) => {
              logger.info('✅ Получена полная информация о водителе:', driverData);

              // Устанавливаем водителя как выбранного
              setSelectedDriverIdRef.current(driverData.id);
              methods.setValue('driverId', driverData.id);

              // Извлекаем carId из данных водителя
              let carId = '';

              if (driverData.activeCar?.id) {
                carId = driverData.activeCar.id;
                logger.info('✅ carId из activeCar.id:', carId);
              } else if (driverData.activeCarId) {
                carId = driverData.activeCarId;
                logger.info('✅ carId из activeCarId:', carId);
              } else {
                logger.warn('❌ carId не найден в данных водителя');
              }

              if (carId) {
                methods.setValue('carId', carId);
                logger.info('✅ carId установлен в форму при редактировании:', carId);
              }
            })
            .catch((error: unknown) => {
              logger.error('❌ Ошибка при загрузке данных водителя:', error);

              // Fallback: устанавливаем только ID водителя
              setSelectedDriverIdRef.current(ride.driverId);
              methods.setValue('driverId', ride.driverId);
            });
        }
      }

      // ✅ ИНИЦИАЛИЗАЦИЯ НОВЫХ ПОЛЕЙ
      logger.info('📝 Инициализация дополнительных полей:', {
        description: orderData.description,
        airFlight: orderData.airFlight,
        flyReis: orderData.flyReis,
      });

      // Инициализируем описание заказа
      if (orderData.description !== undefined) {
        methods.setValue('description', orderData.description);
      }

      // Инициализируем номер рейса прилета
      if (orderData.airFlight !== undefined) {
        methods.setValue('airFlight', orderData.airFlight);
      }

      // Инициализируем номер рейса вылета
      if (orderData.flyReis !== undefined) {
        methods.setValue('flyReis', orderData.flyReis);
      }

      // Устанавливаем флаг что инициализация завершена
      isDataInitialized.current = true;
    }
  }, [
    mode,
    orderDataKey, // ✅ Стабильный ключ
    rawOrderDataKey, // ✅ Стабильный ключ
    tariffs,
    isDataInitialized,
    orderData,
    rawOrderData,
  ]); // Убираем methods из зависимостей

  // === АВТОМАТИЧЕСКОЕ ПЕРЕКЛЮЧЕНИЕ В РУЧНОЙ РЕЖИМ ===
  useEffect(() => {
    if (!hasMainPartner && routeMode === 'template') {
      setRouteModeRef.current('manual');
      methods.setValue('routeType', 'manual');
      // Очищаем выбранный маршрут
      setSelectedRouteIdRef.current('');
      methods.setValue('routeId', null);
    }
  }, [hasMainPartner, routeMode]); // Убираем methods из зависимостей
};

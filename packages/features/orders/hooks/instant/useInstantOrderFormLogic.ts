'use client';

import { useState, useRef, useEffect } from 'react';
import type { GetLocationDTO } from '@entities/locations/interface';
import type { GetTariffDTO } from '@entities/tariffs/interface';
import { useInstantOrderData } from '@features/orders/hooks/instant/admin-pay/useInstantOrderData';
import { useInstantOrderForm } from '@features/orders/hooks/instant/admin-pay/useInstantOrderForm';
import { useOrderFormData } from '@features/orders/hooks/shared/useOrderFormData';
import { useOrderLocations } from '@features/orders/hooks/shared/useOrderLocations';
import { useOrderPricing } from '@features/orders/hooks/shared/useOrderPricing';

export interface UseInstantOrderFormLogicProps {
  mode: 'create' | 'edit';
  id?: string;
}

/**
 * Централизованная бизнес-логика для InstantOrderForm
 * Содержит все состояния, данные и вычисляемые значения
 * ✅ ИСПРАВЛЕНИЕ: Используем ту же архитектуру что и запланированные заказы
 */
export const useInstantOrderFormLogic = ({ mode, id }: UseInstantOrderFormLogicProps) => {
  // === СОСТОЯНИЕ UI ===
  const [selectedTariff, setSelectedTariff] = useState<GetTariffDTO | null>(null);
  // ✅ ИСПРАВЛЕНИЕ: Добавляем локальное состояние локаций как у запланированных
  const [routeLocations, setRouteLocations] = useState<GetLocationDTO[]>([]);

  // === ХУКИ ДАННЫХ ===
  const { orderData, isLoading: isOrderLoading, error: orderError } = useInstantOrderData(id, mode);
  const { tariffs, services, isLoading: isDataLoading, error } = useOrderFormData();
  const methods = useInstantOrderForm(orderData || undefined);

  // === ЗАГРУЗКА ЛОКАЦИЙ ЗАКАЗА ===
  // ✅ ИСПРАВЛЕНИЕ: Используем useOrderLocations только для загрузки данных
  const {
    selectedLocations: orderLocations,
    isLoading: isLocationsLoading,
    error: locationsError,
  } = useOrderLocations({
    startLocationId: orderData?.startLocationId,
    endLocationId: orderData?.endLocationId,
    additionalStops: orderData?.additionalStops,
    mode,
    // ✅ НЕ передаем onLocationsChange - управляем состоянием сами
  });

  // === ХУКИ БИЗНЕС-ЛОГИКИ ===
  const {
    selectedServices,
    currentPrice,
    memoizedInitialSelectedServices,
    handleServicesChange,
    handlePriceChange,
    initializeFromOrderData: initializePricing,
  } = useOrderPricing({
    orderData,
    mode,
    methods: methods as any,
    services,
  });

  // === ВЫЧИСЛЯЕМЫЕ ЗНАЧЕНИЯ ===
  // ✅ ИСПРАВЛЕНИЕ: routeLocations - ЕДИНСТВЕННЫЙ источник истины (как у запланированных)
  const displayLocations = routeLocations;
  const startLocation = displayLocations[0] || null;
  const endLocation =
    displayLocations.length >= 2 ? displayLocations[displayLocations.length - 1] : null;
  const additionalStops = displayLocations.length > 2 ? displayLocations.slice(1, -1) : [];

  // === ОБРАБОТЧИК ИЗМЕНЕНИЯ ЛОКАЦИЙ ===
  // ✅ ИСПРАВЛЕНИЕ: Создаем handleLocationsChange как у запланированных заказов
  const handleLocationsChange = (locations: GetLocationDTO[]) => {
    setRouteLocations(locations);

    // Обновляем поля формы
    const [start, ...rest] = locations;
    const end = rest.length > 0 ? rest[rest.length - 1] : null;
    const stops = rest.length > 1 ? rest.slice(0, -1) : [];

    methods.setValue('startLocationId', start?.id || null);
    methods.setValue('endLocationId', end?.id || null);
    methods.setValue(
      'additionalStops',
      stops.map((s: GetLocationDTO) => s.id),
    );
  };

  // === СОСТОЯНИЯ ЗАГРУЗКИ ===
  const isLoading = isDataLoading || isOrderLoading || isLocationsLoading;
  const loadingError = error || orderError || locationsError;

  // === ФЛАГИ ИНИЦИАЛИЗАЦИИ ===
  const isLocationsInitialized = useRef(false);

  // ✅ ИСПРАВЛЕНИЕ: Инициализируем routeLocations из orderLocations только один раз (как у запланированных)
  useEffect(() => {
    if (!isLocationsInitialized.current && orderLocations.length > 0) {
      setRouteLocations(orderLocations);

      // ✅ КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: Принудительно инициализируем поля формы
      const [start, ...rest] = orderLocations;
      const end = rest.length > 0 ? rest[rest.length - 1] : null;
      const stops = rest.length > 1 ? rest.slice(0, -1) : [];

      methods.setValue('startLocationId', start?.id || null);
      methods.setValue('endLocationId', end?.id || null);
      methods.setValue(
        'additionalStops',
        stops.map((s: GetLocationDTO) => s.id),
      );

      isLocationsInitialized.current = true;
    }
  }, [orderLocations, methods]);

  return {
    // Состояния UI
    selectedTariff,
    setSelectedTariff,

    // Данные
    orderData,
    tariffs,
    services,
    methods,

    // ✅ ИСПРАВЛЕНИЕ: Локации через локальное состояние
    displayLocations,
    startLocation,
    endLocation,
    additionalStops,
    handleLocationsChange,

    // Ценообразование
    selectedServices,
    currentPrice,
    memoizedInitialSelectedServices,
    handleServicesChange,
    handlePriceChange,
    initializePricing,

    // Состояния загрузки
    isLoading,
    loadingError,
  };
};

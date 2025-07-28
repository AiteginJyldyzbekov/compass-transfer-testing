'use client';

import { useRouter } from 'next/navigation';
import { useState, useLayoutEffect } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { OrderServiceDTO, GetScheduledOrderDTO } from '@entities/orders/interface';
import type { CreateScheduledOrderDTOType } from '@entities/orders/schemas';
import { useScheduledOrderFormLogic } from './useScheduledOrderFormLogic';
import { useScheduledOrderHandlers } from './useScheduledOrderHandlers';
import { useScheduledOrderInitialization } from './useScheduledOrderInitialization';

export interface UseScheduledOrderLogicProps {
  mode: 'create' | 'edit';
  id?: string;
}

/**
 * Тип возвращаемого значения useScheduledOrderLogic
 */
export type ScheduledOrderLogicReturn = ReturnType<typeof useScheduledOrderLogic>;

/**
 * Единый хук для всей логики запланированных заказов
 * Объединяет FormLogic, Handlers и Initialization в один интерфейс
 * Аналогично useInstantOrderLogic для консистентной архитектуры
 * ✅ ИСПРАВЛЕНИЕ: Добавлен контроль готовности UI
 */
export const useScheduledOrderLogic = ({ mode, id }: UseScheduledOrderLogicProps) => {
  const router = useRouter();

  // === СОСТОЯНИЕ ГОТОВНОСТИ UI ===
  const [isUIReady, setIsUIReady] = useState(false);

  // === ОСНОВНАЯ ЛОГИКА ===
  const formLogic = useScheduledOrderFormLogic({ mode, id });

  // === ОБРАБОТЧИКИ СОБЫТИЙ ===
  const handlers = useScheduledOrderHandlers({
    mode,
    id,
    orderData: formLogic.orderData,
    rawOrderData: formLogic.rawOrderData as GetScheduledOrderDTO | null,
    methods: formLogic.methods as UseFormReturn<CreateScheduledOrderDTOType>,
    selectedServices: formLogic.selectedServices as OrderServiceDTO[],
    passengers: formLogic.passengers,
    selectedRouteId: formLogic.selectedRouteId,
    routeMode: formLogic.routeMode,
    setSelectedTariff: formLogic.setSelectedTariff,
    setRouteLocations: formLogic.setRouteLocations,
    setSelectedRouteId: formLogic.setSelectedRouteId,
    setRouteMode: formLogic.setRouteMode,
    setSelectedDriverId: formLogic.setSelectedDriverId,
  });

  // === ИНИЦИАЛИЗАЦИЯ ===
  useScheduledOrderInitialization({
    mode,
    orderData: formLogic.orderData,
    rawOrderData: formLogic.rawOrderData as GetScheduledOrderDTO | null,
    tariffs: formLogic.tariffs,
    selectedTariff: formLogic.selectedTariff,
    routeMode: formLogic.routeMode,
    hasMainPartner: formLogic.hasMainPartner,
    stableOrderLocations: formLogic.stableOrderLocations,
    isLocationsInitialized: formLogic.isLocationsInitialized,
    isDataInitialized: formLogic.isDataInitialized,
    methods: formLogic.methods as UseFormReturn<CreateScheduledOrderDTOType>,
    setSelectedTariff: formLogic.setSelectedTariff,
    setRouteLocations: formLogic.setRouteLocations,
    setSelectedRouteId: formLogic.setSelectedRouteId,
    setRouteMode: formLogic.setRouteMode,
    setSelectedDriverId: formLogic.setSelectedDriverId,
  });

  // === КОНТРОЛЬ ГОТОВНОСТИ UI ===
  useLayoutEffect(() => {
    // Проверяем готовность всех данных
    const isDataReady = !formLogic.isLoading && !formLogic.loadingError;
    const isTariffsReady = formLogic.tariffs.length > 0;
    const isServicesReady = formLogic.services.length > 0;
    const isUsersReady = formLogic.users.length > 0;

    // В режиме создания готовы сразу после загрузки базовых данных
    if (mode === 'create') {
      const isCreateReady = isDataReady && isTariffsReady && isServicesReady && isUsersReady;

      if (isCreateReady && !isUIReady) {
        setIsUIReady(true);
      }
    }

    // В режиме редактирования ждем также загрузки данных заказа и инициализации
    if (mode === 'edit') {
      const hasOrderData = formLogic.orderData !== null;
      const hasRawOrderData = formLogic.rawOrderData !== null;
      const isLocationsReady = formLogic.displayLocations.length > 0 || !hasOrderData; // Может не быть локаций
      const isPassengersReady = formLogic.passengers.length > 0 || !hasOrderData; // Может не быть пассажиров
      const isEditReady =
        isDataReady &&
        isTariffsReady &&
        isServicesReady &&
        isUsersReady &&
        hasOrderData &&
        hasRawOrderData &&
        isLocationsReady &&
        isPassengersReady;

      if (isEditReady && !isUIReady) {
        setIsUIReady(true);
      }
    }
  }, [
    mode,
    formLogic.isLoading,
    formLogic.loadingError,
    formLogic.tariffs.length,
    formLogic.services.length,
    formLogic.users.length,
    formLogic.orderData,
    formLogic.rawOrderData,
    formLogic.displayLocations.length,
    formLogic.passengers.length,
    isUIReady,
  ]);

  // === ОБЪЕДИНЕННЫЙ ИНТЕРФЕЙС ===
  return {
    // Данные из formLogic
    ...formLogic,

    // Обработчики из handlers
    ...handlers,

    // Дополнительные методы
    handleCancel: () => router.push('/orders'),

    // ✅ НОВОЕ: Состояние готовности UI
    isUIReady,
  };
};

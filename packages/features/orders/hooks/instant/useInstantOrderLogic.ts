'use client';

import { useRouter } from 'next/navigation';
import { useState, useLayoutEffect } from 'react';
import { useInstantOrderFormLogic } from './useInstantOrderFormLogic';
import { useInstantOrderHandlers } from './useInstantOrderHandlers';
import { useInstantOrderInitialization } from './useInstantOrderInitialization';

export interface UseInstantOrderLogicProps {
  mode: 'create' | 'edit';
  id?: string;
}

/**
 * Тип возвращаемого значения useInstantOrderLogic
 */
export type InstantOrderLogicReturn = ReturnType<typeof useInstantOrderLogic>;

/**
 * Единый хук для всей логики мгновенных заказов
 * Объединяет FormLogic, Handlers и Initialization в один интерфейс
 * Консистентная архитектура с useScheduledOrderLogic
 * ✅ ИСПРАВЛЕНИЕ: Добавлен контроль готовности UI
 */
export const useInstantOrderLogic = ({ mode, id }: UseInstantOrderLogicProps) => {
  const router = useRouter();

  // === СОСТОЯНИЕ ГОТОВНОСТИ UI ===
  const [isUIReady, setIsUIReady] = useState(false);

  // === ОСНОВНАЯ ЛОГИКА ===
  const formLogic = useInstantOrderFormLogic({ mode, id });

  // === ОБРАБОТЧИКИ СОБЫТИЙ ===
  // ✅ ИСПРАВЛЕНИЕ: Передаем handleLocationsChange из formLogic
  const handlers = useInstantOrderHandlers({
    mode,
    id,
    methods: formLogic.methods as any,
    setSelectedTariff: formLogic.setSelectedTariff,
    handleLocationsChange: formLogic.handleLocationsChange, // ✅ Из formLogic
    handlePriceChange: formLogic.handlePriceChange,
    selectedServices: formLogic.memoizedInitialSelectedServices,
  });

  // === ИНИЦИАЛИЗАЦИЯ ===
  useInstantOrderInitialization({
    mode,
    orderData: formLogic.orderData,
    tariffs: formLogic.tariffs,
    selectedTariff: formLogic.selectedTariff,
    methods: formLogic.methods as any,
    setSelectedTariff: formLogic.setSelectedTariff,
  });

  // === КОНТРОЛЬ ГОТОВНОСТИ UI ===
  useLayoutEffect(() => {
    // Проверяем готовность всех данных
    const isDataReady = !formLogic.isLoading && !formLogic.loadingError;
    const isTariffsReady = formLogic.tariffs.length > 0;
    const isServicesReady = formLogic.services.length > 0;

    // В режиме создания готовы сразу после загрузки базовых данных
    if (mode === 'create') {
      const isCreateReady = isDataReady && isTariffsReady && isServicesReady;

      if (isCreateReady && !isUIReady) {
        setIsUIReady(true);
      }
    }

    // В режиме редактирования ждем также загрузки данных заказа и инициализации
    if (mode === 'edit') {
      const hasOrderData = formLogic.orderData !== null;
      const isLocationsReady = formLogic.displayLocations.length > 0 || !hasOrderData; // Может не быть локаций
      const isEditReady =
        isDataReady && isTariffsReady && isServicesReady && hasOrderData && isLocationsReady;

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
    formLogic.orderData,
    formLogic.displayLocations.length,
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

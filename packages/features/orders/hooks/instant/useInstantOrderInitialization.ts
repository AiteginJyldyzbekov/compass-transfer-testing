'use client';

import { useEffect, useRef } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { tariffsApi } from '@shared/api/tariffs';
import type { GetOrderDTO } from '@entities/orders/interface';
import type { CreateInstantOrderDTOType } from '@entities/orders/schemas';
import type { GetTariffDTO } from '@entities/tariffs/interface';

export interface UseInstantOrderInitializationProps {
  mode: 'create' | 'edit';
  orderData: GetOrderDTO | null;
  tariffs: GetTariffDTO[];
  selectedTariff: GetTariffDTO | null;
  methods: UseFormReturn<CreateInstantOrderDTOType>;
  setSelectedTariff: (tariff: GetTariffDTO | null) => void;
}

/**
 * Логика инициализации для InstantOrderForm
 * Обрабатывает автовыбор тарифа и инициализацию при редактировании
 * ✅ ИСПРАВЛЕНИЕ: Приведено к уровню useScheduledOrderInitialization
 */
export const useInstantOrderInitialization = ({
  mode,
  orderData,
  tariffs,
  selectedTariff,
  methods,
  setSelectedTariff,
}: UseInstantOrderInitializationProps) => {
  // ✅ ИСПРАВЛЕНИЕ: Стабильная ссылка на функцию (как в scheduled)
  const setSelectedTariffRef = useRef(setSelectedTariff);

  setSelectedTariffRef.current = setSelectedTariff;

  // ✅ ИСПРАВЛЕНИЕ: Стабильные ключи для объектов (как в scheduled)
  const selectedTariffKey = selectedTariff?.id || null;
  const orderDataKey = orderData ? `${orderData.id}-${mode}` : null;

  // === АВТОМАТИЧЕСКИЙ ВЫБОР ПЕРВОГО ТАРИФА ПРИ СОЗДАНИИ ===
  useEffect(() => {
    if (mode === 'create' && tariffs.length > 0 && !selectedTariff) {
      const firstTariff = tariffs[0];

      setSelectedTariffRef.current(firstTariff);
      methods.setValue('tariffId', firstTariff.id);
    }
  }, [mode, tariffs.length, selectedTariffKey, methods]);

  // === ИНИЦИАЛИЗАЦИЯ ДАННЫХ ПРИ РЕДАКТИРОВАНИИ ===
  // ✅ КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: Добавляем полную инициализацию как в scheduled
  useEffect(() => {
    if (orderData && mode === 'edit') {
      // Инициализация тарифа
      if (orderData.tariffId) {
        const tariff = tariffs.find(t => t.id === orderData.tariffId);

        if (tariff) {
          setSelectedTariffRef.current(tariff);
          methods.setValue('tariffId', orderData.tariffId);
        } else {
          // Загружаем тариф отдельно
          tariffsApi
            .getTariffById(orderData.tariffId)
            .then((loadedTariff: GetTariffDTO) => {
              setSelectedTariffRef.current(loadedTariff);
              if (orderData.tariffId) {
                methods.setValue('tariffId', orderData.tariffId);
              }
            })
            .catch((error: unknown) => {
              console.error('❌ InstantOrder: Ошибка загрузки тарифа:', error);
            });
        }
      }

      // ✅ КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: Инициализация локаций (как в scheduled)
      // Мгновенные заказы всегда используют ручной режим
      methods.setValue('startLocationId', orderData.startLocationId ?? null);
      methods.setValue('endLocationId', orderData.endLocationId ?? null);
      methods.setValue('additionalStops', orderData.additionalStops ?? []);
    }
  }, [orderDataKey, mode, tariffs.length, methods]);
};

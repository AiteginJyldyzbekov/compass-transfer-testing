'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { GetLocationDTO } from '@entities/locations/interface';
import type { CreateInstantOrderDTOType } from '@entities/orders/schemas';
import type { GetTariffDTO } from '@entities/tariffs/interface';
import { useInstantOrderSubmit } from '@features/orders/hooks/instant/admin-pay/useInstantOrderSubmit';

export interface UseInstantOrderHandlersProps {
  mode: 'create' | 'edit';
  id?: string;
  methods: UseFormReturn<CreateInstantOrderDTOType>;
  setSelectedTariff: (tariff: GetTariffDTO | null) => void;
  handleLocationsChange: (locations: GetLocationDTO[]) => void;
  handlePriceChange: (price: number) => void;
  selectedServices: unknown[];
}

/**
 * Все обработчики событий для InstantOrderForm
 * Централизует логику обработки пользовательских действий
 * ✅ ИСПРАВЛЕНИЕ: Получаем handleLocationsChange как параметр (как у запланированных)
 */
export const useInstantOrderHandlers = ({
  mode,
  id,
  methods,
  setSelectedTariff,
  handleLocationsChange,
  handlePriceChange,
  selectedServices,
}: UseInstantOrderHandlersProps) => {
  const router = useRouter();

  // Временная заглушка для показа модального окна водителей
  const showDriversModal = useCallback((_orderId: string) => {
    // TODO: Реализовать модальное окно выбора водителей
    // Пока просто переходим на страницу заказов
    router.push('/orders');
  }, [router]);

  const {
    handleSubmit,
    handleCancel,
    isLoading: isSubmitting,
    error: submitError,
  } = useInstantOrderSubmit({
    mode: mode === 'edit' ? 'edit' : 'create',
    id,
    onSuccess: (orderId?: string) => {
      if (mode === 'edit') {
        // Убираем refetch() при редактировании, так как сразу переходим на список заказов
        // Это экономит один лишний HTTP запрос на GET /Order/instant/{uuid}
        router.push('/orders');
      } else if (orderId) {
        showDriversModal(orderId);
      } else {
        router.push('/orders');
      }
    },
    onCancel: () => router.push('/orders'),
  });

  // === ОБРАБОТЧИКИ UI ===
  const handleTariffSelect = useCallback(
    (tariff: GetTariffDTO) => {
      setSelectedTariff(tariff);
      methods.setValue('tariffId', tariff.id);
    },
    [methods, setSelectedTariff],
  );

  const handleFormSubmit = useCallback(
    (data: CreateInstantOrderDTOType) => {
      const formData = {
        ...data,
        routeType: 'manual' as const, // Мгновенные заказы всегда используют ручной выбор локаций
        routeId: null,
        services: selectedServices,
        // passengers используется из data (дефолт из схемы или заполненные пользователем)
        waypoints: [],
      };

      handleSubmit(formData);
    },
    [handleSubmit, selectedServices],
  );

  return {
    // Обработчики событий
    handleTariffSelect,
    handlePriceChange,
    handleFormSubmit,
    handleLocationsChange,
    handleCancel,

    // Состояние отправки
    isSubmitting,
    submitError,
  };
};

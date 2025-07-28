'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { tariffsApi, type GetTariffDTOWithArchived } from '@shared/api/tariffs';

interface UseArchiveTariffProps {
  onSuccess?: () => void;
}

export function useArchiveTariff({ onSuccess }: UseArchiveTariffProps = {}) {
  const [isArchiving, setIsArchiving] = useState(false);

  const toggleArchive = async (tariff: GetTariffDTOWithArchived) => {
    setIsArchiving(true);
    try {
      // Переключаем статус архивирования
      await tariffsApi.setArchivedStatus(tariff.id, !tariff.archived);

      // Показываем успешное уведомление
      const action = !tariff.archived ? 'архивирован' : 'восстановлен из архива';

      toast.success(`Тариф "${tariff.name}" ${action}`);

      onSuccess?.();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Ошибка при изменении статуса архива тарифа:', error);
      toast.error('Ошибка при изменении статуса архива тарифа');
    } finally {
      setIsArchiving(false);
    }
  };

  return {
    toggleArchive,
    isArchiving,
  };
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { tariffsApi } from '@shared/api/tariffs';
import type { GetTariffDTOWithArchived } from '@entities/tariffs/interface';
import { TariffViewHeader } from './components/tariff-view-header';
import { TariffViewActions } from './components/tariff-view-actions';
import { TariffViewContent } from './components/tariff-view-content';
import { TariffViewLoading } from './components/tariff-view-loading';
import { TariffViewError } from './components/tariff-view-error';

interface TariffViewProps {
  tariffId: string;
}

export function TariffView({ tariffId }: TariffViewProps) {
  const router = useRouter();
  const [tariff, setTariff] = useState<GetTariffDTOWithArchived | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка данных тарифа
  useEffect(() => {
    const loadTariff = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const tariffData = await tariffsApi.getTariffById(tariffId);
        setTariff(tariffData);
      } catch (err) {
        console.error('Ошибка загрузки тарифа:', err);
        setError(err instanceof Error ? err.message : 'Ошибка загрузки тарифа');
      } finally {
        setLoading(false);
      }
    };

    if (tariffId) {
      loadTariff();
    }
  }, [tariffId]);

  // Обработчик возврата к списку
  const handleBackToList = () => {
    router.push('/tariffs');
  };

  // Обработчик редактирования
  const handleEdit = () => {
    router.push(`/tariffs/edit/${tariffId}`);
  };

  // Обработчик удаления
  const handleDelete = async () => {
    if (!tariff) return;

    try {
      await tariffsApi.deleteTariff(tariffId);
      toast.success('Тариф успешно удален');
      router.push('/tariffs');
    } catch (err) {
      console.error('Ошибка удаления тарифа:', err);
      toast.error(err instanceof Error ? err.message : 'Ошибка удаления тарифа');
    }
  };

  // Обработчик архивирования
  const handleToggleArchive = async () => {
    if (!tariff) return;

    try {
      const newArchivedStatus = !tariff.archived;

      await tariffsApi.setArchivedStatus(tariffId, newArchivedStatus);

      const action = newArchivedStatus ? 'архивирован' : 'разархивирован';

      toast.success(`Тариф успешно ${action}`);

      // Обновляем состояние тарифа
      setTariff((prev: GetTariffDTOWithArchived | null) =>
        prev ? { ...prev, archived: newArchivedStatus } : null
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ошибка архивирования тарифа');
    }
  };

  if (loading) {
    return <TariffViewLoading />;
  }

  if (error) {
    return (
      <TariffViewError 
        error={error} 
        onRetry={() => window.location.reload()}
        onBack={handleBackToList}
      />
    );
  }

  if (!tariff) {
    return (
      <TariffViewError 
        error="Тариф не найден" 
        onBack={handleBackToList}
      />
    );
  }

  return (
    <div className='pr-2 border rounded-2xl overflow-hidden shadow-sm h-full bg-white flex flex-col gap-6 p-6 overflow-y-auto'>
      {/* Заголовок */}
      <TariffViewHeader tariff={tariff} />

      {/* Двухколоночный layout */}
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
        {/* Левая колонка - основная информация (3/4 ширины) */}
        <div className='lg:col-span-3'>
          <TariffViewContent tariff={tariff} />
        </div>

        {/* Правая колонка - кнопки действий (1/4 ширины) */}
        <div className='lg:col-span-1'>
          <TariffViewActions
            tariff={tariff}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleArchive={handleToggleArchive}
            onBack={handleBackToList}
          />
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { servicesApi } from '@shared/api/services';
import type { GetServiceDTO } from '@entities/services/interface';
import { ServiceViewHeader } from './components/service-view-header';
import { ServiceViewActions } from './components/service-view-actions';
import { ServiceViewContent } from './components/service-view-content';
import { ServiceViewLoading } from './components/service-view-loading';
import { ServiceViewError } from './components/service-view-error';

interface ServiceViewProps {
  serviceId: string;
}

export function ServiceView({ serviceId }: ServiceViewProps) {
  const router = useRouter();
  const [service, setService] = useState<GetServiceDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка данных услуги
  useEffect(() => {
    const loadService = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const serviceData = await servicesApi.getServiceById(serviceId);
        setService(serviceData);
      } catch (err) {
        console.error('Ошибка загрузки услуги:', err);
        setError(err instanceof Error ? err.message : 'Ошибка загрузки услуги');
      } finally {
        setLoading(false);
      }
    };

    if (serviceId) {
      loadService();
    }
  }, [serviceId]);

  // Обработчик возврата к списку
  const handleBackToList = () => {
    router.push('/services');
  };

  // Обработчик редактирования
  const handleEdit = () => {
    router.push(`/services/edit/${serviceId}`);
  };

  // Обработчик удаления
  const handleDelete = async () => {
    if (!service) return;

    try {
      await servicesApi.deleteService(serviceId);
      toast.success('Услуга успешно удалена');
      router.push('/services');
    } catch (err) {
      console.error('Ошибка удаления услуги:', err);
      toast.error(err instanceof Error ? err.message : 'Ошибка удаления услуги');
    }
  };

  if (loading) {
    return <ServiceViewLoading />;
  }

  if (error) {
    return (
      <ServiceViewError 
        error={error} 
        onRetry={() => window.location.reload()}
        onBack={handleBackToList}
      />
    );
  }

  if (!service) {
    return (
      <ServiceViewError 
        error="Услуга не найдена" 
        onBack={handleBackToList}
      />
    );
  }

  return (
    <div className='pr-2 border rounded-2xl overflow-hidden shadow-sm h-full bg-white flex flex-col gap-6 p-6 overflow-y-auto'>
      {/* Заголовок */}
      <ServiceViewHeader service={service} />

      {/* Двухколоночный layout */}
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
        {/* Левая колонка - основная информация (3/4 ширины) */}
        <div className='lg:col-span-3'>
          <ServiceViewContent service={service} />
        </div>

        {/* Правая колонка - кнопки действий (1/4 ширины) */}
        <div className='lg:col-span-1'>
          <ServiceViewActions
            service={service}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onBack={handleBackToList}
          />
        </div>
      </div>
    </div>
  );
}

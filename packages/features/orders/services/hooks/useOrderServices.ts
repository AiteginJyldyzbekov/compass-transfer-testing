'use client';

import { useEffect } from 'react';
import type { GetOrderServiceDTO } from '@entities/orders/interface';
import type { GetServiceDTO } from '@entities/services/interface';

interface UseOrderServicesProps {
  services: GetServiceDTO[];
  selectedServices: GetOrderServiceDTO[];
  handleServicesChange: (services: GetOrderServiceDTO[]) => void;
  isInstantOrder?: boolean;
}

export const useOrderServices = ({
  services,
  selectedServices,
  handleServicesChange,
  isInstantOrder = false,
}: UseOrderServicesProps) => {
  // Форматирование цены в KGS
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'KGS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };

  // Добавление или удаление услуги
  const handleServiceToggle = (serviceId: string, isQuantifiable: boolean) => {
    const existingService = selectedServices.find(s => s.serviceId === serviceId);

    if (isQuantifiable) {
      if (existingService) {
        const updatedServices = selectedServices.map(s =>
          s.serviceId === serviceId ? { ...s, quantity: s.quantity + 1 } : s
        );

        handleServicesChange(updatedServices);
      } else {
        const service = services.find(s => s.id === serviceId);

        if (service) {
          handleServicesChange([...selectedServices, {
            serviceId: service.id,
            quantity: 1,
            name: service.name
          }]);
        }
      }
    } else {
      if (existingService) {
        const updatedServices = selectedServices.filter(s => s.serviceId !== serviceId);

        handleServicesChange(updatedServices);
      } else {
        const service = services.find(s => s.id === serviceId);

        if (service) {
          handleServicesChange([...selectedServices, {
            serviceId: service.id,
            quantity: 1,
            name: service.name
          }]);
        }
      }
    }
  };

  // Изменение количества услуги
  const handleServiceQuantityChange = (serviceId: string, quantity: number) => {
    if (quantity <= 0) {
      const updatedServices = selectedServices.filter(s => s.serviceId !== serviceId);

      handleServicesChange(updatedServices);
    } else {
      const updatedServices = selectedServices.map(s =>
        s.serviceId === serviceId ? { ...s, quantity } : s
      );

      handleServicesChange(updatedServices);
    }
  };

  // Расчет общей стоимости всех выбранных услуг
  const calculateTotalPrice = () => {
    return selectedServices.reduce((total, selectedService) => {
      const service = services.find(s => s.id === selectedService.serviceId);
      
      return total + (service ? service.price * selectedService.quantity : 0);
    }, 0);
  };

  // Форматированная общая стоимость
  const formattedTotalPrice = formatPrice(calculateTotalPrice());

  // Автоматическое заполнение услуг для моментальных заказов
  useEffect(() => {
    if (isInstantOrder && services.length > 0 && selectedServices.length === 0) {
      // Для моментальных заказов автоматически добавляем самую недорогую услугу
      const cheapestService = services
        .filter(service => service.price <= 100) // Только недорогие услуги (до 100 сом)
        .sort((a, b) => a.price - b.price)[0]; // Сортируем по цене и берем первую

      if (cheapestService) {
        handleServicesChange([{
          serviceId: cheapestService.id,
          quantity: 1,
          name: cheapestService.name,
          notes: null
        }]);
      }
    }
  }, [isInstantOrder, services, selectedServices.length, handleServicesChange]);

  return {
    handleServiceToggle,
    handleServiceQuantityChange,
    formatPrice,
    calculateTotalPrice,
    formattedTotalPrice,
  };
};

'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import type { UseFormReturn, FieldValues, Path } from 'react-hook-form';
import type { GetServiceDTO } from '@entities/services/interface';

// Типы для работы с услугами
interface SelectedService {
  serviceId: string;
  quantity: number;
  notes?: string | null;
}

interface ServiceWithQuantity {
  id: string;
  name?: string;
  price: number;
  isQuantifiable: boolean;
  quantity: number;
  serviceId: string;
}

interface UseOrderPricingProps<T extends FieldValues = FieldValues> {
  orderData?: (T & { initialPrice?: number; services?: SelectedService[] }) | null;
  mode?: string;
  methods: UseFormReturn<T>;
  services: GetServiceDTO[];
}

/**
 * Универсальный хук для управления ценообразованием заказов
 * Работает с любыми типами заказов (instant, scheduled, etc.)
 */
export const useOrderPricing = <
  T extends FieldValues & { initialPrice?: number; services?: SelectedService[] },
>({
  orderData,
  mode,
  methods,
  services,
}: UseOrderPricingProps<T>) => {
  const [selectedServices, setSelectedServices] = useState<ServiceWithQuantity[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // ✅ ИСПРАВЛЕНИЕ: Стабильный ключ для orderData
  const orderDataKey = orderData
    ? `${orderData.initialPrice || 0}-${orderData.services?.length || 0}`
    : null;

  // Мемоизированные данные для компонента ServicesSelector
  // ✅ ИСПРАВЛЕНИЕ: Используем данные формы, но с fallback на orderData при инициализации
  const memoizedInitialSelectedServices = useMemo(() => {
    const formServices = (methods.watch('services' as Path<T>) as SelectedService[]) || [];

    // Если форма пустая, но есть orderData - используем его
    if (formServices.length === 0 && orderData?.services && orderData.services.length > 0) {
      return orderData.services.map((service) => ({
        serviceId: service.serviceId,
        quantity: service.quantity,
        notes: service.notes || null,
      }));
    }

    return formServices.map((service) => ({
      serviceId: service.serviceId,
      quantity: service.quantity,
      notes: service.notes || null,
    }));
  }, [methods, orderData]);

  // Обработчик изменения услуг
  const handleServicesChange = useCallback(
    (newServices: SelectedService[]) => {
      console.log('useOrderPricing.handleServicesChange получил:', newServices);

      const servicesForCalculation = newServices
        .map(service => {
          const serviceData = services.find(s => s.id === service.serviceId);

          return serviceData
            ? {
                id: serviceData.id,
                name: serviceData.name,
                price: serviceData.price,
                isQuantifiable: serviceData.isQuantifiable,
                quantity: service.quantity,
                serviceId: serviceData.id,
              }
            : null;
        })
        .filter(Boolean) as ServiceWithQuantity[];

      setSelectedServices(servicesForCalculation);

      // ✅ ИСПРАВЛЕНИЕ: Сохраняем данные в форму с полем notes
      const servicesForForm = newServices.map(service => ({
        serviceId: service.serviceId,
        quantity: service.quantity,
        notes: service.notes || null,
      }));

      console.log('useOrderPricing.handleServicesChange сохраняет в форму:', servicesForForm);
      methods.setValue('services' as Path<T>, servicesForForm as T[Path<T>]);
    },
    [services, methods],
  );

  // Обработчик изменения цены с правильной типизацией
  const handlePriceChange = useCallback(
    (price: number) => {
      setCurrentPrice(price);
      methods.setValue('initialPrice' as Path<T>, price as T[Path<T>]);
    },
    [methods],
  );

  // Инициализация ценообразования из данных заказа
  const initializeFromOrderData = useCallback(async () => {
    if (!orderData || isInitialized) return;

    // Инициализируем цену
    if (orderData.initialPrice !== undefined) {
      setCurrentPrice(orderData.initialPrice);
      methods.setValue('initialPrice' as Path<T>, orderData.initialPrice as T[Path<T>]);
    }

    // Инициализируем услуги
    if (orderData.services && orderData.services.length > 0) {
      const servicesWithPrices = orderData.services.map(serviceData => {
        const fullServiceData = services.find(s => s.id === serviceData.serviceId);

        if (fullServiceData) {
          return {
            id: fullServiceData.id,
            name: fullServiceData.name,
            price: fullServiceData.price,
            isQuantifiable: fullServiceData.isQuantifiable,
            quantity: serviceData.quantity,
            serviceId: fullServiceData.id,
          };
        } else {
          return {
            id: serviceData.serviceId,
            price: 0,
            isQuantifiable: true,
            quantity: serviceData.quantity,
            serviceId: serviceData.serviceId,
          };
        }
      });

      setSelectedServices(servicesWithPrices as ServiceWithQuantity[]);

      // ✅ ИСПРАВЛЕНИЕ: Сохраняем данные в форму с полем notes
      const servicesForForm = orderData.services.map(serviceData => ({
        serviceId: serviceData.serviceId,
        quantity: serviceData.quantity,
        notes: serviceData.notes || null,
      }));

      methods.setValue('services' as Path<T>, servicesForForm as T[Path<T>]);
    }

    setIsInitialized(true);
  }, [orderDataKey, methods, isInitialized, services]); // ✅ Используем стабильный ключ

  // ✅ ИСПРАВЛЕНИЕ: Убираем initializeFromOrderData из зависимостей
  useEffect(() => {
    if (mode === 'edit' && orderData) {
      initializeFromOrderData();
    }
  }, [mode, orderDataKey]); // ✅ Используем стабильный ключ

  return {
    selectedServices,
    currentPrice,
    memoizedInitialSelectedServices,
    handleServicesChange,
    handlePriceChange,
    initializeFromOrderData,
  };
};

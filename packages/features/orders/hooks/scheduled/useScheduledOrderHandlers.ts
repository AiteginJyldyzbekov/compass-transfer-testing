'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { logger } from '@shared/lib/logger';
import type { GetLocationDTO } from '@entities/locations/interface';
import type { OrderServiceDTO, PassengerDTO, GetScheduledOrderDTO } from '@entities/orders/interface';
import type { CreateScheduledOrderDTOType } from '@entities/orders/schemas';
import type { PartnerRouteDTO } from '@entities/routes/interface/PartnerRouteDTO';
import type { GetTariffDTO } from '@entities/tariffs/interface';
import type { GetDriverDTO } from '@entities/users/interface';
import { useScheduledOrderSubmit } from '@features/orders/hooks/scheduled/admin-pay/useScheduledOrderSubmit';

// Временные типы
type RouteMode = 'manual' | 'template';

// Расширенный интерфейс водителя с дополнительным полем car
interface ExtendedGetDriverDTO extends GetDriverDTO {
  car?: {
    id: string;
    [key: string]: unknown;
  };
}

export interface UseScheduledOrderHandlersProps {
  mode: 'create' | 'edit';
  id?: string;
  orderData: CreateScheduledOrderDTOType | null;
  rawOrderData: GetScheduledOrderDTO | null;
  methods: UseFormReturn<CreateScheduledOrderDTOType>;
  selectedServices: OrderServiceDTO[];
  passengers: PassengerDTO[];
  selectedRouteId: string;
  routeMode: RouteMode;
  setSelectedTariff: (tariff: GetTariffDTO | null) => void;
  setRouteLocations: (locations: GetLocationDTO[]) => void;
  setSelectedRouteId: (id: string) => void;
  setRouteMode: (mode: RouteMode) => void;
  setSelectedDriverId: (id: string) => void;
}

/**
 * Все обработчики событий для ScheduledOrderForm
 * Централизует логику обработки пользовательских действий
 */
export const useScheduledOrderHandlers = ({
  mode,
  id,
  orderData: _orderData,
  rawOrderData,
  methods,
  selectedServices,
  passengers,
  selectedRouteId,
  routeMode: _routeMode,
  setSelectedTariff,
  setRouteLocations,
  setSelectedRouteId,
  setRouteMode,
  setSelectedDriverId,
}: UseScheduledOrderHandlersProps) => {
  const router = useRouter();

  const {
    handleSubmit,
    handleCancel,
    isLoading: isSubmitting,
  } = useScheduledOrderSubmit({
    mode,
    id,
    orderData: rawOrderData,
    onSuccess: () => {
      router.push('/orders');
    },
    onCancel: () => router.push('/orders'),
  });

  // === ОБРАБОТЧИКИ UI ===
  const handleTariffSelect = useCallback(
    (tariff: GetTariffDTO) => {
      logger.info('handleTariffSelect called with tariff:', tariff);
      setSelectedTariff(tariff);
      methods.setValue('tariffId', tariff.id);
      // Загрузка активных водителей происходит в useEffect в RouteMapSelector
    },
    [methods, setSelectedTariff],
  );

  const handleLocationsChange = useCallback(
    (locations: GetLocationDTO[]) => {
      setRouteLocations(locations);

      // Обновляем поля формы
      const [start, ...rest] = locations;
      const end = rest.length > 0 ? rest[rest.length - 1] : null;
      const stops = rest.length > 1 ? rest.slice(0, -1) : [];

      methods.setValue('startLocationId', start?.id || null);
      methods.setValue('endLocationId', end?.id || null);
      methods.setValue(
        'additionalStops',
        stops.map(s => s.id),
      );
      methods.setValue('routeType', 'manual');
    },
    [methods, setRouteLocations],
  );

  const handleRouteSelect = useCallback(
    (route: PartnerRouteDTO) => {
      setSelectedRouteId(route.id);
      methods.setValue('routeId', route.id);
      methods.setValue('routeType', 'template');
      // Очищаем ручные поля
      methods.setValue('startLocationId', null);
      methods.setValue('endLocationId', null);
      methods.setValue('additionalStops', []);

      // Очищаем выбранного водителя при смене маршрута
      setSelectedDriverId('');
      methods.setValue('driverId', '');
      methods.setValue('carId', '');
    },
    [methods, setSelectedRouteId, setSelectedDriverId],
  );

  const handleRouteModeChange = useCallback(
    (mode: RouteMode) => {
      setRouteMode(mode);

      if (mode === 'manual') {
        // Переключение в ручной режим - очищаем шаблон
        setSelectedRouteId('');
        methods.setValue('routeId', null);
        methods.setValue('routeType', 'manual');
      } else {
        // Переключение в режим шаблона - очищаем ручные поля только если нет выбранного маршрута
        if (!selectedRouteId) {
          methods.setValue('startLocationId', null);
          methods.setValue('endLocationId', null);
          methods.setValue('additionalStops', []);
        }
        methods.setValue('routeType', 'template');
      }
    },
    [methods, selectedRouteId, setRouteMode, setSelectedRouteId],
  );

  const handleDriverSelect = useCallback(
    (driverIdOrDriver: string | ExtendedGetDriverDTO) => {
      logger.info('🚗 handleDriverSelect вызван с:', driverIdOrDriver);

      if (typeof driverIdOrDriver === 'object' && driverIdOrDriver?.id) {
        const driver = driverIdOrDriver;

        logger.info('📋 Данные водителя:', {
          id: driver.id,
          activeCar: driver.activeCar,
          activeCarId: driver.activeCarId,
          car: driver.car,
        });

        setSelectedDriverId(driver.id);
        methods.setValue('driverId', driver.id);

        // Устанавливаем автомобиль - проверяем все возможные источники carId
        let carId = '';

        if (driver.activeCar?.id) {
          carId = driver.activeCar.id;
          logger.info('✅ carId из activeCar.id:', carId);
        } else if (driver.activeCarId) {
          carId = driver.activeCarId;
          logger.info('✅ carId из activeCarId:', carId);
        } else if (driver.car?.id) {
          carId = driver.car.id;
          logger.info('✅ carId из car.id:', carId);
        } else {
          logger.warn('❌ carId не найден в данных водителя');
        }

        if (carId) {
          methods.setValue('carId', carId);
          logger.info('✅ carId установлен в форму:', carId);
        } else {
          methods.setValue('carId', '');
          logger.warn('❌ carId очищен в форме');
        }
      } else {
        const driverId = driverIdOrDriver as string;

        logger.info('📝 Установка водителя по ID:', driverId);

        setSelectedDriverId(driverId || '');
        methods.setValue('driverId', driverId || '');
        if (!driverId) {
          methods.setValue('carId', '');
          logger.warn('❌ Водитель и carId очищены');
        } else {
          logger.warn('⚠️ Установлен только driverId, carId может отсутствовать');
        }
      }
    },
    [methods, setSelectedDriverId],
  );

  const handleFormSubmit = useCallback(
    (data: CreateScheduledOrderDTOType) => {
      logger.info('📝 Отправка формы с данными:', {
        driverId: data.driverId,
        carId: data.carId,
        hasDriverAndCar: !!(data.driverId && data.carId),
      });

      const formData = {
        ...data,
        services: selectedServices.map(service => ({
          serviceId: service.serviceId,
          quantity: service.quantity,
          notes: service.notes,
        })),
        passengers,
        waypoints: [],
      };

      handleSubmit(formData);
    },
    [handleSubmit, selectedServices, passengers],
  );

  const handleAddRoute = useCallback(() => {
    // TODO: Открыть модал создания маршрута для партнера
    logger.info(
      'Функция создания маршрута будет реализована позже. Пока используйте ручной выбор локаций.',
    );
  }, []);

  return {
    // Обработчики событий
    handleTariffSelect,
    handleLocationsChange,
    handleRouteSelect,
    handleRouteModeChange,
    handleDriverSelect,
    handleFormSubmit,
    handleAddRoute,
    handleCancel,

    // Состояние отправки
    isSubmitting,
  };
};

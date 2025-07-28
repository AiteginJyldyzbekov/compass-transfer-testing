'use client';

import { useState, useRef, useEffect } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { logger } from '@shared/lib/logger';
import type { GetLocationDTO } from '@entities/locations/interface';
import type { CreateScheduledOrderDTOType } from '@entities/orders/schemas';
import type { GetTariffDTO } from '@entities/tariffs/interface';
import { Role } from '@entities/users/enums/Role.enum';
import { useScheduledOrderData } from '@features/orders/hooks/scheduled/admin-pay/useScheduledOrderData';
import { useScheduledOrderForm } from '@features/orders/hooks/scheduled/admin-pay/useScheduledOrderForm';
import { useOrderFormData } from '@features/orders/hooks/shared/useOrderFormData';
import { useOrderLocations } from '@features/orders/hooks/shared/useOrderLocations';
import { useOrderPricing } from '@features/orders/hooks/shared/useOrderPricing';
import { useScheduledOrderPassengers } from './useScheduledOrderPassengers';

// Временные типы
type RouteMode = 'manual' | 'template';

interface PassengerData {
  customerId?: string;
  isMainPassenger?: boolean;
}

// Заглушка для usePartnerRoutes
const usePartnerRoutes = (_passenger: unknown) => ({
  routes: [],
  isLoading: false,
});

export interface UseScheduledOrderFormLogicProps {
  mode: 'create' | 'edit';
  id?: string;
}

/**
 * Централизованная бизнес-логика для ScheduledOrderForm
 * Содержит все состояния, данные и вычисляемые значения
 */
export const useScheduledOrderFormLogic = ({ mode, id }: UseScheduledOrderFormLogicProps) => {
  // === СОСТОЯНИЕ UI ===
  const [selectedTariff, setSelectedTariff] = useState<GetTariffDTO | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<string>('');
  const [routeLocations, setRouteLocations] = useState<GetLocationDTO[]>([]);
  const [selectedDriverId, setSelectedDriverId] = useState<string>('');
  const [routeMode, setRouteMode] = useState<RouteMode>('manual');

  // === ХУКИ ДАННЫХ ===
  const {
    orderData,
    rawOrderData,
    isLoading: isOrderLoading,
    error: orderError,
  } = useScheduledOrderData(id, mode);
  const { users, tariffs, services, isLoading: isDataLoading, error } = useOrderFormData();
  const methods = useScheduledOrderForm(orderData || undefined);

  // === ЗАГРУЗКА ЛОКАЦИЙ ЗАКАЗА ===
  const {
    selectedLocations: orderLocations,
    isLoading: _isLocationsLoading,
    error: _locationsError,
  } = useOrderLocations({
    startLocationId: orderData?.startLocationId,
    endLocationId: orderData?.endLocationId,
    additionalStops: orderData?.additionalStops,
    mode,
  });

  // === ХУКИ БИЗНЕС-ЛОГИКИ ===
  const {
    passengers,
    handlePassengersChange,
    handleAddNewPassenger,
    handleUpdatePassenger,
    handleRemovePassenger,
    handleSetMainPassenger,
    handleUserSelection,
  } = useScheduledOrderPassengers({
    orderData,
    mode,
    methods: methods as UseFormReturn<CreateScheduledOrderDTOType>,
  });

  const {
    selectedServices,
    currentPrice,
    memoizedInitialSelectedServices,
    handleServicesChange,
    handlePriceChange,
  } = useOrderPricing({
    orderData,
    mode,
    methods: methods as UseFormReturn<CreateScheduledOrderDTOType>,
    services,
  });

  // === ВЫЧИСЛЯЕМЫЕ ЗНАЧЕНИЯ ===
  // ✅ ИСПРАВЛЕНИЕ: routeLocations - ЕДИНСТВЕННЫЙ источник истины
  // Инициализируем routeLocations из orderLocations только один раз при загрузке
  const displayLocations = routeLocations;
  const startLocation = displayLocations[0] || null;
  const endLocation =
    displayLocations.length >= 2 ? displayLocations[displayLocations.length - 1] : null;
  const additionalStops = displayLocations.length > 2 ? displayLocations.slice(1, -1) : [];

  // ✅ СОВМЕСТИМОСТЬ: Создаем stableOrderLocations для useScheduledOrderInitialization
  const stableOrderLocations = orderLocations;

  // === МАРШРУТЫ ПАРТНЕРА ===
  // Находим ГЛАВНОГО пассажира-партнера среди выбранных пассажиров
  const mainPartnerPassenger = passengers.find((passenger: PassengerData) => {
    const user = users.find(u => u.id === passenger.customerId);

    return passenger.isMainPassenger && user?.role === Role.Partner;
  });

  const { routes: partnerRoutes, isLoading: isPartnerRoutesLoading } = usePartnerRoutes(
    mainPartnerPassenger,
  );

  // Используем только маршруты партнера
  const allAvailableRoutes = partnerRoutes;
  const isRoutesLoading = isPartnerRoutesLoading;

  // Показываем переключатель режимов только если есть главный пассажир-партнер
  const hasMainPartner = !!mainPartnerPassenger;

  // === ПРОВЕРКА ОШИБОК ВАЛИДАЦИИ ===
  const routeValidationError = methods.formState.errors.routeId;
  const hasRouteError = !!routeValidationError;

  // === СОСТОЯНИЯ ЗАГРУЗКИ ===
  const isLoading = isDataLoading || isOrderLoading || _isLocationsLoading;
  const loadingError = error || orderError || _locationsError;

  // === ФЛАГИ ИНИЦИАЛИЗАЦИИ ===
  const isLocationsInitialized = useRef(false);
  const isDataInitialized = useRef(false);

  // ✅ ИСПРАВЛЕНИЕ: Инициализируем routeLocations из orderLocations только один раз
  useEffect(() => {
    if (!isLocationsInitialized.current && orderLocations.length > 0) {
      logger.info('🔄 Инициализируем routeLocations из orderLocations:', orderLocations);
      setRouteLocations(orderLocations);
      isLocationsInitialized.current = true;
    }
  }, [orderLocations]);

  return {
    // Состояния UI
    selectedTariff,
    setSelectedTariff,
    selectedRouteId,
    setSelectedRouteId,
    routeLocations,
    setRouteLocations,
    selectedDriverId,
    setSelectedDriverId,
    routeMode,
    setRouteMode,

    // Данные
    orderData,
    rawOrderData,
    users,
    tariffs,
    services,
    methods,

    // Бизнес-логика
    passengers,
    handlePassengersChange,
    handleAddNewPassenger,
    handleUpdatePassenger,
    handleRemovePassenger,
    handleSetMainPassenger,
    handleUserSelection,
    selectedServices,
    currentPrice,
    memoizedInitialSelectedServices,
    handleServicesChange,
    handlePriceChange,

    // Вычисляемые значения
    displayLocations,
    startLocation,
    endLocation,
    additionalStops,
    stableOrderLocations,
    mainPartnerPassenger,
    allAvailableRoutes,
    isRoutesLoading,
    hasMainPartner,
    hasRouteError,

    // Состояния загрузки
    isLoading,
    loadingError,

    // Флаги инициализации
    isLocationsInitialized,
    isDataInitialized,
  };
};

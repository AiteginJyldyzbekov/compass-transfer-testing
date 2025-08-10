'use client';

import { useMemo, useCallback } from 'react';
import type { UseSummaryParams } from '../interfaces';

interface UseSummaryResult {
  // Состояния для секций и данных
  routeInfo: {
    startLocation: string;
    endLocation: string;
    intermediatePoints: string[];
    distance: string;
  };
  priceInfo: {
    basePrice: string;
    distancePrice: string;
    totalPrice: string;
    formattedPrice: string;
    isCustomPrice: boolean;
    handleCustomPriceChange: (value: string) => void;
    toggleCustomPrice: () => void;
  };
  passengerInfo: {
    totalPassengers: number;
    formattedPassengersList: string;
  };
  // Другие вспомогательные функции
  formatPrice: (price: number) => string;
  getStartLocationName: () => string;
  getEndLocationName: () => string;
}

/**
 * Хук для работы с данными и логикой суммарной информации заказа
 */
export function useSummary({
  selectedTariff,
  _selectedServices,
  currentPrice,
  passengers,
  _routeLocations,
  routeState,
  routeDistance,
  _methods,
  _mode,
  _orderId,
  _selectedDriver,
  _getDriverById,
  _updateDriverCache,
  useCustomPrice = false,
  setUseCustomPrice,
  customPrice = '',
  setCustomPrice,
  _onTabChange,
  _orderStatus,
  _setOrderStatus,
  _isInstantOrder = false,
}: UseSummaryParams): UseSummaryResult {
  // Состояния и вычисляемые значения
  
  // Форматирование цены (вспомогательная функция)
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Информация о маршруте
  const getStartLocationName = useCallback((): string => {
    return routeState.startLocation?.name || 'Не выбрано';
  }, [routeState.startLocation]);

  const getEndLocationName = useCallback((): string => {
    return routeState.endLocation?.name || 'Не выбрано';
  }, [routeState.endLocation]);
  
  const routeInfo = useMemo(() => {
    const intermediatePoints = routeState.intermediatePoints?.map(p => p.name) || [];
    
    return {
      startLocation: getStartLocationName(),
      endLocation: getEndLocationName(),
      intermediatePoints,
      distance: routeDistance ? `${Math.round(routeDistance / 1000)} км` : 'Не определено',
    };
  }, [routeState, routeDistance, getStartLocationName, getEndLocationName]);

  // Информация о цене
  const priceInfo = useMemo(() => {
    const basePrice = selectedTariff?.basePrice || 0;
    const distancePrice = selectedTariff ? 
      (routeDistance || 0) / 1000 * (selectedTariff.perKmPrice || 0) : 
      0;
    const totalPrice = useCustomPrice && customPrice ? 
      parseInt(customPrice.replace(/[^\d]/g, ''), 10) || 0 : 
      currentPrice;
    
    return {
      basePrice: formatPrice(basePrice),
      distancePrice: formatPrice(distancePrice),
      totalPrice: formatPrice(totalPrice),
      formattedPrice: formatPrice(totalPrice),
      isCustomPrice: useCustomPrice || false,
      handleCustomPriceChange: (value: string) => {
        if (setCustomPrice) {
          setCustomPrice(value);
        }
      },
      toggleCustomPrice: () => {
        if (setUseCustomPrice) {
          setUseCustomPrice(!useCustomPrice);
        }
      }
    };
  }, [selectedTariff, routeDistance, useCustomPrice, customPrice, currentPrice, setCustomPrice, setUseCustomPrice]);

  // Информация о пассажирах
  const passengerInfo = useMemo(() => {
    return {
      totalPassengers: passengers.length,
      formattedPassengersList: passengers.map(p => `${p.firstName} ${p.lastName}`).join(', ') || 'Не выбраны'
    };
  }, [passengers]);

  return {
    routeInfo,
    priceInfo,
    passengerInfo,
    formatPrice,
    getStartLocationName,
    getEndLocationName
  };
}

'use client'

import { useState, useEffect } from 'react';
import { useUserRole } from '@shared/contexts';
import { ServiceClassValues, ServiceClassColors, CarTypeValues, type ServiceClass, type CarType } from '@entities/tariffs/enums';
import { type GetTariffDTO } from '@entities/tariffs/interface';
import { Role } from '@entities/users/enums';

interface UseOrderTariffsProps {
  tariffs: GetTariffDTO[];
  selectedTariff: GetTariffDTO | null;
  setSelectedTariff: (tariff: GetTariffDTO | null) => void;
  onRefreshTariffs?: () => void;
  isRefreshingTariffs?: boolean;
  initialTariffId?: string;
}

export const useOrderTariffs = ({
  tariffs,
  selectedTariff,
  setSelectedTariff,
  onRefreshTariffs: _onRefreshTariffs,
  isRefreshingTariffs: _isRefreshingTariffs = false,
  initialTariffId
}: UseOrderTariffsProps) => {
  const [showArchived, setShowArchived] = useState(false);
  const { userRole } = useUserRole();

  // Проверяем, может ли пользователь просматривать детали тарифа
  const canViewTariffDetails = userRole === Role.Admin || userRole === Role.Operator;

  // Автоматически выбираем тариф при загрузке, если передан initialTariffId
  useEffect(() => {
    if (initialTariffId && !selectedTariff && tariffs.length > 0) {
      const initialTariff = tariffs.find(t => t.id === initialTariffId && !t.archived);
      
      if (initialTariff) {
        setSelectedTariff(initialTariff);
      }
    }
  }, [initialTariffId, selectedTariff, tariffs, setSelectedTariff]);

  const handleTariffSelect = (tariff: GetTariffDTO) => {
    // Не позволяем выбирать архивные тарифы
    if (tariff.archived) return;
    setSelectedTariff(tariff);
  };

  const handleViewTariffDetails = (tariffId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Предотвращаем выбор тарифа при клике на иконку
    window.open(`/tariffs/edit/${tariffId}`, '_blank');
  };

  const toggleArchivedVisibility = () => {
    setShowArchived(!showArchived);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'KGS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };

  // Используем готовый объект с переводами
  const getServiceClassLabel = (serviceClass: ServiceClass): string => {
    return ServiceClassValues[serviceClass] || serviceClass;
  };

  // Используем готовый объект с переводами
  const getCarTypeLabel = (carType: CarType): string => {
    return CarTypeValues[carType] || carType;
  };

  const getTariffBadgeColor = (serviceClass: ServiceClass | undefined) => {
    if (!serviceClass) return 'bg-gray-500 text-white';

    return ServiceClassColors[serviceClass] || 'bg-gray-500 text-white';
  };

  // Фильтруем и сортируем тарифы (архивные в конце)
  const filteredTariffs = tariffs
    .filter(tariff => {
      if (showArchived) return true; // Показываем все

      return !tariff.archived; // Показываем только активные
    })
    .sort((a, b) => {
      // Сначала активные, потом архивные
      if (a.archived === b.archived) return 0;

      return a.archived ? 1 : -1;
    });

  return {
    showArchived,
    filteredTariffs,
    canViewTariffDetails,
    handleTariffSelect,
    handleViewTariffDetails,
    toggleArchivedVisibility,
    formatPrice,
    getServiceClassLabel,
    getCarTypeLabel,
    getTariffBadgeColor,
  };
};

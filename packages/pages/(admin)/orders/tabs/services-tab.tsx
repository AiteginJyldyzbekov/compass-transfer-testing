'use client';

import type { GetOrderServiceDTO } from '@entities/orders/interface';
import type { GetServiceDTO } from '@entities/services/interface';
import { useOrderServices, ServicesList, SelectedServices } from '@features/orders/services';

interface ServicesTabProps {
  services: GetServiceDTO[];
  selectedServices: GetOrderServiceDTO[];
  handleServicesChange: (services: GetOrderServiceDTO[]) => void;
  isInstantOrder?: boolean; // Флаг для моментальных заказов
  [key: string]: unknown;
}

export function ServicesTab({
  services,
  selectedServices,
  handleServicesChange,
  isInstantOrder = false
}: ServicesTabProps) {
  // Используем хук для логики работы с услугами
  const {
    handleServiceToggle,
    handleServiceQuantityChange,
    formatPrice,
  } = useOrderServices({
    services,
    selectedServices,
    handleServicesChange,
    isInstantOrder,
  });

  // Рендеринг компонентов
  return (
    <div className="flex gap-0">
      {/* Основная область с услугами */}
      <div className="flex-1">
        <ServicesList
          services={services}
          selectedServices={selectedServices}
          onToggle={handleServiceToggle}
          onQuantityChange={handleServiceQuantityChange}
          formatPrice={formatPrice}
        />
      </div>

      {/* Сайдбар с выбранными услугами */}
      <SelectedServices
        services={services}
        selectedServices={selectedServices}
        onToggle={handleServiceToggle}
        onQuantityChange={handleServiceQuantityChange}
        formatPrice={formatPrice}
      />
    </div>
  );
}

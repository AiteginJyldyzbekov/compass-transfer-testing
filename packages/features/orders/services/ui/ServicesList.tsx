'use client';

import { Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/layout/card';
import type { GetOrderServiceDTO } from '@entities/orders/interface';
import type { GetServiceDTO } from '@entities/services/interface';
import { ServiceCard } from './ServiceCard';

interface ServicesListProps {
  services: GetServiceDTO[];
  selectedServices: GetOrderServiceDTO[];
  onToggle: (serviceId: string, isQuantifiable: boolean) => void;
  onQuantityChange: (serviceId: string, quantity: number) => void;
  formatPrice: (price: number) => string;
}

export function ServicesList({
  services,
  selectedServices,
  onToggle,
  onQuantityChange,
  formatPrice,
}: ServicesListProps) {
  if (!services || services.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">Дополнительные услуги не найдены</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Дополнительные услуги
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row flex-wrap gap-4">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              selectedServices={selectedServices}
              onToggle={onToggle}
              onQuantityChange={onQuantityChange}
              formatPrice={formatPrice}
            />
          ))}
        </div>
      </CardContent>
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">
              Выберите дополнительные услуги для повышения комфорта поездки
            </p>
            <p className="text-xs mt-1">
              Стоимость услуг будет добавлена к общей сумме заказа
            </p>
          </div>
        </CardContent>
      </Card>
    </Card>
  );
}

'use client';

import { Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/layout/card';
import type { UISelectedService } from '../interfaces';

interface ServicesInfoCardProps {
  services: UISelectedService[];
  formatPrice: (price: number) => string;
}

/**
 * Компонент для отображения информации о выбранных сервисах в сводке заказа
 */
export function ServicesInfoCard({ services, formatPrice }: ServicesInfoCardProps) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="h-5 w-5" />
          Дополнительные услуги
        </CardTitle>
      </CardHeader>
      <CardContent>
        {services.length > 0 ? (
          <div className="space-y-3">
            {services.map((service, index) => (
              <div key={`service-${service.id}-${index}`} className="border-b border-gray-100 pb-2 last:border-b-0 last:pb-0">
                <div className="flex justify-between">
                  <p className="font-medium">{service.name}</p>
                  <p className="font-medium">{formatPrice(service.totalPrice)}</p>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <p>{service.description}</p>
                  <p>
                    {service.quantity > 1 && `${service.quantity} × ${formatPrice(service.price || 0)}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Дополнительные услуги не выбраны</p>
        )}
      </CardContent>
    </Card>
  );
}

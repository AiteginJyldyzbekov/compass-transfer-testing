'use client';

import { Plus, Minus } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@shared/ui/data-display/badge';
import { Button } from '@shared/ui/forms/button';
import type { GetOrderServiceDTO } from '@entities/orders/interface';
import type { GetServiceDTO } from '@entities/services/interface';

interface ServiceCardProps {
  service: GetServiceDTO;
  selectedServices: GetOrderServiceDTO[];
  onToggle: (serviceId: string, isQuantifiable: boolean) => void;
  onQuantityChange: (serviceId: string, quantity: number) => void;
  formatPrice: (price: number) => string;
}

export function ServiceCard({
  service,
  selectedServices,
  onToggle,
  onQuantityChange,
  formatPrice,
}: ServiceCardProps) {
  const selectedService = selectedServices.find(s => s.serviceId === service.id);
  const quantity = selectedService?.quantity || 0;
  const isSelected = quantity > 0;

  return (
    <div
      className={`border rounded-lg p-4 transition-all flex-1 min-w-[300px] max-w-[400px] h-[400px] ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Картинка плейсхолдер */}
        <div className="mb-3 relative">
          <Image
            src="/auto/hongqi.jpg"
            alt={service.name}
            width={400}
            height={128}
            className="w-full h-32 object-cover rounded-md bg-gray-100"
            onError={() => {
              // Обработка ошибки загрузки изображения
            }}
          />
        </div>

        {/* Заголовок и бейджи */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h4 className="font-medium">{service.name}</h4>
            <Badge variant="outline">
              {formatPrice(service.price)}
            </Badge>
            {service.isQuantifiable && (
              <Badge variant="secondary" className="text-xs">
                Количественная
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {service.description}
          </p>
        </div>

        {/* Кнопки управления */}
        <div className="mt-auto">
          <div className="flex items-center justify-center gap-2">
            {service.isQuantifiable && isSelected ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onQuantityChange(service.id, quantity - 1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onQuantityChange(service.id, quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                variant={isSelected ? 'default' : 'outline'}
                size="sm"
                onClick={() => onToggle(service.id, service.isQuantifiable)}
                className="w-full"
              >
                {isSelected ? 'Убрать' : 'Добавить'}
              </Button>
            )}
          </div>

          {/* Резервируем место для общей стоимости количественных услуг */}
          {service.isQuantifiable && (
            <div className="mt-3 pt-3 border-t min-h-[2rem]">
              {isSelected ? (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">
                    {formatPrice(service.price)} × {quantity}
                  </span>
                  <span className="font-medium">
                    {formatPrice(service.price * quantity)}
                  </span>
                </div>
              ) : (
                <div className="text-xs text-muted-foreground text-center opacity-50">
                  Выберите для расчета стоимости
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

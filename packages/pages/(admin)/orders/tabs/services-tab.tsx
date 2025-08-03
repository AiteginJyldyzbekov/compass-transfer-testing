'use client';

import { Package, Plus, Minus } from 'lucide-react';
import Image from 'next/image';
import { useEffect } from 'react';
import { Badge } from '@shared/ui/data-display/badge';
import { Button } from '@shared/ui/forms/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/layout/card';
import type { GetOrderServiceDTO } from '@entities/orders/interface';
import type { GetServiceDTO } from '@entities/services/interface';

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'KGS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };

  // Автоматическое заполнение услуг для моментальных заказов
  useEffect(() => {
    if (isInstantOrder && services.length > 0 && selectedServices.length === 0) {
      // Для моментальных заказов автоматически добавляем самую недорогую услугу
      // Это ускоряет процесс создания заказа
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

  if (!services || services.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">Дополнительные услуги не найдены</p>
      </div>
    );
  }

  return (
    <div className="flex gap-0">
      {/* Основная область с услугами */}
      <div className="flex-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Дополнительные услуги
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-row flex-wrap gap-4">
            {services.map((service) => {
              const selectedService = selectedServices.find(s => s.serviceId === service.id);
              const quantity = selectedService?.quantity || 0;
              const isSelected = quantity > 0;

              return (
                <div
                  key={service.id}
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
                              onClick={() => handleServiceQuantityChange(service.id, quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-medium">{quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleServiceQuantityChange(service.id, quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant={isSelected ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleServiceToggle(service.id, service.isQuantifiable)}
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
            })}
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
      </div>

      {/* Сайдбар с выбранными услугами */}
      <div className="w-80 sticky top-0 h-fit">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Выбранные услуги ({selectedServices.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedServices.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Услуги не выбраны</p>
                <p className="text-xs mt-1">Выберите услуги из списка слева</p>
              </div>
            ) : (
              <div className="flex flex-col gap-0">
                {selectedServices.map((selectedService) => {
                  const service = services.find(s => s.id === selectedService.serviceId);

                  if (!service) return null;

                  const totalPrice = service.price * selectedService.quantity;

                  return (
                    <div key={selectedService.serviceId} className="p-2">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm">{service.name}</h4>
                        <button
                          onClick={() => handleServiceToggle(service.id, service.isQuantifiable)}
                          className="text-red-500 hover:text-red-700 text-xs border p-2 rounded-md"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          {service.isQuantifiable ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleServiceQuantityChange(service.id, selectedService.quantity - 1)}
                                className="w-6 h-6 rounded border bg-white hover:bg-gray-50 flex items-center justify-center text-xs"
                              >
                                −
                              </button>
                              <span className="w-8 text-center font-medium">{selectedService.quantity}</span>
                              <button
                                onClick={() => handleServiceQuantityChange(service.id, selectedService.quantity + 1)}
                                className="w-6 h-6 rounded border bg-white hover:bg-gray-50 flex items-center justify-center text-xs"
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">1 шт</span>
                          )}
                        </div>
                        <span className="font-medium">{formatPrice(totalPrice)}</span>
                      </div>
                    </div>
                  );
                })}

                {/* Итоговая сумма */}
                <div className="border-t pt-3 mt-4">
                  <div className="flex justify-between items-center font-medium">
                    <span>Итого услуг:</span>
                    <span className="text-lg">
                      {formatPrice(selectedServices.reduce((total, selectedService) => {
                        const service = services.find(s => s.id === selectedService.serviceId);

                        return total + (service ? service.price * selectedService.quantity : 0);
                      }, 0))}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

'use client';

import { Package, Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@shared/ui/data-display/badge';
import { Button } from '@shared/ui/forms/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/layout/card';
// import type { GetServiceDTO } from '@entities/services/interface';

interface ServicesTabProps {
  services: any[];
  selectedServices: any[];
  handleServicesChange: (services: any[]) => void;
  [key: string]: any;
}

export function ServicesTab({
  services,
  selectedServices,
  handleServicesChange
}: ServicesTabProps) {

  const handleServiceToggle = (serviceId: string, isQuantifiable: boolean) => {
    const existingService = selectedServices.find(s => s.id === serviceId);

    if (isQuantifiable) {
      if (existingService) {
        const updatedServices = selectedServices.map(s =>
          s.id === serviceId ? { ...s, quantity: s.quantity + 1 } : s
        );

        handleServicesChange(updatedServices);
      } else {
        const service = services.find(s => s.id === serviceId);

        if (service) {
          handleServicesChange([...selectedServices, { ...service, quantity: 1 }]);
        }
      }
    } else {
      if (existingService) {
        const updatedServices = selectedServices.filter(s => s.id !== serviceId);

        handleServicesChange(updatedServices);
      } else {
        const service = services.find(s => s.id === serviceId);

        if (service) {
          handleServicesChange([...selectedServices, { ...service, quantity: 1 }]);
        }
      }
    }
  };

  const handleServiceQuantityChange = (serviceId: string, quantity: number) => {
    if (quantity <= 0) {
      const updatedServices = selectedServices.filter(s => s.id !== serviceId);

      handleServicesChange(updatedServices);
    } else {
      const updatedServices = selectedServices.map(s =>
        s.id === serviceId ? { ...s, quantity } : s
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

  const calculateServicesTotal = () => {
    return selectedServices.reduce((total, service) => {
      return total + (service.price * service.quantity);
    }, 0);
  };

  if (!services || services.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">Дополнительные услуги не найдены</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Дополнительные услуги */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Дополнительные услуги
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {services.map((service) => {
              const selectedService = selectedServices.find(s => s.id === service.id);
              const quantity = selectedService?.quantity || 0;
              const isSelected = quantity > 0;

              return (
                <div
                  key={service.id}
                  className={`border rounded-lg p-4 transition-all ${
                    isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
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
                      <p className="text-sm text-muted-foreground mt-1">
                        {service.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
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
                        >
                          {isSelected ? 'Убрать' : 'Добавить'}
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Показываем общую стоимость для количественных услуг */}
                  {service.isQuantifiable && isSelected && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">
                          {formatPrice(service.price)} × {quantity}
                        </span>
                        <span className="font-medium">
                          {formatPrice(service.price * quantity)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Сводка выбранных услуг */}
      {selectedServices.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Выбранные услуги</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedServices.map((service) => (
                <div key={service.id} className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{service.name}</span>
                    {service.quantity > 1 && (
                      <span className="text-muted-foreground ml-2">× {service.quantity}</span>
                    )}
                  </div>
                  <span className="font-medium">
                    {formatPrice(service.price * service.quantity)}
                  </span>
                </div>
              ))}

              <hr />
              
              {/* Общая стоимость услуг */}
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Итого за услуги:</span>
                <span className="text-blue-600">{formatPrice(calculateServicesTotal())}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Информационная карточка */}
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
    </div>
  );
}

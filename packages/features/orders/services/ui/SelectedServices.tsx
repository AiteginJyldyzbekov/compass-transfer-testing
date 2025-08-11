'use client';

import { Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/layout/card';
import type { GetOrderServiceDTO } from '@entities/orders/interface';
import type { GetServiceDTO } from '@entities/services/interface';

interface SelectedServicesProps {
  services: GetServiceDTO[];
  selectedServices: GetOrderServiceDTO[];
  onToggle: (serviceId: string, isQuantifiable: boolean) => void;
  onQuantityChange: (serviceId: string, quantity: number) => void;
  formatPrice: (price: number) => string;
}

export function SelectedServices({
  services,
  selectedServices,
  onToggle,
  onQuantityChange,
  formatPrice,
}: SelectedServicesProps) {
  // Расчет общей стоимости
  const totalPrice = selectedServices.reduce((total, selectedService) => {
    if (!services || !Array.isArray(services)) {
      return total;
    }
    
    const service = services.find(s => s.id === selectedService.serviceId);
    
    return total + (service ? service.price * selectedService.quantity : 0);
  }, 0);

  return (
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
                if (!services || !Array.isArray(services)) {
                  return null;
                }
                
                const service = services.find(s => s.id === selectedService.serviceId);

                if (!service) return null;

                const itemTotalPrice = service.price * selectedService.quantity;

                return (
                  <div key={selectedService.serviceId} className="p-2">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm">{service.name}</h4>
                      <button
                        onClick={() => onToggle(service.id, service.isQuantifiable)}
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
                              onClick={() => onQuantityChange(service.id, selectedService.quantity - 1)}
                              className="w-6 h-6 rounded border bg-white hover:bg-gray-50 flex items-center justify-center text-xs"
                            >
                              −
                            </button>
                            <span className="w-8 text-center font-medium">{selectedService.quantity}</span>
                            <button
                              onClick={() => onQuantityChange(service.id, selectedService.quantity + 1)}
                              className="w-6 h-6 rounded border bg-white hover:bg-gray-50 flex items-center justify-center text-xs"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">1 шт</span>
                        )}
                      </div>
                      <span className="font-medium">{formatPrice(itemTotalPrice)}</span>
                    </div>
                  </div>
                );
              })}

              {/* Итоговая сумма */}
              <div className="border-t pt-3 mt-4">
                <div className="flex justify-between items-center font-medium">
                  <span>Итого услуг:</span>
                  <span className="text-lg">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

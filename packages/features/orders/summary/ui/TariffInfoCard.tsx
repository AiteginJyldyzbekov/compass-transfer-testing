'use client';

import { Car } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/layout/card';
import { CarTypeValues, type CarType } from '@entities/tariffs/enums/CarType.enum';
import { ServiceClassValues, type ServiceClass } from '@entities/tariffs/enums/ServiceClass.enum';
import type { GetTariffDTO } from '@entities/tariffs/interface';

interface TariffInfoCardProps {
  tariff: GetTariffDTO | null;
}

/**
 * Компонент для отображения информации о тарифе в сводке заказа
 */
export function TariffInfoCard({ tariff }: TariffInfoCardProps) {
  // Получение типа автомобиля в читаемом формате
  const getCarTypeName = (type?: CarType): string => {
    if (!type) return 'Не указан';
    
    return CarTypeValues[type] || 'Не указан';
  };

  // Получение класса сервиса в читаемом формате
  const getServiceClassName = (serviceClass?: ServiceClass): string => {
    if (!serviceClass) return 'Не указан';
    
    return ServiceClassValues[serviceClass] || 'Не указан';
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-5 w-5" />
          Тариф
        </CardTitle>
      </CardHeader>
      <CardContent>
        {tariff ? (
          <div className="space-y-2">
            <p className="font-medium text-lg">{tariff.name}</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-500">Тип автомобиля</p>
                <p>{getCarTypeName(tariff.carType as CarType)}</p>
              </div>
              <div>
                <p className="text-gray-500">Класс сервиса</p>
                <p>{getServiceClassName(tariff.serviceClass as ServiceClass)}</p>
              </div>
            </div>
            {tariff.description && (
              <div className="mt-2 pt-2 border-t border-gray-100">
                <p className="text-gray-500 text-sm">Описание</p>
                <p className="text-sm">{tariff.description}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500">Тариф не выбран</p>
        )}
      </CardContent>
    </Card>
  );
}

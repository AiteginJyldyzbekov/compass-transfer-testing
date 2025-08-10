'use client';

import { UserCheck } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/layout/card';
import type { GetDriverDTO } from '@entities/users/interface';

// Расширяем интерфейс GetDriverDTO, добавляя поля, которые используются в компоненте
interface ExtendedDriverDTO extends GetDriverDTO {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  avatarUrl?: string;
  car?: {
    brand: string;
    model: string;
    color: string;
    plateNumber: string;
  };
  rating?: number;
}

interface DriverInfoCardProps {
  driver: ExtendedDriverDTO | GetDriverDTO | null;
  onDriverChange?: () => void; // Колбэк для смены водителя
}

/**
 * Компонент для отображения информации о водителе в сводке заказа
 */
export function DriverInfoCard({ driver, onDriverChange }: DriverInfoCardProps) {
  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="h-5 w-5" />
          Водитель
        </CardTitle>
        {onDriverChange && (
          <button 
            onClick={onDriverChange}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Изменить
          </button>
        )}
      </CardHeader>
      <CardContent>
        {driver ? (
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              {driver.avatarUrl ? (
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <Image 
                    src={driver.avatarUrl} 
                    alt={`${driver.firstName || ''} ${driver.lastName || ''}`}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                  {driver.firstName?.[0] || ''}{driver.lastName?.[0] || ''}
                </div>
              )}
              <div>
                <p className="font-medium">{driver.firstName || ''} {driver.lastName || ''}</p>
                <p className="text-sm text-gray-600">{driver.phoneNumber}</p>
              </div>
            </div>
            
            {driver.car && (
              <div className="mt-3 pt-2 border-t border-gray-100">
                <p className="text-gray-600 text-sm font-medium">Автомобиль</p>
                <p>{driver.car.brand} {driver.car.model}, {driver.car.color}</p>
                <p className="text-sm text-gray-600">{driver.car.plateNumber}</p>
              </div>
            )}

            {driver.rating !== undefined && (
              <div className="flex items-center gap-1 text-sm">
                <span className="text-yellow-400">★</span>
                <span>{driver.rating !== undefined ? driver.rating.toFixed(1) : '0.0'}</span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500">Водитель не назначен</p>
        )}
      </CardContent>
    </Card>
  );
}

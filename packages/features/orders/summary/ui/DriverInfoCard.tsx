'use client';

import { UserCheck, Info, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@shared/ui/forms/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/layout/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@shared/ui/modals/sheet';
import type { GetDriverDTO } from '@entities/users/interface';

// Используем частичные свойства для улучшенной типизации
type DriverInfo = {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  phoneNumber?: string;
  avatarUrl?: string;
  car?: {
    brand: string;
    model: string;
    color: string;
    plateNumber: string;
  };
  tariff?: {
    name: string;
  };
  rating?: number | null;
};

// Объединяем типы для возможности работы с разными форматами данных о водителе
type ExtendedDriverDTO = GetDriverDTO & DriverInfo;

interface DriverInfoCardProps {
  driver: ExtendedDriverDTO | null;
  onDriverChange?: () => void; // Колбэк для смены водителя
}

/**
 * Компонент для отображения информации о водителе в сводке заказа
 */
export function DriverInfoCard({ driver, onDriverChange }: DriverInfoCardProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  // Обработчики для модального окна
  const handleOpenSheet = () => setIsSheetOpen(true);
  const handleCloseSheet = () => setIsSheetOpen(false);
  
  // Функция для формирования полного имени водителя
  const getFullName = () => {
    if (!driver) return '';
    return [
      driver.lastName || '',
      driver.firstName || '',
      driver.middleName || ''
    ].filter(Boolean).join(' ');
  };
  
  return (
    <>
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
                      alt={getFullName()}
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
                <div className="flex-1">
                  <p className="font-medium">{getFullName()}</p>
                  <p className="text-sm text-gray-600">{driver.phoneNumber}</p>
                  
                  {driver.tariff && (
                    <p className="text-xs text-gray-500">{driver.tariff.name}</p>
                  )}
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-blue-600" 
                  onClick={handleOpenSheet}
                >
                  <Info className="h-4 w-4" />
                </Button>
              </div>
              
              {driver.car && (
                <div className="mt-3 pt-2 border-t border-gray-100">
                  <div className="flex justify-between">
                    <div>
                      <p>{driver.car.brand} {driver.car.model}, {driver.car.color}</p>
                      <p className="text-sm text-gray-600">{driver.car.plateNumber}</p>
                    </div>
                    
                    {driver.rating !== undefined && driver.rating !== null && (
                      <div className="flex items-center gap-1 text-sm">
                        <span className="text-yellow-400">★</span>
                        <span>{driver.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-2">
              <p className="text-gray-500 mb-2">Водитель не выбран</p>
              {onDriverChange && (
                <Button variant="outline" size="sm" onClick={onDriverChange} className="mx-auto">
                  Выбрать водителя
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      {driver && (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent side="right" className="w-full max-w-xl sm:max-w-xl">
            <SheetHeader className="text-left border-b pb-2 mb-4">
              <SheetTitle className="text-xl">
                Информация о водителе
              </SheetTitle>
            </SheetHeader>
            
            <div className="px-1">
              <div className="flex items-center gap-4 mb-6">
                {driver.avatarUrl ? (
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    <Image 
                      src={driver.avatarUrl} 
                      alt={getFullName()}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium text-xl">
                    {driver.firstName?.[0] || ''}{driver.lastName?.[0] || ''}
                  </div>
                )}
                
                <div>
                  <h3 className="font-medium text-lg">{getFullName()}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    {driver.phoneNumber}
                    {driver.rating !== undefined && driver.rating !== null && (
                      <span className="flex items-center gap-1">
                        <span className="text-yellow-400">★</span>
                        <span>{driver.rating.toFixed(1)}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Автомобиль</h4>
                  {driver.car ? (
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="font-medium">{driver.car.brand} {driver.car.model}</p>
                      <p className="text-sm text-gray-600">Цвет: {driver.car.color}</p>
                      <p className="text-sm text-gray-600">Номер: {driver.car.plateNumber}</p>
                    </div>
                  ) : (
                    <p className="text-gray-500">Информация об автомобиле отсутствует</p>
                  )}
                </div>
                
                <div className="pt-3 border-t border-gray-100">
                  <Button variant="ghost" className="w-full justify-between" onClick={handleCloseSheet}>
                    Закрыть <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}

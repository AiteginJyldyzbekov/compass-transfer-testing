'use client';

import { X } from 'lucide-react';
import type { RoutePoint } from '@shared/components/map/types';
import { Button } from '@shared/ui/forms/button';
import { locationTypeIcons } from '@entities/locations/enums/LocationType.enum';

interface RoutePointItemProps {
  point: RoutePoint;
  index: number;
  isSelected: boolean;
  onSelect: (index: number) => void;
  onClear?: (index: number) => void;
}

/**
 * Компонент для отображения точки маршрута
 */
export function RoutePointItem({
  point,
  index,
  isSelected,
  onSelect,
  onClear,
}: RoutePointItemProps) {
  // Функции для отображения (только верстка!)
  const getPointLabel = (point: RoutePoint, index: number) => {
    if (point.type === 'start') return 'A';
    if (point.type === 'end') return 'B';

    return String.fromCharCode(67 + index - 1); // C, D, E, etc.
  };

  const getPointColor = (point: RoutePoint) => {
    if (point.type === 'start') return 'bg-green-500';
    if (point.type === 'end') return 'bg-red-500';

    return 'bg-blue-500';
  };

  return (
    <div
      className={`p-2 transition-all border rounded ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
      }`}
    >
      <div className='flex flex-col gap-1'>
        <div className='flex flex-row items-center gap-3'>
          {/* Иконка точки */}
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${getPointColor(point)}`}
          >
            {getPointLabel(point, index)}
          </div>

          {/* Информация о точке */}
          <div className='flex-1'>
            <p className='font-medium'>{point.label}</p>
            {point.location ? (
              <div>
                <p className='text-sm text-gray-600 flex items-center gap-1'>
                  <span>
                    {locationTypeIcons[point.location.type as keyof typeof locationTypeIcons]}
                  </span>
                  {point.location.name}
                </p>
              </div>
            ) : (
              <p className='text-sm text-gray-400'>Не выбрано</p>
            )}
          </div>

          {/* Действия */}
          <div className='flex items-center gap-2'>
          {point.location && point.location.name ? (
            <Button
              variant='outline'
              size='sm'
              onClick={() => onClear?.(index)}
              className='text-red-600 hover:text-red-700'
            >
              <X className='h-4 w-4' />
            </Button>
          ) : (
            <Button
              variant={isSelected ? 'default' : 'outline'}
              size='sm'
              onClick={() => onSelect(index)}
            >
              {isSelected ? 'Отмена' : 'Выбрать'}
            </Button>
          )}
          </div>
        </div>

        {/* Адрес локации */}
        {point.location?.address && (
          <p className='text-xs text-gray-500 mt-1'>
            {point.location.address}
          </p>
        )}
      </div>
    </div>
  );
}

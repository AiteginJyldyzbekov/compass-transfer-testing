'use client';

import { MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/layout/card';

interface RouteInfoCardProps {
  startLocation: string;
  endLocation: string;
  intermediatePoints: string[];
  distance: string;
}

/**
 * Компонент для отображения информации о маршруте в сводке заказа
 */
export function RouteInfoCard({
  startLocation,
  endLocation,
  intermediatePoints,
  distance
}: RouteInfoCardProps) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Маршрут
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          {/* Начальная точка - маркер A */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 bg-green-500 text-white text-xs font-bold rounded-full flex items-center justify-center mt-0.5">
              A
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm text-gray-500">Начальная точка</p>
              <p className="text-base">{startLocation}</p>
            </div>
          </div>

          {/* Дополнительные остановки - маркеры B, C, D... */}
          {intermediatePoints.map((point, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center mt-0.5">
                {String.fromCharCode(66 + index)} {/* B, C, D... */}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm text-gray-500">Остановка {index + 1}</p>
                <p className="text-base">{point}</p>
              </div>
            </div>
          ))}

          {/* Конечная точка - последний маркер */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center mt-0.5">
              {String.fromCharCode(66 + intermediatePoints.length)} {/* B, C, D... в зависимости от количества остановок */}
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm text-gray-500">Конечная точка</p>
              <p className="text-base">{endLocation}</p>
            </div>
          </div>

          {/* Расстояние */}
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <div>
                <p className="font-medium text-sm text-gray-500">Расстояние</p>
                <p className="text-base font-medium">{distance}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

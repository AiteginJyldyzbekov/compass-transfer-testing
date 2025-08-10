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
        <div className="grid grid-cols-1 gap-4">
          <div>
            <p className="font-medium text-sm">Начальная точка:</p>
            <p className="text-base">{startLocation}</p>
          </div>

          {intermediatePoints.length > 0 && (
            <div>
              <p className="font-medium text-sm">Промежуточные точки:</p>
              <ul className="list-disc pl-5 text-base">
                {intermediatePoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <p className="font-medium text-sm">Конечная точка:</p>
            <p className="text-base">{endLocation}</p>
          </div>

          <div>
            <p className="font-medium text-sm">Расстояние:</p>
            <p className="text-base">{distance}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

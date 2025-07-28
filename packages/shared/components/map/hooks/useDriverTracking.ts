'use client';

import { useMemo } from 'react';
import { calculateDistanceToLineSegment } from '../utils';

interface UseDriverTrackingProps {
  currentDriverLocation?: { latitude: number; longitude: number };
  routeCoordinates: [number, number][];
  routeDeviationThreshold?: number;
  onRouteDeviation?: (isOffRoute: boolean, distance?: number) => void;
}

/**
 * Хук для отслеживания отклонения водителя от маршрута
 */
export const useDriverTracking = ({
  currentDriverLocation,
  routeCoordinates,
  routeDeviationThreshold = 100,
  onRouteDeviation,
}: UseDriverTrackingProps) => {
  const { isDriverOffRoute } = useMemo(() => {
    if (!currentDriverLocation || routeCoordinates.length < 2) {
      return { isDriverOffRoute: false };
    }

    // Находим минимальное расстояние от водителя до любой точки маршрута
    let minDistance = Infinity;

    for (let i = 0; i < routeCoordinates.length - 1; i++) {
      const [lat1, lon1] = routeCoordinates[i];
      const [lat2, lon2] = routeCoordinates[i + 1];

      // Вычисляем расстояние от водителя до каждого сегмента маршрута
      const distanceToSegment = calculateDistanceToLineSegment(
        currentDriverLocation.latitude,
        currentDriverLocation.longitude,
        lat1,
        lon1,
        lat2,
        lon2,
      );

      minDistance = Math.min(minDistance, distanceToSegment);
    }

    const isOffRoute = minDistance > routeDeviationThreshold;

    // Вызываем callback при изменении статуса
    if (onRouteDeviation) {
      onRouteDeviation(isOffRoute, minDistance);
    }

    return { isDriverOffRoute: isOffRoute };
  }, [
    currentDriverLocation,
    routeCoordinates,
    routeDeviationThreshold,
    onRouteDeviation,
  ]);

  return { isDriverOffRoute };
};

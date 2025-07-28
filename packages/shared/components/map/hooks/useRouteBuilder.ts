'use client';

import { useState, useEffect } from 'react';
import type { RoutePoint } from '../types';

/**
 * Хук для построения маршрута между точками
 */
export const useRouteBuilder = (showRoute: boolean, routePoints: RoutePoint[]) => {
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);

  useEffect(() => {
    if (!showRoute || routePoints.length < 2) {
      setRouteCoordinates([]);

      return;
    }

    let isCancelled = false;
    const controller = new AbortController();

    const buildRoute = async (signal: AbortSignal) => {
      try {
        // Сразу очищаем старый маршрут
        setRouteCoordinates([]);

        // Используем улучшенный сервис роутинга
        const { routingService } = await import('../services/routingService');
        const { RouteType } = await import('../types');

        const routeResult = await routingService.buildRoute(routePoints, RouteType.FASTEST);

        if (!signal.aborted && !isCancelled) {
          setRouteCoordinates(routeResult.coordinates);
        }
      } catch (error) {
        console.warn('Ошибка построения маршрута:', error);

        if (!signal.aborted && !isCancelled) {
          // Fallback к простой линии только в случае ошибки всех API
          const coordinates: [number, number][] = routePoints.map(point => [
            point.latitude,
            point.longitude,
          ]);

          setRouteCoordinates(coordinates);
        }
      }
    };

    buildRoute(controller.signal);

    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, [showRoute, routePoints]);

  return routeCoordinates;
};

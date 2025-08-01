'use client';

import { useState, useEffect, useMemo } from 'react';
import type { RoutePoint } from '../types';

/**
 * Хук для построения маршрута между точками
 */
export const useRouteBuilder = (showRoute: boolean, routePoints: RoutePoint[]) => {
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
  const [routeDistance, setRouteDistance] = useState<number>(0); // в метрах

  // Мемоизируем точки с локациями для предотвращения лишних перерасчетов
  const validRoutePoints = useMemo(() => {
    return routePoints.filter(point =>
      point.latitude &&
      point.longitude &&
      typeof point.latitude === 'number' &&
      typeof point.longitude === 'number'
    );
  }, [routePoints]);

  // Мемоизируем строку координат для сравнения изменений
  const coordinatesKey = useMemo(() => {
    return validRoutePoints
      .map(point => `${point.latitude},${point.longitude}`)
      .join('|');
  }, [validRoutePoints]);

  useEffect(() => {
    if (!showRoute || validRoutePoints.length < 2) {
      setRouteCoordinates([]);
      setRouteDistance(0);

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

        const routeResult = await routingService.buildRoute(validRoutePoints, RouteType.FASTEST);

        if (!signal.aborted && !isCancelled) {
          setRouteCoordinates(routeResult.coordinates);
          setRouteDistance(routeResult.distance); // сохраняем расстояние в метрах
        }
      } catch (error) {
        console.warn('Ошибка построения маршрута:', error);

        if (!signal.aborted && !isCancelled) {
          // Fallback к простой линии только в случае ошибки всех API
          const coordinates: [number, number][] = validRoutePoints.map(point => [
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
  }, [showRoute, validRoutePoints, coordinatesKey]);

  return { routeCoordinates, routeDistance };
};

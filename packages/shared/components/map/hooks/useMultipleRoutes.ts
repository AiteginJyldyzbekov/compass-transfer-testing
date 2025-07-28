'use client';

import { useState, useEffect } from 'react';
import type { RoutePoint, RouteResult, RouteType } from '../types';

/**
 * Хук для построения множественных маршрутов разных типов
 */
export const useMultipleRoutes = (showRoutes: boolean, routePoints: RoutePoint[]) => {
  const [routes, setRoutes] = useState<RouteResult[]>([]);
  const [selectedRouteType, setSelectedRouteType] = useState<RouteType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!showRoutes || routePoints.length < 2) {
      setRoutes([]);
      setSelectedRouteType(null);

      return;
    }

    let isCancelled = false;
    const controller = new AbortController();

    const buildRoutes = async () => {
      setIsLoading(true);

      try {
        // Сразу очищаем старые маршруты
        setRoutes([]);
        setSelectedRouteType(null);

        // Динамически импортируем сервис роутинга
        const { routingService } = await import('../services/routingService');

        // Строим все типы маршрутов параллельно
        const allRoutes = await routingService.buildAllRoutes(routePoints);

        if (!controller.signal.aborted && !isCancelled && allRoutes.length > 0) {
          setRoutes(allRoutes);
          // По умолчанию выбираем быстрый маршрут
          setSelectedRouteType(allRoutes[0].type);
        }
      } catch {
        // Обрабатываем ошибки построения маршрутов

        if (!controller.signal.aborted && !isCancelled) {
          // Fallback к простой линии
          const { ROUTE_TYPE_CONFIG } = await import('../services/routingService');
          const { RouteType } = await import('../types');
          const fallbackRoute: RouteResult = {
            type: RouteType.FASTEST,
            coordinates: routePoints.map(point => [point.latitude, point.longitude]),
            distance: 0,
            duration: 0,
            info: ROUTE_TYPE_CONFIG[RouteType.FASTEST],
          };

          setRoutes([fallbackRoute]);
          setSelectedRouteType(RouteType.FASTEST);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    buildRoutes();

    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, [showRoutes, routePoints]);

  // Получить выбранный маршрут
  const selectedRoute = routes.find(route => route.type === selectedRouteType) || null;

  // Получить координаты выбранного маршрута для отображения на карте
  const selectedRouteCoordinates = selectedRoute?.coordinates || [];

  return {
    routes,
    selectedRoute,
    selectedRouteType,
    selectedRouteCoordinates,
    setSelectedRouteType,
    isLoading,
  };
};

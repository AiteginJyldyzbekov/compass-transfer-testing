'use client';

import { useState, useEffect, useCallback } from 'react';
import type { GetLocationDTO } from '@entities/locations/interface';

interface RoutePoint {
  type: 'start' | 'end' | 'additional';
  location: GetLocationDTO | null;
  label: string;
}

/**
 * Хук для управления точками маршрута
 * SRP: отвечает только за логику управления точками маршрута
 */
export const useRoutePoints = (
  selectedLocations: GetLocationDTO[],
  onLocationsChange: (locations: GetLocationDTO[]) => void,
) => {
  // Состояние для точек маршрута
  const [routePoints, setRoutePoints] = useState<RoutePoint[]>([
    { type: 'start', location: null, label: 'Точка А (начало поездки)' },
    { type: 'end', location: null, label: 'Точка Б (конец поездки)' },
  ]);

  // Синхронизация точек маршрута с selectedLocations
  // СТРОГАЯ ПРИВЯЗКА: [start, ...additionalStops, end]
  useEffect(() => {
    const newRoutePoints: RoutePoint[] = [
      {
        type: 'start',
        location: selectedLocations[0] || null,
        label: 'Точка А (начало поездки)',
      },
    ];

    // Дополнительные остановки (все кроме первой и последней)
    if (selectedLocations.length > 2) {
      for (let i = 1; i < selectedLocations.length - 1; i++) {
        newRoutePoints.push({
          type: 'additional',
          location: selectedLocations[i],
          label: `Доп точка ${i}`,
        });
      }
    }

    // Конечная точка (только если есть минимум 2 локации)
    if (selectedLocations.length >= 2) {
      newRoutePoints.push({
        type: 'end',
        location: selectedLocations[selectedLocations.length - 1],
        label: 'Точка Б (конец поездки)',
      });
    } else {
      // Если только одна локация, показываем пустую конечную точку
      newRoutePoints.push({
        type: 'end',
        location: null,
        label: 'Точка Б (конец поездки)',
      });
    }

    setRoutePoints(newRoutePoints);
  }, [selectedLocations]);

  /**
   * Выбрать локацию для точки маршрута
   * СТРОГАЯ ПРИВЯЗКА: каждая позиция в селекторе соответствует позиции в массиве
   */
  const selectLocationForPoint = useCallback((location: GetLocationDTO, pointIndex: number) => {
    const newLocations = [...selectedLocations];

    if (pointIndex === -1) {
      // Добавляем новую дополнительную точку
      if (selectedLocations.length < 5) {
        // Максимум 5 точек
        if (selectedLocations.length < 2) {
          // Если меньше 2 точек, добавляем в конец
          newLocations.push(location);
        } else {
          // Вставляем перед последней точкой (конечной)
          newLocations.splice(selectedLocations.length - 1, 0, location);
        }
      }
    } else {
      // Обновляем существующую позицию
      const routePoint = routePoints[pointIndex];

      if (routePoint.type === 'start') {
        // Начальная точка - позиция 0
        newLocations[0] = location;
      } else if (routePoint.type === 'end') {
        // Конечная точка
        if (selectedLocations.length === 1) {
          // Если была только начальная точка, добавляем конечную
          newLocations.push(location);
        } else {
          // Заменяем последнюю точку
          newLocations[newLocations.length - 1] = location;
        }
      } else if (routePoint.type === 'additional') {
        // Дополнительная точка - находим её позицию
        const additionalIndex = pointIndex - 1; // -1 потому что первая точка - start
        const actualIndex = 1 + additionalIndex; // +1 потому что после start

        newLocations[actualIndex] = location;
      }
    }

    onLocationsChange(newLocations);
  }, [selectedLocations, routePoints, onLocationsChange]);
  /**
   * Удалить точку маршрута
   * СТРОГАЯ ПРИВЯЗКА: удаляем из правильной позиции в массиве
   */
  const removeRoutePoint = useCallback((pointIndex: number) => {
    const newLocations = [...selectedLocations];
    const routePoint = routePoints[pointIndex];

    if (routePoint.type === 'start') {
      // Удаляем начальную точку - сдвигаем все влево
      newLocations.shift();
    } else if (routePoint.type === 'end') {
      // Удаляем конечную точку
      newLocations.pop();
    } else if (routePoint.type === 'additional') {
      // Удаляем дополнительную точку
      const additionalIndex = pointIndex - 1; // -1 потому что первая точка - start
      const actualIndex = 1 + additionalIndex; // +1 потому что после start

      newLocations.splice(actualIndex, 1);
    }

    onLocationsChange(newLocations);
  }, [selectedLocations, routePoints, onLocationsChange]);

  return {
    routePoints,
    selectLocationForPoint,
    removeRoutePoint,
  };
};

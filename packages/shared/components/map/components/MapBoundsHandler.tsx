'use client';

import React, { useEffect, useCallback } from 'react';
import { useMap } from 'react-leaflet';
import type { MapBounds } from '../types';

interface MapBoundsHandlerProps {
  onBoundsChange?: (bounds: MapBounds) => void;
}

/**
 * Компонент для отслеживания изменений границ карты
 */
export const MapBoundsHandler: React.FC<MapBoundsHandlerProps> = ({ onBoundsChange }) => {
  const map = useMap();

  const handleBoundsChange = useCallback(
    (_isInitialLoad: boolean = false) => {
      if (!onBoundsChange) return;

      const bounds = map.getBounds();
      const boundsData: MapBounds = {
        latFrom: bounds.getSouth(),
        latTo: bounds.getNorth(),
        longFrom: bounds.getWest(),
        longTo: bounds.getEast(),
      };

      onBoundsChange(boundsData);
    },
    [map, onBoundsChange],
  );

  useEffect(() => {
    if (!onBoundsChange) return;

    let timeoutId: NodeJS.Timeout | null = null;
    let lastBoundsKey: string | null = null;

    const debouncedBoundsChange = () => {
      const bounds = map.getBounds();
      const boundsKey = `${bounds.getSouth().toFixed(6)},${bounds.getNorth().toFixed(6)},${bounds.getWest().toFixed(6)},${bounds.getEast().toFixed(6)}`;

      // Проверяем, действительно ли границы изменились
      if (lastBoundsKey === boundsKey) {
        return;
      }

      lastBoundsKey = boundsKey;

      // Дебаунс для предотвращения слишком частых вызовов
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        handleBoundsChange(false);
      }, 500); // 500ms дебаунс
    };

    // Вызываем сразу при монтировании для получения начальных границ
    handleBoundsChange(true);

    // Подписываемся на события изменения карты
    map.on('moveend', debouncedBoundsChange);
    map.on('zoomend', debouncedBoundsChange);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      map.off('moveend', debouncedBoundsChange);
      map.off('zoomend', debouncedBoundsChange);
    };
  }, [map, onBoundsChange, handleBoundsChange]);

  return null;
};

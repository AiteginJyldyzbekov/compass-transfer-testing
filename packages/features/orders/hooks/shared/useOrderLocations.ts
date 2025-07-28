'use client';

import { useState, useEffect } from 'react';
import type { GetLocationDTO } from '@entities/locations/interface';

interface UseOrderLocationsProps {
  startLocationId?: string | null;
  endLocationId?: string | null;
  additionalStops?: string[];
  mode?: string;
}

interface UseOrderLocationsReturn {
  selectedLocations: GetLocationDTO[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Хук для загрузки локаций заказа по их ID
 */
export const useOrderLocations = ({
  startLocationId,
  endLocationId,
  additionalStops = [],
  mode,
}: UseOrderLocationsProps): UseOrderLocationsReturn => {
  const [selectedLocations, setSelectedLocations] = useState<GetLocationDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLocations = async () => {
      // Только в режиме редактирования и если есть ID локаций
      if (mode !== 'edit' || (!startLocationId && !endLocationId && additionalStops.length === 0)) {
        setSelectedLocations([]);

        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Собираем все ID локаций
        const locationIds = [
          startLocationId,
          ...additionalStops,
          endLocationId,
        ].filter(Boolean) as string[];

        if (locationIds.length === 0) {
          setSelectedLocations([]);

          return;
        }

        // TODO: Заменить на реальный API вызов
        // const locations = await locationsApi.getLocationsByIds(locationIds);

        // Временные моковые данные
        const mockLocations: GetLocationDTO[] = [
          { id: '1', name: 'Аэропорт Манас', address: 'Аэропорт Манас, Бишкек' },
          { id: '2', name: 'Центральная площадь', address: 'Центральная площадь, Бишкек' },
          { id: '3', name: 'Железнодорожный вокзал', address: 'ЖД вокзал, Бишкек' },
          { id: '4', name: 'Торговый центр', address: 'ТЦ Дордой Плаза, Бишкек' },
        ];

        // Фильтруем и сортируем локации в правильном порядке
        const orderedLocations: GetLocationDTO[] = [];
        
        if (startLocationId) {
          const startLocation = mockLocations.find(loc => loc.id === startLocationId);

          if (startLocation) orderedLocations.push(startLocation);
        }

        additionalStops.forEach(stopId => {
          const stopLocation = mockLocations.find(loc => loc.id === stopId);

          if (stopLocation) orderedLocations.push(stopLocation);
        });

        if (endLocationId) {
          const endLocation = mockLocations.find(loc => loc.id === endLocationId);

          if (endLocation) orderedLocations.push(endLocation);
        }

        setSelectedLocations(orderedLocations);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки локаций');
        setSelectedLocations([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadLocations();
  }, [startLocationId, endLocationId, additionalStops, mode]);

  return {
    selectedLocations,
    isLoading,
    error,
  };
};

'use client';

import { useState, useEffect } from 'react';
import { logger } from '@shared/lib';
import type { LocationDTO } from '@entities/locations/interface/LocationDTO';
import type { LocationListResponseDTO } from '@entities/locations/interface/LocationListDTO';
import { getMockLocationById } from '@entities/locations/mock-data/terminal-location-mock';

/**
 * Mock функция для получения всех локаций
 * В реальном приложении здесь будет вызов API GET /Location
 */
const getMockAllLocations = async (): Promise<LocationListResponseDTO> => {
  // Имитируем задержку сети
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Получаем все доступные локации из mock данных
  const locationIds = [
    '550e8400-e29b-41d4-a716-446655440201', // Ошский рынок
    '550e8400-e29b-41d4-a716-446655440101', // Аэропорт Манас
    '550e8400-e29b-41d4-a716-446655440102', // Центр города
    '550e8400-e29b-41d4-a716-446655440301', // Микрорайон Джал
    '550e8400-e29b-41d4-a716-446655440104', // Восточный район
    '550e8400-e29b-41d4-a716-446655440105', // Западный район
  ];
  
  const locations: LocationDTO[] = [];

  for (const id of locationIds) {
    const location = await getMockLocationById(id);
    
    if (location) {
      locations.push(location);
    }
  }
  
  return {
    data: locations,
    totalCount: locations.length,
    pageSize: locations.length,
    hasPrevious: false,
    hasNext: false,
  };
};

/**
 * Хук для получения всех локаций
 */
export const useAllLocations = (): {
  locations: LocationDTO[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
} => {
  const [locations, setLocations] = useState<LocationDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLocations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // В реальном приложении здесь будет вызов API
      // const response = await fetch('/api/locations');
      // const data = await response.json();
      
      const data = await getMockAllLocations();
      
      setLocations(data.data);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Произошла ошибка при загрузке локаций';
      
      setError(errorMessage);
      setLocations([]);
      
      if (process.env.NODE_ENV !== 'production') {
        logger.error('Ошибка загрузки всех локаций:', err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const refetch = async () => {
    await fetchLocations();
  };

  return {
    locations,
    isLoading,
    error,
    refetch,
  };
};

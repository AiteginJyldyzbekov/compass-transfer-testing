'use client';

import { useState, useEffect } from 'react';
import { LocationType } from '@entities/locations/enums';
import type { GetLocationDTO } from '@entities/locations/interface';
import { useLocations } from './useLocations';

/**
 * Хук для работы с локациями аэропортов
 */
export const useAirportLocations = () => {
  const { fetchLocationsByType, isLoading, error } = useLocations();
  const [airportLocations, setAirportLocations] = useState<GetLocationDTO[]>([]);

  /**
   * Загружает локации аэропортов при монтировании компонента
   */
  useEffect(() => {
    const loadAirportLocations = async () => {
      const airports = await fetchLocationsByType(LocationType.Airport);

      setAirportLocations(airports);
    };

    loadAirportLocations();
  }, [fetchLocationsByType]);

  /**
   * Обновляет список аэропортов
   */
  const refreshAirportLocations = async () => {
    const airports = await fetchLocationsByType(LocationType.Airport);
    
    setAirportLocations(airports);
  };

  return {
    airportLocations,
    isLoading,
    error,
    refreshAirportLocations,
  };
};

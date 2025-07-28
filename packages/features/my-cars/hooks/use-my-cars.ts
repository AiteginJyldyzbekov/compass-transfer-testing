'use client';

import { useState, useEffect, useCallback } from 'react';
import { carsApi, type GetMyCarParams } from '@shared/api/cars';
import { logger } from '@shared/lib';
import type { GetCarDTO, GetCarDTOKeysetPaginationResult } from '@entities/cars/interface';

interface UseMyCarsReturn {
  cars: GetCarDTO[];
  totalCount: number;
  pageSize: number;
  hasPrevious: boolean;
  hasNext: boolean;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateFilters: (params: GetMyCarParams) => void;
  currentFilters: GetMyCarParams;
}

export function useMyCars(initialParams?: GetMyCarParams): UseMyCarsReturn {
  const [data, setData] = useState<GetCarDTOKeysetPaginationResult>({
    data: [],
    totalCount: 0,
    pageSize: 10,
    hasPrevious: false,
    hasNext: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentFilters, setCurrentFilters] = useState<GetMyCarParams>(
    initialParams || { Size: 10 }
  );

  const fetchCars = useCallback(async (params: GetMyCarParams = currentFilters) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await carsApi.getMyCars(params);
      
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки автомобилей';
      
      setError(errorMessage);
      logger.error('Failed to fetch cars:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentFilters]);

  const updateFilters = useCallback((params: GetMyCarParams) => {
    setCurrentFilters(params);
    fetchCars(params);
  }, [fetchCars]);

  const refetch = useCallback(() => {
    return fetchCars(currentFilters);
  }, [fetchCars, currentFilters]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  return {
    cars: data.data,
    totalCount: data.totalCount,
    pageSize: data.pageSize,
    hasPrevious: data.hasPrevious,
    hasNext: data.hasNext,
    isLoading,
    error,
    refetch,
    updateFilters,
    currentFilters,
  };
}

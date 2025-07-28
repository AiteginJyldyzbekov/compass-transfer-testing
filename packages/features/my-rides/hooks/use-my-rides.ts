'use client';

import { useState, useEffect, useCallback } from 'react';
import { ridesApi, type GetMyRidesParams } from '@shared/api/rides';
import { logger } from '@shared/lib';
import type { GetRideDTO, ScheduledRideDTO, ScheduledRidesParams } from '@entities/rides/interface';

interface UseMyRidesReturn {
  rides: GetRideDTO[];
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateParams: (params: GetMyRidesParams) => void;
  currentParams: GetMyRidesParams;
}

export function useMyRides(initialParams?: GetMyRidesParams): UseMyRidesReturn {
  const [data, setData] = useState({
    data: [] as GetRideDTO[],
    total: 0,
    page: 1,
    limit: 10,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentParams, setCurrentParams] = useState<GetMyRidesParams>(
    initialParams || { Size: 10 }
  );

  const fetchRides = useCallback(async (params: GetMyRidesParams = currentParams) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await ridesApi.getMyRides(params);
      
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки поездок';
      
      setError(errorMessage);
      logger.error('Failed to fetch rides:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentParams]);

  const updateParams = useCallback((params: GetMyRidesParams) => {
    setCurrentParams(params);
    fetchRides(params);
  }, [fetchRides]);

  const refetch = useCallback(() => {
    return fetchRides(currentParams);
  }, [fetchRides, currentParams]);

  useEffect(() => {
    fetchRides();
  }, [fetchRides]);

  return {
    rides: data.data,
    total: data.total,
    page: data.page,
    limit: data.limit,
    isLoading,
    error,
    refetch,
    updateParams,
    currentParams,
  };
}

interface UseScheduledRidesReturn {
  rides: ScheduledRideDTO[];
  totalCount: number;
  pageSize: number;
  hasPrevious: boolean;
  hasNext: boolean;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateParams: (params: ScheduledRidesParams) => void;
  currentParams: ScheduledRidesParams;
}

export function useScheduledRides(initialParams?: ScheduledRidesParams): UseScheduledRidesReturn {
  const [data, setData] = useState({
    data: [] as ScheduledRideDTO[],
    totalCount: 0,
    pageSize: 10,
    hasPrevious: false,
    hasNext: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentParams, setCurrentParams] = useState<ScheduledRidesParams>(
    initialParams || { size: 10 }
  );

  const fetchScheduledRides = useCallback(async (params: ScheduledRidesParams = currentParams) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await ridesApi.getMyAssignedRides(params);
      
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки запланированных поездок';
      
      setError(errorMessage);
      logger.error('Failed to fetch scheduled rides:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentParams]);

  const updateParams = useCallback((params: ScheduledRidesParams) => {
    setCurrentParams(params);
    fetchScheduledRides(params);
  }, [fetchScheduledRides]);

  const refetch = useCallback(() => {
    return fetchScheduledRides(currentParams);
  }, [fetchScheduledRides, currentParams]);

  useEffect(() => {
    fetchScheduledRides();
  }, [fetchScheduledRides]);

  return {
    rides: data.data,
    totalCount: data.totalCount,
    pageSize: data.pageSize,
    hasPrevious: data.hasPrevious,
    hasNext: data.hasNext,
    isLoading,
    error,
    refetch,
    updateParams,
    currentParams,
  };
}

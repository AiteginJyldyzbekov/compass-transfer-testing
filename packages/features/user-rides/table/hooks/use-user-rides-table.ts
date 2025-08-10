import { useState, useEffect, useCallback } from 'react';
import { ridesApi } from '@shared/api/rides';
import type { GetRideDTO } from '@entities/rides/interface';

// Интерфейс для параметров запроса поездок
interface RideFilters {
  // Параметры пагинации
  first?: boolean;
  after?: string | undefined;
  size?: number;
  
  // Параметры сортировки
  sortBy?: string;
  sortOrder?: 'Asc' | 'Desc';
  
  // Фильтры
  'Id.Contains'?: string;
  'Status.In'?: string[];
  
  // Идентификатор водителя
  DriverId?: string;
}

interface ColumnVisibility {
  status: boolean;
  startLocation: boolean;
  endLocation: boolean;
  distance: boolean;
  duration: boolean;
  startTime: boolean;
  endTime: boolean;
  actions: boolean;
}

export function useUserRidesTable(userId: string) {
  const [paginatedRides, setPaginatedRides] = useState<GetRideDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Фильтры
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Пагинация
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [currentCursor, setCurrentCursor] = useState<string | null>(null);
  const [cursorsHistory, setCursorsHistory] = useState<(string | null)[]>([]);
  const [isFirstPage, setIsFirstPage] = useState(true);
  
  // Сортировка
  const [sortBy, setSortBy] = useState<string>('startTime');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Видимость колонок
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    status: true,
    startLocation: true,
    endLocation: true,
    distance: true,
    duration: false,
    startTime: true,
    endTime: false,
    actions: true,
  });

  const fetchRides = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params: RideFilters = {
        first: isFirstPage,
        after: currentCursor || undefined,
        size: pageSize,
        sortBy: sortBy,
        sortOrder: sortOrder === 'asc' ? 'Asc' : 'Desc',
      };

      // Добавляем фильтры
      if (searchTerm) {
        params['Id.Contains'] = searchTerm;
      }

      if (statusFilter.length > 0) {
        params['Status.In'] = statusFilter;
      }

      // Добавляем фильтр по пользователю
      params['DriverId'] = userId;

      const response = await ridesApi.getUserRides(userId, params);

      setPaginatedRides(response.data || []);
      setTotalCount(response.totalCount || 0);
      setHasNext(response.hasNext || false);
      setHasPrevious(response.hasPrevious || false);

    } catch (err) {
      console.error('Ошибка загрузки поездок пользователя:', err);
      setError(err instanceof Error ? err.message : 'Ошибка загрузки поездок');
    } finally {
      setLoading(false);
    }
  }, [userId, pageSize, sortBy, sortOrder, searchTerm, statusFilter, currentCursor, isFirstPage]);

  // Загружаем данные при изменении фильтров
  useEffect(() => {
    fetchRides();
  }, [fetchRides]);

  const handleNextPage = useCallback(() => {
    if (paginatedRides.length > 0) {
      const lastRide = paginatedRides[paginatedRides.length - 1];

      // Сохраняем текущий cursor в историю
      setCursorsHistory(prev => [...prev, currentCursor]);
      setCurrentCursor(lastRide.id);
      setIsFirstPage(false);
      setCurrentPageNumber(prev => prev + 1);
    }
  }, [paginatedRides, currentCursor]);

  const handlePrevPage = useCallback(() => {
    if (cursorsHistory.length > 0) {
      // Берем предыдущий cursor из истории
      const newHistory = [...cursorsHistory];
      const prevCursor = newHistory.pop();

      setCursorsHistory(newHistory);
      setCurrentCursor(prevCursor || null);
      setIsFirstPage(prevCursor === null);
      setCurrentPageNumber(prev => prev - 1);
    }
  }, [cursorsHistory]);

  const handleFirstPage = useCallback(() => {
    setCursorsHistory([]);
    setCurrentCursor(null);
    setIsFirstPage(true);
    setCurrentPageNumber(1);
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setCursorsHistory([]);
    setCurrentCursor(null);
    setIsFirstPage(true);
    setCurrentPageNumber(1);
  }, []);

  const handleColumnVisibilityChange = useCallback((column: keyof ColumnVisibility, visible: boolean) => {
    setColumnVisibility(prev => ({
      ...prev,
      [column]: visible,
    }));
  }, []);

  const handleStatusFilterChange = useCallback((statuses: string[]) => {
    setStatusFilter(statuses);
    setCursorsHistory([]);
    setCurrentCursor(null);
    setIsFirstPage(true);
    setCurrentPageNumber(1);
  }, []);

  const handleSortChange = useCallback((column: string, order: 'asc' | 'desc') => {
    setSortBy(column);
    setSortOrder(order);
    setCursorsHistory([]);
    setCurrentCursor(null);
    setIsFirstPage(true);
    setCurrentPageNumber(1);
  }, []);

  const refetch = useCallback(() => {
    fetchRides();
  }, [fetchRides]);

  return {
    paginatedRides,
    loading,
    error,
    searchTerm,
    statusFilter,
    showAdvancedFilters,
    pageSize,
    columnVisibility,
    totalCount,
    hasNext,
    hasPrevious,
    currentPageNumber,
    sortBy,
    sortOrder,
    setSearchTerm,
    setShowAdvancedFilters,
    handleNextPage,
    handlePrevPage,
    handleFirstPage,
    handlePageSizeChange,
    handleColumnVisibilityChange,
    handleStatusFilterChange,
    handleSortChange,
    refetch,
  };
}

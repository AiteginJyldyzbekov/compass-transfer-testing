import { useState, useEffect, useCallback } from 'react';
import { ordersApi } from '@shared/api/orders';
import type { GetOrderDTO } from '@entities/orders/interface';
import { type OrderStatus } from '@entities/orders/enums/OrderStatus.enum';
import { type OrderSubStatus } from '@entities/orders/enums/OrderSubStatus.enum';
import { type OrderType } from '@entities/orders/enums/OrderType.enum';

interface ColumnVisibility {
  orderNumber: boolean;
  type: boolean;
  status: boolean;
  subStatus: boolean;
  initialPrice: boolean;
  finalPrice: boolean;
  createdAt: boolean;
  completedAt: boolean;
  scheduledTime: boolean;
  actions: boolean;
}

export function useUserOrdersTable(userId: string) {
  const [paginatedOrders, setPaginatedOrders] = useState<GetOrderDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Фильтры
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<OrderType[]>([]);
  const [statusFilter, setStatusFilter] = useState<OrderStatus[]>([]);
  const [subStatusFilter, setSubStatusFilter] = useState<OrderSubStatus[]>([]);
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
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Видимость колонок
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    orderNumber: true,
    type: true,
    status: true,
    subStatus: true,
    initialPrice: true,
    finalPrice: true,
    createdAt: true,
    completedAt: false,
    scheduledTime: false,
    actions: true,
  });

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params: any = {
        first: isFirstPage,
        after: currentCursor || undefined,
        size: pageSize,
        sortBy: sortBy,
        sortOrder: sortOrder === 'asc' ? 'Asc' : 'Desc',
      };

      // Добавляем фильтры
      if (searchTerm) {
        params['orderNumber'] = searchTerm;
        params['orderNumberOp'] = 'Contains';
      }

      if (typeFilter.length > 0) {
        params['type'] = typeFilter;
      }

      if (statusFilter.length > 0) {
        params['status'] = statusFilter;
      }

      if (subStatusFilter.length > 0) {
        params['subStatus'] = subStatusFilter;
      }

      // Добавляем фильтр по пользователю
      params['creatorId'] = userId;

      const response = await ordersApi.getOrders(params);

      setPaginatedOrders(response.data || []);
      setTotalCount(response.totalCount || 0);
      setHasNext(response.hasNext || false);
      setHasPrevious(response.hasPrevious || false);

    } catch (err) {
      console.error('Ошибка загрузки заказов пользователя:', err);
      setError(err instanceof Error ? err.message : 'Ошибка загрузки заказов');
    } finally {
      setLoading(false);
    }
  }, [userId, pageSize, sortBy, sortOrder, searchTerm, typeFilter, statusFilter, subStatusFilter, currentCursor, isFirstPage]);

  // Загружаем данные при изменении фильтров
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleNextPage = useCallback(() => {
    if (paginatedOrders.length > 0) {
      const lastOrder = paginatedOrders[paginatedOrders.length - 1];

      // Сохраняем текущий cursor в историю
      setCursorsHistory(prev => [...prev, currentCursor]);
      setCurrentCursor(lastOrder.id);
      setIsFirstPage(false);
      setCurrentPageNumber(prev => prev + 1);
    }
  }, [paginatedOrders, currentCursor]);

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

  const handleTypeFilterChange = useCallback((types: OrderType[]) => {
    setTypeFilter(types);
    setCursorsHistory([]);
    setCurrentCursor(null);
    setIsFirstPage(true);
    setCurrentPageNumber(1);
  }, []);

  const handleStatusFilterChange = useCallback((statuses: OrderStatus[]) => {
    setStatusFilter(statuses);
    setCursorsHistory([]);
    setCurrentCursor(null);
    setIsFirstPage(true);
    setCurrentPageNumber(1);
  }, []);

  const handleSubStatusFilterChange = useCallback((subStatuses: OrderSubStatus[]) => {
    setSubStatusFilter(subStatuses);
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
    fetchOrders();
  }, [fetchOrders]);

  return {
    paginatedOrders,
    loading,
    error,
    searchTerm,
    typeFilter,
    statusFilter,
    subStatusFilter,
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
    handleTypeFilterChange,
    handleStatusFilterChange,
    handleSubStatusFilterChange,
    handleSortChange,
    refetch,
  };
}

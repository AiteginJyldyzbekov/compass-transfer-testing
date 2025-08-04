'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ordersApi, type OrderFilters, type GetOrderDTO } from '@shared/api/orders';
import { useSavedFilters } from '@shared/hooks';
import { useUserRole } from '@shared/contexts/user-role-context';
import { Role } from '@entities/users/enums';
import type { OrderStatus } from '@entities/orders/enums/OrderStatus.enum';
import type { OrderSubStatus } from '@entities/orders/enums/OrderSubStatus.enum';
import type { OrderType } from '@entities/orders/enums/OrderType.enum';

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

interface SavedOrderFilters {
  orderNumberFilter: string;
  typeFilter: OrderType[];
  statusFilter: OrderStatus[];
  subStatusFilter: OrderSubStatus[];
  creatorIdFilter: string;
  airFlightFilter: string;
  flyReisFilter: string;
}

export function useOrdersTable(initialFilters?: {
  orderNumber?: string;
  type?: string;
  status?: string;
  subStatus?: string;
  creatorId?: string;
  airFlight?: string;
  flyReis?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userRole } = useUserRole();
  
  // Данные
  const [orders, setOrders] = useState<GetOrderDTO[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<GetOrderDTO[]>([]);
  const [paginatedOrders, setPaginatedOrders] = useState<GetOrderDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Фильтры
  const [searchTerm, setSearchTerm] = useState('');
  const [orderNumberFilter, setOrderNumberFilter] = useState(initialFilters?.orderNumber || '');
  const [typeFilter, setTypeFilter] = useState<OrderType[]>(
    initialFilters?.type ? [initialFilters.type as OrderType] : []
  );
  const [statusFilter, setStatusFilter] = useState<OrderStatus[]>(
    initialFilters?.status ? [initialFilters.status as OrderStatus] : []
  );
  const [subStatusFilter, setSubStatusFilter] = useState<OrderSubStatus[]>(
    initialFilters?.subStatus ? [initialFilters.subStatus as OrderSubStatus] : []
  );
  const [creatorIdFilter, setCreatorIdFilter] = useState(initialFilters?.creatorId || '');
  const [airFlightFilter, setAirFlightFilter] = useState(initialFilters?.airFlight || '');
  const [flyReisFilter, setFlyReisFilter] = useState(initialFilters?.flyReis || '');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Пагинация (cursor-based с историей)
  const [currentCursor, setCurrentCursor] = useState<string | null>(null);
  const [isFirstPage, setIsFirstPage] = useState(true);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [cursorsHistory, setCursorsHistory] = useState<(string | null)[]>([]);
  const [pageSize, setPageSize] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('orders-page-size');

      return saved ? parseInt(saved, 10) : 10;
    }

    return 10;
  });
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);

  // Сортировка
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Видимость колонок
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('orders-column-visibility');
      
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // Если не удалось распарсить, используем значения по умолчанию
        }
      }
    }

    return {
      orderNumber: true,
      type: true,
      status: true,
      subStatus: true,
      initialPrice: true,
      finalPrice: true,
      createdAt: true,
      completedAt: true,
      scheduledTime: true,
      actions: true,
    };
  });

  // Защита от двойных вызовов
  const loadingRef = useRef(false);

  // Отслеживаем изменения URL параметров и обновляем фильтры
  useEffect(() => {
    const currentStatus = searchParams.get('status');
    const currentType = searchParams.get('type');
    const currentOrderNumber = searchParams.get('orderNumber');
    const currentCreatorId = searchParams.get('creatorId');
    const currentAirFlight = searchParams.get('airFlight');
    const currentFlyReis = searchParams.get('flyReis');

    // Обновляем фильтры только если они изменились
    let filtersChanged = false;

    if (currentStatus && currentStatus !== statusFilter[0]) {
      setStatusFilter([currentStatus as OrderStatus]);
      filtersChanged = true;
    } else if (!currentStatus && statusFilter.length > 0) {
      setStatusFilter([]);
      filtersChanged = true;
    }

    if (currentType && currentType !== typeFilter[0]) {
      setTypeFilter([currentType as OrderType]);
      filtersChanged = true;
    }
    // Не сбрасываем typeFilter если нет currentType - пользователь мог выбрать через UI

    if (currentOrderNumber !== orderNumberFilter) {
      setOrderNumberFilter(currentOrderNumber || '');
      filtersChanged = true;
    }

    if (currentCreatorId !== creatorIdFilter) {
      setCreatorIdFilter(currentCreatorId || '');
      filtersChanged = true;
    }

    if (currentAirFlight !== airFlightFilter) {
      setAirFlightFilter(currentAirFlight || '');
      filtersChanged = true;
    }

    if (currentFlyReis !== flyReisFilter) {
      setFlyReisFilter(currentFlyReis || '');
      filtersChanged = true;
    }

    // Сбрасываем пагинацию при изменении фильтров
    if (filtersChanged) {
      setCursorsHistory([]);
      setCurrentCursor(null);
      setIsFirstPage(true);
      setCurrentPageNumber(1);
    }
  }, [searchParams, statusFilter, typeFilter, orderNumberFilter, creatorIdFilter, airFlightFilter, flyReisFilter]);

  // Загрузка данных
  const loadOrders = useCallback(async () => {
    if (loadingRef.current) {
      return;
    }

    loadingRef.current = true;
    setLoading(true);
    setError(null);
    
    try {
      const params: OrderFilters = {
        first: isFirstPage,
        after: currentCursor || undefined,
        size: pageSize,
        sortBy,
        sortOrder: sortOrder === 'asc' ? 'Asc' : 'Desc',
      };

      // Добавляем фильтры если они заданы
      if (orderNumberFilter) {
        params.orderNumber = orderNumberFilter;
        params.orderNumberOp = 'Equal';
      }
      if (typeFilter.length > 0) {
        params.type = typeFilter;
      }
      if (statusFilter.length > 0) {
        params.status = statusFilter;
      }
      if (subStatusFilter.length > 0) {
        params.subStatus = subStatusFilter;
      }
      if (creatorIdFilter) {
        params.creatorId = creatorIdFilter;
      }
      if (airFlightFilter) {
        params.airFlight = airFlightFilter;
        params.airFlightOp = 'Contains';
      }
      if (flyReisFilter) {
        params.flyReis = flyReisFilter;
        params.flyReisOp = 'Contains';
      }
      if (searchTerm) {
        params.orderNumber = searchTerm;
        params.orderNumberOp = 'Equal';
      }

      // Для партнеров используем API для заказов созданных ими
      const response = userRole === Role.Partner
        ? await ordersApi.getMyCreatorOrders(params)
        : await ordersApi.getOrders(params);

      setOrders(response.data);
      setFilteredOrders(response.data);
      setPaginatedOrders(response.data);
      setTotalCount(response.totalCount);
      setHasNext(response.hasNext);
      setHasPrevious(response.hasPrevious);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [
    currentCursor,
    isFirstPage,
    pageSize,
    sortBy,
    sortOrder,
    orderNumberFilter,
    typeFilter,
    statusFilter,
    subStatusFilter,
    creatorIdFilter,
    airFlightFilter,
    flyReisFilter,
    searchTerm,
    userRole,
  ]);

  // Загружаем данные при изменении зависимостей
  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Конфигурация для сохранения фильтров
  const defaultFilters: SavedOrderFilters = useMemo(() => ({
    orderNumberFilter: '',
    typeFilter: [],
    statusFilter: [],
    subStatusFilter: [],
    creatorIdFilter: '',
    airFlightFilter: '',
    flyReisFilter: '',
  }), []);

  const currentFilters: SavedOrderFilters = useMemo(() => ({
    orderNumberFilter,
    typeFilter,
    statusFilter,
    subStatusFilter,
    creatorIdFilter,
    airFlightFilter,
    flyReisFilter,
  }), [orderNumberFilter, typeFilter, statusFilter, subStatusFilter, creatorIdFilter, airFlightFilter, flyReisFilter]);

  // Функция загрузки сохраненных фильтров
  const onFiltersLoad = useCallback((filters: SavedOrderFilters) => {
    setOrderNumberFilter(filters.orderNumberFilter || '');
    setTypeFilter(filters.typeFilter || []);
    setStatusFilter(filters.statusFilter || []);
    setSubStatusFilter(filters.subStatusFilter || []);
    setCreatorIdFilter(filters.creatorIdFilter || '');
    setAirFlightFilter(filters.airFlightFilter || '');
    setFlyReisFilter(filters.flyReisFilter || '');
  }, []);

  // Хук для сохранения фильтров
  const { saveFilters, clearSavedFilters, hasSaved, justSaved } = useSavedFilters({
    key: 'orders-filters',
    defaultFilters,
    currentFilters,
    onFiltersLoad,
  });

  // Обработчики
  const handleNextPage = () => {
    if (orders.length > 0) {
      const lastOrder = orders[orders.length - 1];

      // Сохраняем текущий cursor в историю
      setCursorsHistory(prev => [...prev, currentCursor]);
      setCurrentCursor(lastOrder.id);
      setIsFirstPage(false);
      setCurrentPageNumber(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (cursorsHistory.length > 0) {
      // Берем предыдущий cursor из истории
      const newHistory = [...cursorsHistory];
      const prevCursor = newHistory.pop();

      setCursorsHistory(newHistory);
      setCurrentCursor(prevCursor || null);
      setIsFirstPage(prevCursor === null);
      setCurrentPageNumber(prev => prev - 1);
    }
  };

  const handleFirstPage = () => {
    setCursorsHistory([]);
    setCurrentCursor(null);
    setIsFirstPage(true);
    setCurrentPageNumber(1);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCursorsHistory([]);
    setCurrentCursor(null);
    setIsFirstPage(true);
    setCurrentPageNumber(1);

    if (typeof window !== 'undefined') {
      localStorage.setItem('orders-page-size', size.toString());
    }
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleColumnVisibilityChange = (column: keyof ColumnVisibility, visible: boolean) => {
    const newVisibility = {
      ...columnVisibility,
      [column]: visible,
    };

    setColumnVisibility(newVisibility);
    if (typeof window !== 'undefined') {
      localStorage.setItem('orders-column-visibility', JSON.stringify(newVisibility));
    }
  };

  const handleTypeFilterChange = (types: OrderType[]) => {
    setTypeFilter(types);
    setCursorsHistory([]);
    setCurrentCursor(null);
    setIsFirstPage(true);
    setCurrentPageNumber(1);
  };

  const handleStatusFilterChange = (statuses: OrderStatus[]) => {
    setStatusFilter(statuses);
    setCursorsHistory([]);
    setCurrentCursor(null);
    setIsFirstPage(true);
    setCurrentPageNumber(1);
  };

  const handleSubStatusFilterChange = (subStatuses: OrderSubStatus[]) => {
    setSubStatusFilter(subStatuses);
    setCursorsHistory([]);
    setCurrentCursor(null);
    setIsFirstPage(true);
    setCurrentPageNumber(1);
  };

  return {
    // Данные
    orders,
    filteredOrders,
    paginatedOrders,
    loading,
    error,

    // Фильтры
    searchTerm,
    orderNumberFilter,
    typeFilter,
    statusFilter,
    subStatusFilter,
    creatorIdFilter,
    airFlightFilter,
    flyReisFilter,
    showAdvancedFilters,

    // Пагинация
    currentCursor,
    isFirstPage,
    pageSize,
    totalCount,
    hasNext,
    hasPrevious,
    currentPageNumber,

    // Сортировка
    sortBy,
    sortOrder,

    // Видимость колонок
    columnVisibility,

    // Сеттеры
    setSearchTerm: (term: string) => {
      setSearchTerm(term);
      setCursorsHistory([]);
      setCurrentCursor(null);
      setIsFirstPage(true);
      setCurrentPageNumber(1);
    },
    setOrderNumberFilter: (orderNumber: string) => {
      setOrderNumberFilter(orderNumber);
      setCursorsHistory([]);
      setCurrentCursor(null);
      setIsFirstPage(true);
      setCurrentPageNumber(1);
    },
    setCreatorIdFilter: (creatorId: string) => {
      setCreatorIdFilter(creatorId);
      setCursorsHistory([]);
      setCurrentCursor(null);
      setIsFirstPage(true);
      setCurrentPageNumber(1);
    },
    setAirFlightFilter: (airFlight: string) => {
      setAirFlightFilter(airFlight);
      setCursorsHistory([]);
      setCurrentCursor(null);
      setIsFirstPage(true);
      setCurrentPageNumber(1);
    },
    setFlyReisFilter: (flyReis: string) => {
      setFlyReisFilter(flyReis);
      setCursorsHistory([]);
      setCurrentCursor(null);
      setIsFirstPage(true);
      setCurrentPageNumber(1);
    },
    setShowAdvancedFilters,

    // Обработчики
    handleNextPage,
    handlePrevPage,
    handleFirstPage,
    handlePageSizeChange,
    handleSort,
    handleColumnVisibilityChange,
    handleTypeFilterChange,
    handleStatusFilterChange,
    handleSubStatusFilterChange,
    loadOrders,
    router,

    // Сохранение фильтров
    saveFilters,
    clearSavedFilters,
    hasSavedFilters: hasSaved,
    justSavedFilters: justSaved,

    // Обновление данных
    refetch: loadOrders,
  };
}

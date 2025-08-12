'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { toast } from 'sonner';
import { tariffsApi, type TariffFilters } from '@shared/api/tariffs';
import { useSavedFilters } from '@shared/hooks';
import type { CarType } from '@entities/tariffs/enums/CarType.enum';
import type { ServiceClass } from '@entities/tariffs/enums/ServiceClass.enum';
import type { GetTariffDTO } from '@entities/tariffs/interface/GetTariffDTO';

interface ColumnVisibility {
  name: boolean;
  serviceClass: boolean;
  carType: boolean;
  basePrice: boolean;
  minutePrice: boolean;
  minimumPrice: boolean;
  perKmPrice: boolean;
  freeWaitingTimeMinutes: boolean;
  archived: boolean;
  actions: boolean;
}

interface SavedTariffFilters {
  nameFilter: string;
  serviceClassFilter: ServiceClass[];
  carTypeFilter: CarType[];
  basePriceFromFilter: string;
  basePriceToFilter: string;
  minutePriceFromFilter: string;
  minutePriceToFilter: string;
}

export function useTariffsTable(_initialFilters?: {
  name?: string;
  priceFrom?: string;
  priceTo?: string;
  isActive?: string;
}) {
  const router = useRouter();
  
  // Данные
  const [tariffs, setTariffs] = useState<GetTariffDTO[]>([]);
  const [filteredTariffs, setFilteredTariffs] = useState<GetTariffDTO[]>([]);
  const [paginatedTariffs, setPaginatedTariffs] = useState<GetTariffDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Фильтры
  const [searchTerm, setSearchTerm] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [serviceClassFilter, setServiceClassFilter] = useState<ServiceClass[]>([]);
  const [carTypeFilter, setCarTypeFilter] = useState<CarType[]>([]);
  const [basePriceFromFilter, setBasePriceFromFilter] = useState('');
  const [basePriceToFilter, setBasePriceToFilter] = useState('');
  const [minutePriceFromFilter, setMinutePriceFromFilter] = useState('');
  const [minutePriceToFilter, setMinutePriceToFilter] = useState('');
  const [archivedFilter, setArchivedFilter] = useState<boolean | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Пагинация (cursor-based с историей)
  const [currentCursor, setCurrentCursor] = useState<string | null>(null);
  const [isFirstPage, setIsFirstPage] = useState(true);
  const [cursorsHistory, setCursorsHistory] = useState<(string | null)[]>([]);

  // Инициализируем pageSize из localStorage синхронно
  const [pageSize, setPageSize] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedPageSize = localStorage.getItem('tariffs-page-size');

      if (savedPageSize) {
        const parsedSize = parseInt(savedPageSize, 10);

        if (!isNaN(parsedSize) && parsedSize > 0) {
          return parsedSize;
        }
      }
    }
    
    return 10; // значение по умолчанию
  });

  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);

  // Сортировка
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Инициализируем columnVisibility из localStorage синхронно
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tariffs-column-visibility');

      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          toast.error('Ошибка при парсинге сохраненной видимости колонок:');
        }
      }
    }

    // Значения по умолчанию
    return {
      name: true,
      serviceClass: true,
      carType: true,
      basePrice: true,
      minutePrice: true,
      minimumPrice: false,
      perKmPrice: true,
      freeWaitingTimeMinutes: false,
      archived: true,
      actions: true,
    };
  });

  // Защита от двойных вызовов
  const loadingRef = useRef(false);

  // Загрузка данных
  const loadTariffs = useCallback(async () => {
    // Предотвращаем двойные вызовы
    if (loadingRef.current) {
      return;
    }

    loadingRef.current = true;
    setLoading(true);
    setError(null);
    
    try {
      const params: TariffFilters = {
        first: isFirstPage,
        after: currentCursor || undefined,
        size: pageSize,
        sortBy,
        sortOrder: sortOrder === 'asc' ? 'Asc' : 'Desc',
      };

      // Добавляем фильтры если они заданы
      if (nameFilter) {
        params.name = nameFilter;
        params.nameOp = 'Contains';
      }
      if (serviceClassFilter.length > 0) {
        params.serviceClass = serviceClassFilter;
      }
      if (carTypeFilter.length > 0) {
        params.carType = carTypeFilter;
      }
      if (basePriceFromFilter) {
        params.basePrice = parseFloat(basePriceFromFilter);
        params.basePriceOp = 'GreaterThanOrEqual';
      }
      if (basePriceToFilter) {
        // Для фильтра "до" нужно использовать отдельный параметр или логику
        if (!basePriceFromFilter) {
          params.basePrice = parseFloat(basePriceToFilter);
          params.basePriceOp = 'LessThanOrEqual';
        }
      }
      if (minutePriceFromFilter) {
        params.minutePrice = parseFloat(minutePriceFromFilter);
        params.minutePriceOp = 'GreaterThanOrEqual';
      }
      if (minutePriceToFilter) {
        if (!minutePriceFromFilter) {
          params.minutePrice = parseFloat(minutePriceToFilter);
          params.minutePriceOp = 'LessThanOrEqual';
        }
      }
      if (archivedFilter !== null) {
        params.archived = archivedFilter;
      }
      if (searchTerm) {
        params['FTS.Plain'] = searchTerm;
      }

      const response = await tariffsApi.getTariffs(params);

      setTariffs(response.data as GetTariffDTO[]);
      setFilteredTariffs(response.data as GetTariffDTO[]);
      setPaginatedTariffs(response.data as GetTariffDTO[]);
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
    nameFilter,
    serviceClassFilter,
    carTypeFilter,
    basePriceFromFilter,
    basePriceToFilter,
    minutePriceFromFilter,
    minutePriceToFilter,
    archivedFilter,
    searchTerm,
  ]);

  // Загружаем данные при изменении зависимостей
  useEffect(() => {
    loadTariffs();
  }, [loadTariffs]);



  // Конфигурация для сохранения фильтров
  const defaultFilters: SavedTariffFilters = useMemo(() => ({
    nameFilter: '',
    serviceClassFilter: [],
    carTypeFilter: [],
    basePriceFromFilter: '',
    basePriceToFilter: '',
    minutePriceFromFilter: '',
    minutePriceToFilter: '',
  }), []);

  const currentFilters: SavedTariffFilters = useMemo(() => ({
    nameFilter,
    serviceClassFilter,
    carTypeFilter,
    basePriceFromFilter,
    basePriceToFilter,
    minutePriceFromFilter,
    minutePriceToFilter,
  }), [nameFilter, serviceClassFilter, carTypeFilter, basePriceFromFilter, basePriceToFilter, minutePriceFromFilter, minutePriceToFilter]);

  // Функция загрузки сохраненных фильтров
  const onFiltersLoad = useCallback((filters: SavedTariffFilters) => {
    setNameFilter(filters.nameFilter || '');
    setServiceClassFilter(filters.serviceClassFilter || []);
    setCarTypeFilter(filters.carTypeFilter || []);
    setBasePriceFromFilter(filters.basePriceFromFilter || '');
    setBasePriceToFilter(filters.basePriceToFilter || '');
    setMinutePriceFromFilter(filters.minutePriceFromFilter || '');
    setMinutePriceToFilter(filters.minutePriceToFilter || '');
  }, []);

  // Хук для сохранения фильтров
  const { saveFilters, clearSavedFilters, hasSaved, justSaved } = useSavedFilters({
    key: 'tariffs-filters',
    defaultFilters: defaultFilters as unknown as Record<string, unknown>,
    currentFilters: currentFilters as unknown as Record<string, unknown>,
    onFiltersLoad: onFiltersLoad as unknown as (filters: Record<string, unknown>) => void,
  });

  // Обработчики
  const handleNextPage = () => {
    if (tariffs.length > 0) {
      const lastTariff = tariffs[tariffs.length - 1];

      // Сохраняем текущий cursor в историю
      setCursorsHistory(prev => [...prev, currentCursor]);
      setCurrentCursor(lastTariff.id);
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

    // Сохраняем в localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('tariffs-page-size', size.toString());
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

    // Сохраняем в localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('tariffs-column-visibility', JSON.stringify(newVisibility));
    }
  };

  const handleServiceClassFilterChange = (classes: ServiceClass[]) => {
    setServiceClassFilter(classes);
    setCursorsHistory([]);
    setCurrentCursor(null);
    setIsFirstPage(true);
    setCurrentPageNumber(1);
  };

  const handleCarTypeFilterChange = (types: CarType[]) => {
    setCarTypeFilter(types);
    setCursorsHistory([]);
    setCurrentCursor(null);
    setIsFirstPage(true);
    setCurrentPageNumber(1);
  };

  return {
    // Данные
    tariffs,
    filteredTariffs,
    paginatedTariffs,
    loading,
    error,

    // Фильтры
    searchTerm,
    nameFilter,
    serviceClassFilter,
    carTypeFilter,
    basePriceFromFilter,
    basePriceToFilter,
    minutePriceFromFilter,
    minutePriceToFilter,
    archivedFilter,
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
    setNameFilter: (name: string) => {
      setNameFilter(name);
      setCursorsHistory([]);
      setCurrentCursor(null);
      setIsFirstPage(true);
      setCurrentPageNumber(1);
    },
    setBasePriceFromFilter: (price: string) => {
      setBasePriceFromFilter(price);
      setCursorsHistory([]);
      setCurrentCursor(null);
      setIsFirstPage(true);
      setCurrentPageNumber(1);
    },
    setBasePriceToFilter: (price: string) => {
      setBasePriceToFilter(price);
      setCursorsHistory([]);
      setCurrentCursor(null);
      setIsFirstPage(true);
      setCurrentPageNumber(1);
    },
    setMinutePriceFromFilter: (price: string) => {
      setMinutePriceFromFilter(price);
      setCursorsHistory([]);
      setCurrentCursor(null);
      setIsFirstPage(true);
      setCurrentPageNumber(1);
    },
    setMinutePriceToFilter: (price: string) => {
      setMinutePriceToFilter(price);
      setCursorsHistory([]);
      setCurrentCursor(null);
      setIsFirstPage(true);
      setCurrentPageNumber(1);
    },
    setArchivedFilter: useCallback((archived: boolean | null) => {
      // Обновляем состояние
      setArchivedFilter(archived);
      setCursorsHistory([]);
      setCurrentCursor(null);
      setIsFirstPage(true);
      setCurrentPageNumber(1);
    }, []),

    // Функция для обработки изменения статуса
    handleArchivedFilterChange: useCallback((archived: boolean | null) => {
      setArchivedFilter(archived);
      setCursorsHistory([]);
      setCurrentCursor(null);
      setIsFirstPage(true);
      setCurrentPageNumber(1);
    }, []),

    setShowAdvancedFilters,

    // Обработчики
    handleNextPage,
    handlePrevPage,
    handleFirstPage,
    handlePageSizeChange,
    handleSort,
    handleColumnVisibilityChange,
    handleServiceClassFilterChange,
    handleCarTypeFilterChange,
    loadTariffs,
    router,

    // Сохранение фильтров
    saveFilters,
    clearSavedFilters,
    hasSavedFilters: hasSaved,
    justSavedFilters: justSaved,
  };
}

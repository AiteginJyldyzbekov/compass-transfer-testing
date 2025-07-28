'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { servicesApi, type ServiceFilters } from '@shared/api/services';
import { useSavedFilters } from '@shared/hooks';
import type { GetServiceDTO } from '@entities/services/interface/GetServiceDTO';

interface ColumnVisibility {
  name: boolean;
  description: boolean;
  price: boolean;
  isQuantifiable: boolean;
  actions: boolean;
}

interface SavedServiceFilters {
  nameFilter: string;
  priceFromFilter: string;
  priceToFilter: string;
}

export function useServicesTable() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Данные
  const [services, setServices] = useState<GetServiceDTO[]>([]);
  const [filteredServices, setFilteredServices] = useState<GetServiceDTO[]>([]);
  const [paginatedServices, setPaginatedServices] = useState<GetServiceDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Фильтры
  const [searchTerm, setSearchTerm] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [priceFromFilter, setPriceFromFilter] = useState('');
  const [priceToFilter, setPriceToFilter] = useState('');
  const [isQuantifiableFilter, setIsQuantifiableFilter] = useState<boolean | null>(() => {
    const quantifiableParam = searchParams.get('isQuantifiable');
    if (quantifiableParam === 'true') return true;
    if (quantifiableParam === 'false') return false;
    return null;
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Пагинация (cursor-based)
  const [currentCursor, setCurrentCursor] = useState<string | null>(null);
  const [isFirstPage, setIsFirstPage] = useState(true);

  // Инициализируем pageSize из localStorage синхронно
  const [pageSize, setPageSize] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedPageSize = localStorage.getItem('services-page-size');

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

  // Видимость колонок
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('services-column-visibility');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // Если не удалось распарсить, используем значения по умолчанию
        }
      }
    }
    return {
      name: true,
      description: true,
      price: true,
      isQuantifiable: true,
      actions: true,
    };
  });

  // Загрузка данных
  const loadServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params: ServiceFilters = {
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
      if (priceFromFilter) {
        params.price = parseFloat(priceFromFilter);
        params.priceOp = 'GreaterThanOrEqual';
      }
      if (priceToFilter) {
        // Для фильтра "до" нужно использовать отдельный параметр или логику
        // В данном случае используем основной фильтр цены
        if (!priceFromFilter) {
          params.price = parseFloat(priceToFilter);
          params.priceOp = 'LessThanOrEqual';
        }
      }
      if (isQuantifiableFilter !== null) {
        params.isQuantifiable = isQuantifiableFilter;
      }
      if (searchTerm) {
        params['FTS.Plain'] = searchTerm;
      }

      const response = await servicesApi.getServices(params);
      
      setServices(response.data);
      setFilteredServices(response.data);
      setPaginatedServices(response.data);
      setTotalCount(response.totalCount);
      setHasNext(response.hasNext);
      setHasPrevious(response.hasPrevious);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  }, [
    currentCursor,
    isFirstPage,
    pageSize,
    sortBy,
    sortOrder,
    nameFilter,
    priceFromFilter,
    priceToFilter,
    isQuantifiableFilter,
    searchTerm,
  ]);

  // Загружаем данные при изменении зависимостей
  useEffect(() => {
    loadServices();
  }, [loadServices]);

  // Синхронизируем фильтр количественная с URL параметрами
  useEffect(() => {
    const quantifiableParam = searchParams.get('isQuantifiable');
    let newQuantifiableFilter: boolean | null = null;

    if (quantifiableParam === 'true') newQuantifiableFilter = true;
    if (quantifiableParam === 'false') newQuantifiableFilter = false;

    // Обновляем только если значение действительно отличается
    // Используем внутреннюю функцию состояния, чтобы не вызывать обновление URL
    if (newQuantifiableFilter !== isQuantifiableFilter) {
      setIsQuantifiableFilter(newQuantifiableFilter);
      setCurrentCursor(null);
      setIsFirstPage(true);
    }
  }, [searchParams.get('isQuantifiable')]); // Реагируем на изменения URL параметра

  // Конфигурация для сохранения фильтров
  const defaultFilters: SavedServiceFilters = {
    nameFilter: '',
    priceFromFilter: '',
    priceToFilter: '',
  };

  const currentFilters: SavedServiceFilters = useMemo(() => ({
    nameFilter,
    priceFromFilter,
    priceToFilter,
  }), [nameFilter, priceFromFilter, priceToFilter]);

  // Функция загрузки сохраненных фильтров
  const onFiltersLoad = useCallback((filters: SavedServiceFilters) => {
    setNameFilter(filters.nameFilter || '');
    setPriceFromFilter(filters.priceFromFilter || '');
    setPriceToFilter(filters.priceToFilter || '');
  }, []);

  // Хук для сохранения фильтров
  const { saveFilters, clearSavedFilters, hasSaved, justSaved } = useSavedFilters({
    key: 'services-filters',
    defaultFilters,
    currentFilters,
    onFiltersLoad,
  });

  // Обработчики
  const handleNextPage = () => {
    if (services.length > 0) {
      const lastService = services[services.length - 1];
      setCurrentCursor(lastService.id);
      setIsFirstPage(false);
      setCurrentPageNumber(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    setCurrentCursor(null);
    setIsFirstPage(true);
    setCurrentPageNumber(1);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentCursor(null);
    setIsFirstPage(true);
    setCurrentPageNumber(1);

    // Сохраняем в localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('services-page-size', size.toString());
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
    setColumnVisibility(prev => {
      const newVisibility = {
        ...prev,
        [column]: visible,
      };

      // Сохраняем в localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('services-column-visibility', JSON.stringify(newVisibility));
      }

      return newVisibility;
    });
  };

  return {
    // Данные
    services,
    filteredServices,
    paginatedServices,
    loading,
    error,

    // Фильтры
    searchTerm,
    nameFilter,
    priceFromFilter,
    priceToFilter,
    isQuantifiableFilter,
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
      setCurrentCursor(null);
      setIsFirstPage(true);
      setCurrentPageNumber(1);
    },
    setNameFilter: (name: string) => {
      setNameFilter(name);
      setCurrentCursor(null);
      setIsFirstPage(true);
      setCurrentPageNumber(1);
    },
    setPriceFromFilter: (price: string) => {
      setPriceFromFilter(price);
      setCurrentCursor(null);
      setIsFirstPage(true);
      setCurrentPageNumber(1);
    },
    setPriceToFilter: (price: string) => {
      setPriceToFilter(price);
      setCurrentCursor(null);
      setIsFirstPage(true);
      setCurrentPageNumber(1);
    },
    setIsQuantifiableFilter: (isQuantifiable: boolean | null) => {
      setIsQuantifiableFilter(isQuantifiable);
      setCurrentCursor(null);
      setIsFirstPage(true);
      setCurrentPageNumber(1);
    },

    // Функция для обработки изменения количественной с обновлением URL
    handleIsQuantifiableFilterChange: useCallback((isQuantifiable: boolean | null) => {
      setIsQuantifiableFilter(isQuantifiable);

      // Обновляем URL
      const params = new URLSearchParams(searchParams.toString());
      if (isQuantifiable === null) {
        params.delete('isQuantifiable');
      } else {
        params.set('isQuantifiable', isQuantifiable.toString());
      }

      const newURL = params.toString() ? `/services?${params.toString()}` : '/services';
      router.push(newURL);

      setCurrentCursor(null);
      setIsFirstPage(true);
      setCurrentPageNumber(1);
    }, [searchParams, router]),
    setShowAdvancedFilters,

    // Обработчики
    handleNextPage,
    handlePrevPage,
    handlePageSizeChange,
    handleSort,
    handleColumnVisibilityChange,
    loadServices,
    router,

    // Сохранение фильтров
    saveFilters,
    clearSavedFilters,
    hasSavedFilters: hasSaved,
    justSavedFilters: justSaved,
  };
}

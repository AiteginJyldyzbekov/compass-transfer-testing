'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { carsApi, type CarFilters } from '@shared/api/cars';
import { useSavedFilters } from '@shared/hooks';
import {
  CarColor,
  VehicleType,
  ServiceClass,
  VehicleStatus,
  CarFeature,
} from '@entities/cars/enums';
import type { GetCarDTO } from '@entities/cars/interface';

interface ColumnVisibility {
  make: boolean;
  model: boolean;
  year: boolean;
  color: boolean;
  licensePlate: boolean;
  type: boolean;
  serviceClass: boolean;
  status: boolean;
  passengerCapacity: boolean;
  features: boolean;
  drivers: boolean;
}

interface SavedCarsFilters {
  makeFilter: string;
  modelFilter: string;
  yearFilter: string;
  colorFilter: CarColor[];
  licensePlateFilter: string;
  typeFilter: VehicleType[];
  serviceClassFilter: ServiceClass[];
  statusFilter: VehicleStatus[];
  passengerCapacityFilter: string;
  featuresFilter: CarFeature[];
}

export function useCarsTable() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Флаг для отслеживания инициализации
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Данные
  const [cars, setCars] = useState<GetCarDTO[]>([]);
  const [filteredCars, setFilteredCars] = useState<GetCarDTO[]>([]);
  const [paginatedCars, setPaginatedCars] = useState<GetCarDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Фильтры
  const [searchTerm, setSearchTerm] = useState('');
  const [makeFilter, setMakeFilter] = useState('');
  const [modelFilter, setModelFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [colorFilter, setColorFilter] = useState<CarColor[]>([]);
  const [licensePlateFilter, setLicensePlateFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState<VehicleType[]>([]);
  const [serviceClassFilter, setServiceClassFilter] = useState<ServiceClass[]>([]);
  const [statusFilter, setStatusFilter] = useState<VehicleStatus[]>(() => {
    const statusParam = searchParams.get('status');
    if (statusParam && Object.values(VehicleStatus).includes(statusParam as VehicleStatus)) {
      return [statusParam as VehicleStatus];
    }
    return [];
  });
  const [passengerCapacityFilter, setPassengerCapacityFilter] = useState('');
  const [featuresFilter, setFeaturesFilter] = useState<CarFeature[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Пагинация (cursor-based)
  const [currentCursor, setCurrentCursor] = useState<string | null>(null);
  const [isFirstPage, setIsFirstPage] = useState(true);

  // Инициализируем pageSize из localStorage синхронно
  const [pageSize, setPageSize] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedPageSize = localStorage.getItem('cars-page-size');

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
  const [sortBy, setSortBy] = useState<string>('make');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Инициализируем columnVisibility из localStorage синхронно
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cars-column-visibility');

      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (error) {
          console.error('Ошибка при парсинге сохраненной видимости колонок:', error);
        }
      }
    }

    // Значения по умолчанию
    return {
      make: true,
      model: true,
      year: true,
      color: true,
      licensePlate: true,
      type: true,
      serviceClass: true,
      status: true,
      passengerCapacity: true,
      features: false,
      drivers: true,
    };
  });

  // Дефолтные фильтры (мемоизируем чтобы избежать пересоздания)
  const defaultFilters = useMemo<SavedCarsFilters>(() => ({
    makeFilter: '',
    modelFilter: '',
    yearFilter: '',
    colorFilter: [],
    licensePlateFilter: '',
    typeFilter: [],
    serviceClassFilter: [],
    statusFilter: [],
    passengerCapacityFilter: '',
    featuresFilter: [],
  }), []);

  // Текущие фильтры
  const currentFilters: SavedCarsFilters = {
    makeFilter,
    modelFilter,
    yearFilter,
    colorFilter,
    licensePlateFilter,
    typeFilter,
    serviceClassFilter,
    statusFilter,
    passengerCapacityFilter,
    featuresFilter,
  };

  // Стабильная функция загрузки фильтров
  const onFiltersLoad = useCallback((filters: SavedCarsFilters) => {
    setMakeFilter(filters.makeFilter || '');
    setModelFilter(filters.modelFilter || '');
    setYearFilter(filters.yearFilter || '');
    setColorFilter(filters.colorFilter || []);
    setLicensePlateFilter(filters.licensePlateFilter || '');
    setTypeFilter(filters.typeFilter || []);
    setServiceClassFilter(filters.serviceClassFilter || []);
    setStatusFilter(filters.statusFilter || []);
    setPassengerCapacityFilter(filters.passengerCapacityFilter || '');
    setFeaturesFilter(filters.featuresFilter || []);
    setIsInitialized(true); // Помечаем как инициализированный
  }, []);

  // Хук для сохранения фильтров
  const { saveFilters, clearSavedFilters, hasSaved, justSaved } = useSavedFilters({
    key: 'cars-filters',
    defaultFilters,
    currentFilters,
    onFiltersLoad,
  });

  // Инициализация, если нет сохраненных фильтров
  useEffect(() => {
    if (!hasSaved && !isInitialized) {
      setIsInitialized(true);
    }
  }, [hasSaved, isInitialized]);

  // Защита от двойных вызовов
  const loadingRef = useRef(false);

  // Загрузка данных
  const loadCars = useCallback(async () => {
    // Предотвращаем двойные вызовы
    if (loadingRef.current) {
      return;
    }

    loadingRef.current = true;
    setLoading(true);
    setError(null);
    
    try {
      const params: CarFilters = {
        first: isFirstPage,
        after: currentCursor || undefined,
        size: pageSize,
        sortBy,
        sortOrder: sortOrder === 'asc' ? 'Asc' : 'Desc',
      };

      // Добавляем фильтры если они заданы
      if (makeFilter) {
        params.make = makeFilter;
        params.makeOp = 'Contains';
      }
      if (modelFilter) {
        params.model = modelFilter;
        params.modelOp = 'Contains';
      }
      if (yearFilter) {
        params.year = parseInt(yearFilter, 10);
        params.yearOp = 'Equal';
      }
      if (colorFilter.length > 0) {
        params.color = colorFilter;
      }
      if (licensePlateFilter) {
        params.licensePlate = licensePlateFilter;
        params.licensePlateOp = 'Contains';
      }
      if (typeFilter.length > 0) {
        params.type = typeFilter;
      }
      if (serviceClassFilter.length > 0) {
        params.serviceClass = serviceClassFilter;
      }
      if (statusFilter.length > 0) {
        params.status = statusFilter;
      }
      if (passengerCapacityFilter) {
        params.passengerCapacity = parseInt(passengerCapacityFilter, 10);
        params.passengerCapacityOp = 'Equal';
      }
      if (featuresFilter.length > 0) {
        params.features = featuresFilter;
      }
      if (searchTerm) {
        params['FTS.Plain'] = searchTerm;
      }

      const response = await carsApi.getCars(params);

      setCars(response.data);
      setFilteredCars(response.data);
      setPaginatedCars(response.data);
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
    makeFilter,
    modelFilter,
    yearFilter,
    colorFilter,
    licensePlateFilter,
    typeFilter,
    serviceClassFilter,
    statusFilter,
    passengerCapacityFilter,
    featuresFilter,
    searchTerm,
  ]);

  // Загружаем данные при изменении зависимостей (только после инициализации)
  useEffect(() => {
    if (isInitialized) {
      loadCars();
    }
  }, [
    isInitialized,
    currentCursor,
    isFirstPage,
    pageSize,
    sortBy,
    sortOrder,
    makeFilter,
    modelFilter,
    yearFilter,
    colorFilter,
    licensePlateFilter,
    typeFilter,
    serviceClassFilter,
    statusFilter,
    passengerCapacityFilter,
    featuresFilter,
    searchTerm,
  ]);

  // Синхронизируем фильтр статуса с URL параметрами
  useEffect(() => {
    const statusParam = searchParams.get('status');
    let newStatusFilter: VehicleStatus[] = [];

    if (statusParam && Object.values(VehicleStatus).includes(statusParam as VehicleStatus)) {
      newStatusFilter = [statusParam as VehicleStatus];
    }

    // Обновляем только если значение изменилось
    if (JSON.stringify(newStatusFilter) !== JSON.stringify(statusFilter)) {
      setStatusFilter(newStatusFilter);
    }
  }, [searchParams]);

  // Обработчики
  const handleNextPage = () => {
    if (cars.length > 0) {
      // Используем ID последнего элемента как курсор
      const lastCar = cars[cars.length - 1];
      
      setCurrentCursor(lastCar.id);
      setIsFirstPage(false);
    }
  };

  const handlePrevPage = () => {
    setCurrentCursor(null);
    setIsFirstPage(true);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    // Сбрасываем на первую страницу
    setCurrentCursor(null);
    setIsFirstPage(true);

    // Сохраняем в localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('cars-page-size', size.toString());
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
      localStorage.setItem('cars-column-visibility', JSON.stringify(newVisibility));
    }
  };

  const handleColorFilterChange = (colors: CarColor[]) => {
    setColorFilter(colors);
    setCurrentCursor(null);
    setIsFirstPage(true);
  };

  const handleTypeFilterChange = (types: VehicleType[]) => {
    setTypeFilter(types);
    setCurrentCursor(null);
    setIsFirstPage(true);
  };

  const handleServiceClassFilterChange = (classes: ServiceClass[]) => {
    setServiceClassFilter(classes);
    setCurrentCursor(null);
    setIsFirstPage(true);
  };

  const handleStatusFilterChange = useCallback((statuses: VehicleStatus[]) => {
    setStatusFilter(statuses);

    // Обновляем URL
    const params = new URLSearchParams(searchParams.toString());
    if (statuses.length === 1) {
      params.set('status', statuses[0]);
    } else {
      params.delete('status');
    }

    const newURL = params.toString() ? `/cars?${params.toString()}` : '/cars';
    router.push(newURL);

    setCurrentCursor(null);
    setIsFirstPage(true);
  }, [searchParams, router]);

  const handleFeaturesFilterChange = (features: CarFeature[]) => {
    setFeaturesFilter(features);
    setCurrentCursor(null);
    setIsFirstPage(true);
  };

  return {
    // Данные
    cars,
    filteredCars,
    paginatedCars,
    loading,
    error,

    // Фильтры
    searchTerm,
    makeFilter,
    modelFilter,
    yearFilter,
    colorFilter,
    licensePlateFilter,
    typeFilter,
    serviceClassFilter,
    statusFilter,
    passengerCapacityFilter,
    featuresFilter,
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
    },
    setMakeFilter: (make: string) => {
      setMakeFilter(make);
      setCurrentCursor(null);
      setIsFirstPage(true);
    },
    setModelFilter: (model: string) => {
      setModelFilter(model);
      setCurrentCursor(null);
      setIsFirstPage(true);
    },
    setYearFilter: (year: string) => {
      setYearFilter(year);
      setCurrentCursor(null);
      setIsFirstPage(true);
    },
    setLicensePlateFilter: (plate: string) => {
      setLicensePlateFilter(plate);
      setCurrentCursor(null);
      setIsFirstPage(true);
    },
    setPassengerCapacityFilter: (capacity: string) => {
      setPassengerCapacityFilter(capacity);
      setCurrentCursor(null);
      setIsFirstPage(true);
    },
    setShowAdvancedFilters,

    // Обработчики
    handleNextPage,
    handlePrevPage,
    handlePageSizeChange,
    handleSort,
    handleColumnVisibilityChange,
    handleColorFilterChange,
    handleTypeFilterChange,
    handleServiceClassFilterChange,
    handleStatusFilterChange,
    handleFeaturesFilterChange,
    loadCars,
    router,

    // Сохранение фильтров
    saveFilters,
    clearSavedFilters,
    hasSavedFilters: hasSaved,
    justSavedFilters: justSaved,
  };
}

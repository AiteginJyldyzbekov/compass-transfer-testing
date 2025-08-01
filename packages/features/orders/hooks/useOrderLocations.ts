'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import apiClient from '@shared/api/client';
import { usersApi } from '@shared/api/users';
import type { MapBounds } from '@shared/components/map/types';
import type { GetLocationDTO } from '@entities/locations/interface';
import { useActiveDrivers, type ActiveDriver } from '@features/drivers/hooks/useActiveDrivers';
import { useLocations } from '@features/locations/hooks/useLocations';

interface RoutePoint {
  id: string;
  location: GetLocationDTO | null;
  type: 'start' | 'end' | 'intermediate';
  label: string;
}

interface Ride {
  id: string;
  driverId: string;
}

interface UseOrderLocationsParams {
  startLocationId?: string | null;
  endLocationId?: string | null;
  additionalStops?: string[];
  mode?: 'create' | 'edit';
  rides?: Ride[]; // Данные поездок для режима редактирования

  // Внешнее состояние для сохранения между табами
  externalRoutePoints?: RoutePoint[];
  setExternalRoutePoints?: (points: RoutePoint[]) => void;
  externalSelectedDriver?: Driver | null;
  setExternalSelectedDriver?: (driver: Driver | null) => void;
  externalDynamicMapCenter?: { latitude: number; longitude: number } | null;
  setExternalDynamicMapCenter?: (center: { latitude: number; longitude: number } | null) => void;
  externalOpenDriverPopupId?: string | null;
  setExternalOpenDriverPopupId?: (id: string | null) => void;

  onRouteChange?: (routePoints: RoutePoint[]) => void;
  onRoutePointsChange?: (startId: string, endId: string, points: RoutePoint[]) => void;
  onRouteDistanceChange?: (distance: number) => void;
}

interface Driver {
  id: string;
  fullName?: string;
  phoneNumber?: string;
  currentLocation?: { latitude: number; longitude: number };
  [key: string]: unknown;
}

interface UseOrderLocationsResult {
  // Данные маршрута
  routePoints: RoutePoint[];
  isReady: boolean;

  // Данные карты
  mapLocations: GetLocationDTO[];
  mapCenter: { latitude: number; longitude: number };
  dynamicMapCenter: { latitude: number; longitude: number } | null;

  // Данные водителей
  drivers: ActiveDriver[]; // Активные водители для карты
  allDrivers: Driver[]; // Все водители для панели
  selectedDriver: Driver | null;
  openDriverPopupId: string | null;

  // Состояния UI
  isModalOpen: boolean;
  modalTitle: string;
  selectedPointIndex: number | null;

  // Обработчики
  handlePointSelect: (index: number) => void;
  handleLocationSelect: (location: GetLocationDTO) => void;
  handlePointClear: (index: number) => void;
  handleMapBoundsChange: (bounds: MapBounds) => void;
  handleDriverSelect: (driver: Driver | null, location?: { latitude: number; longitude: number }, fromSearchPanel?: boolean) => void;
  handleLocationToggle: (location: GetLocationDTO, isSelected: boolean) => void;
  canSelectLocation: (location: GetLocationDTO) => boolean;
  addIntermediatePoint: (location?: GetLocationDTO) => void;
  closeModal: () => void;

  // Функции для работы с данными водителей
  getDriverById: (id: string) => Record<string, unknown> | null;
  loadDriverData: (id: string) => Promise<void>;
}

/**
 * Хук для всей логики карты и маршрута заказа
 */
export const useOrderLocations = ({
  startLocationId,
  endLocationId,
  additionalStops = [],
  mode = 'create',
  rides,
  // Внешнее состояние
  externalRoutePoints,
  setExternalRoutePoints,
  externalSelectedDriver,
  setExternalSelectedDriver,
  externalDynamicMapCenter,
  setExternalDynamicMapCenter,
  externalOpenDriverPopupId,
  setExternalOpenDriverPopupId,
  // Колбэки
  onRouteChange,
  onRoutePointsChange,
  onRouteDistanceChange: _onRouteDistanceChange
}: UseOrderLocationsParams): UseOrderLocationsResult => {

  // Состояния
  const [mapLocations, setMapLocations] = useState<GetLocationDTO[]>([]);
  const [allDrivers, setAllDrivers] = useState<Driver[]>([]); // Список всех водителей для панели
  const [driversDataCache, setDriversDataCache] = useState<Record<string, Record<string, unknown>>>({}); // Кэш полных данных водителей
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');

  // Используем внешнее состояние если передано, иначе локальное
  const [localRoutePoints, setLocalRoutePoints] = useState<RoutePoint[]>([
    { id: '1', location: null, type: 'start', label: 'Откуда' },
    { id: '2', location: null, type: 'end', label: 'Куда' },
  ]);
  const [localSelectedDriver, setLocalSelectedDriver] = useState<Driver | null>(null);
  const [localDynamicMapCenter, setLocalDynamicMapCenter] = useState<{ latitude: number; longitude: number } | null>(null);
  const [localOpenDriverPopupId, setLocalOpenDriverPopupId] = useState<string | null>(null);

  // Определяем, какое состояние использовать
  const routePoints = externalRoutePoints ?? localRoutePoints;
  const setRoutePoints = setExternalRoutePoints ?? setLocalRoutePoints;
  const selectedDriver = externalSelectedDriver ?? localSelectedDriver;
  const setSelectedDriver = setExternalSelectedDriver ?? setLocalSelectedDriver;
  const dynamicMapCenter = externalDynamicMapCenter ?? localDynamicMapCenter;
  const setDynamicMapCenter = setExternalDynamicMapCenter ?? setLocalDynamicMapCenter;
  const openDriverPopupId = externalOpenDriverPopupId ?? localOpenDriverPopupId;
  const setOpenDriverPopupId = setExternalOpenDriverPopupId ?? setLocalOpenDriverPopupId;

  // Хуки для работы с локациями и водителями
  const { fetchAllLocations } = useLocations();
  const { drivers, updateMapBounds } = useActiveDrivers();

  // Инициализация водителей (без загрузки локаций)
  useEffect(() => {
    const initialBounds: MapBounds = {
      latFrom: 42.82,
      latTo: 42.98,
      longFrom: 74.45,
      longTo: 74.7,
    };

    updateMapBounds(initialBounds);
  }, [updateMapBounds]);

  // Загрузка ВСЕХ локаций для обоих режимов
  useEffect(() => {
    if (mode === 'edit' && (startLocationId || endLocationId || additionalStops?.length)) {
      fetchAllLocations().then(locations => {
        setMapLocations(locations);
      });
    } else if (mode === 'create') {
      fetchAllLocations().then(locations => {
        setMapLocations(locations);
      });
    }
  }, [mode, startLocationId, endLocationId, additionalStops, fetchAllLocations]);

  // Загрузка водителя в режиме редактирования
  useEffect(() => {
    const loadDriverInEditMode = async () => {
      if (mode === 'edit' && rides && rides.length > 0 && rides[0].driverId) {
        const driverId = rides[0].driverId;

        try {
          // Загружаем данные водителя
          const driverData = await usersApi.getDriver(driverId);

          // Проверяем, есть ли координаты у водителя
          if (driverData && driverData.currentLocation) {
            const { latitude, longitude } = driverData.currentLocation;

            // Устанавливаем водителя как выбранного
            setSelectedDriver(driverData as unknown as Driver);

            // Перемещаем карту к водителю
            setDynamicMapCenter({ latitude, longitude });

            // Открываем popup водителя
            setOpenDriverPopupId(driverId);
          }
        } catch {
          // Тихо обрабатываем ошибку - водитель может быть недоступен
        }
      }
    };

    loadDriverInEditMode();
  }, [mode, rides, setSelectedDriver, setDynamicMapCenter, setOpenDriverPopupId]);

  // Загрузка ВСЕХ водителей для панели
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await apiClient.get<{
          data: Driver[];
          totalCount: number;
        }>('/User/Driver', {
          params: {
            First: true,
            Size: 1000,
            IsActive: true
          }
        });

        const drivers = Array.isArray(response.data?.data) ? response.data.data : [];

        setAllDrivers(drivers);
      } catch {
        setAllDrivers([]);
      }
    };

    fetchDrivers();
  }, []);

  // Формируем точки маршрута из загруженных локаций (в режиме редактирования)
  useEffect(() => {
    if (mode === 'edit' && mapLocations.length > 0) {
      const newRoutePoints: RoutePoint[] = [
        { id: '1', location: null, type: 'start', label: 'Откуда' },
        { id: '2', location: null, type: 'end', label: 'Куда' },
      ];

      // Устанавливаем начальную локацию
      if (startLocationId) {
        const startLocation = mapLocations.find(loc => loc.id === startLocationId);

        if (startLocation) {
          newRoutePoints[0] = { ...newRoutePoints[0], location: startLocation };
        }
      }

      // Устанавливаем конечную локацию
      if (endLocationId) {
        const endLocation = mapLocations.find(loc => loc.id === endLocationId);

        if (endLocation) {
          newRoutePoints[1] = { ...newRoutePoints[1], location: endLocation };
        }
      }

      // Добавляем промежуточные остановки
      if (additionalStops && additionalStops.length > 0) {
        additionalStops.forEach((stopId, index) => {
          const stopLocation = mapLocations.find(loc => loc.id === stopId);

          if (stopLocation) {
            const intermediatePoint: RoutePoint = {
              id: `intermediate-${index}`,
              location: stopLocation,
              type: 'intermediate',
              label: `Остановка ${index + 1}`
            };

            // Вставляем промежуточные точки перед конечной
            newRoutePoints.splice(newRoutePoints.length - 1, 0, intermediatePoint);
          }
        });
      }

      setRoutePoints(newRoutePoints);
    }
  }, [mode, mapLocations, startLocationId, endLocationId, additionalStops, setRoutePoints]);

  // Готовность определяется наличием локаций в режиме редактирования
  const isReady = useMemo(() => {
    if (mode === 'create') return true;
    if (mode === 'edit') {
      return (!startLocationId && !endLocationId && !additionalStops?.length) || mapLocations.length > 0;
    }

    return true;
  }, [mode, startLocationId, endLocationId, additionalStops, mapLocations.length]);

  // Центр карты
  const mapCenter = useMemo(() => {
    // Если установлен динамический центр (например, при выборе водителя), используем его
    if (dynamicMapCenter) {
      return dynamicMapCenter;
    }

    const routePointsWithLocation = routePoints.filter(point =>
      point.location &&
      typeof point.location.latitude === 'number' &&
      typeof point.location.longitude === 'number'
    );

    if (routePointsWithLocation.length > 0) {
      const firstPoint = routePointsWithLocation[0];
      
      return {
        latitude: firstPoint.location!.latitude,
        longitude: firstPoint.location!.longitude
      };
    }

    return { latitude: 42.9, longitude: 74.575 };
  }, [routePoints, dynamicMapCenter]);

  // Уведомляем родительский компонент об изменениях
  useEffect(() => {
    if (onRouteChange) {
      onRouteChange(routePoints);
    }

    if (onRoutePointsChange) {
      const startPoint = routePoints.find(p => p.type === 'start');
      const endPoint = routePoints.find(p => p.type === 'end');

      // Используем исходные ID, если локации еще не загружены
      const startId = startPoint?.location?.id || startLocationId || '';
      const endId = endPoint?.location?.id || endLocationId || '';

      onRoutePointsChange(startId, endId, routePoints);
    }
  }, [routePoints, onRouteChange, onRoutePointsChange, startLocationId, endLocationId]);

  // Обработчики
  const handleMapBoundsChange = useCallback(async (bounds: MapBounds) => {
    updateMapBounds(bounds);
    // Убираем загрузку локаций - используем только fetchAllLocations один раз
  }, [updateMapBounds]);

  const handlePointSelect = useCallback((index: number) => {
    setSelectedPointIndex(index);
    setModalTitle(routePoints[index].label);
    setIsModalOpen(true);
  }, [routePoints]);

  const handleLocationSelect = useCallback((location: GetLocationDTO) => {
    if (selectedPointIndex !== null) {
      const updatedPoints = [...routePoints];

      updatedPoints[selectedPointIndex] = {
        ...updatedPoints[selectedPointIndex],
        location,
      };
      setRoutePoints(updatedPoints);
      setSelectedPointIndex(null);
    }
    setIsModalOpen(false);
  }, [selectedPointIndex, routePoints, setRoutePoints]);

  const handlePointClear = useCallback((index: number) => {
    const currentPoints = [...routePoints];
    const pointToRemove = currentPoints[index];

    // Если это промежуточная точка, удаляем её полностью
    if (pointToRemove.type === 'intermediate') {
      // Удаляем промежуточную точку
      currentPoints.splice(index, 1);

      // Перенумеровываем оставшиеся промежуточные точки
      let intermediateCounter = 1;

      for (let i = 0; i < currentPoints.length; i++) {
        if (currentPoints[i].type === 'intermediate') {
          currentPoints[i] = {
            ...currentPoints[i],
            id: `intermediate-${intermediateCounter - 1}`,
            label: `Остановка ${intermediateCounter}`
          };
          intermediateCounter++;
        }
      }
    }
    // Если это конечная точка "Куда" и есть промежуточные точки
    else if (pointToRemove.type === 'end' && currentPoints.length > 2) {
      // Находим последнюю промежуточную точку
      let lastIntermediateIndex = -1;

      for (let i = currentPoints.length - 2; i >= 0; i--) {
        if (currentPoints[i].type === 'intermediate') {
          lastIntermediateIndex = i;

          break;
        }
      }

      if (lastIntermediateIndex !== -1) {
        // Превращаем последнюю промежуточную точку в конечную
        currentPoints[lastIntermediateIndex] = {
          ...currentPoints[lastIntermediateIndex],
          type: 'end',
          label: 'Куда'
        };

        // Удаляем старую конечную точку
        currentPoints.splice(index, 1);

        // Перенумеровываем оставшиеся промежуточные точки
        let intermediateCounter = 1;

        for (let i = 0; i < currentPoints.length; i++) {
          if (currentPoints[i].type === 'intermediate') {
            currentPoints[i] = {
              ...currentPoints[i],
              id: `intermediate-${intermediateCounter - 1}`,
              label: `Остановка ${intermediateCounter}`
            };
            intermediateCounter++;
          }
        }
      } else {
        // Если нет промежуточных точек, просто очищаем конечную точку
        currentPoints[index] = {
          ...currentPoints[index],
          location: null
        };
      }
    }
    // Если это начальная точка "Откуда", просто очищаем её
    else if (pointToRemove.type === 'start') {
      currentPoints[index] = {
        ...currentPoints[index],
        location: null
      };
    }
    // Если это единственная конечная точка, просто очищаем её
    else {
      currentPoints[index] = {
        ...currentPoints[index],
        location: null
      };
    }

    setRoutePoints(currentPoints);
  }, [routePoints, setRoutePoints]);

  const handleDriverSelect = useCallback((driver: Driver | null, location?: { latitude: number; longitude: number }, fromSearchPanel: boolean = true) => {
    if (!driver) {
      // Отменяем выбор водителя
      setSelectedDriver(null);
      setDynamicMapCenter(null);
      setOpenDriverPopupId(null);

      return;
    }

    setSelectedDriver(driver);

    // Перемещаем карту только если выбор происходит из панели поиска
    if (fromSearchPanel) {
      // Если переданы координаты, используем их
      if (location) {
        // Смещаем центр карты вниз, чтобы водитель был виден над панелью
        // Панель занимает примерно 200-250px снизу, смещаем на ~0.0015 градуса вниз
        const offsetLatitude = location.latitude - 0.0015;

        const newCenter = {
          latitude: offsetLatitude,
          longitude: location.longitude
        };

        setDynamicMapCenter(newCenter);

        // Автоматически открываем попап водителя
        setOpenDriverPopupId(driver.id);

      } else {
        // Если координаты не переданы, пытаемся найти водителя в списке активных водителей
        const activeDriver = drivers.find(d => d.id === driver.id);

        if (activeDriver && activeDriver.currentLocation) {
          const offsetLatitude = activeDriver.currentLocation.latitude - 0.0015;

          const newCenter = {
            latitude: offsetLatitude,
            longitude: activeDriver.currentLocation.longitude
          };

          setDynamicMapCenter(newCenter);

          // Автоматически открываем попап водителя
          setOpenDriverPopupId(driver.id);
        } else {
          // Если водитель не найден на карте, все равно пытаемся открыть popup
          // Это может произойти если водитель не в зоне видимости карты
          setOpenDriverPopupId(driver.id);
        }
      }
    }
    // Если выбор НЕ из панели поиска (т.е. из popup на карте), не перемещаем карту
  }, [drivers, setSelectedDriver, setDynamicMapCenter, setOpenDriverPopupId]);

  const handleLocationToggle = useCallback((location: GetLocationDTO, isSelected: boolean) => {
    if (!isSelected) {
      // Убираем локацию из маршрута
      const updatedPoints = routePoints.map(point => {
        if (point.location?.id === location.id) {
          return { ...point, location: null };
        }

        return point;
      });

      setRoutePoints(updatedPoints);

      return;
    }

    // Добавляем локацию в первую свободную точку
    if (selectedPointIndex !== null && selectedPointIndex >= 0) {
      const updatedPoints = [...routePoints];

      updatedPoints[selectedPointIndex] = {
        ...updatedPoints[selectedPointIndex],
        location: location
      };
      setRoutePoints(updatedPoints);
      setSelectedPointIndex(null);
      setIsModalOpen(false);
    } else {
      const emptyPointIndex = routePoints.findIndex(point => !point.location);

      if (emptyPointIndex !== -1) {
        const updatedPoints = [...routePoints];
        
        updatedPoints[emptyPointIndex] = {
          ...updatedPoints[emptyPointIndex],
          location: location
        };
        setRoutePoints(updatedPoints);
      }
    }
  }, [routePoints, selectedPointIndex, setRoutePoints]);

  const canSelectLocation = useCallback((location: GetLocationDTO) => {
    // Если локация уже выбрана, можно отменить
    const isLocationSelected = routePoints.some(point => point.location?.id === location.id);

    if (isLocationSelected) return true;

    // Если есть активная точка для выбора, можно выбрать
    if (selectedPointIndex !== null && selectedPointIndex >= 0) return true;

    // Если есть пустые точки в маршруте, можно выбрать
    const hasEmptyPoints = routePoints.some(point => !point.location);

    return hasEmptyPoints;
  }, [routePoints, selectedPointIndex]);

  const addIntermediatePoint = useCallback((location?: GetLocationDTO) => {
    if (routePoints.length >= 5) return; // Максимум 5 точек

    // Считаем количество промежуточных точек для правильной нумерации
    const intermediateCount = routePoints.filter(p => p.type === 'intermediate').length;

    const newPoint: RoutePoint = {
      id: `intermediate-${intermediateCount}`,
      location: location || null,
      type: 'intermediate',
      label: `Остановка ${intermediateCount + 1}`,
    };

    // Вставляем перед последней точкой (конечной)
    const updatedPoints = [...routePoints];

    updatedPoints.splice(-1, 0, newPoint);
    setRoutePoints(updatedPoints);
  }, [routePoints, setRoutePoints]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedPointIndex(null);
  }, []);

  // Функция для получения полных данных водителя из кэша
  const getDriverById = useCallback((id: string): Record<string, unknown> | null => {
    return driversDataCache[id] || null;
  }, [driversDataCache]);

  // Функция для загрузки полных данных водителя
  const loadDriverData = useCallback(async (id: string): Promise<void> => {
    // Если данные уже есть в кэше, не загружаем повторно
    if (driversDataCache[id]) {
      return;
    }

    try {
      const driverData = await usersApi.getDriver(id);

      // Сохраняем в кэш
      setDriversDataCache(prev => ({
        ...prev,
        [id]: driverData as unknown as Record<string, unknown>
      }));
    } catch (error) {
      throw error;
    }
  }, [driversDataCache]);

  return {
    // Данные маршрута
    routePoints,
    isReady,
    
    // Данные карты
    mapLocations,
    mapCenter,
    dynamicMapCenter,
    
    // Данные водителей
    drivers, // Активные водители для карты
    allDrivers, // Все водители для панели
    selectedDriver,
    openDriverPopupId,
    
    // Состояния UI
    isModalOpen,
    modalTitle,
    selectedPointIndex,
    
    // Обработчики
    handlePointSelect,
    handleLocationSelect,
    handlePointClear,
    handleMapBoundsChange,
    handleDriverSelect,
    handleLocationToggle,
    canSelectLocation,
    addIntermediatePoint,
    closeModal,

    // Функции для работы с данными водителей
    getDriverById,
    loadDriverData
  };
};

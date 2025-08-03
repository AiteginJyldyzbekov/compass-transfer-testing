'use client';

import { Navigation, Plus, AlertTriangle } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import { LeafletMap } from '@shared/components/map';
import { Button } from '@shared/ui/forms/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/layout/card';
import type { GetLocationDTO } from '@entities/locations/interface';
import { useOrderLocations } from '@features/orders';
import { DriverPanel } from '../components/DriverPanel';
import { LocationSelectionModal } from '../components/LocationSelectionModal';
import { RoutePointItem } from '../components/RoutePointItem';

interface RoutePoint {
  id: string;
  location: GetLocationDTO | null;
  type: 'start' | 'end' | 'intermediate';
  label: string;
}

interface Driver {
  id: string;
  fullName?: string;
  phoneNumber?: string;
  currentLocation?: { latitude: number; longitude: number };
  [key: string]: unknown;
}

interface Ride {
  id: string;
  driverId: string;
}

interface MapTabProps {
  // Данные заказа
  startLocationId?: string | null;
  endLocationId?: string | null;
  additionalStops?: string[];
  mode?: 'create' | 'edit';
  rides?: Ride[]; // Данные поездок для режима редактирования

  // Внешнее состояние маршрута (для сохранения между табами)
  routePoints?: RoutePoint[];
  setRoutePoints?: (points: RoutePoint[]) => void;

  // Внешнее состояние водителя (для сохранения между табами)
  selectedDriver?: Driver | null;
  setSelectedDriver?: (driver: Driver | null) => void;
  dynamicMapCenter?: { latitude: number; longitude: number } | null;

  // Для моментальных заказов - показывать радиус водителей
  showDriverRadius?: boolean;
  isInstantOrder?: boolean; // Флаг для моментальных заказов
  setDynamicMapCenter?: (center: { latitude: number; longitude: number } | null) => void;
  openDriverPopupId?: string | null;
  setOpenDriverPopupId?: (id: string | null) => void;

  // Колбэки
  onRouteChange?: (routePoints: RoutePoint[]) => void;
  onRoutePointsChange?: (startId: string, endId: string, points: RoutePoint[]) => void;
  onRouteDistanceChange?: (distance: number) => void;
  onRouteLoadingChange?: (loading: boolean) => void; // Новый колбэк для состояния загрузки
}

export function MapTab({
  startLocationId,
  endLocationId,
  additionalStops = [],
  mode = 'create',
  rides,
  // Внешнее состояние
  routePoints: externalRoutePoints,
  setRoutePoints: setExternalRoutePoints,
  selectedDriver: externalSelectedDriver,
  setSelectedDriver: setExternalSelectedDriver,
  showDriverRadius = false,
  isInstantOrder = false,
  dynamicMapCenter: externalDynamicMapCenter,
  setDynamicMapCenter: setExternalDynamicMapCenter,
  openDriverPopupId: externalOpenDriverPopupId,
  setOpenDriverPopupId: setExternalOpenDriverPopupId,
  // Колбэки
  onRouteChange,
  onRoutePointsChange,
  onRouteDistanceChange,
  onRouteLoadingChange,
}: MapTabProps) {
  // Состояние для отслеживания ошибки маршрута и загрузки
  const [routeError, setRouteError] = useState(false);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeDistance, setRouteDistance] = useState<number>(0);

  // Обработчик изменения расстояния маршрута
  const handleRouteDistanceChange = (distance: number) => {
    setRouteDistance(distance);

    // Если расстояние 0, значит произошла ошибка построения маршрута
    setRouteError(distance === 0 && routePoints.length >= 2);

    // Передаем дальше
    if (onRouteDistanceChange) {
      onRouteDistanceChange(distance);
    }
  };

  // ВСЯ ЛОГИКА В ХУКЕ!
  const {
    routePoints,
    isReady,
    mapLocations,
    mapCenter,
    dynamicMapCenter,
    drivers,
    allDrivers, // Все водители для панели
    selectedDriver,
    openDriverPopupId,
    isModalOpen,
    modalTitle,
    selectedPointIndex,
    handlePointSelect,
    handleLocationSelect,
    handlePointClear,
    handleMapBoundsChange,
    handleDriverSelect,
    handleLocationToggle,
    canSelectLocation,
    addIntermediatePoint,
    closeModal,
    getDriverById,
    loadDriverData,
  } = useOrderLocations({
    startLocationId,
    endLocationId,
    additionalStops,
    mode,
    rides,
    // Передаем внешнее состояние
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
    // onRouteDistanceChange НЕ передаем в useOrderLocations - он не используется там
  });

  // Отслеживаем изменения точек маршрута для управления состоянием загрузки
  useEffect(() => {
    if (routePoints.length < 2) {
      setRouteError(false);
      setRouteLoading(false);
      setRouteDistance(0);
    } else {
      // Если есть минимум 2 точки, начинаем загрузку маршрута
      setRouteLoading(true);
      setRouteError(false);
    }
  }, [routePoints.length]);

  // Отслеживаем получение расстояния для завершения загрузки
  useEffect(() => {
    if (routeDistance > 0) {
      setRouteLoading(false);
    }
  }, [routeDistance]);

  // Передаем состояние загрузки в родительский компонент
  useEffect(() => {
    if (onRouteLoadingChange) {
      onRouteLoadingChange(routeLoading);
    }
  }, [routeLoading, onRouteLoadingChange]);

  // Преобразуем точки маршрута для карты с мемоизацией
  const mapRoutePoints = useMemo(() => {

    const validPoints = routePoints
      .filter(
        (point: RoutePoint) =>
          point.location &&
          typeof point.location.latitude === 'number' &&
          typeof point.location.longitude === 'number',
      )
      .map((point: RoutePoint) => ({
        latitude: point.location!.latitude,
        longitude: point.location!.longitude,
        name: point.location!.name,
        type: point.type === 'start' ? 'start' : point.type === 'end' ? 'end' : 'waypoint',
        id: point.location!.id,
      }));

    return validPoints;
  }, [routePoints]);

  // Показываем индикатор загрузки
  if (!isReady) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4' />
          <p className='text-muted-foreground'>Загрузка данных карты...</p>
        </div>
      </div>
    );
  }

  // Вспомогательные функции теперь в компоненте RoutePointItem!

  return (
    <div className='flex flex-col lg:flex-row gap-0 h-full'>
      {/* Левая колонка - Построение маршрута */}
      <div className='flex-[1] w-full lg:w-1/2 space-y-6'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Navigation className='h-5 w-5' />
              Построение маршрута
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {/* Точки маршрута */}
              <div>
                {routePoints.map((point: RoutePoint, index: number) => (
                  <RoutePointItem
                    key={point.id}
                    point={point}
                    index={index}
                    isSelected={selectedPointIndex === index}
                    onSelect={handlePointSelect}
                    onClear={handlePointClear}
                  />
                ))}
              </div>

              {/* Добавить промежуточную точку - только для обычных заказов */}
              {!isInstantOrder && routePoints.length < 5 && (
                <Button variant='outline' onClick={() => addIntermediatePoint()} className='w-full'>
                  <Plus className='h-4 w-4 mr-2' />
                  Добавить остановку
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Правая колонка - Карта */}
      <div className='flex-[2] w-full lg:w-1/2 relative'>
        <Card className='h-full'>
          <CardContent className='h-full p-4'>
            {/* Уведомление об ошибке маршрута */}
            {routeError && (
              <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2'>
                <AlertTriangle className='h-4 w-4 text-red-600' />
                <div className='text-sm text-red-800'>
                  <strong>Ошибка построения маршрута</strong>
                  <p className='text-xs text-red-600 mt-1'>
                    Не удалось построить маршрут по дорогам. Проверьте доступность API роутинга.
                  </p>
                </div>
              </div>
            )}
            <div className='h-96 lg:h-full rounded-lg overflow-hidden'>
              <LeafletMap
                latitude={mapCenter.latitude}
                longitude={mapCenter.longitude}
                zoom={dynamicMapCenter ? 16 : (mapRoutePoints.length > 0 ? 12 : 11)}
                routePoints={mapRoutePoints}
                showRoute={mapRoutePoints.length >= 2} // Показываем маршрут если есть минимум 2 точки
                showActiveDrivers
                onBoundsChange={handleMapBoundsChange}
                mapLocations={mapLocations}
                selectedLocationIds={routePoints
                  .filter((p: RoutePoint) => p.location)
                  .map((p: RoutePoint) => p.location!.id)}
                onLocationToggle={handleLocationToggle}
                canSelectLocation={canSelectLocation}
                onDriverSelect={isInstantOrder ? undefined : handleDriverSelect}
                selectedDriverId={selectedDriver?.id}
                openDriverPopupId={openDriverPopupId}
                dynamicCenter={dynamicMapCenter}
                onRouteDistanceChange={handleRouteDistanceChange}
                activeDrivers={drivers}
                getDriverById={getDriverById}
                loadDriverData={loadDriverData}
                // Для моментальных заказов показываем радиус поиска водителей
                showDriverSearchZone={showDriverRadius}
                driverSearchRadius={1000} // 1 км радиус для каждого водителя
              />
            </div>
          </CardContent>
        </Card>
        {/* Панель водителя */}
        <DriverPanel
          selectedDriver={selectedDriver}
          onDriverSelect={handleDriverSelect}
          onClose={() => handleDriverSelect(null)}
          activeDrivers={drivers}
          getDriverById={(id: string) => allDrivers.find((d: Driver) => d.id === id) || null}
          isInstantOrder={isInstantOrder}
        />
      </div>

      {/* Модальное окно выбора локации */}
      <LocationSelectionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onLocationSelect={handleLocationSelect}
        title={modalTitle}
        selectedLocationIds={routePoints
          .filter((p: RoutePoint) => p.location)
          .map((p: RoutePoint) => p.location!.id)}
      />
    </div>
  );
}

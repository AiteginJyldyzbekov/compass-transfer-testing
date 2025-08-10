'use client';

import { useState, useEffect } from 'react';
import type { RoutePoint, ActiveDriverDTO } from '@shared/components/map/types';
import type { GetRideDTO } from '@entities/orders/interface';
import type { GetDriverDTO } from '@entities/users/interface';
import { DriverPanel } from '@features/orders/components/DriverPanel';
import { LocationSelectionModal } from '@features/orders/components/LocationSelectionModal';
import { useOrderLocations, RoutePointsList, LocationMap } from '@features/orders/locations';

interface MapTabProps {
  // Данные заказа
  startLocationId?: string | null;
  endLocationId?: string | null;
  additionalStops?: string[];
  mode?: 'create' | 'edit';
  rides?: GetRideDTO[]; // Данные поездок для режима редактирования

  // Внешнее состояние маршрута (для сохранения между табами)
  routePoints?: RoutePoint[];
  setRoutePoints?: (points: RoutePoint[]) => void;

  // Роль пользователя
  userRole?: 'admin' | 'operator' | 'partner' | 'driver';

  // Внешнее состояние водителя (для сохранения между табами)
  selectedDriver?: GetDriverDTO | null;
  setSelectedDriver?: (driver: GetDriverDTO | null) => void;
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
  onRouteLoadingChange?: (loading: boolean) => void; // колбэк для состояния загрузки
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
  userRole = 'operator',
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

  // Преобразование точек маршрута теперь выполняется в компоненте LocationMap

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

  return (
    <div className='flex flex-col lg:flex-row gap-0 h-full'>
      {/* Левая колонка - Построение маршрута */}
      <div className='flex-[1] w-full lg:w-1/2 space-y-6'>
        <RoutePointsList
          routePoints={routePoints}
          selectedPointIndex={selectedPointIndex}
          isInstantOrder={isInstantOrder}
          onPointSelect={handlePointSelect}
          onPointClear={handlePointClear}
          onAddIntermediatePoint={addIntermediatePoint}
        />
      </div>

      {/* Правая колонка - Карта */}
      <div className='flex-[2] w-full lg:w-1/2 relative'>
        <LocationMap
          mapCenter={mapCenter}
          dynamicMapCenter={dynamicMapCenter}
          routePoints={routePoints}
          mapLocations={mapLocations}
          routeError={routeError}
          _routeLoading={routeLoading}
          activeDrivers={drivers as unknown as ActiveDriverDTO[]}
          selectedDriverId={selectedDriver?.id}
          openDriverPopupId={openDriverPopupId}
          showDriverSearchZone={showDriverRadius}
          driverSearchRadius={1000} // 1 км радиус для каждого водителя
          selectedLocationIds={routePoints
            .filter((p: RoutePoint) => p.location)
            .map((p: RoutePoint) => p.location!.id)}
          canSelectLocation={canSelectLocation}
          userRole={userRole}
          onBoundsChange={handleMapBoundsChange}
          onLocationToggle={handleLocationToggle}
          onDriverSelect={isInstantOrder ? undefined : (handleDriverSelect as unknown as (driver: string | ActiveDriverDTO) => void)}
          onRouteDistanceChange={handleRouteDistanceChange}
          getDriverById={getDriverById}
          loadDriverData={loadDriverData}
        />
        {/* Панель водителя - скрыта для партнеров */}
        {userRole !== 'partner' && (
          <DriverPanel
            selectedDriver={selectedDriver as GetDriverDTO | null}
            onDriverSelect={handleDriverSelect as (driver: GetDriverDTO | null, location?: { latitude: number; longitude: number }, fromSearchPanel?: boolean) => void}
            onClose={() => handleDriverSelect(null)}
            activeDrivers={drivers}
            getDriverById={(id: string) => {
              const driver = (allDrivers as GetDriverDTO[]).find((d: GetDriverDTO) => d.id === id);

              return driver ? (driver as unknown as GetDriverDTO) : null;
            }}
            isInstantOrder={isInstantOrder}
            userRole={userRole}
          />
        )}
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

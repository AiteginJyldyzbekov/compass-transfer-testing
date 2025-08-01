'use client';

import { Navigation, Plus } from 'lucide-react';
import { useMemo } from 'react';
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
  setDynamicMapCenter?: (center: { latitude: number; longitude: number } | null) => void;
  openDriverPopupId?: string | null;
  setOpenDriverPopupId?: (id: string | null) => void;

  // Колбэки
  onRouteChange?: (routePoints: RoutePoint[]) => void;
  onRoutePointsChange?: (startId: string, endId: string, points: RoutePoint[]) => void;
  onRouteDistanceChange?: (distance: number) => void;
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
  dynamicMapCenter: externalDynamicMapCenter,
  setDynamicMapCenter: setExternalDynamicMapCenter,
  openDriverPopupId: externalOpenDriverPopupId,
  setOpenDriverPopupId: setExternalOpenDriverPopupId,
  // Колбэки
  onRouteChange,
  onRoutePointsChange,
  onRouteDistanceChange,
}: MapTabProps) {
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
    onRouteDistanceChange,
  });

  // Преобразуем точки маршрута для карты с мемоизацией
  const mapRoutePoints = useMemo(() => {
    return routePoints
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

              {/* Добавить промежуточную точку */}
              {routePoints.length < 5 && (
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
                onDriverSelect={handleDriverSelect}
                selectedDriverId={selectedDriver?.id}
                openDriverPopupId={openDriverPopupId}
                dynamicCenter={dynamicMapCenter}
                onRouteDistanceChange={onRouteDistanceChange}
                activeDrivers={drivers}
                getDriverById={getDriverById}
                loadDriverData={loadDriverData}
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

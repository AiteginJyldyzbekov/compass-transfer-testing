'use client';

import { X, MapPin, Banknote, Route } from 'lucide-react';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { routesApi } from '@shared/api/routes';
import { LeafletMap } from '@shared/components/map/DynamicLeafletMap';
import { SpinnerOverlay } from '@shared/ui/feedback/spinner';
import { Button } from '@shared/ui/forms/button';
import { Input } from '@shared/ui/forms/input';
import { Label } from '@shared/ui/forms/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@shared/ui/modals/sheet';
import { getLocationTypeLabel } from '@entities/locations/enums/LocationType.enum';
import type { LocationDTO } from '@entities/locations/interface/LocationDTO';
import type {
  CreatePartnerRouteData,
  PartnerRouteDTO,
} from '@entities/routes/interface/PartnerRouteDTO';
import { useAllLocations } from '@features/locations/hooks/useAllLocations';

interface UpdatePartnerRouteSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (routeData: CreatePartnerRouteData) => void;
  /** Данные существующего маршрута для редактирования */
  existingRoute?: PartnerRouteDTO;
}

export function UpdatePartnerRouteSheet({
  isOpen,
  onClose,
  onSave,
  existingRoute,
}: UpdatePartnerRouteSheetProps) {
  const { locations, isLoading: locationsLoading } = useAllLocations();
  const [selectedStartLocation, setSelectedStartLocation] = useState<LocationDTO | null>(null);
  const [selectedEndLocation, setSelectedEndLocation] = useState<LocationDTO | null>(null);
  const [price, setPrice] = useState(existingRoute?.price?.toString() || '');
  const [isSelectingStart, setIsSelectingStart] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Предзаполнение данных при редактировании существующего маршрута
  useEffect(() => {
    if (existingRoute && locations.length > 0) {
      const startLocation = locations.find(loc => loc.id === existingRoute.startLocationId);
      const endLocation = locations.find(loc => loc.id === existingRoute.endLocationId);

      if (startLocation) {
        setSelectedStartLocation(startLocation);
      }
      if (endLocation) {
        setSelectedEndLocation(endLocation);
      }

      setPrice(existingRoute.price.toString());
      setIsSelectingStart(false); // Не в режиме выбора, так как точки уже выбраны
    }
  }, [existingRoute, locations]);

  // Функция для вычисления расстояния между двумя точками в км
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Радиус Земли в км
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  // Вычисляем расстояние между выбранными точками
  const routeDistance =
    selectedStartLocation && selectedEndLocation
      ? calculateDistance(
          selectedStartLocation.latitude,
          selectedStartLocation.longitude,
          selectedEndLocation.latitude,
          selectedEndLocation.longitude,
        )
      : null;

  const handleLocationSelect = useCallback(
    (location: LocationDTO) => {
      if (isSelectingStart) {
        setSelectedStartLocation(location);
        setIsSelectingStart(false);
      } else {
        setSelectedEndLocation(location);
      }
    },
    [isSelectingStart],
  );

  const handleSave = async () => {
    const priceNumber = typeof price === 'string' ? parseFloat(price) : price;

    if (!selectedStartLocation || !selectedEndLocation || !priceNumber || priceNumber <= 0) {
      return;
    }

    setIsSaving(true);

    try {
      if (existingRoute) {
        // Обновление существующего маршрута
        await routesApi.updatePartnerRoute(existingRoute.id, {
          routeId: existingRoute.id,
          price: priceNumber,
        });
      } else {
        // Создание нового маршрута
        await routesApi.createPartnerRoute({
          startLocationId: selectedStartLocation.id,
          endLocationId: selectedEndLocation.id,
          price: priceNumber,
        });
      }

      onSave({
        startLocationId: selectedStartLocation.id,
        endLocationId: selectedEndLocation.id,
        price: priceNumber,
      });

      // Сброс формы
      setSelectedStartLocation(null);
      setSelectedEndLocation(null);
      setPrice('');
      setIsSelectingStart(true);
      onClose();
    } catch {
      // Здесь можно добавить toast уведомление об ошибке
      // TODO: Добавить обработку ошибок
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setSelectedStartLocation(null);
    setSelectedEndLocation(null);
    setIsSelectingStart(true);
  };

  const priceNumber = typeof price === 'string' ? parseFloat(price) : price;
  const canSave = selectedStartLocation && selectedEndLocation && priceNumber > 0 && !isSaving;

  // Мемоизируем пропсы карты, чтобы избежать перерендера при изменении цены
  const mapLocations = useMemo(
    () =>
      locations.map(loc => ({
        id: loc.id,
        name: loc.name,
        latitude: loc.latitude,
        longitude: loc.longitude,
        type: getLocationTypeLabel(loc.type),
      })),
    [locations],
  );

  const mapSelectedStartLocation = useMemo(
    () =>
      selectedStartLocation
        ? {
            id: selectedStartLocation.id,
            name: selectedStartLocation.name,
            latitude: selectedStartLocation.latitude,
            longitude: selectedStartLocation.longitude,
            type: getLocationTypeLabel(selectedStartLocation.type),
          }
        : null,
    [selectedStartLocation],
  );

  const mapSelectedEndLocation = useMemo(
    () =>
      selectedEndLocation
        ? {
            id: selectedEndLocation.id,
            name: selectedEndLocation.name,
            latitude: selectedEndLocation.latitude,
            longitude: selectedEndLocation.longitude,
            type: getLocationTypeLabel(selectedEndLocation.type),
          }
        : null,
    [selectedEndLocation],
  );

  const mapRoutePoints = useMemo(
    () => [
      ...(selectedStartLocation
        ? [
            {
              latitude: selectedStartLocation.latitude,
              longitude: selectedStartLocation.longitude,
              name: selectedStartLocation.name,
              type: 'start' as const,
              id: selectedStartLocation.id,
            },
          ]
        : []),
      ...(selectedEndLocation
        ? [
            {
              latitude: selectedEndLocation.latitude,
              longitude: selectedEndLocation.longitude,
              name: selectedEndLocation.name,
              type: 'end' as const,
              id: selectedEndLocation.id,
            },
          ]
        : []),
    ],
    [selectedStartLocation, selectedEndLocation],
  );

  const handleMapLocationSelect = useCallback(
    (location: { id: string }) => {
      // Найдем полную локацию по ID
      const fullLocation = locations.find(loc => loc.id === location.id);

      if (fullLocation) {
        handleLocationSelect(fullLocation);
      }
    },
    [locations, handleLocationSelect],
  );

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className='w-full sm:max-w-4xl p-0 overflow-hidden flex flex-col h-full'>
        <SheetHeader className='p-6 pb-4 border-b flex-shrink-0 mb-0'>
          <div className='flex items-center justify-between'>
            <SheetTitle className='flex items-center gap-2'>
              <MapPin className='h-5 w-5' />
              {existingRoute ? 'Обновить маршрут' : 'Создать маршрут'}
            </SheetTitle>
            <Button variant='ghost' size='icon' onClick={onClose}>
              <X className='h-4 w-4' />
            </Button>
          </div>
        </SheetHeader>

        <div className='flex flex-col flex-1 min-h-0'>
          {/* Панель управления */}
          <div className='p-6 border-b bg-gray-50 flex-shrink-0'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              {/* Начальная точка */}
              <div className='space-y-2'>
                <Label className='text-sm font-medium'>
                  Начальная точка{' '}
                  {isSelectingStart && <span className='text-blue-600'>(выберите на карте)</span>}
                </Label>
                <div className='p-3 border rounded-md bg-white min-h-[60px] flex items-center'>
                  {selectedStartLocation ? (
                    <div>
                      <p className='font-medium text-sm'>{selectedStartLocation.name}</p>
                      <p className='text-xs text-muted-foreground'>
                        {getLocationTypeLabel(selectedStartLocation.type)}
                      </p>
                    </div>
                  ) : (
                    <p className='text-sm text-muted-foreground'>Не выбрана</p>
                  )}
                </div>
              </div>

              {/* Конечная точка */}
              <div className='space-y-2'>
                <Label className='text-sm font-medium'>
                  Конечная точка{' '}
                  {!isSelectingStart && selectedStartLocation && (
                    <span className='text-blue-600'>(выберите на карте)</span>
                  )}
                </Label>
                <div className='p-3 border rounded-md bg-white min-h-[60px] flex items-center'>
                  {selectedEndLocation ? (
                    <div>
                      <p className='font-medium text-sm'>{selectedEndLocation.name}</p>
                      <p className='text-xs text-muted-foreground'>
                        {getLocationTypeLabel(selectedEndLocation.type)}
                      </p>
                    </div>
                  ) : (
                    <p className='text-sm text-muted-foreground'>Не выбрана</p>
                  )}
                </div>
              </div>

              {/* Цена */}
              <div className='space-y-2'>
                <Label htmlFor='price' className='text-sm font-medium'>
                  Цена (сом)
                </Label>
                <div className='relative'>
                  <Banknote className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                  <Input
                    id='price'
                    type='text'
                    value={price}
                    onChange={e => {
                      const value = e.target.value;

                      // Разрешаем только цифры и точку
                      if (value === '' || /^\d*\.?\d*$/.test(value)) {
                        setPrice(value);
                      }
                    }}
                    className='pl-10'
                    placeholder='Введите цену'
                  />
                </div>
                {/* Отображение расстояния */}
                {routeDistance && (
                  <div className='mt-2 flex items-center gap-1 text-sm text-muted-foreground'>
                    <Route className='h-3 w-3' />
                    <span>Расстояние: {routeDistance.toFixed(1)} км</span>
                  </div>
                )}
              </div>
            </div>

            {/* Кнопки управления */}
            <div className='flex items-center justify-between mt-4'>
              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setIsSelectingStart(true)}
                  className={isSelectingStart ? 'bg-blue-50 border-blue-200' : ''}
                >
                  Выбрать начальную точку
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setIsSelectingStart(false)}
                  disabled={!selectedStartLocation}
                  className={
                    !isSelectingStart && selectedStartLocation ? 'bg-blue-50 border-blue-200' : ''
                  }
                >
                  Выбрать конечную точку
                </Button>
                <Button variant='outline' size='sm' onClick={handleReset}>
                  Сбросить
                </Button>
              </div>

              <div className='flex gap-2'>
                <Button variant='outline' onClick={onClose}>
                  Отмена
                </Button>
                <Button onClick={handleSave} disabled={!canSave}>
                  {isSaving ? 'Сохранение...' : existingRoute ? 'Обновить' : 'Создать'} маршрут
                </Button>
              </div>
            </div>
          </div>

          {/* Карта */}
          <div className='flex-1 relative min-h-0'>
            {locationsLoading ? (
              <div className='absolute inset-0 flex items-center justify-center bg-gray-50'>
                <div className='flex items-center gap-2'>
                  <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-primary' />
                  <p className='text-sm text-muted-foreground'>Загрузка локаций...</p>
                </div>
              </div>
            ) : (
              <LeafletMap
                locations={mapLocations}
                selectedStartLocation={mapSelectedStartLocation}
                selectedEndLocation={mapSelectedEndLocation}
                onLocationSelect={handleMapLocationSelect}
                isSelectingStart={isSelectingStart}
                showRoute={!!(selectedStartLocation && selectedEndLocation)}
                routePoints={mapRoutePoints}
                latitude={42.8746}
                longitude={74.5698}
                zoom={11}
                height='100%'
              />
            )}
          </div>
        </div>
      </SheetContent>

      {/* Оверлей загрузки - за пределами sheet для полноэкранного покрытия */}
      <SpinnerOverlay
        show={isSaving}
        text={existingRoute ? 'Обновление маршрута...' : 'Создание маршрута...'}
      />
    </Sheet>
  );
}

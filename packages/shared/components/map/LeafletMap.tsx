'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from 'react-leaflet';
// Импорты типов и компонентов
import {
  MapClickHandler,
  MapBoundsHandler,
  MapController,
  LocationMarker,
  DriverMarker,
  RouteMarker,
  RouteSelectionMarker,
} from './components';
import { useRouteBuilder, useDriverTracking, useUIScale } from './hooks';
import { createPinIcon, getColorByType } from './icons';
import type { LeafletMapProps } from './types';

/**
 * Компонент карты на основе React-Leaflet и OpenStreetMap
 */
export const LeafletMap: React.FC<LeafletMapProps> = ({
  latitude,
  longitude,
  zoom = 13,
  height = '100%',
  width = '100%',
  showMarker = true,
  markerText,
  routePoints = [],
  showRoute = false,
  activeDrivers = [],
  showActiveDrivers = false,
  className = '',
  onMapClick,
  onBoundsChange,
  onDriverSelect,
  selectedDriverId,
  openDriverPopupId,
  mapLocations = [],
  selectedLocationIds = [],
  onLocationToggle,
  canSelectLocation,
  getDriverById,
  loadDriverData,
  dynamicCenter,
  showDriverSearchZone = false,
  driverSearchRadius = 2000,
  currentDriverLocation,
  routeDeviationThreshold = 100,
  onRouteDeviation,
  locations = [],
  selectedStartLocation,
  selectedEndLocation,
  onLocationSelect,
  isSelectingStart = true,
  onRouteDistanceChange,
}) => {
  const position: [number, number] = [latitude, longitude];
  const [isClient, setIsClient] = useState(false);

  // Инициализация на клиенте
  useEffect(() => {
    setIsClient(true);

    // Динамический импорт Leaflet только на клиенте
    import('leaflet').then(L => {
      // Динамически добавляем CSS
      if (typeof document !== 'undefined') {
        const link = document.createElement('link');

        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Исправляем проблему с иконками маркеров в Next.js
      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
    });
  }, []);

  // Используем хуки
  const uiScale = useUIScale();
  const { routeCoordinates, routeDistance, routeStatus } = useRouteBuilder(showRoute, routePoints);
  const { isDriverOffRoute } = useDriverTracking({
    currentDriverLocation,
    routeCoordinates,
    routeDeviationThreshold,
    onRouteDeviation,
  });

  // Передаем расстояние маршрута через колбэк
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('🗺️ LeafletMap routeDistance изменилось:', routeDistance, 'routeStatus:', routeStatus, 'onRouteDistanceChange:', !!onRouteDistanceChange);

    if (onRouteDistanceChange) {
      if (routeStatus === 'success' && routeDistance > 0) {
        // eslint-disable-next-line no-console
        console.log('🚀 Вызываем onRouteDistanceChange с:', routeDistance);
        onRouteDistanceChange(routeDistance);
      } else if (routeStatus === 'error') {
        // eslint-disable-next-line no-console
        console.log('❌ Маршрут не построен - передаем 0');
        onRouteDistanceChange(0);
      }
    }
  }, [routeDistance, routeStatus, onRouteDistanceChange]);

  // Показываем загрузку пока не инициализирован клиент
  if (!isClient) {
    return (
      <div className={className} style={{ height, width }}>
        <div className='w-full h-full flex items-center justify-center bg-gray-100 rounded-lg'>
          <div className='flex flex-col items-center gap-2'>
            <div className='h-8 w-8 rounded-full bg-gray-300 animate-pulse' />
            <p className='text-sm text-gray-500'>Загрузка карты...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className} style={{ height, width }}>
      <style>{`
        .leaflet-popup-content-wrapper {
          padding: 20px;
          font-size: 1rem !important;
        }
        .leaflet-popup-content {
            margin: 0 !important;
            font-size: inherit !important;
        }
        .leaflet-popup-close-button {
          font-size: 1.5rem !important;
        }

      `}</style>
      <MapContainer
        center={position}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom
      >
        {/* Обычная карта без топографии и POI */}
        <TileLayer attribution='' url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />

        {/* Обработчик кликов по карте */}
        {onMapClick && <MapClickHandler onMapClick={onMapClick} />}

        {/* Обработчик изменения границ карты */}
        {onBoundsChange && <MapBoundsHandler onBoundsChange={onBoundsChange} />}

        {/* Контроллер для программного управления картой */}
        <MapController
          center={dynamicCenter}
          zoom={dynamicCenter ? 16 : undefined}
          openPopupDriverId={openDriverPopupId}
        />

        {/* Основной маркер */}
        {showMarker && (
          <Marker position={position}>
            <Popup>
              {markerText || `Координаты: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`}
            </Popup>
          </Marker>
        )}

        {/* Маркеры маршрута */}
        {routePoints.map((point, index) => (
          <RouteMarker
            key={index}
            point={point}
            index={index}
            routePoints={routePoints}
            onLocationToggle={onLocationToggle}
            uiScale={uiScale}
          />
        ))}

        {/* Маркеры активных водителей */}
        {showActiveDrivers &&
          activeDrivers.map(driver => (
            <DriverMarker
              key={`driver-${driver.id}`}
              driver={driver}
              isSelected={selectedDriverId === driver.id}
              heading={0}
              onDriverSelect={onDriverSelect}
              getDriverById={getDriverById}
              loadDriverData={loadDriverData}
              uiScale={uiScale}
              forceOpenPopup={openDriverPopupId === driver.id}
            />
          ))}

        {/* Дорожный маршрут */}
        {showRoute && routeCoordinates.length >= 2 && (
          <>
            {/* Подложка маршрута (темная) */}
            <Polyline
              positions={routeCoordinates}
              color={isDriverOffRoute ? '#7f1d1d' : '#1e40af'}
              weight={4}
              opacity={0.8}
            />
            {/* Основная линия маршрута */}
            <Polyline
              positions={routeCoordinates}
              color={isDriverOffRoute ? '#ef4444' : '#3b82f6'}
              weight={2}
              opacity={0.9}
            />
            {/* Индикатор отклонения от маршрута */}
            {isDriverOffRoute && currentDriverLocation && (
              <Circle
                center={[currentDriverLocation.latitude, currentDriverLocation.longitude]}
                radius={routeDeviationThreshold}
                color='#ef4444'
                weight={2}
                opacity={0.7}
                fillColor='#ef4444'
                fillOpacity={0.2}
                dashArray='5, 5'
              />
            )}
          </>
        )}

        {/* Зона поиска водителей для мгновенных заказов */}
        {showDriverSearchZone &&
          routePoints &&
          routePoints.length > 0 &&
          routePoints[0] &&
          typeof routePoints[0].latitude === 'number' &&
          typeof routePoints[0].longitude === 'number' &&
          !isNaN(routePoints[0].latitude) &&
          !isNaN(routePoints[0].longitude) && (
            <Circle
              center={[routePoints[0].latitude, routePoints[0].longitude]}
              radius={driverSearchRadius}
              color='#3b82f6'
              weight={2}
              opacity={0.6}
              fillColor='#3b82f6'
              fillOpacity={0.1}
            />
          )}

        {/* Маркеры доступных локаций - исключаем те, что уже показаны как RouteMarker */}
        {mapLocations
          .filter(location => {
            // Исключаем локации, которые уже показаны как точки маршрута
            const isUsedInRoute = routePoints.some(rp =>
              rp.id === location.id ||
              (rp.latitude === location.latitude && rp.longitude === location.longitude)
            );

            return !isUsedInRoute;
          })
          .map(location => {
          const icon = createPinIcon(getColorByType('location'), undefined, uiScale);
          const isSelected = selectedLocationIds.includes(location.id);
          const canSelect = canSelectLocation ? canSelectLocation(location) : true;

          return (
            <LocationMarker
              key={`loc-${location.id}`}
              location={location}
              icon={icon}
              isSelected={isSelected}
              canSelect={canSelect}
              onLocationToggle={onLocationToggle}
            />
          );
        })}

        {/* Маркеры локаций для выбора маршрута */}
        {locations.map(location => (
          <RouteSelectionMarker
            key={`route-loc-${location.id}`}
            location={location}
            selectedStartLocation={selectedStartLocation}
            selectedEndLocation={selectedEndLocation}
            onLocationSelect={onLocationSelect}
            isSelectingStart={isSelectingStart}
            uiScale={uiScale}
          />
        ))}

        {/* Маршрут между выбранными локациями */}
        {selectedStartLocation && selectedEndLocation && showRoute && (
          <Polyline
            positions={[
              [selectedStartLocation.latitude, selectedStartLocation.longitude],
              [selectedEndLocation.latitude, selectedEndLocation.longitude],
            ]}
            color='#3b82f6'
            weight={3}
            opacity={0.7}
            dashArray='10, 10'
          />
        )}
      </MapContainer>
    </div>
  );
};

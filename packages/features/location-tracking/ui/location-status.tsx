'use client';

import React from 'react';
import { MapPin, AlertCircle, CheckCircle } from 'lucide-react';
import { useLocation } from './location-provider';

export function LocationStatus() {
  const { isTracking, lastLocation, error, permissionStatus } = useLocation();

  const getStatusColor = () => {
    if (error || permissionStatus === 'denied') return 'text-red-600';
    if (isTracking && lastLocation) return 'text-green-600';
    return 'text-yellow-600';
  };

  const getStatusIcon = () => {
    if (error || permissionStatus === 'denied') {
      return <AlertCircle className="w-4 h-4" />;
    }
    if (isTracking && lastLocation) {
      return <CheckCircle className="w-4 h-4" />;
    }
    return <MapPin className="w-4 h-4" />;
  };

  const getStatusText = () => {
    if (permissionStatus === 'denied') {
      return 'Доступ к геолокации запрещен';
    }
    if (error) {
      return error;
    }
    if (isTracking && lastLocation) {
      return 'Местоположение отслеживается';
    }
    if (isTracking) {
      return 'Получение местоположения...';
    }
    return 'Геолокация отключена';
  };

  return (
    <div className="flex items-center space-x-2 text-sm">
      <div className={getStatusColor()}>
        {getStatusIcon()}
      </div>
      <span className={`${getStatusColor()} font-medium`}>
        {getStatusText()}
      </span>
    </div>
  );
}

export function LocationStatusCard() {
  const { isTracking, lastLocation, error, permissionStatus, requestLocationPermission } = useLocation();

  const formatCoordinate = (coord: number, type: 'lat' | 'lng') => {
    const direction = type === 'lat' ? (coord >= 0 ? 'N' : 'S') : (coord >= 0 ? 'E' : 'W');
    return `${Math.abs(coord).toFixed(6)}° ${direction}`;
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Геолокация</h3>
        <LocationStatus />
      </div>

      {lastLocation && (
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Широта:</span>
            <span className="font-mono">
              {formatCoordinate(lastLocation.latitude, 'lat')}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Долгота:</span>
            <span className="font-mono">
              {formatCoordinate(lastLocation.longitude, 'lng')}
            </span>
          </div>
        </div>
      )}

      {(error || permissionStatus === 'denied') && (
        <div className="mt-3 p-3 bg-red-50 rounded-xl">
          <p className="text-sm text-red-700 mb-3">
            {error?.includes('HTTPS') || error?.includes('secure origins')
              ? 'Для геолокации нужен HTTPS. В Edge: edge://flags → "Insecure origins treated as secure" → добавьте http://compass.local:3010'
              : permissionStatus === 'denied' 
                ? 'Разрешите доступ к геолокации в настройках браузера для корректной работы приложения.'
                : error
            }
          </p>
          
          {/* Кнопка для ручной активации геолокации */}
          {(permissionStatus === 'prompt' || permissionStatus === 'unknown') && (
            <button
              onClick={requestLocationPermission}
              className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Включить геолокацию
            </button>
          )}
        </div>
      )}

      {isTracking && !error && permissionStatus !== 'denied' && (
        <div className="mt-3 p-3 bg-green-50 rounded-xl">
          <p className="text-sm text-green-700">
            Ваше местоположение обновляется каждые 30 секунд
          </p>
        </div>
      )}
    </div>
  );
}

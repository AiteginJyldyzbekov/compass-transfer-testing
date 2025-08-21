'use client';

import { MapPin, X, ExternalLink } from 'lucide-react';
import React from 'react';
import { useLocation } from './location-provider';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LocationModal({ isOpen, onClose }: LocationModalProps) {
  const { isTracking, lastLocation, error, permissionStatus, requestLocationPermission } = useLocation();

  if (!isOpen) return null;

  const formatCoordinate = (coord: number, type: 'lat' | 'lng') => {
    const direction = type === 'lat' ? (coord >= 0 ? 'N' : 'S') : (coord >= 0 ? 'E' : 'W');

    return `${Math.abs(coord).toFixed(6)}° ${direction}`;

  };

  const getStatusColor = () => {
    if (error || permissionStatus === 'denied') return 'text-red-600';
    if (isTracking && lastLocation) return 'text-green-600';

    return 'text-yellow-600';
  };

  const getStatusText = () => {
    if (error) return 'Ошибка геолокации';
    if (permissionStatus === 'denied') return 'Геолокация запрещена';
    if (isTracking && lastLocation) return 'Местоположение отслеживается';

    return 'Геолокация отключена';
  };

  // Функции для открытия карт
  const open2GIS = () => {
    if (!lastLocation) return;
    const url = `https://2gis.ru/geo/${lastLocation.longitude},${lastLocation.latitude}`;
    
    window.open(url, '_blank');
  };

  const openYandexMaps = () => {
    if (!lastLocation) return;
    const url = `https://yandex.ru/maps/?ll=${lastLocation.longitude},${lastLocation.latitude}&z=16&pt=${lastLocation.longitude},${lastLocation.latitude}`;
    
    window.open(url, '_blank');
  };

  const openGoogleMaps = () => {
    if (!lastLocation) return;
    const url = `https://www.google.com/maps?q=${lastLocation.latitude},${lastLocation.longitude}`;

    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-30 flex items-center justify-center z-[1000px] p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Геолокация</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Статус:</span>
            <span className={`text-sm font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>

          {/* Coordinates */}
          {lastLocation && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700">Координаты:</h3>
              <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Широта:</span>
                  <span className="font-mono text-gray-900">
                    {formatCoordinate(lastLocation.latitude, 'lat')}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Долгота:</span>
                  <span className="font-mono text-gray-900">
                    {formatCoordinate(lastLocation.longitude, 'lng')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Error or activation button */}
          {(error || permissionStatus === 'denied') && (
            <div className="p-3 bg-red-50 rounded-lg">
              <p className="text-sm text-red-700 mb-3">
                {error?.includes('HTTPS') || error?.includes('secure origins')
                  ? 'Для геолокации нужен HTTPS. В Edge: edge://flags → "Insecure origins treated as secure" → добавьте http://compass.local:3010'
                  : permissionStatus === 'denied' 
                    ? 'Разрешите доступ к геолокации в настройках браузера для корректной работы приложения.'
                    : error
                }
              </p>
              
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

          {/* Success message */}
          {isTracking && !error && permissionStatus !== 'denied' && (
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700">
                Ваше местоположение обновляется каждые 30 секунд
              </p>
            </div>
          )}

          {/* Map buttons */}
          {lastLocation && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700">Открыть в картах:</h3>
              
              <div className="grid grid-cols-1 gap-2">
                {/* 2ГИС */}
                <button
                  onClick={open2GIS}
                  className="flex items-center justify-between p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-xs">2ГИС</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">2ГИС</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-orange-600" />
                </button>

                {/* Яндекс.Карты */}
                <button
                  onClick={openYandexMaps}
                  className="flex items-center justify-between p-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-xs">Я</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">Яндекс.Карты</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-red-600" />
                </button>

                {/* Google Maps */}
                <button
                  onClick={openGoogleMaps}
                  className="flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-xs">G</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">Google Maps</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

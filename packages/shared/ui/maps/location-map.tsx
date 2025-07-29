'use client';

import { useState, useRef, useEffect } from 'react';
import { YMaps, Map, Placemark, useYMaps } from '@pbe/react-yandex-maps';

const DEFAULT_CENTER = [42.856219, 74.603967]; // Центр Кыргызстана (Бишкек)
const DEFAULT_ZOOM = 10;
const KYRGYZSTAN_BOUNDS = [
  [39.0, 69.0],
  [43.5, 81.0],
]; // Примерные границы Кыргызстана

interface LocationMapProps {
  coordinates: [number, number] | null;
  onCoordinatesChange: (coordinates: [number, number]) => void;
  onAddressChange?: (addressData: AddressData) => void;
  height?: string;
  className?: string;
}

// Интерфейс для структурированного адреса
interface AddressData {
  fullAddress: string;
  country: string;
  region: string;
  city: string;
  street: string;
}

// Функция для получения структурированного адреса по координатам
const getAddressByCoordinates = async (lat: number, lon: number): Promise<AddressData> => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY;

    if (!apiKey) {
      console.warn('Yandex Maps API key не найден');
      return {
        fullAddress: 'Адрес не определен',
        country: '',
        region: '',
        city: '',
        street: ''
      };
    }

    // Используем lon,lat (а не lat,lon) для Яндекс HTTP API геокодера
    // Добавляем ограничение поиска территорией Кыргызстана
    const url = `https://geocode-maps.yandex.ru/1.x/?apikey=${apiKey}&format=json&geocode=${lon},${lat}&lang=ru_RU&bbox=69.0,39.0~81.0,43.5&rspn=1&kind=house`;

    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Ошибка HTTP при геокодировании: ${response.status}`);
      return {
        fullAddress: `Координаты: ${lat.toFixed(6)}, ${lon.toFixed(6)}`,
        country: '',
        region: '',
        city: '',
        street: ''
      };
    }

    const data = await response.json();

    // Проверяем на ошибку в JSON ответе
    if (data.status === 'error') {
      if (data.code === 403) {
        console.error('Превышен лимит запросов к Яндекс.Карт API');
        console.warn('Используются координаты вместо адреса');
      } else {
        console.error('Ошибка API геокодера:', data.message);
      }
      return {
        fullAddress: `Координаты: ${lat.toFixed(6)}, ${lon.toFixed(6)}`,
        country: '',
        region: '',
        city: '',
        street: ''
      };
    }

    // Извлечение адреса из ответа
    const geoObject = data.response?.GeoObjectCollection?.featureMember?.[0]?.GeoObject;
    if (geoObject) {
      const fullAddress = geoObject.metaDataProperty?.GeocoderMetaData?.text || 'Адрес не найден';

      // Парсим компоненты адреса
      const addressComponents = geoObject.metaDataProperty?.GeocoderMetaData?.Address?.Components || [];

      let country = '';
      let region = '';
      let city = '';
      let street = '';

      // Извлекаем компоненты адреса
      addressComponents.forEach((component: any) => {
        switch (component.kind) {
          case 'country':
            country = component.name;
            break;
          case 'province':
            region = component.name;
            break;
          case 'locality':
            city = component.name;
            break;
          case 'street':
            street = component.name;
            break;
        }
      });

      console.log('Парсинг адреса:', { fullAddress, country, region, city, street });

      return {
        fullAddress,
        country: country || '',
        region: region || '',
        city: city || '',
        street: street || ''
      };
    } else {
      return {
        fullAddress: 'Адрес не найден',
        country: '',
        region: '',
        city: '',
        street: ''
      };
    }
  } catch (error) {
    console.error('Ошибка при запросе к geocode-maps API:', error);
    return {
      fullAddress: `Координаты: ${lat.toFixed(6)}, ${lon.toFixed(6)}`,
      country: '',
      region: '',
      city: '',
      street: ''
    };
  }
};

export function LocationMap({
  coordinates,
  onCoordinatesChange,
  onAddressChange,
  height = '500px',
  className = '',
}: LocationMapProps) {
  const mapRef = useRef<any>(null);
  const [addressData, setAddressData] = useState<AddressData>({
    fullAddress: '',
    country: '',
    region: '',
    city: '',
    street: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Обработчик клика по карте
  const handleMapClick = async (event: any) => {
    try {
      const coords = event.get('coords');
      const [lat, lon] = coords;

      console.log('Клик по карте:', lat, lon);
      setIsLoading(true);
      onCoordinatesChange([lat, lon]);

      // Получаем адрес по координатам
      const newAddressData = await getAddressByCoordinates(lat, lon);
      setAddressData(newAddressData);
      onAddressChange?.(newAddressData);
    } catch (error) {
      console.error('Ошибка обработки клика по карте:', error);
      const errorData: AddressData = {
        fullAddress: 'Ошибка получения адреса',
        country: '',
        region: '',
        city: '',
        street: ''
      };
      setAddressData(errorData);
      onAddressChange?.(errorData);
    } finally {
      setIsLoading(false);
    }
  };

  // Обработчик загрузки карты для настройки поиска
  const handleMapLoad = (ymaps: any) => {
    console.log('Карта загружена, настраиваем поиск только по Кыргызстану');

    if (mapRef.current && ymaps) {
      try {
        // Если есть координаты, центрируем на них, иначе на Кыргызстане
        if (coordinates && coordinates.length === 2) {
          console.log('Центрируем карту на существующих координатах:', coordinates);
          mapRef.current.setCenter(coordinates, 15);
        } else {
          // Ограничиваем область просмотра карты Кыргызстаном
          mapRef.current.setBounds(KYRGYZSTAN_BOUNDS, {
            checkZoomRange: true,
            zoomMargin: 50
          });
        }

        // Настраиваем поисковые контролы для ограничения поиска Кыргызстаном
        const searchControl = mapRef.current.controls.get('searchControl');
        if (searchControl) {
          // Создаем кастомный провайдер поиска с ограничением по Кыргызстану
          const customProvider = ymaps.search.createProvider({
            search: function (request: string, options: any) {
              // Добавляем "Кыргызстан" к каждому поисковому запросу
              const modifiedRequest = `${request} Кыргызстан`;

              return ymaps.search(modifiedRequest, {
                ...options,
                boundedBy: KYRGYZSTAN_BOUNDS,
                strictBounds: true,
                results: 10,
                // Дополнительные параметры для фильтрации по стране
                ll: '74.603967,42.856219', // Центр Кыргызстана
                spn: '12,4.5', // Примерный размер Кыргызстана
              });
            }
          });

          searchControl.options.set({
            provider: customProvider,
            noPlacemark: false,
            placeholderContent: 'Поиск по Кыргызстану...',
            size: 'large'
          });

          console.log('Поиск настроен только для Кыргызстана');
        }
      } catch (error) {
        console.error('Ошибка настройки поиска:', error);

        // Fallback: простая настройка поиска
        try {
          const searchControl = mapRef.current.controls.get('searchControl');
          if (searchControl) {
            searchControl.options.set({
              provider: 'yandex#search',
              boundedBy: KYRGYZSTAN_BOUNDS,
              strictBounds: true,
              placeholderContent: 'Поиск по Кыргызстану...'
            });
          }
        } catch (fallbackError) {
          console.error('Ошибка fallback настройки:', fallbackError);
        }
      }
    }
  };

  // Получаем адрес при изменении координат
  useEffect(() => {
    if (coordinates && coordinates.length === 2) {
      const [lat, lon] = coordinates;
      // Не получаем адрес для координат по умолчанию (центр Бишкека)
      // Только если координаты были изменены пользователем
      if (lat !== DEFAULT_CENTER[0] || lon !== DEFAULT_CENTER[1]) {
        getAddressByCoordinates(lat, lon).then((addr) => {
          setAddressData(addr);
          onAddressChange?.(addr);
        });
      }
    }
  }, [coordinates]); // Убрал onAddressChange из зависимостей

  // Центрируем карту при изменении координат
  useEffect(() => {
    if (mapRef.current && coordinates && coordinates.length === 2) {
      console.log('Центрируем карту на координатах:', coordinates);
      mapRef.current.setCenter(coordinates, 15); // Устанавливаем центр с зумом 15
    }
  }, [coordinates]);

  return (
    <div className={`relative ${className}`}>
      <Map
        state={{
          center: coordinates || DEFAULT_CENTER,
          zoom: coordinates ? 15 : DEFAULT_ZOOM, // Увеличиваем зум если есть координаты
          controls: ['zoomControl', 'searchControl', 'fullscreenControl'],
        }}
        width="100%"
        height={height}
        onClick={handleMapClick}
        options={{
          suppressMapOpenBlock: true,
          suppressObsoleteBrowserNotifier: true,
          yandexMapDisablePoiInteractivity: true,
          restrictMapArea: KYRGYZSTAN_BOUNDS,
        }}
        modules={[
          'control.ZoomControl',
          'control.SearchControl',
          'control.FullscreenControl',
          'geoObject.addon.balloon',
          'geoObject.addon.hint'
        ]}
        style={{
          width: '100%',
          height: height,
          minHeight: height,
          overflow: 'hidden',
          backgroundColor: '#f5f9fe',
        }}
        instanceRef={(ref: any) => {
          mapRef.current = ref;
        }}
        onLoad={handleMapLoad}
      >
        {coordinates && (
          <Placemark
            geometry={coordinates}
            options={{
              preset: 'islands#blueIcon',
              hideIconOnBalloonOpen: false,
              balloonOffset: [0, -35],
            }}
            properties={{
              balloonContentBody: `
                <div style="padding: 10px; max-width: 250px;">
                  <h3 style="font-weight: 500; margin-bottom: 8px; font-size: 14px;">Выбранная точка</h3>
                  <p style="font-size: 12px; margin-bottom: 4px;"><b>Адрес:</b> ${addressData.fullAddress}</p>
                  <p style="font-size: 12px; margin-bottom: 4px;"><b>Широта:</b> ${coordinates[0].toFixed(6)}</p>
                  <p style="font-size: 12px;"><b>Долгота:</b> ${coordinates[1].toFixed(6)}</p>
                </div>
              `,
              balloonAutoPan: true,
            }}
          />
        )}
      </Map>

      {/* Информационная панель */}
      {coordinates && (
        <div className="absolute bottom-4 right-4 z-10 bg-white rounded-lg shadow-lg p-3 max-w-xs">
          <div className="text-sm">
            <div className="font-medium text-gray-900 mb-1">Выбранная точка</div>
            <div className="text-gray-700 text-sm font-medium mb-2">
              {isLoading ? 'Получение адреса...' : addressData.fullAddress}
            </div>
            <div className="text-gray-500 text-xs">
              <div>Широта: {coordinates[0].toFixed(6)}</div>
              <div>Долгота: {coordinates[1].toFixed(6)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Подсказка для пользователя */}
      {!coordinates && (
        <div className="absolute top-4 left-4 z-10 bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-sm">
          <div className="text-sm text-blue-800">
            <div className="font-medium mb-1">💡 Как выбрать точку</div>
            <div className="text-xs">
              Кликните на карте, чтобы выбрать местоположение локации
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

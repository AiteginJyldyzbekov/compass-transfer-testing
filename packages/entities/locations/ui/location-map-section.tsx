'use client';

import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { toast } from 'sonner';
import { Label } from '@shared/ui/forms/label';
import { LeafletLocationMap } from '@shared/ui/maps/leaflet-location-map';
import type { LocationCreateFormData } from '../schemas/locationCreateSchema';

// Интерфейс для структурированного адреса из LeafletLocationMap
interface AddressData {
  fullAddress: string;
  country: string;
  region: string;
  city: string;
  street: string;
}

interface LocationMapSectionProps {
  labels?: {
    coordinates?: string;
  };
}

export function LocationMapSection({
  labels = {},
}: LocationMapSectionProps) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<LocationCreateFormData>();

  const latitude = watch('latitude');
  const longitude = watch('longitude');
  const address = watch('address');

  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [error, setError] = useState<string>('');

  // Инициализируем координаты из формы
  useEffect(() => {
    if (typeof latitude === 'number' && typeof longitude === 'number') {
      setCoordinates([latitude, longitude]);
    } else {
      setCoordinates(null);
    }
  }, [latitude, longitude]);

  // Проверяем доступность API Яндекс Карт
  useEffect(() => {
    const checkYandexMapsApi = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY;

        if (!apiKey) {
          setError('API ключ Яндекс Карт не настроен. Проверьте переменную NEXT_PUBLIC_YANDEX_MAPS_API_KEY в .env файле');
          setIsApiLoaded(false);

          return;
        }

        setIsApiLoaded(true);
      } catch {
        toast.error('Проверка API Яндекс Карт не удалась:');
        setError('Ошибка загрузки карты. Пожалуйста, попробуйте обновить страницу.');
        setIsApiLoaded(false);
      }
    };

    checkYandexMapsApi();
  }, []);

  // Обработчик изменения координат
  const handleCoordinatesChange = (newCoordinates: [number, number]) => {
    setCoordinates(newCoordinates);
    setValue('latitude', newCoordinates[0]);
    setValue('longitude', newCoordinates[1]);
  };

  // Обработчик изменения адреса и названия
  const handleAddressChange = (addressData: AddressData) => {
    const currentName = watch('name');
    const currentAddress = watch('address');

    // Заполняем адрес
    setValue('address', addressData.fullAddress);

    // Заполняем название только если:
    // 1. Поле пустое, ИЛИ
    // 2. Текущее значение названия равно текущему адресу (т.е. пользователь его не редактировал)
    if (!currentName || currentName === currentAddress) {
      setValue('name', addressData.fullAddress);
    }

    setValue('country', addressData.country);
    setValue('region', addressData.region);
    setValue('city', addressData.city);
  };

  return (
    <div className="space-y-4">
      {/* Заголовок секции */}
      <div>
        <Label className="text-sm font-medium">
          {labels.coordinates || 'Местоположение на карте *'}
        </Label>
        <div className="text-sm text-muted-foreground mt-1">
          Кликните на карте, чтобы выбрать точное местоположение локации
        </div>
      </div>



      {/* Карта */}
      <div className="border rounded-lg overflow-hidden">
        {error ? (
          <div className="bg-gray-100 rounded-lg p-6 text-center h-[400px] flex items-center justify-center">
            <div className="text-gray-500">
              <div className="text-red-500 mb-2">⚠️</div>
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => {
                  setError('');
                  setIsApiLoaded(false);
                  // Перезагружаем проверку API
                  const checkApi = async () => {
                    const apiKey = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY;

                    if (apiKey) {
                      setIsApiLoaded(true);
                    } else {
                      setError('API ключ не найден');
                    }
                  };

                  checkApi();
                }}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Попробовать снова
              </button>
            </div>
          </div>
        ) : !isApiLoaded ? (
          <div className="bg-gray-100 rounded-lg p-6 text-center h-[400px] flex items-center justify-center">
            <div className="text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-3"/>
              <p>Загрузка карты...</p>
            </div>
          </div>
        ) : (
          <LeafletLocationMap
            coordinates={coordinates}
            onCoordinatesChange={handleCoordinatesChange}
            onAddressChange={handleAddressChange}
            initialAddress={address || ''}
            height="400px"
          />
        )}
      </div>

      {/* Скрытые поля для широты и долготы */}
      <input type="hidden" name="latitude" value={latitude || ''} />
      <input type="hidden" name="longitude" value={longitude || ''} />

      {/* Отображение ошибок валидации */}
      {errors.latitude && (
        <p className="text-sm text-red-600">{errors.latitude.message}</p>
      )}
      {errors.longitude && (
        <p className="text-sm text-red-600">{errors.longitude.message}</p>
      )}
    </div>
  );
}

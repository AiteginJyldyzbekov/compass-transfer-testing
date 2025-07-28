/**
 * Сервис для геокодинга адресов через Яндекс.Карты API
 * Используется для поиска адресов при создании новых локаций
 *
 * Документация: https://yandex.ru/dev/maps/geocoder/
 */

import { logger } from '@shared/lib';

export interface YandexGeocodingResult {
  GeoObject: {
    metaDataProperty: {
      GeocoderMetaData: {
        precision: string;
        text: string;
        kind: string;
        Address: {
          country_code: string;
          formatted: string;
          Components: Array<{
            kind: string;
            name: string;
          }>;
        };
      };
    };
    name: string;
    description: string;
    Point: {
      pos: string; // "longitude latitude"
    };
    boundedBy: {
      Envelope: {
        lowerCorner: string;
        upperCorner: string;
      };
    };
  };
}

export interface YandexAddressSearchResult {
  id: string;
  displayName: string;
  address: string;
  city?: string;
  district?: string;
  street?: string;
  house?: string;
  latitude: number;
  longitude: number;
  precision: string; // exact, number, near, range, street, other
  kind: string; // house, street, metro, district, locality, area, province, country
  boundingBox?: {
    south: number;
    north: number;
    west: number;
    east: number;
  };
}

class YandexGeocodingService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://geocode-maps.yandex.ru/1.x/';

  constructor(apiKey?: string) {
    // API ключ можно получить бесплатно на https://developer.tech.yandex.ru/
    this.apiKey = apiKey || process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY || '';

    if (!this.apiKey) {
      logger.warn(
        '⚠️ Яндекс.Карты API ключ не найден. Укажите NEXT_PUBLIC_YANDEX_MAPS_API_KEY в .env',
      );
    }
  }

  /**
   * Поиск адресов по строке запроса
   * @param query Строка поиска (адрес, название места)
   * @param options Дополнительные опции поиска
   */
  async searchAddresses(
    query: string,
    options: {
      limit?: number;
      language?: string;
      bounds?: { south: number; north: number; west: number; east: number };
      kind?: string; // house, street, metro, district, locality
    } = {},
  ): Promise<YandexAddressSearchResult[]> {
    const { limit = 10, language = 'ru_RU', kind = 'house' } = options;

    if (!this.apiKey) {
      throw new Error('Яндекс.Карты API ключ не настроен');
    }

    try {
      const params = new URLSearchParams({
        apikey: this.apiKey,
        geocode: query,
        format: 'json',
        results: limit.toString(),
        lang: language,
        kind: kind,
      });

      // Ограничиваем поиск Кыргызстаном
      if (options.bounds) {
        const { south, north, west, east } = options.bounds;

        params.append('bbox', `${west},${south}~${east},${north}`);
        params.append('rspn', '1'); // Ограничить поиск указанной областью
      } else {
        // Дефолтные границы Кыргызстана
        params.append('bbox', '69.3,39.2~80.3,43.3');
        params.append('rspn', '1');
      }

      const response = await fetch(`${this.baseUrl}?${params}`);

      if (!response.ok) {
        throw new Error(`Yandex Geocoding API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const geoObjects = data?.response?.GeoObjectCollection?.featureMember || [];

      return geoObjects.map((item: { GeoObject: YandexGeocodingResult['GeoObject'] }) =>
        this.transformResult(item.GeoObject),
      );
    } catch (error) {
      logger.error('❌ Ошибка геокодинга Яндекс.Карты:', error);
      throw new Error('Не удалось найти адреса. Проверьте подключение к интернету.');
    }
  }

  /**
   * Обратный геокодинг - получение адреса по координатам
   * @param latitude Широта
   * @param longitude Долгота
   */
  async reverseGeocode(
    latitude: number,
    longitude: number,
    language: string = 'ru_RU',
  ): Promise<YandexAddressSearchResult | null> {
    if (!this.apiKey) {
      throw new Error('Яндекс.Карты API ключ не настроен');
    }

    try {
      const params = new URLSearchParams({
        apikey: this.apiKey,
        geocode: `${longitude},${latitude}`, // Яндекс принимает longitude,latitude
        format: 'json',
        results: '1',
        lang: language,
        kind: 'house',
      });

      const response = await fetch(`${this.baseUrl}?${params}`);

      if (!response.ok) {
        throw new Error(`Yandex Geocoding API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const geoObjects = data?.response?.GeoObjectCollection?.featureMember || [];

      if (geoObjects.length === 0) {
        return null;
      }

      return this.transformResult(geoObjects[0].GeoObject);
    } catch (error) {
      logger.error('❌ Ошибка обратного геокодинга Яндекс.Карты:', error);

      return null;
    }
  }

  /**
   * Получение подсказок адресов (автодополнение)
   * @param query Частичный запрос
   * @param options Опции поиска
   */
  async getSuggestions(
    query: string,
    options: {
      limit?: number;
      bounds?: { south: number; north: number; west: number; east: number };
    } = {},
  ): Promise<YandexAddressSearchResult[]> {
    // Для подсказок используем обычный поиск с ограниченным количеством результатов
    return this.searchAddresses(query, {
      ...options,
      limit: options.limit || 5,
      kind: 'house,street,district,locality', // Расширенные типы для подсказок
    });
  }

  /**
   * Преобразование результата Яндекс.Карт в наш формат
   */
  private transformResult = (
    geoObject: YandexGeocodingResult['GeoObject'],
  ): YandexAddressSearchResult => {
    const metaData = geoObject.metaDataProperty.GeocoderMetaData;
    const address = metaData.Address;
    const [longitude, latitude] = geoObject.Point.pos.split(' ').map(Number);

    // Извлекаем компоненты адреса
    const components = address.Components.reduce(
      (acc, comp) => {
        acc[comp.kind] = comp.name;

        return acc;
      },
      {} as Record<string, string>,
    );

    // Формируем читаемый адрес
    const addressParts = [];

    if (components.house && components.street) {
      addressParts.push(`${components.street}, ${components.house}`);
    } else if (components.street) {
      addressParts.push(components.street);
    }

    const formattedAddress = addressParts.length > 0 ? addressParts.join(', ') : address.formatted;

    // Парсим границы
    let boundingBox;

    if (geoObject.boundedBy) {
      const [lowerLon, lowerLat] = geoObject.boundedBy.Envelope.lowerCorner.split(' ').map(Number);
      const [upperLon, upperLat] = geoObject.boundedBy.Envelope.upperCorner.split(' ').map(Number);

      boundingBox = {
        south: lowerLat,
        north: upperLat,
        west: lowerLon,
        east: upperLon,
      };
    }

    return {
      id: `yandex_${longitude}_${latitude}`, // Уникальный ID
      displayName: metaData.text,
      address: formattedAddress,
      city: components.locality || components.area,
      district: components.district,
      street: components.street,
      house: components.house,
      latitude,
      longitude,
      precision: metaData.precision,
      kind: metaData.kind,
      boundingBox,
    };
  };
}

export const yandexGeocodingService = new YandexGeocodingService();

/**
 * Хук для использования Яндекс.Карты геокодинга в компонентах
 */
export const useYandexGeocoding = () => {
  return {
    searchAddresses: yandexGeocodingService.searchAddresses.bind(yandexGeocodingService),
    reverseGeocode: yandexGeocodingService.reverseGeocode.bind(yandexGeocodingService),
    getSuggestions: yandexGeocodingService.getSuggestions.bind(yandexGeocodingService),
  };
};

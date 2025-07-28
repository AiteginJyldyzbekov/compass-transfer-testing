/**
 * Сервис для геокодинга адресов через Nominatim (OpenStreetMap)
 * Используется для поиска адресов при создании новых локаций
 */

import { logger } from '@shared/lib';

export interface GeocodingResult {
  place_id: string;
  licence: string;
  osm_type: string;
  osm_id: string;
  lat: string;
  lon: string;
  display_name: string;
  address: {
    house_number?: string;
    road?: string;
    suburb?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
    country_code?: string;
  };
  boundingbox: [string, string, string, string]; // [south, north, west, east]
  importance: number;
}

export interface AddressSearchResult {
  id: string;
  displayName: string;
  address: string;
  city?: string;
  district?: string;
  latitude: number;
  longitude: number;
  importance: number;
  boundingBox?: {
    south: number;
    north: number;
    west: number;
    east: number;
  };
}

class GeocodingService {
  private readonly baseUrl = 'https://nominatim.openstreetmap.org';
  private readonly userAgent = 'CompassTaxi/2.0'; // Обязательный User-Agent для Nominatim

  /**
   * Поиск адресов по строке запроса
   * @param query Строка поиска (адрес, название места)
   * @param options Дополнительные опции поиска
   */
  async searchAddresses(
    query: string,
    options: {
      limit?: number;
      countryCode?: string;
      language?: string;
      bounds?: { south: number; north: number; west: number; east: number };
    } = {},
  ): Promise<AddressSearchResult[]> {
    const { limit = 10, countryCode = 'kg', language = 'ru' } = options;

    try {
      const params = new URLSearchParams({
        q: query,
        format: 'json',
        addressdetails: '1',
        limit: limit.toString(),
        'accept-language': language,
      });

      if (countryCode) {
        params.append('countrycodes', countryCode);
      }

      if (options.bounds) {
        const { south, north, west, east } = options.bounds;

        params.append('viewbox', `${west},${south},${east},${north}`);
        params.append('bounded', '1');
      }

      const response = await fetch(`${this.baseUrl}/search?${params}`, {
        headers: {
          'User-Agent': this.userAgent,
        },
      });

      if (!response.ok) {
        throw new Error(`Nominatim API error: ${response.status} ${response.statusText}`);
      }

      const data: GeocodingResult[] = await response.json();

      return data.map(this.transformResult);
    } catch (error) {
      logger.error('❌ Ошибка геокодинга:', error);
      throw new Error('Не удалось найти адреса. Попробуйте изменить запрос.');
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
    language: string = 'ru',
  ): Promise<AddressSearchResult | null> {
    try {
      const params = new URLSearchParams({
        lat: latitude.toString(),
        lon: longitude.toString(),
        format: 'json',
        addressdetails: '1',
        'accept-language': language,
      });

      const response = await fetch(`${this.baseUrl}/reverse?${params}`, {
        headers: {
          'User-Agent': this.userAgent,
        },
      });

      if (!response.ok) {
        throw new Error(`Nominatim API error: ${response.status} ${response.statusText}`);
      }

      const data: GeocodingResult = await response.json();

      return this.transformResult(data);
    } catch (error) {
      logger.error('❌ Ошибка обратного геокодинга:', error);

      return null;
    }
  }

  /**
   * Преобразование результата Nominatim в наш формат
   */
  private transformResult = (result: GeocodingResult): AddressSearchResult => {
    const { address } = result;

    // Формируем читаемый адрес
    const addressParts = [];

    if (address.house_number && address.road) {
      addressParts.push(`${address.road}, ${address.house_number}`);
    } else if (address.road) {
      addressParts.push(address.road);
    }

    const formattedAddress =
      addressParts.length > 0 ? addressParts.join(', ') : result.display_name.split(',')[0];

    return {
      id: result.place_id,
      displayName: result.display_name,
      address: formattedAddress,
      city: address.city || address.state,
      district: address.suburb,
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      importance: result.importance,
      boundingBox: {
        south: parseFloat(result.boundingbox[0]),
        north: parseFloat(result.boundingbox[1]),
        west: parseFloat(result.boundingbox[2]),
        east: parseFloat(result.boundingbox[3]),
      },
    };
  };
}

export const geocodingService = new GeocodingService();

/**
 * Хук для использования геокодинга в компонентах
 */
export const useGeocoding = () => {
  return {
    searchAddresses: geocodingService.searchAddresses.bind(geocodingService),
    reverseGeocode: geocodingService.reverseGeocode.bind(geocodingService),
  };
};

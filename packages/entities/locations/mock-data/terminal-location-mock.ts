import { LocationType } from '../enums/LocationType.enum';
import type { LocationDTO } from '../interface/LocationDTO';

/**
 * Mock данные локации терминала
 * Соответствует API GET /Location/{uuid}
 */
export const mockTerminalLocation: LocationDTO = {
  id: '550e8400-e29b-41d4-a716-446655440201',
  type: LocationType.Station,
  name: 'Терминал Ошский рынок',
  address: 'ул. Ошская, 125, Бишкек, Кыргызстан',
  district: 'Ленинский район',
  city: 'Бишкек',
  country: 'Кыргызстан',
  region: 'Чуйская область',
  latitude: 42.8746,
  longitude: 74.5698,
  isActive: true,
  popular1: true,
  popular2: false,
};

/**
 * Mock функция для получения локации по ID
 */
export const getMockLocationById = async (locationId: string): Promise<LocationDTO | null> => {
  // Имитируем задержку API
  await new Promise(resolve => setTimeout(resolve, 300));

  // Возвращаем mock локацию если ID совпадает
  if (locationId === mockTerminalLocation.id) {
    return mockTerminalLocation;
  }

  // Можно добавить другие локации
  const otherLocations: Record<string, LocationDTO> = {
    // Терминалы
    '550e8400-e29b-41d4-a716-446655440101': {
      id: '550e8400-e29b-41d4-a716-446655440101',
      type: LocationType.Airport,
      name: 'Терминал Аэропорт Манас',
      address: 'Международный аэропорт Манас, Бишкек, Кыргызстан',
      district: null,
      city: 'Бишкек',
      country: 'Кыргызстан',
      region: 'Чуйская область',
      latitude: 43.0612,
      longitude: 74.4776,
      isActive: true,
      popular1: true,
      popular2: true,
    },
    '550e8400-e29b-41d4-a716-446655440102': {
      id: '550e8400-e29b-41d4-a716-446655440102',
      type: LocationType.BusinessCenter,
      name: 'Офис партнера "Центр города"',
      address: 'пр. Чуй, 200, Бишкек, Кыргызстан',
      district: 'Первомайский район',
      city: 'Бишкек',
      country: 'Кыргызстан',
      region: 'Чуйская область',
      latitude: 42.8747,
      longitude: 74.6248,
      isActive: true,
      popular1: true,
      popular2: false,
    },

    // Зоны работы водителей
    '550e8400-e29b-41d4-a716-446655440301': {
      id: '550e8400-e29b-41d4-a716-446655440301',
      type: LocationType.Work,
      name: 'Микрорайон Джал',
      address: 'мкр. Джал, Бишкек, Кыргызстан',
      district: 'Октябрьский район',
      city: 'Бишкек',
      country: 'Кыргызстан',
      region: 'Чуйская область',
      latitude: 42.84,
      longitude: 74.62,
      isActive: true,
      popular1: false,
      popular2: true,
    },
    '550e8400-e29b-41d4-a716-446655440104': {
      id: '550e8400-e29b-41d4-a716-446655440104',
      type: LocationType.Work,
      name: 'Восточный район',
      address: 'Восточная часть города, Бишкек, Кыргызстан',
      district: 'Свердловский район',
      city: 'Бишкек',
      country: 'Кыргызстан',
      region: 'Чуйская область',
      latitude: 42.89,
      longitude: 74.65,
      isActive: true,
      popular1: true,
      popular2: false,
    },
    '550e8400-e29b-41d4-a716-446655440105': {
      id: '550e8400-e29b-41d4-a716-446655440105',
      type: LocationType.Work,
      name: 'Западный район',
      address: 'Западная часть города, Бишкек, Кыргызстан',
      district: 'Ленинский район',
      city: 'Бишкек',
      country: 'Кыргызстан',
      region: 'Чуйская область',
      latitude: 42.85,
      longitude: 74.52,
      isActive: true,
      popular1: true,
      popular2: true,
    },
  };

  return otherLocations[locationId] || null;
};

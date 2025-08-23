/**
 * Города и регионы Кыргызстана
 */

export interface CityRegion {
  city: string;
  regions: string[];
}

export const KYRGYZSTAN_CITIES_REGIONS: CityRegion[] = [
  {
    city: 'Бишкек',
    regions: [
      'Первомайский район',
      'Свердловский район',
      'Октябрьский район',
      'Ленинский район',
      'Сокулукский район'
    ]
  },
  {
    city: 'Ош',
    regions: [
      'Центральный район',
      'Северный район',
      'Южный район'
    ]
  },
  {
    city: 'Джалал-Абад',
    regions: [
      'Центральный район',
      'Восточный район',
      'Западный район'
    ]
  },
  {
    city: 'Каракол',
    regions: [
      'Центральный район',
      'Пригородный район'
    ]
  },
  {
    city: 'Токмок',
    regions: [
      'Центральный район',
      'Промышленный район'
    ]
  },
  {
    city: 'Узген',
    regions: [
      'Центральный район',
      'Старый город'
    ]
  },
  {
    city: 'Нарын',
    regions: [
      'Центральный район'
    ]
  },
  {
    city: 'Талас',
    regions: [
      'Центральный район'
    ]
  },
  {
    city: 'Баткен',
    regions: [
      'Центральный район'
    ]
  },
  {
    city: 'Кант',
    regions: [
      'Центральный район'
    ]
  },
  {
    city: 'Кара-Балта',
    regions: [
      'Центральный район',
      'Промышленный район'
    ]
  },
  {
    city: 'Кызыл-Кия',
    regions: [
      'Центральный район'
    ]
  },
  {
    city: 'Сулюкта',
    regions: [
      'Центральный район'
    ]
  },
  {
    city: 'Кербен',
    regions: [
      'Центральный район'
    ]
  },
  {
    city: 'Майлуу-Суу',
    regions: [
      'Центральный район'
    ]
  },
  {
    city: 'Тюп',
    regions: [
      'Центральный район'
    ]
  },
  {
    city: 'Чолпон-Ата',
    regions: [
      'Центральный район',
      'Курортный район'
    ]
  },
  {
    city: 'Балыкчы',
    regions: [
      'Центральный район'
    ]
  },
  {
    city: 'Кочкор-Ата',
    regions: [
      'Центральный район'
    ]
  },
  {
    city: 'Кемин',
    regions: [
      'Центральный район'
    ]
  }
];

/**
 * Получить все города
 */
export const getCities = (): string[] => {
  return KYRGYZSTAN_CITIES_REGIONS.map(item => item.city).sort();
};

/**
 * Получить регионы для указанного города
 */
export const getRegionsByCity = (city: string): string[] => {
  const cityData = KYRGYZSTAN_CITIES_REGIONS.find(item => item.city === city);

  return cityData ? cityData.regions.sort() : [];
};

/**
 * Проверить, существует ли город
 */
export const isCityExists = (city: string): boolean => {
  return KYRGYZSTAN_CITIES_REGIONS.some(item => item.city === city);
};

/**
 * Проверить, существует ли регион в указанном городе
 */
export const isRegionExistsInCity = (city: string, region: string): boolean => {
  const cityData = KYRGYZSTAN_CITIES_REGIONS.find(item => item.city === city);
  
  return cityData ? cityData.regions.includes(region) : false;
};

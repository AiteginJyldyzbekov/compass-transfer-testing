export interface District {
  name: string;
  slug: string;
}

export interface City {
  name: string;
  slug: string;
  districts: District[];
}

export interface Region {
  name: string;
  slug: string;
  image: string;
  cities: City[];
}

// Полная структура административного деления Кыргызстана
export const KYRGYZSTAN_ADMINISTRATIVE: Region[] = [
  {
    name: 'Бишкек',
    slug: 'bishkek',
    image: '/regions/bishkek.png',
    cities: [
      {
        name: 'Бишкек',
        slug: 'bishkek-city',
        districts: [
          { name: 'Первомайский', slug: 'birinchi-may' },
          { name: 'Ленинский', slug: 'leninsky' },
          { name: 'Октябрьский', slug: 'oktyabrsky' },
          { name: 'Свердловский', slug: 'sverdlovsky' },
        ],
      },
    ],
  },
  {
    name: 'Чуйская область',
    slug: 'chui',
    image: '/regions/chui.png',
    cities: [
      {
        name: 'Токмок',
        slug: 'tokmok',
        districts: [
          { name: 'Центральный', slug: 'tokmok-central' },
          { name: 'Северный', slug: 'tokmok-north' },
          { name: 'Южный', slug: 'tokmok-south' },
        ],
      },
      {
        name: 'Кант',
        slug: 'kant',
        districts: [
          { name: 'Центральный', slug: 'kant-central' },
          { name: 'Промышленный', slug: 'kant-industrial' },
        ],
      },
      {
        name: 'Кара-Балта',
        slug: 'kara-balta',
        districts: [
          { name: 'Центральный', slug: 'kara-balta-central' },
          { name: 'Восточный', slug: 'kara-balta-east' },
        ],
      },
      {
        name: 'Шопоков',
        slug: 'shopokov',
        districts: [{ name: 'Центральный', slug: 'shopokov-central' }],
      },
    ],
  },
  {
    name: 'Ошская область',
    slug: 'osh',
    image: '/regions/osh.png',
    cities: [
      {
        name: 'Ош',
        slug: 'osh-city',
        districts: [
          { name: 'Центральный', slug: 'osh-central' },
          { name: 'Северный', slug: 'osh-north' },
          { name: 'Южный', slug: 'osh-south' },
          { name: 'Восточный', slug: 'osh-east' },
        ],
      },
      {
        name: 'Узген',
        slug: 'uzgen',
        districts: [
          { name: 'Центральный', slug: 'uzgen-central' },
          { name: 'Старый город', slug: 'uzgen-old' },
        ],
      },
      {
        name: 'Кара-Суу',
        slug: 'kara-suu',
        districts: [
          { name: 'Центральный', slug: 'kara-suu-central' },
          { name: 'Базарный', slug: 'kara-suu-bazar' },
        ],
      },
    ],
  },
  {
    name: 'Жалал-Абадская область',
    slug: 'jalal-abad',
    image: '/regions/jalal-abad.png',
    cities: [
      {
        name: 'Жалал-Абад',
        slug: 'jalal-abad-city',
        districts: [
          { name: 'Центральный', slug: 'jalal-abad-central' },
          { name: 'Северный', slug: 'jalal-abad-north' },
          { name: 'Южный', slug: 'jalal-abad-south' },
        ],
      },
      {
        name: 'Таш-Кумыр',
        slug: 'tash-kumyr',
        districts: [
          { name: 'Центральный', slug: 'tash-kumyr-central' },
          { name: 'Горняцкий', slug: 'tash-kumyr-mining' },
        ],
      },
      {
        name: 'Кербен',
        slug: 'kerben',
        districts: [{ name: 'Центральный', slug: 'kerben-central' }],
      },
    ],
  },
  {
    name: 'Иссык-Кульская область',
    slug: 'issyk-kul',
    image: '/regions/issyk-kul.png',
    cities: [
      {
        name: 'Каракол',
        slug: 'karakol',
        districts: [
          { name: 'Центральный', slug: 'karakol-central' },
          { name: 'Северный', slug: 'karakol-north' },
          { name: 'Южный', slug: 'karakol-south' },
        ],
      },
      {
        name: 'Балыкчы',
        slug: 'balykchy',
        districts: [
          { name: 'Центральный', slug: 'balykchy-central' },
          { name: 'Портовый', slug: 'balykchy-port' },
        ],
      },
      {
        name: 'Чолпон-Ата',
        slug: 'cholpon-ata',
        districts: [
          { name: 'Центральный', slug: 'cholpon-ata-central' },
          { name: 'Курортный', slug: 'cholpon-ata-resort' },
        ],
      },
    ],
  },
  {
    name: 'Нарынская область',
    slug: 'naryn',
    image: '/regions/naryn.png',
    cities: [
      {
        name: 'Нарын',
        slug: 'naryn-city',
        districts: [
          { name: 'Центральный', slug: 'naryn-central' },
          { name: 'Восточный', slug: 'naryn-east' },
        ],
      },
    ],
  },
  {
    name: 'Таласская область',
    slug: 'talas',
    image: '/regions/talas.png',
    cities: [
      {
        name: 'Талас',
        slug: 'talas-city',
        districts: [
          { name: 'Центральный', slug: 'talas-central' },
          { name: 'Северный', slug: 'talas-north' },
        ],
      },
    ],
  },
  {
    name: 'Баткенская область',
    slug: 'batken',
    image: '/regions/batken.png',
    cities: [
      {
        name: 'Баткен',
        slug: 'batken-city',
        districts: [{ name: 'Центральный', slug: 'batken-central' }],
      },
      {
        name: 'Сулюкта',
        slug: 'sulyukta',
        districts: [
          { name: 'Центральный', slug: 'sulyukta-central' },
          { name: 'Горняцкий', slug: 'sulyukta-mining' },
        ],
      },
    ],
  },
];

// Утилитарные функции для работы с данными
export const getAllCities = (): City[] => {
  return KYRGYZSTAN_ADMINISTRATIVE.flatMap(region => region.cities);
};

export const getAllDistricts = (): District[] => {
  return KYRGYZSTAN_ADMINISTRATIVE.flatMap(region => region.cities.flatMap(city => city.districts));
};

export const getCitiesByRegion = (regionSlug: string): City[] => {
  const region = KYRGYZSTAN_ADMINISTRATIVE.find(r => r.slug === regionSlug);

  return region ? region.cities : [];
};

export const getDistrictsByCity = (citySlug: string): District[] => {
  const city = getAllCities().find(c => c.slug === citySlug);

  return city ? city.districts : [];
};

export const getRegionByCity = (citySlug: string): Region | undefined => {
  return KYRGYZSTAN_ADMINISTRATIVE.find(region =>
    region.cities.some(city => city.slug === citySlug),
  );
};

export const getCityByDistrict = (districtSlug: string): City | undefined => {
  return getAllCities().find(city =>
    city.districts.some(district => district.slug === districtSlug),
  );
};

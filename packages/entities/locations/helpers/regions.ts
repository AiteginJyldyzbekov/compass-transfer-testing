// Строгий тип для slug'ов регионов - единый источник истины
export type RegionSlug =
  | 'bishkek'
  | 'chui'
  | 'naryn'
  | 'osh'
  | 'batken'
  | 'talas'
  | 'jalal-abad'
  | 'issyk-kul';

// Интерфейс для региона
export interface Region {
  name: string;
  image: string;
  slug: RegionSlug;
}

// Type guard для проверки валидности региона
export const isValidRegionSlug = (region: string | null | undefined): region is RegionSlug => {
  const validSlugs: RegionSlug[] = [
    'bishkek',
    'chui',
    'naryn',
    'osh',
    'batken',
    'talas',
    'jalal-abad',
    'issyk-kul',
  ];

  return region !== null && region !== undefined && validSlugs.includes(region as RegionSlug);
};

// Функция для получения списка регионов с переводами
export const REGIONS = (t: (key: string) => string) => [
  { name: t('Regions.bishkek'), image: '/regions/bishkek.png', slug: 'bishkek' },
  { name: t('Regions.chui'), image: '/regions/chui.png', slug: 'chui' },
  { name: t('Regions.naryn'), image: '/regions/naryn.png', slug: 'naryn' },
  { name: t('Regions.osh'), image: '/regions/osh.png', slug: 'osh' },
  { name: t('Regions.batken'), image: '/regions/batken.png', slug: 'batken' },
  { name: t('Regions.talas'), image: '/regions/talas.png', slug: 'talas' },
  { name: t('Regions.jalal-abad'), image: '/regions/jalal-abad.png', slug: 'jalal-abad' },
  { name: t('Regions.issyk-kul'), image: '/regions/issyk-kul.png', slug: 'issyk-kul' },
];

// Маппинг slug к названию города для API
export const CITY_MAPPING: Record<RegionSlug, string> = {
  bishkek: 'Бишкек',
  chui: 'Чуй',
  naryn: 'Нарын',
  osh: 'Ош',
  batken: 'Баткен',
  talas: 'Талас',
  'jalal-abad': 'Жалал-Абад',
  'issyk-kul': 'Иссык-Куль',
};

// Маппинг регионов к картинкам для hero banner
export const REGION_IMAGES: Record<RegionSlug, string> = {
  bishkek: '/background/bishkek-fullbackground.png',
  chui: '/background/welcomeTerminal.png',
  naryn: '/background/welcomeTerminal.png',
  osh: '/background/welcomeTerminal.png',
  batken: '/background/welcomeTerminal.png',
  talas: '/background/welcomeTerminal.png',
  'jalal-abad': '/background/welcomeTerminal.png',
  'issyk-kul': '/background/welcomeTerminal.png',
};

// Маппинг регионов к ключам переводов для hero banner
export const REGION_TITLE_KEYS: Record<RegionSlug, string> = {
  bishkek: 'MainTerminal.heroTitleBishkek',
  chui: 'MainTerminal.heroTitleChui',
  naryn: 'MainTerminal.heroTitleNaryn',
  osh: 'MainTerminal.heroTitleOsh',
  batken: 'MainTerminal.heroTitleBatken',
  talas: 'MainTerminal.heroTitleTalas',
  'jalal-abad': 'MainTerminal.heroTitleJalalAbad',
  'issyk-kul': 'MainTerminal.heroTitleIssykKul',
};

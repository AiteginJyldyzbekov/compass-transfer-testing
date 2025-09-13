/**
 * Области Кыргызстана
 * Синхронизировано с packages/entities/locations/helpers/regions.ts
 */
export const KYRGYZSTAN_REGIONS = {
  "bishkek": "Бишкек",
  "chui": "Чуй",
  "naryn": "Нарын", 
  "osh": "Ош",
  "batken": "Баткен",
  "talas": "Талас",
  "jalal-abad": "Жалал-Абад",
  "issyk-kul": "Иссык-Куль"
} as const;

export type KyrgyzstanRegionKey = keyof typeof KYRGYZSTAN_REGIONS;
export type KyrgyzstanRegionName = typeof KYRGYZSTAN_REGIONS[KyrgyzstanRegionKey];

/**
 * Получить список областей в формате для селекта
 */
export const getRegionsForSelect = () => {
  return Object.entries(KYRGYZSTAN_REGIONS).map(([key, name]) => ({
    value: key,
    label: name
  }));
};

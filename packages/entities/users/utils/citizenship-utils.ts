/**
 * Утилиты для работы с гражданством
 */

export interface CitizenshipOption {
  value: string;
  label: string;
}

/**
 * Маппинг кодов стран в полные названия
 */
export const citizenshipLabels: Record<string, string> = {
  RU: 'Россия',
  BY: 'Беларусь', 
  KZ: 'Казахстан',
  UA: 'Украина',
  UZ: 'Узбекистан',
  TJ: 'Таджикистан',
  KG: 'Кыргызстан',
  AM: 'Армения',
  AZ: 'Азербайджан',
  MD: 'Молдова',
  GE: 'Грузия',
  OTHER: 'Другие страны',
  Other: 'Другое', // Для совместимости с формой
};

/**
 * Список всех доступных стран гражданства
 */
export const citizenshipOptions: CitizenshipOption[] = [
  { value: 'KG', label: 'Кыргызстан' },
  { value: 'RU', label: 'Россия' },
  { value: 'KZ', label: 'Казахстан' },
  { value: 'UZ', label: 'Узбекистан' },
  { value: 'TJ', label: 'Таджикистан' },
  { value: 'UA', label: 'Украина' },
  { value: 'BY', label: 'Беларусь' },
  { value: 'AM', label: 'Армения' },
  { value: 'AZ', label: 'Азербайджан' },
  { value: 'MD', label: 'Молдова' },
  { value: 'GE', label: 'Грузия' },
  { value: 'OTHER', label: 'Другие страны' },
  { value: 'Other', label: 'Другое' }, // Для совместимости с формой
];

/**
 * Получить полное название страны по её коду
 */
export const getCitizenshipLabel = (countryCode: string): string => {
  return citizenshipLabels[countryCode] || countryCode;
};

/**
 * Получить полные названия для массива кодов стран
 */
export const getCitizenshipLabels = (countryCodes: string[]): string[] => {
  return countryCodes.map(code => getCitizenshipLabel(code));
};

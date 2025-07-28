/**
 * Утилиты для работы с языками
 */

export interface LanguageOption {
  value: string;
  label: string;
}

/**
 * Маппинг языков для отображения на русском
 */
export const languageLabels: Record<string, string> = {
  kyrgyz: 'Кыргызский',
  russian: 'Русский',
  english: 'Английский',
  kazakh: 'Казахский',
  uzbek: 'Узбекский',
  turkish: 'Турецкий',
  // Дополнительные варианты для совместимости
  ru: 'Русский',
  en: 'Английский',
  ky: 'Кыргызский',
  kz: 'Казахский',
  uz: 'Узбекский',
  tr: 'Турецкий',
};

/**
 * Список всех доступных языков
 */
export const languageOptions: LanguageOption[] = [
  { value: 'kyrgyz', label: 'Кыргызский' },
  { value: 'russian', label: 'Русский' },
  { value: 'english', label: 'Английский' },
  { value: 'kazakh', label: 'Казахский' },
  { value: 'uzbek', label: 'Узбекский' },
  { value: 'turkish', label: 'Турецкий' },
];

/**
 * Получить русское название языка по его коду
 */
export const getLanguageLabel = (languageCode: string): string => {
  return languageLabels[languageCode] || languageCode;
};

/**
 * Получить русские названия для массива языков
 */
export const getLanguageLabels = (languageCodes: string[]): string[] => {
  return languageCodes.map(code => getLanguageLabel(code));
};

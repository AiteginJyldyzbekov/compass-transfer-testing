/**
 * Утилиты для работы с категориями водительских прав
 */

export interface LicenseCategory {
  value: string;
  label: string;
}

/**
 * Список всех доступных категорий водительских прав
 */
export const licenseCategories: LicenseCategory[] = [
  { value: 'A', label: 'A - Мотоциклы' },
  { value: 'B', label: 'B - Легковые автомобили' },
  { value: 'C', label: 'C - Грузовые автомобили' },
  { value: 'D', label: 'D - Автобусы' },
  { value: 'BE', label: 'BE - Легковые с прицепом' },
  { value: 'CE', label: 'CE - Грузовые с прицепом' },
  { value: 'DE', label: 'DE - Автобусы с прицепом' },
];

/**
 * Получить название категории по её значению
 */
export const getLicenseCategoryLabel = (value: string): string => {
  const category = licenseCategories.find(cat => cat.value === value);
  return category ? category.label : value;
};

/**
 * Получить массив значений всех категорий
 */
export const getLicenseCategoryValues = (): string[] => {
  return licenseCategories.map(cat => cat.value);
};

/**
 * Проверить, является ли значение валидной категорией
 */
export const isValidLicenseCategory = (value: string): boolean => {
  return licenseCategories.some(cat => cat.value === value);
};

/**
 * Отфильтровать только валидные категории из массива
 */
export const filterValidCategories = (categories: string[]): string[] => {
  return categories.filter(isValidLicenseCategory);
};

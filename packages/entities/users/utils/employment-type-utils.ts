/**
 * Утилиты для работы с типами занятости
 */

import { EmploymentType } from '@entities/users/enums';

export interface EmploymentTypeOption {
  value: EmploymentType;
  label: string;
}

/**
 * Список доступных типов занятости для API
 */
export const employmentTypeOptions: EmploymentTypeOption[] = [
  { value: EmploymentType.Percentage, label: 'Процентная оплата' },
  { value: EmploymentType.FixedAmount, label: 'Фиксированная оплата' },
];

/**
 * Получить название типа занятости по его значению
 */
export const getEmploymentTypeLabel = (value: EmploymentType): string => {
  const option = employmentTypeOptions.find(opt => opt.value === value);
  return option ? option.label : value;
};

/**
 * Получить массив значений всех типов занятости
 */
export const getEmploymentTypeValues = (): EmploymentType[] => {
  return employmentTypeOptions.map(opt => opt.value);
};

/**
 * Проверить, является ли значение валидным типом занятости
 */
export const isValidEmploymentType = (value: string): value is EmploymentType => {
  return Object.values(EmploymentType).includes(value as EmploymentType);
};

/**
 * Отфильтровать только валидные типы занятости из массива
 */
export const filterValidEmploymentTypes = (types: string[]): EmploymentType[] => {
  return types.filter(isValidEmploymentType);
};

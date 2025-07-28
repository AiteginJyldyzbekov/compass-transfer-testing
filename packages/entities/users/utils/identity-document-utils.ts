/**
 * Утилиты для работы с типами документов, удостоверяющих личность
 */

import { IdentityDocumentType } from '@entities/users/enums';

export interface IdentityDocumentOption {
  value: IdentityDocumentType;
  label: string;
}

/**
 * Список всех доступных типов документов
 */
export const identityDocumentOptions: IdentityDocumentOption[] = [
  { value: IdentityDocumentType.NationalPassport, label: 'Внутренний паспорт' },
  { value: IdentityDocumentType.InternationalPassport, label: 'Заграничный паспорт' },
  { value: IdentityDocumentType.IdCard, label: 'ID карта' },
  { value: IdentityDocumentType.DriversLicense, label: 'Водительское удостоверение' },
  { value: IdentityDocumentType.ForeignPassport, label: 'Иностранный паспорт' },
  { value: IdentityDocumentType.ResidencePermit, label: 'Вид на жительство' },
  { value: IdentityDocumentType.RefugeeId, label: 'Удостоверение беженца' },
  { value: IdentityDocumentType.TemporaryId, label: 'Временное удостоверение личности' },
  { value: IdentityDocumentType.MilitaryId, label: 'Военный билет' },
];

/**
 * Получить название типа документа по его значению
 */
export const getIdentityDocumentLabel = (value: IdentityDocumentType): string => {
  const option = identityDocumentOptions.find(opt => opt.value === value);
  return option ? option.label : value;
};

/**
 * Получить массив значений всех типов документов
 */
export const getIdentityDocumentValues = (): IdentityDocumentType[] => {
  return identityDocumentOptions.map(opt => opt.value);
};

/**
 * Проверить, является ли значение валидным типом документа
 */
export const isValidIdentityDocumentType = (value: string): value is IdentityDocumentType => {
  return Object.values(IdentityDocumentType).includes(value as IdentityDocumentType);
};

/**
 * Отфильтровать только валидные типы документов из массива
 */
export const filterValidIdentityDocumentTypes = (types: string[]): IdentityDocumentType[] => {
  return types.filter(isValidIdentityDocumentType);
};

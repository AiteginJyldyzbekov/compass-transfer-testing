import { LocationType, LocationTypeLabels } from '../enums';

export const locationTypeHelpers = {
  // Получить все опции для Select
  getOptions: () => {
    return Object.values(LocationType).map((type) => ({
      value: type,
      label: LocationTypeLabels[type],
    }));
  },

  // Получить лейбл по значению
  getLabel: (type: LocationType): string => {
    return LocationTypeLabels[type] || type;
  },

  // Проверить валидность типа
  isValid: (type: string): type is LocationType => {
    return Object.values(LocationType).includes(type as LocationType);
  },

  // Получить значение по умолчанию
  getDefault: (): LocationType => {
    return LocationType.Airport;
  },

  // Безопасно получить тип или дефолт
  getSafeValue: (type: string | undefined | null): LocationType => {
    if (!type) return LocationType.Airport;
    return locationTypeHelpers.isValid(type) ? (type as LocationType) : LocationType.Airport;
  },
};

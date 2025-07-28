/**
 * @enum
 */
export enum LocationType {
  Home = 'Home',
  Work = 'Work',
  Airport = 'Airport',
  Station = 'Station',
  Hotel = 'Hotel',
  Restaurant = 'Restaurant',
  Shop = 'Shop',
  Entertainment = 'Entertainment',
  Medical = 'Medical',
  Educational = 'Educational',
  BusinessCenter = 'BusinessCenter',
  Other = 'Other',
}

/**
 * Массив всех значений LocationType
 */
export const LocationTypeValues = [
  LocationType.Home,
  LocationType.Work,
  LocationType.Airport,
  LocationType.Station,
  LocationType.Hotel,
  LocationType.Restaurant,
  LocationType.Shop,
  LocationType.Entertainment,
  LocationType.Medical,
  LocationType.Educational,
  LocationType.BusinessCenter,
  LocationType.Other,
];

/**
 * Человекочитаемые названия типов локаций
 */
export const LocationTypeLabels: Record<LocationType, string> = {
  [LocationType.Home]: 'Дом',
  [LocationType.Work]: 'Работа',
  [LocationType.Airport]: 'Аэропорт',
  [LocationType.Station]: 'Вокзал',
  [LocationType.Hotel]: 'Отель',
  [LocationType.Restaurant]: 'Ресторан',
  [LocationType.Shop]: 'Магазин',
  [LocationType.Entertainment]: 'Развлекательное заведение',
  [LocationType.Medical]: 'Медицинское учреждение',
  [LocationType.Educational]: 'Образовательное учреждение',
  [LocationType.BusinessCenter]: 'Бизнес-центр',
  [LocationType.Other]: 'Другое',
};

export const locationTypeIcons: Record<LocationType, string> = {
  [LocationType.Home]: '🏠',
  [LocationType.Work]: '💼',
  [LocationType.Airport]: '✈️',
  [LocationType.Station]: '🚉',
  [LocationType.Hotel]: '🏨',
  [LocationType.Restaurant]: '🍽️',
  [LocationType.Shop]: '🛍️',
  [LocationType.Entertainment]: '🎮',
  [LocationType.Medical]: '🏥',
  [LocationType.Educational]: '🎓',
  [LocationType.BusinessCenter]: '🏢',
  [LocationType.Other]: '📍',
};

/**
 * Функция для получения человекочитаемого названия типа локации
 */
export const getLocationTypeLabel = (type: LocationType): string => {
  return LocationTypeLabels[type] || LocationTypeLabels[LocationType.Other];
};

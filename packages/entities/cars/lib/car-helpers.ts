import type {
  CarColor,
  VehicleType,
  ServiceClass,
  VehicleStatus,
  CarFeature,
} from '@entities/cars/enums';

/**
 * Получить русское название цвета автомобиля
 */
export const getCarColorLabel = (color: CarColor): string => {
  const labels = {
    Black: 'Черный',
    White: 'Белый',
    Silver: 'Серебристый',
    Gray: 'Серый',
    Red: 'Красный',
    Blue: 'Синий',
    Green: 'Зеленый',
    Yellow: 'Желтый',
    Brown: 'Коричневый',
    Orange: 'Оранжевый',
    Purple: 'Фиолетовый',
    Gold: 'Золотой',
    Other: 'Другой',
  };

  return labels[color] || color;
};

/**
 * Получить русское название типа автомобиля
 */
export const getVehicleTypeLabel = (type: VehicleType): string => {
  const labels = {
    Sedan: 'Седан',
    Hatchback: 'Хэтчбек',
    SUV: 'Внедорожник',
    Minivan: 'Минивэн',
    Coupe: 'Купе',
    Cargo: 'Грузовой',
    Pickup: 'Пикап',
  };

  return labels[type as keyof typeof labels] || type;
};

/**
 * Получить русское название класса обслуживания
 */
export const getServiceClassLabel = (serviceClass: ServiceClass): string => {
  const labels = {
    Economy: 'Эконом',
    Comfort: 'Комфорт',
    ComfortPlus: 'Комфорт+',
    Business: 'Бизнес',
    Premium: 'Премиум',
    Vip: 'VIP',
    Luxury: 'Люкс',
  };

  return labels[serviceClass] || serviceClass;
};

/**
 * Получить русское название статуса автомобиля
 */
export const getVehicleStatusLabel = (status: VehicleStatus): string => {
  const labels = {
    Available: 'Доступен',
    Maintenance: 'На обслуживании',
    Repair: 'На ремонте',
    Other: 'Другое',
  };

  return labels[status] || status;
};

/**
 * Получить цвет для статуса автомобиля
 */
export const getVehicleStatusColor = (status: VehicleStatus): string => {
  const colors = {
    Available: 'bg-green-100 text-green-800',
    Maintenance: 'bg-yellow-100 text-yellow-800',
    Repair: 'bg-red-100 text-red-800',
    Other: 'bg-gray-100 text-gray-800',
  };

  return colors[status] || 'bg-gray-100 text-gray-800';
};

/**
 * Получить русское название особенности автомобиля
 */
export const getCarFeatureLabel = (feature: CarFeature): string => {
  const labels = {
    AirConditioning: 'Кондиционер',
    ClimateControl: 'Климат-контроль',
    LeatherSeats: 'Кожаные сиденья',
    HeatedSeats: 'Подогрев сидений',
    Bluetooth: 'Bluetooth',
    USBPort: 'USB-порт',
    AuxInput: 'AUX-вход',
    Navigation: 'Навигация',
    BackupCamera: 'Камера заднего вида',
    ParkingSensors: 'Парковочные датчики',
    Sunroof: 'Люк',
    PanoramicRoof: 'Панорамная крыша',
    ThirdRowSeats: 'Третий ряд сидений',
    ChildSeat: 'Детское кресло',
    WheelchairAccess: 'Доступ для инвалидных колясок',
    Wifi: 'Wi-Fi',
    PremiumAudio: 'Премиальная аудиосистема',
    AppleCarplay: 'Apple CarPlay',
    AndroidAuto: 'Android Auto',
    SmokingAllowed: 'Разрешено курение',
    PetFriendly: 'Дружелюбно к питомцам',
    LuggageCarrier: 'Багажник на крыше',
    BikeRack: 'Велосипедная стойка',
  };

  return labels[feature as keyof typeof labels] || feature;
};

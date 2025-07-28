import { ServiceClass } from '../enums';

/**
 * Получение русского названия класса обслуживания
 */
export const getServiceClassLabel = (serviceClass: ServiceClass): string => {
  const serviceClassLabels = {
    [ServiceClass.Economy]: 'Эконом',
    [ServiceClass.Comfort]: 'Комфорт',
    [ServiceClass.ComfortPlus]: 'Комфорт+',
    [ServiceClass.Business]: 'Бизнес',
    [ServiceClass.Premium]: 'Премиум',
    [ServiceClass.Vip]: 'VIP',
    [ServiceClass.Luxury]: 'Люкс',
  };

  return serviceClassLabels[serviceClass] || 'Неизвестный';
};

/**
 * Получение полного русского названия класса обслуживания
 */
export const getServiceClassFullLabel = (serviceClass: ServiceClass): string => {
  const serviceClassFullLabels = {
    [ServiceClass.Economy]: 'Эконом-класс',
    [ServiceClass.Comfort]: 'Комфорт-класс',
    [ServiceClass.ComfortPlus]: 'Комфорт+ класс',
    [ServiceClass.Business]: 'Бизнес-класс',
    [ServiceClass.Premium]: 'Премиум-класс',
    [ServiceClass.Vip]: 'VIP-класс',
    [ServiceClass.Luxury]: 'Люкс-класс',
  };

  return serviceClassFullLabels[serviceClass] || 'Неизвестный класс';
};

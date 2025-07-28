import { z } from 'zod';
import { ServiceClass } from '../enums/ServiceClass.enum';
import { CarType } from '../enums/CarType.enum';

/**
 * Схема валидации для создания тарифа
 */
export const tariffCreateSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Название тарифа обязательно' })
    .max(127, { message: 'Название тарифа не должно превышать 127 символов' }),
  
  serviceClass: z
    .nativeEnum(ServiceClass, {
      required_error: 'Класс обслуживания обязателен',
      invalid_type_error: 'Неверный класс обслуживания',
    }),
  
  carType: z
    .nativeEnum(CarType, {
      required_error: 'Тип автомобиля обязателен',
      invalid_type_error: 'Неверный тип автомобиля',
    }),
  
  basePrice: z
    .number({
      required_error: 'Базовая цена обязательна',
      invalid_type_error: 'Базовая цена должна быть числом',
    })
    .min(0, { message: 'Базовая цена не может быть отрицательной' }),
  
  minutePrice: z
    .number({
      required_error: 'Цена за минуту обязательна',
      invalid_type_error: 'Цена за минуту должна быть числом',
    })
    .min(0, { message: 'Цена за минуту не может быть отрицательной' }),
  
  minimumPrice: z
    .number({
      required_error: 'Минимальная цена обязательна',
      invalid_type_error: 'Минимальная цена должна быть числом',
    })
    .min(0, { message: 'Минимальная цена не может быть отрицательной' }),
  
  perKmPrice: z
    .number({
      required_error: 'Цена за километр обязательна',
      invalid_type_error: 'Цена за километр должна быть числом',
    })
    .min(0, { message: 'Цена за километр не может быть отрицательной' }),
  
  freeWaitingTimeMinutes: z
    .number({
      required_error: 'Время бесплатного ожидания обязательно',
      invalid_type_error: 'Время ожидания должно быть числом',
    })
    .min(0, { message: 'Время ожидания не может быть отрицательным' })
    .max(60, { message: 'Время ожидания не может превышать 60 минут' }),
});

/**
 * Тип данных формы создания тарифа
 */
export type TariffCreateFormData = z.infer<typeof tariffCreateSchema>;

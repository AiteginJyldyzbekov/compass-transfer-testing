import { z } from 'zod';
import {
  CarColor,
  VehicleType,
  ServiceClass,
  VehicleStatus,
  CarFeature,
} from '@entities/cars/enums';

/**
 * Схема валидации для формы создания автомобиля
 */
export const carCreateSchema = z.object({
  make: z
    .string()
    .min(1, { message: 'Марка автомобиля обязательна' })
    .max(63, { message: 'Марка автомобиля не должна превышать 63 символа' }),
  model: z
    .string()
    .min(1, { message: 'Модель автомобиля обязательна' })
    .max(63, { message: 'Модель автомобиля не должна превышать 63 символа' }),
  year: z
    .number({
      required_error: 'Год выпуска обязателен',
      invalid_type_error: 'Год выпуска должен быть числом',
    })
    .int({ message: 'Год выпуска должен быть целым числом' })
    .min(1900, { message: 'Год выпуска должен быть не ранее 1900' })
    .max(new Date().getFullYear() + 1, { message: 'Год выпуска не может быть в будущем' }),
  color: z.nativeEnum(CarColor, {
    errorMap: () => ({ message: 'Выберите цвет автомобиля' }),
  }),
  licensePlate: z
    .string()
    .min(1, { message: 'Государственный регистрационный знак обязателен' })
    .max(15, { message: 'Государственный регистрационный знак не должен превышать 15 символов' }),
  type: z.nativeEnum(VehicleType, {
    errorMap: () => ({ message: 'Выберите тип автомобиля' }),
  }),
  serviceClass: z.nativeEnum(ServiceClass, {
    errorMap: () => ({ message: 'Выберите класс обслуживания' }),
  }),
  status: z.nativeEnum(VehicleStatus, {
    errorMap: () => ({ message: 'Выберите статус автомобиля' }),
  }),
  passengerCapacity: z
    .number({
      required_error: 'Пассажировместимость обязательна',
      invalid_type_error: 'Пассажировместимость должна быть числом',
    })
    .int({ message: 'Пассажировместимость должна быть целым числом' })
    .min(1, { message: 'Пассажировместимость должна быть не менее 1' })
    .max(50, { message: 'Пассажировместимость должна быть не более 50' }),
  features: z
    .array(z.nativeEnum(CarFeature))
    .min(1, { message: 'Выберите хотя бы одну дополнительную опцию' }),

  // Поля для управления водителями - обрабатываются через writeOperations
  firstShiftDriver: z.string().optional(),
  secondShiftDriver: z.string().optional(),
  previousFirstShiftDriver: z.string().optional(),
  previousSecondShiftDriver: z.string().optional(),
});
/**
 * Тип данных формы создания автомобиля, выведенный из схемы
 */
export type CarCreateFormData = z.infer<typeof carCreateSchema>;

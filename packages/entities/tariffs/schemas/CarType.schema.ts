import { z } from 'zod';
import { CarType } from '@entities/tariffs/enums';

/**
 * Схема валидации для CarType
 */
export const CarTypeSchema = z.nativeEnum(CarType, {
  errorMap: () => ({ message: 'Недопустимый тип автомобиля' }),
});

/**
 * Тип, выведенный из схемы CarTypeSchema
 */
export type CarTypeSchemaType = z.infer<typeof CarTypeSchema>;

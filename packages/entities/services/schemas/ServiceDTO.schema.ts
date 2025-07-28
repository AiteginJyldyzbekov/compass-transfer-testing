import { z } from 'zod';

/**
 * Схема валидации для ServiceDTO
 */
export const ServiceDTOSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Название услуги обязательно' })
    .max(127, { message: 'Название услуги не должно превышать 127 символов' })
    .describe('Название услуги'),
  description: z
    .string()
    .max(255, { message: 'Описание услуги не должно превышать 255 символов' })
    .nullable()
    .describe('Описание услуги (сом)'),
  price: z
    .number({
      required_error: 'Цена услуги обязательна',
      invalid_type_error: 'Цена услуги должна быть числом',
    })
    .positive({ message: 'Цена услуги должна быть положительным числом' })
    .describe('Цена услуги (сом)'),
  isQuantifiable: z
    .boolean({
      required_error: 'Необходимо указать, можно ли указать количество',
      invalid_type_error: 'Поле должно быть логическим значением',
    })
    .describe('Можно ли указать количество единиц услуги'),
});
/**
 * Тип, выведенный из схемы ServiceDTOSchema
 */
export type ServiceDTOType = z.infer<typeof ServiceDTOSchema>;

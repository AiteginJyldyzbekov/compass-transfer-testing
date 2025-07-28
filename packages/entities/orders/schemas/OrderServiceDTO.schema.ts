import { z } from 'zod';

/**
 * Схема валидации для OrderServiceDTO
 */
export const OrderServiceDTOSchema = z.object({
  serviceId: z.string({ required_error: 'Выберите услугу' }).uuid({ message: 'Выберите корректную услугу' }),
  quantity: z.number({
    required_error: 'Укажите количество',
    invalid_type_error: 'Количество должно быть числом'
  }).int({ message: 'Количество должно быть целым числом' }).min(1, { message: 'Количество должно быть больше 0' }),
  notes: z.string().nullable().optional()
});
/**
 * Тип, выведенный из схемы OrderServiceDTOSchema
 */
export type OrderServiceDTOType = z.infer<typeof OrderServiceDTOSchema>;
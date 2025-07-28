import { z } from 'zod';

/**
 * Схема валидации для обновления услуги
 */
export const serviceUpdateSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Название услуги обязательно' })
    .max(127, { message: 'Название услуги не должно превышать 127 символов' }),
  
  description: z
    .string()
    .max(255, { message: 'Описание услуги не должно превышать 255 символов' })
    .optional()
    .or(z.literal('')),
  
  price: z
    .number({
      required_error: 'Цена услуги обязательна',
      invalid_type_error: 'Цена услуги должна быть числом',
    })
    .positive({ message: 'Цена услуги должна быть положительным числом' })
    .max(999999, { message: 'Цена услуги не должна превышать 999,999 сом' }),
  
  isQuantifiable: z
    .boolean({
      required_error: 'Необходимо указать, можно ли указать количество',
      invalid_type_error: 'Поле должно быть логическим значением',
    }),
});

/**
 * Тип данных формы обновления услуги
 */
export type ServiceUpdateFormData = z.infer<typeof serviceUpdateSchema>;

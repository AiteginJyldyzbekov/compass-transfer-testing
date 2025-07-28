import { z } from 'zod';

/**
 * Схема валидации для обновления клиента
 */
export const customerUpdateSchema = z.object({
  phoneNumber: z
    .string()
    .max(63, { message: 'Номер телефона не должен превышать 63 символа' })
    .optional(),
  fullName: z
    .string()
    .min(1, { message: 'Полное имя обязательно' })
    .max(255, { message: 'Полное имя не должно превышать 255 символов' }),
  avatarUrl: z.string().nullable().optional(),
  loyaltyPoints: z.number().int({ message: 'Баллы лояльности должны быть целым числом' }),
});

/**
 * Тип данных формы обновления клиента
 */
export type CustomerUpdateFormData = z.infer<typeof customerUpdateSchema>;

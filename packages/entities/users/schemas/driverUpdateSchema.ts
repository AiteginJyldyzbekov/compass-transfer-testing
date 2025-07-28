import { z } from 'zod';
import { VerificationStatus } from '@entities/users/enums';
import { driverProfileSchema } from '@entities/users/schemas/driverProfileSchema';
import { employmentSchema } from '@entities/users/schemas/employmentSchema';

/**
 * Схема валидации для обновления водителя
 */
export const driverUpdateSchema = z.object({
  phoneNumber: z
    .string()
    .max(63, { message: 'Номер телефона не должен превышать 63 символа' })
    .nullable()
    .optional(),
  fullName: z
    .string()
    .min(1, { message: 'Полное имя обязательно' })
    .max(255, { message: 'Полное имя не должно превышать 255 символов' }),
  avatarUrl: z.string().nullable().optional(),
  verificationStatus: z.nativeEnum(VerificationStatus, {
    message: 'Выберите статус верификации',
  }),
  profile: driverProfileSchema,
  employment: employmentSchema,
  // Поле для автомобиля (может обрабатываться через конфигурацию формы)
  car: z.string().uuid({ message: 'Некорректный ID автомобиля' }).nullable().optional(),
});
/**
 * Тип данных формы обновления водителя
 */
export type DriverUpdateFormData = z.infer<typeof driverUpdateSchema>;

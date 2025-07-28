import { z } from 'zod';
import { VerificationStatus } from '@entities/users/enums';
import { driverProfileSchema } from '@entities/users/schemas/driverProfileSchema';
import { employmentSchema } from '@entities/users/schemas/employmentSchema';

/**
 * Схема валидации для создания водителя
 */
export const driverCreateSchema = z
  .object({
    email: z
      .string({
        message: 'Email должен быть строкой',
      })
      .min(1, { message: 'Email не может быть пустым' }),
    password: z
      .string({
        message: 'Пароль должен быть строкой',
      })
      .min(1, { message: 'Пароль не может быть пустым' }),
    confirmPassword: z
      .string({
        message: 'Подтверждение пароля должно быть строкой',
      })
      .min(1, { message: 'Подтверждение пароля не может быть пустым' }),
    phoneNumber: z
      .string({
        message: 'Номер телефона должен быть строкой',
      })
      .nullable()
      .optional(),
    fullName: z
      .string({
        message: 'Полное имя должно быть строкой',
      })
      .min(1, { message: 'Полное имя не может быть пустым' }),
    avatarUrl: z.string().nullable().optional(),
    verificationStatus: z.nativeEnum(VerificationStatus, {
      message: 'Выберите статус верификации',
    }),
    profile: driverProfileSchema,
    employment: employmentSchema,
    // Поле для автомобиля (может обрабатываться через конфигурацию формы)
    car: z
      .string({
        message: 'ID автомобиля должен быть строкой',
      })
      .optional(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'], // Ошибка будет привязана к полю confirmPassword
  });
/**
 * Тип данных формы создания водителя
 */
export type DriverCreateFormData = z.infer<typeof driverCreateSchema>;

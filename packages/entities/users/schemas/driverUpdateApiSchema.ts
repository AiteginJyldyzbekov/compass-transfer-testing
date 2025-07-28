import { z } from 'zod';
import { VerificationStatus } from '@entities/users/enums';
import { driverProfileSchema } from '@entities/users/schemas/driverProfileSchema';

/**
 * Схема валидации для API обновления водителя (PUT запрос)
 * PUT /User/Driver/{uuid}
 *
 * Эта схема используется для валидации данных, отправляемых на сервер
 * при обновлении профиля водителя
 */
export const driverUpdateApiSchema = z.object({
  /**
   * Номер телефона водителя
   * Может быть null, максимум 63 символа, формат tel
   */
  phoneNumber: z
    .string()
    .max(63, { message: 'Номер телефона не должен превышать 63 символа' })
    .nullable()
    .optional(),

  /**
   * Полное имя водителя
   * Обязательное поле, минимум 1 символ, максиум 255 символов
   */
  fullName: z
    .string({ message: 'Полное имя должно быть строкой' })
    .min(1, { message: 'Полное имя не может быть пустым' })
    .max(255, { message: 'Полное имя не должно превышать 255 символов' }),

  /**
   * URL аватара водителя
   * Может быть null, максимум 511 символов
   */
  avatarUrl: z
    .string({ message: 'URL аватара должен быть строкой' })
    .max(511, { message: 'URL аватара не должен превышать 511 символов' })
    .nullable()
    .optional(),

  /**
   * Статус верификации водителя
   * Обязательное поле, одно из значений enum VerificationStatus
   */
  verificationStatus: z.nativeEnum(VerificationStatus, {
    message: 'Выберите статус верификации',
  }),

  /**
   * Профиль водителя
   * Обязательный объект, содержащий детальную информацию о водителе
   */
  profile: driverProfileSchema,
});

/**
 * Тип данных для API обновления водителя
 */
export type DriverUpdateApiData = z.infer<typeof driverUpdateApiSchema>;

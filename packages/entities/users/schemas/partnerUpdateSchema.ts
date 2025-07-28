import { z } from 'zod';
import { VerificationStatus, BusinessType } from '@entities/users/enums';

/**
 * Схема валидации для обновления партнера
 */
export const partnerUpdateSchema = z.object({
  phoneNumber: z
    .string()
    .max(63, { message: 'Номер телефона не должен превышать 63 символа' })
    .optional(),
  fullName: z
    .string()
    .min(1, { message: 'Полное имя обязательно' })
    .max(255, { message: 'Полное имя не должно превышать 255 символов' }),
  avatarUrl: z.string().nullable().optional(),
  verificationStatus: z.nativeEnum(VerificationStatus, {
    message: 'Выберите статус верификации',
  }),
  profile: z.object({
    companyName: z.string().min(1, { message: 'Название компании обязательно' }),
    companyType: z.nativeEnum(BusinessType, {
      message: 'Выберите тип компании',
    }),
    registrationNumber: z
      .string()
      .max(31, { message: 'Регистрационный номер не должен превышать 31 символ' })
      .nullable(),
    taxIdentifier: z.string().max(31, { message: 'ИНН не должен превышать 31 символ' }).nullable(),
    legalAddress: z
      .string()
      .min(1, { message: 'Юридический адрес обязателен' })
      .max(255, { message: 'Юридический адрес не должен превышать 255 символов' }),
    contactEmail: z
      .string()
      .max(255, { message: 'Контактный email не должен превышать 255 символов' })
      .email({ message: 'Введите корректный email' })
      .nullable(),
    contactPhone: z
      .string()
      .max(63, { message: 'Номер телефона не должен превышать 63 символа' })
      .nullable(),
    website: z
      .string()
      .max(255, { message: 'Веб-сайт не должен превышать 255 символов' })
      .nullable(),
  }),
});

/**
 * Тип данных формы обновления партнера
 */
export type PartnerUpdateFormData = z.infer<typeof partnerUpdateSchema>;

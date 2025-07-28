import { z } from 'zod';
import { IdentityDocumentType } from '@entities/users/enums';

/**
 * Схема валидации для паспорта водителя (адаптированная для КР)
 */
export const driverPassportSchema = z.object({
  /**
   * Номер паспорта
   */
  number: z
    .string({
      message: 'Номер паспорта должен быть строкой',
    })
    .min(1, { message: 'Номер паспорта не может быть пустым' }),

  /**
   * Серия паспорта
   */
  series: z
    .string({
      message: 'Серия паспорта должна быть строкой',
    })
    .nullable()
    .optional(),

  /**
   * Дата выдачи паспорта
   */
  issueDate: z
    .string({
      message: 'Дата выдачи паспорта должна быть строкой',
    })
    .nullable()
    .optional(),

  /**
   * Орган, выдавший паспорт
   */
  issuedBy: z
    .string()
    .nullable()
    .optional(),

  /**
   * Страница паспорта
   */
  page: z
    .number({
      message: 'Страница паспорта должна быть числом',
    })
    .int({ message: 'Страница паспорта должна быть целым числом' })
    .nullable()
    .optional(),

  /**
   * Дата окончания срока действия
   */
  expiryDate: z
    .string({
      message: 'Дата окончания срока действия должна быть строкой',
    })
    .nullable()
    .optional(),

  /**
   * Тип документа, удостоверяющего личность
   */
  identityType: z.nativeEnum(IdentityDocumentType, {
    message: 'Выберите тип документа',
  }),
});
/**
 * Тип данных паспорта водителя, выведенный из схемы
 */
export type DriverPassportFormData = z.infer<typeof driverPassportSchema>;

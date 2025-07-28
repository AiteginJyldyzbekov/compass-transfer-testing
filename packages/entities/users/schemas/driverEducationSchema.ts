import { z } from 'zod';

/**
 * Схема валидации для образования водителя
 */
export const driverEducationSchema = z.object({
  institution: z
    .string()
    .min(1, { message: 'Название учебного заведения обязательно' })
    .max(255, { message: 'Название учебного заведения не должно превышать 255 символов' }),
  degree: z
    .string()
    .max(255, { message: 'Полученная степень/квалификация не должна превышать 255 символов' })
    .nullable(),
  fieldOfStudy: z
    .string()
    .max(127, { message: 'Специальность не должна превышать 127 символов' })
    .nullable(),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: 'Дата начала обучения должна быть в формате YYYY-MM-DD',
    })
    .nullable(),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: 'Дата окончания обучения должна быть в формате YYYY-MM-DD',
    })
    .nullable(),
  isCompleted: z.boolean(),
});
/**
 * Тип данных образования водителя, выведенный из схемы
 */
export type DriverEducationFormData = z.infer<typeof driverEducationSchema>;

import { z } from 'zod';
import { CitizenshipCountry, ServiceClass } from '@entities/users/enums';
import { driverEducationSchema } from '@entities/users/schemas/driverEducationSchema';
import { driverPassportSchema } from '@entities/users/schemas/driverPassportSchema';
import { driverTestScoreSchema } from '@entities/users/schemas/driverTestScoreSchema';
import { driverWorkExperienceSchema } from '@entities/users/schemas/driverWorkExperienceSchema';

/**
 * Схема валидации для профиля водителя
 */
export const driverProfileSchema = z.object({
  licenseNumber: z
    .string({
      message: 'Номер водительских прав должен быть строкой',
    })
    .min(1, { message: 'Номер водительских прав не может быть пустым' }),
  licenseCategories: z
    .array(z.string(), {
      message: 'Категории прав должны быть массивом строк',
    })
    .min(1, { message: 'Выберите хотя бы одну категорию прав' }),
  licenseIssueDate: z
    .string({
      message: 'Дата выдачи прав должна быть строкой',
    })
    .min(1, { message: 'Дата выдачи прав не может быть пустой' }),
  licenseExpiryDate: z
    .string({
      message: 'Дата окончания прав должна быть строкой',
    })
    .min(1, { message: 'Дата окончания прав не может быть пустой' }),
  dateOfBirth: z
    .string({
      message: 'Дата рождения должна быть строкой',
    })
    .min(1, { message: 'Дата рождения не может быть пустой' }),
  birthPlace: z
    .string({
      message: 'Место рождения должно быть строкой',
    })
    .max(255, { message: 'Место рождения не должно превышать 255 символов' })
    .nullable()
    .optional(),
  citizenship: z
    .string({
      message: 'Гражданство должно быть строкой',
    })
    .min(1, { message: 'Гражданство не может быть пустым' })
    .max(63, { message: 'Гражданство не должно превышать 63 символа' }),
  citizenshipCountry: z.union([
    z.nativeEnum(CitizenshipCountry),
    z.string()
  ], {
    message: 'Некорректная страна гражданства',
  }),
  drivingExperience: z
    .number({
      message: 'Опыт вождения должен быть числом',
    })
    .int({ message: 'Опыт вождения должен быть целым числом' })
    .min(0, { message: 'Опыт вождения не может быть отрицательным' })
    .nullable()
    .optional(),
  languages: z
    .array(z.string(), {
      message: 'Языки должны быть массивом строк',
    })
    .min(1, { message: 'Выберите хотя бы один язык' }),
  taxIdentifier: z
    .string({
      message: 'Налоговый номер должен быть строкой',
    })
    .nullable()
    .optional(),
  totalRides: z
    .number({
      message: 'Общее количество поездок должно быть числом',
    })
    .int({ message: 'Общее количество поездок должно быть целым числом' })
    .min(0, { message: 'Количество поездок не может быть отрицательным' }),
  totalDistance: z
    .number({
      message: 'Общее пройденное расстояние должно быть числом',
    })
    .min(0, { message: 'Пройденное расстояние не может быть отрицательным' }),
  lastRideDate: z
    .string({
      message: 'Дата последней поездки должна быть строкой',
    })
    .nullable()
    .optional(),
  medicalExamDate: z
    .string({
      message: 'Дата медосмотра должна быть строкой',
    })
    .nullable()
    .optional(),
  backgroundCheckDate: z
    .string({
      message: 'Дата проверки биографии должна быть строкой',
    })
    .nullable()
    .optional(),
  profilePhoto: z
    .string({
      message: 'URL фото профиля должен быть строкой',
    })
    .max(511, { message: 'URL фото профиля не должен превышать 511 символов' })
    .nullable()
    .optional(),
  preferredRideTypes: z
    .array(z.nativeEnum(ServiceClass), {
      message: 'Предпочитаемые классы обслуживания должны быть массивом',
    })
    .min(1, { message: 'Выберите хотя бы один предпочитаемый класс обслуживания' }),
  preferredWorkZones: z
    .array(z.string(), {
      message: 'Предпочитаемые зоны работы должны быть массивом строк',
    })
    .optional(),
  trainingCompleted: z.boolean({
    message: 'Статус обучения должен быть булевым значением',
  }),
  passport: driverPassportSchema,
  workExperience: z
    .array(driverWorkExperienceSchema, {
      message: 'Опыт работы должен быть массивом объектов',
    })
    .optional(),
  education: z
    .array(driverEducationSchema, {
      message: 'Образование должно быть массивом объектов',
    })
    .optional(),
  testScore: z
    .array(driverTestScoreSchema, {
      message: 'Результаты тестов должны быть массивом объектов',
    })
    .optional(),
});
/**
 * Тип данных профиля водителя, выведенный из схемы
 */
export type DriverProfileFormData = z.infer<typeof driverProfileSchema>;

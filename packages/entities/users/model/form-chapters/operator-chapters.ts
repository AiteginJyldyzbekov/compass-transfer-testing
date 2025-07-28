// Главы форм для оператора

import { BASE_CHAPTERS, type FormChapter } from './base-chapters';

// Специфичные главы для оператора
export const OPERATOR_CHAPTERS = {
  EMPLOYEE_PROFILE: {
    id: 'employee-profile',
    title: 'Профиль сотрудника',
    description: 'Табельный номер, отдел, должность, дата найма',
  } as FormChapter,
} as const;

// Готовые наборы глав для форм оператора
export const OPERATOR_FORM_CHAPTERS = {
  CREATE: [BASE_CHAPTERS.BASIC, BASE_CHAPTERS.SECURITY, OPERATOR_CHAPTERS.EMPLOYEE_PROFILE],
  EDIT: [BASE_CHAPTERS.BASIC, OPERATOR_CHAPTERS.EMPLOYEE_PROFILE],
} as const;

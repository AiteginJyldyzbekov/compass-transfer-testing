// Главы форм для администратора

import { BASE_CHAPTERS, type FormChapter } from './base-chapters';

// Специфичные главы для администратора
export const ADMIN_CHAPTERS = {
  PROFILE: {
    id: 'profile',
    title: 'Профиль администратора',
    description: 'Уровень доступа, отдел, должность',
  } as FormChapter,
} as const;

// Готовые наборы глав для форм администратора
export const ADMIN_FORM_CHAPTERS = {
  CREATE: [BASE_CHAPTERS.BASIC, BASE_CHAPTERS.SECURITY, ADMIN_CHAPTERS.PROFILE],
  EDIT: [BASE_CHAPTERS.BASIC, ADMIN_CHAPTERS.PROFILE],
} as const;

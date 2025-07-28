// Главы форм для партнера

import { BASE_CHAPTERS, type FormChapter } from './base-chapters';

// Специфичные главы для партнера
export const PARTNER_CHAPTERS = {
  BUSINESS: {
    id: 'business',
    title: 'Данные компании',
    description: 'Название, тип, ИНН, адрес, контакты',
  } as FormChapter,
} as const;

// Готовые наборы глав для форм партнера
export const PARTNER_FORM_CHAPTERS = {
  CREATE: [BASE_CHAPTERS.BASIC, BASE_CHAPTERS.SECURITY, PARTNER_CHAPTERS.BUSINESS],
  EDIT: [BASE_CHAPTERS.BASIC, PARTNER_CHAPTERS.BUSINESS],
} as const;

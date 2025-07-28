// Главы форм для терминала

import { BASE_CHAPTERS, type FormChapter } from './base-chapters';

// Специфичные главы для терминала
export const TERMINAL_CHAPTERS = {
  DATA: {
    id: 'terminal',
    title: 'Данные терминала',
    description: 'ID, устройство, IP, ОС, версия ПО, локация',
  } as FormChapter,
} as const;

// Готовые наборы глав для форм терминала
export const TERMINAL_FORM_CHAPTERS = {
  CREATE: [BASE_CHAPTERS.BASIC, BASE_CHAPTERS.SECURITY, TERMINAL_CHAPTERS.DATA],
  EDIT: [BASE_CHAPTERS.BASIC, TERMINAL_CHAPTERS.DATA],
} as const;

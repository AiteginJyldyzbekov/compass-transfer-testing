// Главы форм для клиента

import { BASE_CHAPTERS } from './base-chapters';

// Готовые наборы глав для форм клиента
export const CUSTOMER_FORM_CHAPTERS = {
  CREATE: [BASE_CHAPTERS.BASIC, BASE_CHAPTERS.SECURITY],
  EDIT: [BASE_CHAPTERS.BASIC],
} as const;

// Базовые главы форм (используются везде)

export interface FormChapter {
  id: string;
  title: string;
  description: string;
}

// Базовые главы (используются везде)
export const BASE_CHAPTERS = {
  BASIC: {
    id: 'basic',
    title: 'Базовые данные',
    description: 'Имя, email, телефон',
  } as FormChapter,

  SECURITY: {
    id: 'security',
    title: 'Безопасность',
    description: 'Пароль',
  } as FormChapter,
} as const;

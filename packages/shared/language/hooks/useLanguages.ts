'use client';

import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useCallback } from 'react';
import { changeLanguage } from '../api';
import { SUPPORTED_LANGUAGES, type Locale, type LanguageOption } from '../types';
import { isValidLanguage } from '../utils';

export const useLanguages = () => {
  const router = useRouter();
  const currentLanguage = useLocale() as Locale;
  const t = useTranslations();

  // Маппинг языков к флагам (используем SVG для надежности)
  const languageFlags: Record<Locale, string> = {
    ru: '/flag/russia-flag.svg',
    en: '/flag/uk-flag.svg',
    kg: '/flag/kyrg-flag.svg',
  };

  // Генерируем список языков с переводимыми названиями и флагами
  const languages: LanguageOption[] = SUPPORTED_LANGUAGES.map(locale => ({
    name: t(`languages.${locale}`), // Переводимые названия
    locale,
    icon: languageFlags[locale], // Путь к флагу
  }));

  // Функция смены языка с обработкой ошибок
  const handleLanguageChange = useCallback(
    async (language: Locale): Promise<void> => {
      // ВАЖНО: Избегаем ненужных API вызовов
      if (language === currentLanguage) {
        return;
      }

      // Проверяем, что язык поддерживается
      if (!isValidLanguage(language)) {
        console.error('Неподдерживаемый язык:', language);

        return;
      }

      try {
        const data = await changeLanguage(language);

        if (data.success) {
          // Обновляем страницу для применения нового языка
          router.refresh();
        }
      } catch (error) {
        console.error('Ошибка при смене языка:', error);
        // Можно добавить toast уведомление об ошибке
        alert(error instanceof Error ? error.message : 'Ошибка при смене языка');
      }
    },
    [currentLanguage, router],
  );

  return {
    languages,
    handleLanguageChange,
    currentLanguage,
  };
};

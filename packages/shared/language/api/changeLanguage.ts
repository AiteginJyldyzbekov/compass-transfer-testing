import type { Locale, LanguageChangeResponse, LanguageChangeRequest } from '../types';

/**
 * Функция для смены языка через API
 * @param language - Язык для установки
 * @returns Promise с ответом сервера
 * @throws Error если запрос не удался
 */
export const changeLanguage = async (language: Locale): Promise<LanguageChangeResponse> => {
  try {
    const response = await fetch('/api/language', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ language } as LanguageChangeRequest),
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;

      try {
        const errorData = await response.json();

        errorMessage = errorData.message || errorMessage;
      } catch {
        // Если не удается распарсить JSON ошибки, используем стандартное сообщение
      }

      throw new Error(errorMessage);
    }

    const data: LanguageChangeResponse = await response.json();

    if (data.success) {
      return data;
    } else {
      throw new Error(data.message || 'Ошибка при смене языка');
    }
  } catch (error) {
    console.error('Ошибка при смене языка:', error);

    // Перебрасываем ошибку для обработки в вызывающем коде
    throw error instanceof Error ? error : new Error('Неизвестная ошибка при смене языка');
  }
};

import { useTranslations } from 'next-intl';

export const getRegionName = (key: string): string => {
  // Для функций, которые не являются компонентами, нельзя напрямую использовать хуки
  // Поэтому возвращаем ключ для перевода, который будет использоваться в компоненте
  return `Regions.${key}`;
};

// Альтернативная функция для использования внутри компонентов
export const useRegionName = (key: string): string => {
  // Если ключ пустой или undefined, возвращаем пустую строку
  if (!key) return '';

  const t = useTranslations();

  try {
    // Формируем ключ перевода
    const translationKey = `Regions.${key}`;

    // Безопасно получаем перевод с помощью функции exists
    // Метод t.exists проверяет наличие перевода без выбрасывания исключения
    if (t.has(translationKey)) {
      return t(translationKey);
    } else {
      // Если перевода нет, возвращаем исходный ключ
      return key;
    }
  } catch (error) {
    // Если произошла ошибка, возвращаем ключ без логирования ошибки
    return key;
  }
};

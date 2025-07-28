import fs from 'fs/promises';
import path from 'path';
import { cookies } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';
import { logger } from '@shared/lib';

export default getRequestConfig(async () => {
  // Используем значение по умолчанию 'LANG', если переменная окружения не определена
  const langKey = process.env.NEXT_PUBLIC_LAN_COOKIE_NAME || 'LANG';
  const langCookie = (await cookies()).get(langKey)?.value || 'ru';
  const messagesPath = path.join(process.cwd(), '..', '..', 'messages');

  try {
    // Пытаемся загрузить все файлы из директории выбранного языка
    const languagePath = path.join(messagesPath, langCookie);
    const files = await fs.readdir(languagePath);
    // Фильтруем только JSON файлы
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    // Загружаем и объединяем все переводы в один плоский объект
    let messages = {};

    for (const file of jsonFiles) {
      const filePath = path.join(languagePath, file);
      const fileContent = await fs.readFile(filePath, 'utf8');
      const translations = JSON.parse(fileContent);

      // Объединяем все переводы в один объект, сохраняя вложенную структуру
      messages = { ...messages, ...translations };
    }

    // Гарантированный return при успешной загрузке (даже если файлов не было)
    return {
      locale: langCookie,
      messages,
      // Добавляем настройку для предотвращения падения при отсутствии переводов
      onError: error => {
        if (error.code === 'MISSING_MESSAGE') {
          // Просто возвращаем ключ или пустую строку вместо ошибки
          return '';
        }

        return '';
      },
    };
  } catch (error) {
    logger.error('Error loading translations:', error);

    // Возвращаем пустой объект переводов в случае ошибки при загрузке
    return {
      locale: 'ru', // Возвращаем дефолтную локаль при ошибке
      messages: {},
      onError: () => '', // Пустой обработчик ошибок для дефолта
    };
  }
});

import { NextResponse, type NextRequest } from 'next/server';
import {
  SUPPORTED_LANGUAGES,
  type Locale,
  type LanguageChangeRequest,
  type LanguageChangeResponse,
} from '@shared/language';
import { logger } from '@shared/lib';

/**
 * POST /api/language
 * Обработчик для смены языка приложения
 */
export async function POST(request: NextRequest): Promise<NextResponse<LanguageChangeResponse>> {
  try {
    // Парсим тело запроса
    const body: LanguageChangeRequest = await request.json();
    const { language } = body;

    // Валидация: проверяем, что язык передан
    if (!language) {
      return NextResponse.json(
        {
          success: false,
          message: 'Язык не указан',
        },
        { status: 400 },
      );
    }

    // Валидация: проверяем, что язык поддерживается
    if (!SUPPORTED_LANGUAGES.includes(language)) {
      return NextResponse.json(
        {
          success: false,
          message: `Неподдерживаемый язык. Доступные языки: ${SUPPORTED_LANGUAGES.join(', ')}`,
        },
        { status: 400 },
      );
    }

    const validLanguage = language as Locale;

    // Получаем имя cookie из переменной окружения или используем значение по умолчанию
    const cookieName = process.env.NEXT_PUBLIC_LAN_COOKIE_NAME || 'LANG';

    // Создаем ответ с успешным результатом
    const response = NextResponse.json(
      {
        success: true,
        message: 'Язык успешно изменен',
        language: validLanguage,
      },
      { status: 200 },
    );

    // Устанавливаем cookie с языком
    // Cookie будет действовать 1 год, доступна для всего домена
    response.cookies.set({
      name: cookieName,
      value: validLanguage,
      maxAge: 60 * 60 * 24 * 365, // 1 год в секундах
      httpOnly: false, // Позволяем доступ из JavaScript на клиенте
      secure: process.env.NODE_ENV === 'production', // HTTPS только в продакшене
      sameSite: 'lax', // Защита от CSRF
      path: '/', // Доступна для всего сайта
    });

    return response;
  } catch (error) {
    logger.error('Ошибка при смене языка:', error);

    // Обработка ошибки парсинга JSON
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Неверный формат данных',
        },
        { status: 400 },
      );
    }

    // Общая ошибка сервера
    return NextResponse.json(
      {
        success: false,
        message: 'Внутренняя ошибка сервера',
      },
      { status: 500 },
    );
  }
}

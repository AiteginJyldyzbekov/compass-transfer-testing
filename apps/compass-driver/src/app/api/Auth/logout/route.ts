import { NextResponse } from 'next/server';
import { logger } from '@shared/lib';

export async function POST() {
  try {
    const response = NextResponse.json(
      { success: true, message: 'Успешно вышел из системы' },
      { status: 200 },
    );

    response.cookies.delete({
      name: process.env.AUTH_COOKIE_NAME,
      domain: process.env.NEXT_PUBLIC_DOMAIN,
    });

    return response;
  } catch (error) {
    logger.error('Ошибка выхода из системы:', error);

    return NextResponse.json(
      { success: false, message: '⚠️ Не удалось выйти из системы' },
      { status: 500 },
    );
  }
}

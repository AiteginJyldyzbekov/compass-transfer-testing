import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json(
      { success: true, message: 'Успешно вышел из системы' },
      { status: 200 },
    );

    // Удаляем куки аутентификации
    if (process.env.AUTH_COOKIE_NAME) {
      response.cookies.delete(process.env.AUTH_COOKIE_NAME);
    }

    return response;
  } catch {
    return NextResponse.json(
      { success: false, message: '⚠️ Не удалось выйти из системы' },
      { status: 500 },
    );
  }
}

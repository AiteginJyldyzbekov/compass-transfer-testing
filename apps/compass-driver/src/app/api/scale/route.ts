import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import { logger } from '@shared/lib';

export async function POST(request: NextRequest) {
  try {
    const { scale } = await request.json();

    if (typeof scale !== 'number' || scale < 0.5 || scale > 1.2) {
      return NextResponse.json({ error: 'Неверное значение масштаба' }, { status: 400 });
    }

    const cookieStore = await cookies();

    cookieStore.set('driver-ui-scale', scale.toString(), {
      maxAge: 365 * 24 * 60 * 60, // 1 год
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Ошибка при сохранении масштаба:', error);

    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}

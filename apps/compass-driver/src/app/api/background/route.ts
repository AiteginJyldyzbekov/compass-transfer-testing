import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import { logger } from '@shared/lib';

export async function POST(request: NextRequest) {
  try {
    const { type, value } = await request.json();

    if (!['color', 'image'].includes(type)) {
      return NextResponse.json({ error: 'Неверный тип фона' }, { status: 400 });
    }

    if (typeof value !== 'string' || value.length === 0) {
      return NextResponse.json({ error: 'Неверное значение фона' }, { status: 400 });
    }

    const cookieStore = await cookies();

    cookieStore.set('driver-background-type', type, {
      maxAge: 365 * 24 * 60 * 60, // 1 год
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    cookieStore.set('driver-background-value', value, {
      maxAge: 365 * 24 * 60 * 60, // 1 год
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Ошибка при сохранении фона:', error);

    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}

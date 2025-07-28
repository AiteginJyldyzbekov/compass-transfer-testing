import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import { logger } from '@shared/lib';

export async function POST(request: NextRequest) {
  try {
    const { opacity, blur, componentOpacity, componentBlur, overlayColor } = await request.json();

    if (typeof opacity !== 'number' || opacity < 0 || opacity > 1) {
      return NextResponse.json(
        { error: 'Неверное значение прозрачности планшета' },
        { status: 400 },
      );
    }

    if (typeof blur !== 'number' || blur < 0 || blur > 20) {
      return NextResponse.json({ error: 'Неверное значение размытия планшета' }, { status: 400 });
    }

    if (typeof componentOpacity !== 'number' || componentOpacity < 0 || componentOpacity > 1) {
      return NextResponse.json(
        { error: 'Неверное значение прозрачности компонентов' },
        { status: 400 },
      );
    }

    if (typeof componentBlur !== 'number' || componentBlur < 0 || componentBlur > 20) {
      return NextResponse.json(
        { error: 'Неверное значение размытия компонентов' },
        { status: 400 },
      );
    }

    // Валидация цвета планшета (опционально)
    if (overlayColor && typeof overlayColor !== 'string') {
      return NextResponse.json({ error: 'Неверное значение цвета планшета' }, { status: 400 });
    }

    const cookieStore = await cookies();

    // Настройки планшета
    cookieStore.set('driver-overlay-opacity', opacity.toString(), {
      maxAge: 365 * 24 * 60 * 60, // 1 год
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    cookieStore.set('driver-overlay-blur', blur.toString(), {
      maxAge: 365 * 24 * 60 * 60, // 1 год
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    // Цвет планшета
    if (overlayColor) {
      cookieStore.set('driver-overlay-color', overlayColor, {
        maxAge: 365 * 24 * 60 * 60, // 1 год
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
    }

    // Настройки компонентов
    cookieStore.set('driver-component-opacity', componentOpacity.toString(), {
      maxAge: 365 * 24 * 60 * 60, // 1 год
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    cookieStore.set('driver-component-blur', componentBlur.toString(), {
      maxAge: 365 * 24 * 60 * 60, // 1 год
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Ошибка при сохранении настроек оверлея:', error);

    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}

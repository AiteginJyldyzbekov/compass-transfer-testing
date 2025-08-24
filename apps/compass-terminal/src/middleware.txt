import { NextResponse, type NextRequest } from 'next/server';
import { TERMINAL_PUBLIC_ROUTES, isPublicRoute } from '@shared/lib/middleware';
import { getUserFromJWTCookie } from '@shared/lib/parse-cookie';
import { TERMINAL_ALLOWED_ROLES } from '@entities/auth';

/**
 * Middleware для защиты маршрутов
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Проверяем, является ли маршрут публичным
  if (isPublicRoute(pathname, TERMINAL_PUBLIC_ROUTES)) {
    return NextResponse.next();
  }

  // Для защищенных маршрутов проверяем аутентификацию
  const user = getUserFromJWTCookie(request);

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Проверяем доступ к терминалу
  if (pathname.startsWith('/(admin)') || pathname.startsWith('/')) {
    if (!TERMINAL_ALLOWED_ROLES.includes(user.role)) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

/**
 * Конфигурация middleware
 */
export const config = {
  matcher: [
    /*
     * Применяем middleware ко всем маршрутам кроме:
     * - api routes
     * - _next/static (статические файлы)
     * - _next/image (оптимизация изображений)
     * - favicon.ico
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

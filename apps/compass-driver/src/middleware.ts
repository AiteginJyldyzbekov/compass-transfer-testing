import { NextResponse, type NextRequest } from 'next/server';
import { getUserFromJWTCookie } from '@shared/lib/parse-cookie';

// Временные константы до создания shared/middleware
const DRIVER_PUBLIC_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password'];
const DRIVER_ALLOWED_ROLES = ['Driver'];

function isPublicRoute(pathname: string, publicRoutes: string[]): boolean {
  return publicRoutes.some(route => pathname.startsWith(route));
}

/**
 * Middleware для защиты маршрутов
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Проверяем, является ли маршрут публичным
  if (isPublicRoute(pathname, DRIVER_PUBLIC_ROUTES)) {
    return NextResponse.next();
  }

  // Для защищенных маршрутов проверяем аутентификацию
  const user = await getUserFromJWTCookie(request);

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Проверяем доступ к приложению водителя
  if (pathname.startsWith('/(admin)') || pathname.startsWith('/')) {
    if (!DRIVER_ALLOWED_ROLES.includes(user.role)) {
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

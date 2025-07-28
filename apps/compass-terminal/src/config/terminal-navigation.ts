// Утилиты для навигации в терминале
import {
  type TerminalRouteName,
  getAllTerminalRoutes,
  isValidTerminalRoute,
} from './terminal-routes';

// Интерфейс для элемента навигации
export interface TerminalNavigationItem {
  name: TerminalRouteName;
  path: string;
  title: string;
  description: string;
  order: number;
  isVisible: boolean;
}

// Порядок отображения маршрутов в навигации
const routeOrder: Record<TerminalRouteName, number> = {
  main: 0,
  locations: 1,
  payment: 2,
  receipt: 3,
};

// Видимость маршрутов в навигации (некоторые могут быть скрыты)
const routeVisibility: Record<TerminalRouteName, boolean> = {
  main: true,
  locations: true,
  payment: false, // Скрыт в навигации, доступен только по прямой ссылке
  receipt: false, // Скрыт в навигации, доступен только по прямой ссылке
};

// Генерация пути для маршрута
export function getTerminalRoutePath(routeName: TerminalRouteName): string {
  if (routeName === 'main') {
    return '/';
  }

  return `/${routeName}`;
}

// Получение всех элементов навигации
export function getTerminalNavigation(): TerminalNavigationItem[] {
  const routes = getAllTerminalRoutes();

  return routes
    .map(routeName => ({
      name: routeName,
      path: getTerminalRoutePath(routeName),
      title: getRouteTitle(routeName),
      description: getRouteDescription(routeName),
      order: routeOrder[routeName] || 999,
      isVisible: routeVisibility[routeName] ?? true,
    }))
    .sort((a, b) => a.order - b.order);
}

// Получение только видимых элементов навигации
export function getVisibleTerminalNavigation(): TerminalNavigationItem[] {
  return getTerminalNavigation().filter(item => item.isVisible);
}

// Получение заголовка маршрута
function getRouteTitle(routeName: TerminalRouteName): string {
  const titles: Record<TerminalRouteName, string> = {
    main: 'Главная',
    locations: 'Локации',
    payment: 'Оплата',
    receipt: 'Чек',
  };

  return titles[routeName] || routeName;
}

// Получение описания маршрута
function getRouteDescription(routeName: TerminalRouteName): string {
  const descriptions: Record<TerminalRouteName, string> = {
    main: 'Главная страница терминала',
    locations: 'Выбор локации для поездки',
    payment: 'Оплата заказа',
    receipt: 'Чек об оплате',
  };

  return descriptions[routeName] || 'Страница терминала';
}

// Проверка активного маршрута
export function isActiveRoute(currentPath: string, routeName: TerminalRouteName): boolean {
  const routePath = getTerminalRoutePath(routeName);

  if (routeName === 'main') {
    return currentPath === '/' || currentPath === '';
  }

  return currentPath.startsWith(routePath);
}

// Получение следующего маршрута в последовательности
export function getNextRoute(currentRoute: TerminalRouteName): TerminalRouteName | null {
  const visibleRoutes = getVisibleTerminalNavigation();
  const currentIndex = visibleRoutes.findIndex(route => route.name === currentRoute);

  if (currentIndex === -1 || currentIndex === visibleRoutes.length - 1) {
    return null;
  }

  return visibleRoutes[currentIndex + 1].name;
}

// Получение предыдущего маршрута в последовательности
export function getPreviousRoute(currentRoute: TerminalRouteName): TerminalRouteName | null {
  const visibleRoutes = getVisibleTerminalNavigation();
  const currentIndex = visibleRoutes.findIndex(route => route.name === currentRoute);

  if (currentIndex <= 0) {
    return null;
  }

  return visibleRoutes[currentIndex - 1].name;
}

// Валидация и нормализация пути
export function normalizeTerminalPath(path: string): string {
  // Убираем начальный слеш для проверки
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  // Если путь пустой, это главная страница
  if (!cleanPath) {
    return '/';
  }

  // Проверяем, является ли путь валидным маршрутом
  if (isValidTerminalRoute(cleanPath)) {
    return `/${cleanPath}`;
  }

  // Если маршрут не найден, возвращаем главную страницу
  return '/';
}

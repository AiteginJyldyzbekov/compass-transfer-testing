/**
 * Утилитарные функции для работы с картой
 */

/**
 * Функция для вычисления расстояния между двумя точками в метрах
 * Использует формулу гаверсинуса
 */
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371000; // Радиус Земли в метрах
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

/**
 * Функция для вычисления расстояния от точки до отрезка линии
 */
export const calculateDistanceToLineSegment = (
  px: number,
  py: number, // Точка (водитель)
  x1: number,
  y1: number, // Начало отрезка
  x2: number,
  y2: number, // Конец отрезка
): number => {
  // Переводим в декартовы координаты для упрощения расчетов
  const A = px - x1;
  const B = py - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;

  if (lenSq === 0) {
    // Отрезок вырожден в точку
    return calculateDistance(px, py, x1, y1);
  }

  const param = dot / lenSq;

  let xx: number, yy: number;

  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  return calculateDistance(px, py, xx, yy);
};

/**
 * Получает текущий масштаб UI из CSS переменной
 */
export const getUIScale = (): number => {
  const scale = getComputedStyle(document.documentElement).getPropertyValue('--ui-scale');
  return scale ? parseFloat(scale) : 1;
};

/**
 * Вычисляет направление (азимут) от одной точки к другой
 * @param fromLat - широта начальной точки
 * @param fromLng - долгота начальной точки  
 * @param toLat - широта конечной точки
 * @param toLng - долгота конечной точки
 * @returns азимут в градусах (0° = север, 90° = восток)
 */
export const calculateHeading = (fromLat: number, fromLng: number, toLat: number, toLng: number): number => {
  const deltaLng = toLng - fromLng;
  const deltaLat = toLat - fromLat;
  
  // Преобразуем в азимут (0° = север, 90° = восток)
  return ((Math.atan2(deltaLng, deltaLat) * 180) / Math.PI + 360) % 360;
};

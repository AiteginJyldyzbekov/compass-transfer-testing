/**
 * Форматирует число как валюту в кыргызских сомах (KGS)
 * @param price - цена для форматирования
 * @returns отформатированная строка с ценой
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'KGS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
};

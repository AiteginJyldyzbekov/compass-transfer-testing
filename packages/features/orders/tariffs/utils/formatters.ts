/**
 * Форматирует цену в формате кыргызских сомов (KGS)
 * @param price - Цена для форматирования
 * @returns Отформатированная строка с валютой
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'KGS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
};

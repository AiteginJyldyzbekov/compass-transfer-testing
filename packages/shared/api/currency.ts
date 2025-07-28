// API для получения курсов валют (используем exchangerate-api.com - бесплатный)
const CURRENCY_API_BASE = 'https://api.exchangerate-api.com/v4/latest';

// Интерфейсы для данных валют
export interface CurrencyRate {
  code: string;
  name: string;
  rate: number;
  change?: number; // изменение за день в %
  flag: string; // эмодзи флага
}

export interface CurrencyData {
  baseCurrency: string;
  lastUpdated: string;
  rates: CurrencyRate[];
}

// Основные валюты для отображения
export const MAIN_CURRENCIES = [
  { code: 'USD', name: 'Доллар США', flag: '🇺🇸' },
  { code: 'EUR', name: 'Евро', flag: '🇪🇺' },
  { code: 'RUB', name: 'Российский рубль', flag: '🇷🇺' },
  { code: 'KZT', name: 'Казахский тенге', flag: '🇰🇿' },
  { code: 'UZS', name: 'Узбекский сум', flag: '🇺🇿' },
  { code: 'CNY', name: 'Китайский юань', flag: '🇨🇳' },
] as const;

// Функция для получения курсов валют относительно сома
export async function getCurrencyRates(): Promise<CurrencyData> {
  try {
    // Получаем курсы относительно KGS (кыргызский сом)
    const response = await fetch(`${CURRENCY_API_BASE}/KGS`);

    if (!response.ok) {
      throw new Error('Ошибка получения курсов валют');
    }

    const data = await response.json();

    // Обрабатываем данные для нужных валют
    const rates: CurrencyRate[] = MAIN_CURRENCIES.map(currency => {
      const rate = data.rates[currency.code];
      
      return {
        code: currency.code,
        name: currency.name,
        rate: rate ? parseFloat((1 / rate).toFixed(4)) : 0, // Инвертируем курс (сколько сомов за 1 единицу валюты)
        flag: currency.flag,
      };
    }).filter(rate => rate.rate > 0); // Убираем валюты без курса

    return {
      baseCurrency: 'KGS',
      lastUpdated: new Date().toLocaleString('ru-RU'),
      rates,
    };
  } catch (error) {
    throw error;
  }
}

// Функция для получения курсов валют (без исторических данных)
export async function getCurrencyRatesWithHistory(): Promise<CurrencyData> {
  // Просто возвращаем текущие курсы без попыток получить исторические данные
  return getCurrencyRates();
}

// Функция для форматирования курса валюты
export function formatCurrencyRate(rate: number): string {
  if (rate >= 1000) {
    return rate.toLocaleString('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  return rate.toLocaleString('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// Функция для получения цвета изменения курса
export function getChangeColor(change?: number): string {
  if (!change) return 'text-gray-500';
  if (change > 0) return 'text-green-500';
  if (change < 0) return 'text-red-500';
  
  return 'text-gray-500';
}

// Функция для получения иконки изменения курса
export function getChangeIcon(change?: number): string {
  if (!change) return '';
  if (change > 0) return '↗️';
  if (change < 0) return '↘️';
  
  return '';
}

// Функция для получения текста изменения
export function getChangeText(change?: number): string {
  if (!change) return '';
  
  const absChange = Math.abs(change);
  const sign = change > 0 ? '+' : '';
  
  return `${sign}${absChange.toFixed(2)}%`;
}

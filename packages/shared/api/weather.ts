// API для получения данных о погоде (Open-Meteo - бесплатный без ключей)
const WEATHER_API_BASE = 'https://api.open-meteo.com/v1';

// Интерфейсы для данных погоды
export interface WeatherData {
  location: string;
  country: string;
  temperature: number;
  feelsLike: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  uvIndex?: number;
}

export interface ForecastItem {
  time: string;
  temperature: number;
  icon: string;
  description: string;
}

export interface WeatherForecast {
  current: WeatherData;
  hourly: ForecastItem[];
  daily: ForecastItem[];
}

// Города Кыргызстана с координатами
export const KYRGYZSTAN_CITIES = [
  { name: 'Бишкек', nameEn: 'Bishkek', lat: 42.8746, lon: 74.5698 },
  { name: 'Ош', nameEn: 'Osh', lat: 40.5283, lon: 72.7985 },
  { name: 'Джалал-Абад', nameEn: 'Jalal-Abad', lat: 40.9339, lon: 73.0089 },
  { name: 'Каракол', nameEn: 'Karakol', lat: 42.4906, lon: 78.3931 },
  { name: 'Токмок', nameEn: 'Tokmok', lat: 42.8421, lon: 75.3008 },
  { name: 'Узген', nameEn: 'Uzgen', lat: 40.7697, lon: 73.3014 },
  { name: 'Балыкчы', nameEn: 'Balykchy', lat: 42.4603, lon: 76.1869 },
  { name: 'Талас', nameEn: 'Talas', lat: 42.5228, lon: 72.2428 },
  { name: 'Нарын', nameEn: 'Naryn', lat: 41.4286, lon: 75.9911 },
  { name: 'Кербен', nameEn: 'Kerben', lat: 40.5167, lon: 72.2167 },
] as const;

// Функция для получения текущей погоды
export async function getCurrentWeather(cityName: string): Promise<WeatherData> {
  try {
    const city = KYRGYZSTAN_CITIES.find(c => c.name === cityName || c.nameEn === cityName);

    if (!city) {
      throw new Error('Город не найден');
    }

    const response = await fetch(
      `${WEATHER_API_BASE}/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,surface_pressure,visibility&timezone=Asia/Bishkek`
    );

    if (!response.ok) {
      throw new Error('Ошибка получения данных о погоде');
    }

    const data = await response.json();
    const current = data.current;

    return {
      location: city.name,
      country: 'Кыргызстан',
      temperature: Math.round(current.temperature_2m),
      feelsLike: Math.round(current.apparent_temperature),
      description: getWeatherDescription(current.weather_code),
      icon: getWeatherIcon(current.weather_code),
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m * 3.6), // м/с в км/ч
      pressure: Math.round(current.surface_pressure),
      visibility: Math.round(current.visibility / 1000), // метры в км
    };
  } catch (error) {
    throw error;
  }
}

// Функция для получения прогноза погоды
export async function getWeatherForecast(cityName: string): Promise<WeatherForecast> {
  try {
    const city = KYRGYZSTAN_CITIES.find(c => c.name === cityName || c.nameEn === cityName);
    
    if (!city) {
      throw new Error('Город не найден');
    }

    // Получаем текущую погоду
    const currentWeather = await getCurrentWeather(cityName);

    // Получаем прогноз (почасовой и дневной)
    const forecastResponse = await fetch(
      `${WEATHER_API_BASE}/forecast?latitude=${city.lat}&longitude=${city.lon}&hourly=temperature_2m,weather_code&daily=temperature_2m_max,weather_code&timezone=Asia/Bishkek&forecast_days=5`
    );

    if (!forecastResponse.ok) {
      throw new Error('Ошибка получения прогноза погоды');
    }

    const forecastData = await forecastResponse.json();

    // Обрабатываем почасовой прогноз (следующие 24 часа)
    const hourly: ForecastItem[] = forecastData.hourly.time.slice(0, 24).map((time: string, index: number) => ({
      time: new Date(time).toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      temperature: Math.round(forecastData.hourly.temperature_2m[index]),
      icon: getWeatherIcon(forecastData.hourly.weather_code[index]),
      description: getWeatherDescription(forecastData.hourly.weather_code[index]),
    }));

    // Обрабатываем дневной прогноз (следующие 5 дней)
    const daily: ForecastItem[] = forecastData.daily.time.map((time: string, index: number) => ({
      time: new Date(time).toLocaleDateString('ru-RU', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      }),
      temperature: Math.round(forecastData.daily.temperature_2m_max[index]),
      icon: getWeatherIcon(forecastData.daily.weather_code[index]),
      description: getWeatherDescription(forecastData.daily.weather_code[index]),
    }));

    return {
      current: currentWeather,
      hourly: hourly.slice(0, 8), // Показываем только 8 часов
      daily,
    };
  } catch (error) {
    throw error;
  }
}

// Функция для получения иконки погоды по коду Open-Meteo
function getWeatherIcon(weatherCode: number): string {
  // Коды погоды Open-Meteo: https://open-meteo.com/en/docs
  if (weatherCode === 0) return 'clear'; // ясно
  if (weatherCode <= 3) return 'partly-cloudy'; // малооблачно/облачно
  if (weatherCode <= 48) return 'fog'; // туман
  if (weatherCode <= 67) return 'rain'; // дождь
  if (weatherCode <= 77) return 'snow'; // снег
  if (weatherCode <= 82) return 'rain'; // ливень
  if (weatherCode <= 86) return 'snow'; // снегопад
  if (weatherCode <= 99) return 'thunderstorm'; // гроза

  return 'clear';
}

// Функция для получения описания погоды по коду Open-Meteo
function getWeatherDescription(weatherCode: number): string {
  const descriptions: Record<number, string> = {
    0: 'ясно',
    1: 'преимущественно ясно',
    2: 'переменная облачность',
    3: 'пасмурно',
    45: 'туман',
    48: 'изморозь',
    51: 'легкая морось',
    53: 'умеренная морось',
    55: 'сильная морось',
    61: 'легкий дождь',
    63: 'умеренный дождь',
    65: 'сильный дождь',
    71: 'легкий снег',
    73: 'умеренный снег',
    75: 'сильный снег',
    80: 'легкий ливень',
    81: 'умеренный ливень',
    82: 'сильный ливень',
    95: 'гроза',
    96: 'гроза с градом',
    99: 'сильная гроза с градом',
  };

  return descriptions[weatherCode] || 'неизвестно';
}

// Функция для получения эмодзи погоды по коду Open-Meteo
export function getWeatherEmoji(iconCode: string): string {
  const iconMap: Record<string, string> = {
    'clear': '☀️',
    'partly-cloudy': '⛅',
    'cloudy': '☁️',
    'fog': '🌫️',
    'rain': '🌧️',
    'snow': '❄️',
    'thunderstorm': '⛈️',
  };

  return iconMap[iconCode] || '🌤️';
}

// Функция для определения текущего местоположения (по умолчанию Бишкек)
export function getDefaultCity(): string {
  // Можно добавить логику определения города по IP или геолокации
  return 'Бишкек';
}

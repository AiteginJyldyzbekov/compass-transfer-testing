'use client';

import { Cloud, MapPin, Droplets, Wind, Eye, Gauge } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import {
  getCurrentWeather,
  getWeatherForecast,
  getWeatherEmoji,
  getDefaultCity,
  KYRGYZSTAN_CITIES,
  type WeatherData,
  type WeatherForecast
} from '@shared/api/weather';
import { Button } from '@shared/ui/forms/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/ui/forms/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@shared/ui/navigation/dropdown-menu';

export function WeatherWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState(getDefaultCity());
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<WeatherForecast | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWeatherData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const weather = await getCurrentWeather(selectedCity);

      setWeatherData(weather);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки погоды');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCity]);

  // Загружаем погоду при изменении города
  useEffect(() => {
    if (selectedCity) {
      loadWeatherData();
    }
  }, [selectedCity, loadWeatherData]);

  const loadForecastData = async () => {
    if (forecastData) return; // Уже загружен
    
    try {
      setIsLoading(true);
      const forecast = await getWeatherForecast(selectedCity);

      setForecastData(forecast);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки прогноза');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && !forecastData) {
      loadForecastData();
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative h-9 w-9 rounded-full hover:bg-gray-100"
        >
          {weatherData ? (
            <span className="text-lg">
              {getWeatherEmoji(weatherData.icon)}
            </span>
          ) : (
            <Cloud className="h-4 w-4" />
          )}
          {weatherData && (
            <span className="absolute -bottom-1 -right-1 text-xs font-medium bg-blue-500 text-white rounded-full px-1 min-w-[16px] h-4 flex items-center justify-center">
              {weatherData.temperature}°
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-80 p-0 max-h-[80vh]" align="end">
        <div className="bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 text-white rounded-lg max-h-[80vh] flex flex-col overflow-auto">
          {/* Заголовок с выбором города - фиксированный */}
          <div className="flex-shrink-0 p-4 border-b border-blue-300/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="font-medium">Погода</span>
              </div>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="w-32 h-8 bg-white/20 border-white/30 text-white text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-[9999]">
                  {KYRGYZSTAN_CITIES.map((city) => (
                    <SelectItem key={city.name} value={city.name}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Основная информация о погоде - скроллируемый контент */}
          <div className="flex-1 overflow-y-auto" style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(255,255,255,0.3) transparent'
          }}>
            {isLoading ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/30 border-t-white mx-auto mb-2" />
                <p className="text-sm opacity-80">Загрузка...</p>
              </div>
            ) : error ? (
              <div className="p-6 text-center">
                <p className="text-sm opacity-80">{error}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={loadWeatherData}
                  className="mt-2 text-white hover:bg-white/20"
                >
                  Повторить
                </Button>
              </div>
            ) : weatherData ? (
            <>
              {/* Текущая погода */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{weatherData.location}</h3>
                    <p className="text-sm opacity-80 capitalize">{weatherData.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-light">{weatherData.temperature}°</div>
                    <div className="text-xs opacity-80">
                      Ощущается как {weatherData.feelsLike}°
                    </div>
                  </div>
                </div>

                {/* Детали погоды */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2 bg-white/10 rounded-lg p-2">
                    <Droplets className="h-3 w-3" />
                    <span>Влажность: {weatherData.humidity}%</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 rounded-lg p-2">
                    <Wind className="h-3 w-3" />
                    <span>Ветер: {weatherData.windSpeed} км/ч</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 rounded-lg p-2">
                    <Gauge className="h-3 w-3" />
                    <span>Давление: {weatherData.pressure} гПа</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 rounded-lg p-2">
                    <Eye className="h-3 w-3" />
                    <span>Видимость: {weatherData.visibility} км</span>
                  </div>
                </div>
              </div>

              {/* Прогноз */}
              {forecastData && (
                <div className="border-t border-blue-300/30">
                  {/* Почасовой прогноз */}
                  <div className="p-4">
                    <h4 className="text-sm font-medium mb-3 opacity-90">Почасовой прогноз</h4>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {forecastData.hourly.map((item, index) => (
                        <div key={index} className="flex-shrink-0 text-center">
                          <div className="text-xs opacity-80 mb-1">{item.time}</div>
                          <div className="text-lg mb-1">{getWeatherEmoji(item.icon)}</div>
                          <div className="text-xs font-medium">{item.temperature}°</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Дневной прогноз */}
                  <div className="p-4 border-t border-blue-300/30 pb-6">
                    <h4 className="text-sm font-medium mb-3 opacity-90">Прогноз на 5 дней</h4>
                    <div className="space-y-2">
                      {forecastData.daily.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{getWeatherEmoji(item.icon)}</span>
                            <span className="text-sm">{item.time}</span>
                          </div>
                          <div className="text-sm font-medium">{item.temperature}°</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : null}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

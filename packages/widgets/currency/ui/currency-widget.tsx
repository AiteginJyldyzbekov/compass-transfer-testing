'use client';

import { DollarSign, TrendingUp, TrendingDown, RefreshCw, Calculator } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import {
  getCurrencyRatesWithHistory,
  formatCurrencyRate,
  getChangeText,
  type CurrencyData
} from '@shared/api/currency';
import { Button } from '@shared/ui/forms/button';
import { WidgetFooter } from '@shared/ui/layout/widget-footer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@shared/ui/navigation/dropdown-menu';
import { CurrencyCalculatorModal } from './currency-calculator-modal';

export function CurrencyWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [currencyData, setCurrencyData] = useState<CurrencyData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCurrencyData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await getCurrencyRatesWithHistory();

      setCurrencyData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки курсов валют');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Загружаем курсы сразу при монтировании компонента
  useEffect(() => {
    loadCurrencyData();
  }, [loadCurrencyData]);

  // Получаем основной курс для отображения на кнопке (USD)
  const mainRate = currencyData?.rates.find(rate => rate.code === 'USD');

  return (
    <>
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative h-9 w-9 rounded-full hover:bg-gray-100"
        >
          <DollarSign className="h-4 w-4" />
          {mainRate && (
            <span className="absolute -bottom-1 -right-1 text-xs font-medium bg-green-500 text-white rounded-full px-1 min-w-[20px] h-4 flex items-center justify-center">
              {mainRate.rate.toFixed(2)}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-80 p-0 max-h-[80vh] z-[9999]" align="end">
        <div className="bg-gradient-to-br from-green-400 via-green-500 to-green-600 text-white rounded-lg overflow-hidden max-h-[80vh] flex flex-col">
          {/* Заголовок - фиксированный */}
          <div className="flex-shrink-0 p-4 border-b border-green-300/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span className="font-medium">Курсы валют</span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsCalculatorOpen(true);
                    setIsOpen(false); // Закрываем dropdown при открытии калькулятора
                  }}
                  className="h-8 w-8 p-0 text-white hover:bg-white/20"
                  title="Калькулятор валют"
                >
                  <Calculator className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={loadCurrencyData}
                  disabled={isLoading}
                  className="h-8 w-8 p-0 text-white hover:bg-white/20"
                  title="Обновить курсы"
                >
                  <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
            <div className="text-xs opacity-80 mt-1">
              Курс сома (KGS) к основным валютам
            </div>
          </div>

          {/* Основной контент - скроллируемый */}
          <div className="flex-1 overflow-y-auto" style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(255,255,255,0.3) transparent'
          }}>
            {isLoading ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/30 border-t-white mx-auto mb-2" />
                <p className="text-sm opacity-80">Загрузка курсов...</p>
              </div>
            ) : error ? (
              <div className="p-6 text-center">
                <p className="text-sm opacity-80">{error}</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={loadCurrencyData}
                  className="mt-2 text-white hover:bg-white/20"
                >
                  Повторить
                </Button>
              </div>
            ) : currencyData ? (
              <>
                {/* Список курсов валют */}
                <div className="p-4">
                  <div className="space-y-3">
                    {currencyData.rates.map((rate) => (
                      <div key={rate.code} className="flex items-center justify-between bg-white/15 rounded-lg p-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{rate.flag}</span>
                          <div>
                            <div className="font-medium text-sm">{rate.code}</div>
                            <div className="text-xs opacity-80">{rate.name}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            {formatCurrencyRate(rate.rate)} сом
                          </div>
                          {rate.change !== undefined && (
                            <div className={`text-xs flex items-center gap-1 ${
                              rate.change > 0 ? 'text-green-200' : 
                              rate.change < 0 ? 'text-red-200' : 'text-gray-300'
                            }`}>
                              {rate.change > 0 ? (
                                <TrendingUp className="h-3 w-3" />
                              ) : rate.change < 0 ? (
                                <TrendingDown className="h-3 w-3" />
                              ) : null}
                              {getChangeText(rate.change)}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Информация об обновлении */}
                <div className="p-4 border-t border-green-300/30">
                  <div className="text-center">
                    <div className="text-xs opacity-70">
                      Последнее обновление: {currencyData.lastUpdated}
                    </div>
                    <div className="text-xs opacity-60 mt-1">
                      Данные предоставлены ExchangeRate-API
                    </div>
                  </div>
                </div>

                {/* Футер виджета */}
                <WidgetFooter variant="green">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-4">
                      <a
                        href="https://www.nbkr.kg"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-100 hover:text-white transition-colors"
                      >
                        НБКР
                      </a>
                      <a
                        href="https://www.exchangerate-api.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-100 hover:text-white transition-colors"
                      >
                        API
                      </a>
                    </div>
                    <div className="text-green-200">
                      © 2024 Compass
                    </div>
                  </div>
                </WidgetFooter>
              </>
            ) : null}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>

    {/* Модальное окно калькулятора */}
    <CurrencyCalculatorModal
      isOpen={isCalculatorOpen}
      onClose={() => setIsCalculatorOpen(false)}
      currencyData={currencyData}
    />
  </>
  );
}

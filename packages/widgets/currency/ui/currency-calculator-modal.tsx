'use client';

import { Calculator, ArrowRightLeft } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { type CurrencyData } from '@shared/api/currency';
import { Button } from '@shared/ui/forms/button';
import { Input } from '@shared/ui/forms/input';
import { Label } from '@shared/ui/forms/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/ui/forms/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@shared/ui/modals/dialog';


interface CurrencyCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currencyData: CurrencyData | null;
}

const CURRENCIES = [
  { code: 'KGS', name: 'Кыргызский сом', flag: '🇰🇬' },
  { code: 'USD', name: 'Доллар США', flag: '🇺🇸' },
  { code: 'EUR', name: 'Евро', flag: '🇪🇺' },
  { code: 'RUB', name: 'Российский рубль', flag: '🇷🇺' },
  { code: 'KZT', name: 'Казахский тенге', flag: '🇰🇿' },
  { code: 'UZS', name: 'Узбекский сум', flag: '🇺🇿' },
  { code: 'CNY', name: 'Китайский юань', flag: '🇨🇳' },
];

export function CurrencyCalculatorModal({ isOpen, onClose, currencyData }: CurrencyCalculatorModalProps) {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('KGS');
  const [fromAmount, setFromAmount] = useState('1');
  const [toAmount, setToAmount] = useState('');

  // Функция для получения курса валюты
  const getCurrencyRate = useCallback((currencyCode: string): number => {
    if (currencyCode === 'KGS') return 1;
    const rate = currencyData?.rates.find(r => r.code === currencyCode);

    return rate?.rate || 1;
  }, [currencyData]);

  // Функция для конвертации валют
  const convertCurrency = useCallback((amount: number, from: string, to: string): number => {
    if (from === to) return amount;

    // Сначала конвертируем в сомы (базовая валюта)
    let amountInKGS: number;

    if (from === 'KGS') {
      amountInKGS = amount;
    } else {
      const fromRate = getCurrencyRate(from);

      amountInKGS = amount * fromRate;
    }

    // Затем конвертируем из сомов в целевую валюту
    if (to === 'KGS') {
      return amountInKGS;
    } else {
      const toRate = getCurrencyRate(to);

      return amountInKGS / toRate;
    }
  }, [getCurrencyRate]);

  // Обновляем результат при изменении входных данных
  useEffect(() => {
    if (fromAmount && !isNaN(Number(fromAmount))) {
      const amount = Number(fromAmount);
      const result = convertCurrency(amount, fromCurrency, toCurrency);

      setToAmount(result.toFixed(2));
    } else {
      setToAmount('');
    }
  }, [fromAmount, fromCurrency, toCurrency, convertCurrency]);

  // Функция для обмена валют местами
  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(toAmount);
  };

  // Функция для форматирования числа
  const formatNumber = (value: string): string => {
    const num = parseFloat(value);

    if (isNaN(num)) 
      return value;

    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(num);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md z-[1001]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Калькулятор валют
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Поле "Из" */}
          <div className="space-y-2">
            <Label htmlFor="from-amount">Сумма</Label>
            <div className="flex gap-2">
              <Input
                id="from-amount"
                type="number"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                placeholder="Введите сумму"
                className="flex-1"
              />
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      <div className="flex items-center gap-2">
                        <span>{currency.flag}</span>
                        <span>{currency.code}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Кнопка обмена */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={swapCurrencies}
              className="rounded-full h-10 w-10 p-0"
            >
              <ArrowRightLeft className="h-4 w-4" />
            </Button>
          </div>

          {/* Поле "В" */}
          <div className="space-y-2">
            <Label htmlFor="to-amount">Результат</Label>
            <div className="flex gap-2">
              <Input
                id="to-amount"
                type="text"
                value={toAmount ? formatNumber(toAmount) : ''}
                readOnly
                placeholder="Результат конвертации"
                className="flex-1 bg-gray-50"
              />
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      <div className="flex items-center gap-2">
                        <span>{currency.flag}</span>
                        <span>{currency.code}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Информация о курсе */}
          {fromAmount && !isNaN(Number(fromAmount)) && (
            <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span>Курс:</span>
                <span className="font-medium">
                  1 {fromCurrency} = {formatNumber(convertCurrency(1, fromCurrency, toCurrency).toFixed(4))} {toCurrency}
                </span>
              </div>
            </div>
          )}

          {/* Кнопки действий */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setFromAmount('1');
                setFromCurrency('USD');
                setToCurrency('KGS');
              }}
              className="flex-1"
            >
              Сбросить
            </Button>
            <Button onClick={onClose} className="flex-1">
              Закрыть
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

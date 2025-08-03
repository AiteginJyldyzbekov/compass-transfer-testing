'use client';

import { useState, useEffect } from 'react';
import { Save, X, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@shared/ui/modals/dialog';
import { Button } from '@shared/ui/forms/button';
import { Input } from '@shared/ui/forms/input';
import { Label } from '@shared/ui/forms/label';
import type { CurrencyData, CurrencyRate } from '@shared/api/currency';

interface CurrencyEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currencyData: CurrencyData | null;
  onSave: (updatedRates: CurrencyRate[]) => void;
}

export function CurrencyEditModal({
  isOpen,
  onClose,
  currencyData,
  onSave,
}: CurrencyEditModalProps) {
  const [editedRates, setEditedRates] = useState<CurrencyRate[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Инициализируем данные при открытии модального окна
  useEffect(() => {
    if (isOpen && currencyData) {
      setEditedRates([...currencyData.rates]);
    }
  }, [isOpen, currencyData]);

  const handleRateChange = (code: string, newRate: string) => {
    const numericRate = parseFloat(newRate);
    if (isNaN(numericRate) || numericRate <= 0) return;

    setEditedRates(prev => 
      prev.map(rate => 
        rate.code === code 
          ? { ...rate, rate: numericRate }
          : rate
      )
    );
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Валидация: проверяем, что все курсы положительные числа
      const invalidRates = editedRates.filter(rate => rate.rate <= 0);
      if (invalidRates.length > 0) {
        toast.error('Ошибка валидации', {
          description: 'Все курсы должны быть положительными числами'
        });
        return;
      }

      // Сохраняем изменения
      onSave(editedRates);
      
      toast.success('Курсы валют обновлены', {
        description: 'Изменения успешно сохранены'
      });
      
      onClose();
    } catch (error) {
      toast.error('Ошибка при сохранении', {
        description: error instanceof Error ? error.message : 'Произошла неизвестная ошибка'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (!isSaving) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-gray-900">
                Редактировать курсы валют
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500 mt-1">
                Введите новые курсы валют относительно сома (KGS)
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4 max-h-[50vh] overflow-y-auto">
          {editedRates.length > 0 ? (
            <div className="space-y-4">
              {editedRates.map((rate) => (
                <div key={rate.code} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-2xl">{rate.flag}</span>
                    <div>
                      <div className="font-medium text-sm">{rate.code}</div>
                      <div className="text-xs text-gray-500">{rate.name}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`rate-${rate.code}`} className="text-sm font-medium">
                      Курс:
                    </Label>
                    <div className="flex items-center gap-1">
                      <Input
                        id={`rate-${rate.code}`}
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={rate.rate.toFixed(2)}
                        onChange={(e) => handleRateChange(rate.code, e.target.value)}
                        className="w-24 text-right"
                        disabled={isSaving}
                      />
                      <span className="text-sm text-gray-500">сом</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Нет данных для редактирования</p>
            </div>
          )}
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <div className="flex items-start gap-2">
            <DollarSign className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-yellow-800">
                Внимание
              </p>
              <p className="text-sm text-yellow-700 mt-1">
                Изменение курсов валют повлияет на все расчеты в системе. Убедитесь в правильности введенных данных.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSaving}
          >
            <X className="h-4 w-4 mr-2" />
            Отмена
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || editedRates.length === 0}
            className="min-w-[120px]"
          >
            {isSaving ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Сохранение...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Сохранить
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

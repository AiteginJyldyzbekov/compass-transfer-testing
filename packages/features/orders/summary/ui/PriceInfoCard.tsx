'use client';

import { DollarSign } from 'lucide-react';
import { Checkbox } from '@shared/ui/forms/checkbox';
import { Input } from '@shared/ui/forms/input';
import { Label } from '@shared/ui/forms/label';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/layout/card';

interface PriceInfoCardProps {
  basePrice: string;
  distancePrice: string;
  totalPrice: string;
  formattedPrice: string;
  isCustomPrice: boolean;
  handleCustomPriceChange: (value: string) => void;
  toggleCustomPrice: () => void;
  showCustomPrice?: boolean;
}

/**
 * Компонент для отображения информации о цене в сводке заказа
 */
export function PriceInfoCard({
  basePrice,
  distancePrice,
  totalPrice,
  formattedPrice,
  isCustomPrice,
  handleCustomPriceChange,
  toggleCustomPrice,
  showCustomPrice = true
}: PriceInfoCardProps) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Стоимость поездки
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">Базовая стоимость:</span>
            <span>{basePrice}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Стоимость за расстояние:</span>
            <span>{distancePrice}</span>
          </div>
          <div className="flex justify-between items-center font-medium">
            <span>Итоговая стоимость:</span>
            <span className="text-lg">{totalPrice}</span>
          </div>
          
          {/* Кастомная цена (только для админов/операторов) */}
          {showCustomPrice && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="custom-price" 
                  checked={isCustomPrice} 
                  onCheckedChange={toggleCustomPrice} 
                />
                <Label htmlFor="custom-price">Изменить цену вручную</Label>
              </div>
              
              {isCustomPrice && (
                <div className="mt-2">
                  <Input
                    placeholder="Введите цену"
                    value={formattedPrice}
                    onChange={(e) => handleCustomPriceChange(e.target.value)}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

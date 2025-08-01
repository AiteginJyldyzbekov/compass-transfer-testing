'use client';

import {
  DollarSign,
  Users,
  MapPin,
  Calendar,
  Clock,
  Plane,
  FileText,
  User
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@shared/ui/data-display/badge';
import { Checkbox } from '@shared/ui/forms/checkbox';
import { Input } from '@shared/ui/forms/input';
import { Label } from '@shared/ui/forms/label';
import { Textarea } from '@shared/ui/forms/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/layout/card';

interface SummaryTabProps {
  tariffs: any[];
  services: any[];
  users: any[];
  routeState: any;
  pricing: any;
  selectedTariff: any;
  selectedServices: any[];
  currentPrice: number;
  passengers: any[];
  routeLocations: any[];
  routeDistance?: number; // расстояние маршрута в метрах
  methods: any;
  mode: 'create' | 'edit';
  orderId?: string;
  selectedDriver?: any; // выбранный водитель
  // Кастомная цена
  useCustomPrice?: boolean;
  setUseCustomPrice?: (value: boolean) => void;
  customPrice?: string;
  setCustomPrice?: (value: string) => void;
  // Статус заказа (для редактирования)
  orderStatus?: 'Pending' | 'Scheduled' | 'InProgress' | 'Completed' | 'Cancelled' | 'Expired';
  setOrderStatus?: (status: 'Pending' | 'Scheduled' | 'InProgress' | 'Completed' | 'Cancelled' | 'Expired') => void;
  [key: string]: any;
}

export function SummaryTab({
  selectedTariff,
  selectedServices,
  currentPrice,
  passengers,
  routeLocations,
  routeState,
  routeDistance,
  methods,
  mode,
  orderId,
  selectedDriver,
  useCustomPrice = false,
  setUseCustomPrice,
  customPrice = '',
  setCustomPrice,
  orderStatus = 'Pending',
  setOrderStatus
}: SummaryTabProps) {
  const [notes, setNotes] = useState('');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'KGS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Функция для получения расстояния маршрута в километрах
  const getRouteDistanceKm = () => {
    console.log('routeDistance:', routeDistance); // Отладка
    if (routeDistance && routeDistance > 0) {
      // Конвертируем из метров в километры и округляем до 1 знака после запятой
      return Math.round((routeDistance / 1000) * 10) / 10;
    }
    // Временно: если нет реального расстояния, используем примерное
    const routePointsWithLocation = routeState?.routePoints?.filter((point: any) => point.location) || [];
    
    if (routePointsWithLocation.length >= 2) {
      return 15.5; // Временное значение для тестирования
    }
    
    return 0;
  };



  // Расчет общей стоимости с учетом расстояния
  const calculateTotalPrice = () => {
    if (!selectedTariff) return 0;

    const distance = getRouteDistanceKm();
    const perKmPrice = selectedTariff.perKmPrice || 0;
    const basePrice = selectedTariff.basePrice || 0;

    const distancePrice = distance * perKmPrice;
    const servicesPrice = selectedServices.reduce((sum, service) => sum + ((service.price || 0) * (service.quantity || 1)), 0);

    return basePrice + distancePrice + servicesPrice;
  };



  return (
    <div className="space-y-6">


      {/* Сводка заказа */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Маршрут */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Маршрут
            </CardTitle>
          </CardHeader>
          <CardContent>
            {routeState?.routePoints?.filter((point: any) => point.location).length > 0 ? (
              <div className="space-y-1">
                {routeState.routePoints
                  .filter((point: any) => point.location)
                  .map((point: any, index: number, filteredPoints: any[]) => {
                    return (
                      <div key={point.id}>
                        {/* Точка маршрута */}
                        <div className="flex items-start gap-3 py-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                            index === 0 ? 'bg-green-500' :
                            index === filteredPoints.length - 1 ? 'bg-red-500' :
                            'bg-blue-500'
                          }`}>
                            {String.fromCharCode(65 + index)}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{point.location.name}</p>
                            <p className="text-xs text-gray-500">{point.location.address}</p>
                          </div>
                        </div>

                        {/* Расстояние до следующей точки */}
                        {index < filteredPoints.length - 1 && (
                          <div className="flex items-center gap-3 py-1 ml-3">
                            <div className="w-6 flex justify-center">
                              <div className="w-px h-4 bg-gray-300" />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                {/* Общее расстояние */}
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Общее расстояние:</span>
                    <span className="font-medium">{getRouteDistanceKm()} км</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">Маршрут не задан</p>
            )}
          </CardContent>
        </Card>

        {/* Пассажиры */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Пассажиры
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{passengers.length} пассажир{passengers.length > 1 ? 'а' : ''}</Badge>
              </div>
              <div className="text-sm space-y-1">
                {passengers.map((passenger, index) => (
                  <p key={index}>
                    • {passenger.firstName} {passenger.lastName || ''}
                    {passenger.isMainPassenger && ' (основной)'}
                  </p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Расписание */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Расписание поездки
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Основная информация о времени */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {methods.getValues('scheduledTime') && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Дата поездки</p>
                        <p className="font-medium">{formatDate(new Date(methods.getValues('scheduledTime')))}</p>
                      </div>
                    </div>
                  )}
                  {methods.getValues('departureTime') && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <Clock className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Время подачи</p>
                        <p className="font-medium">{methods.getValues('departureTime')}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Информация о водителе */}
              {selectedDriver ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Назначенный водитель</p>
                      <p className="font-medium">{selectedDriver.fullName || `Водитель ${selectedDriver.id}`}</p>
                      {selectedDriver.phoneNumber && (
                        <p className="text-sm text-gray-500">{selectedDriver.phoneNumber}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✓ Назначен
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Водитель</p>
                      <p className="font-medium text-gray-500">Водитель не выбран</p>
                      <p className="text-xs text-gray-400">Выберите водителя в табе &quot;Карта&quot;</p>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        ⚠ Не назначен
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Информация о рейсах */}
              {(methods.getValues('airFlight') || methods.getValues('flyReis')) && (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Информация о рейсах</h4>
                  {methods.getValues('airFlight') && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Plane className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">Рейс вылета</p>
                        <p className="font-medium">{methods.getValues('airFlight')}</p>
                      </div>
                    </div>
                  )}
                  {methods.getValues('flyReis') && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Plane className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-600">Рейс прилета</p>
                        <p className="font-medium">{methods.getValues('flyReis')}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          </CardContent>
        </Card>

        {/* Стоимость */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Стоимость
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Расчетная стоимость */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Базовая стоимость:</span>
                  <span className="font-medium">
                    {selectedTariff ? formatPrice(selectedTariff.basePrice || 0) : formatPrice(0)}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>За расстояние ({getRouteDistanceKm()} км × {selectedTariff?.perKmPrice || 0} сом):</span>
                  <span>
                    {formatPrice(getRouteDistanceKm() * (selectedTariff?.perKmPrice || 0))}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Дополнительные услуги:</span>
                  <span>
                    {formatPrice(selectedServices.reduce((total, service) =>
                      total + ((service.price || 0) * (service.quantity || 1)), 0
                    ))}
                  </span>
                </div>
                <hr />
                <div className="flex justify-between font-medium text-lg">
                  <span>Итого к оплате:</span>
                  <div className="flex flex-col items-end">
                    {useCustomPrice && customPrice && parseFloat(customPrice) !== calculateTotalPrice() ? (
                      <>
                        {/* Зачеркнутая автоматическая цена */}
                        <span className="text-gray-400 line-through text-sm">
                          {formatPrice(calculateTotalPrice())}
                        </span>
                        {/* Кастомная цена */}
                        <span className="text-orange-600 font-bold">
                          {formatPrice(parseFloat(customPrice) || 0)}
                        </span>
                      </>
                    ) : (
                      <span className="text-green-600">{formatPrice(calculateTotalPrice())}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Кастомная цена */}
              <div className="p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="custom-final-price"
                    checked={useCustomPrice}
                    onCheckedChange={(checked) => {
                      if (setUseCustomPrice) {
                        setUseCustomPrice(checked as boolean);
                      }
                    }}
                  />
                  <Label htmlFor="custom-final-price" className="font-medium">
                    Использовать кастомную итоговую цену
                  </Label>
                </div>
                {useCustomPrice && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="custom-final-price-input">Итоговая цена (сом)</Label>
                      <Input
                        id="custom-final-price-input"
                        type="number"
                        placeholder="Введите итоговую цену"
                        value={customPrice}
                        onChange={(e) => {
                          if (setCustomPrice) {
                            setCustomPrice(e.target.value);
                          }
                        }}
                        className="max-w-xs"
                      />
                    </div>

                    {/* Предупреждение о разнице в цене */}
                    {customPrice && parseFloat(customPrice) !== calculateTotalPrice() && (
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-white text-xs font-bold">!</span>
                          </div>
                          <div className="text-sm">
                            <p className="font-medium text-yellow-800 mb-1">
                              Внимание: цена изменена вручную
                            </p>
                            <p className="text-yellow-700">
                              Автоматически рассчитанная цена: <span className="font-medium">{formatPrice(calculateTotalPrice())}</span>
                            </p>
                            <p className="text-yellow-700">
                              Установленная цена: <span className="font-medium">{formatPrice(parseFloat(customPrice) || 0)}</span>
                            </p>
                            <p className="text-yellow-700 mt-1">
                              Разница: <span className={`font-medium ${
                                parseFloat(customPrice) > calculateTotalPrice() ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {parseFloat(customPrice) > calculateTotalPrice() ? '+' : ''}
                                {formatPrice((parseFloat(customPrice) || 0) - calculateTotalPrice())}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Статус заказа (только для редактирования) */}
              {mode === 'edit' && (
                <div className="p-4 border rounded-lg bg-blue-50">
                  <div className="space-y-3">
                    <h4 className="font-medium text-blue-900">Статус заказа</h4>
                    <div className="space-y-2">
                      <Label htmlFor="order-status" className="text-sm font-medium text-blue-800">
                        Текущий статус
                      </Label>
                      <select
                        id="order-status"
                        value={orderStatus}
                        onChange={(e) => {
                          if (setOrderStatus) {
                            setOrderStatus(e.target.value as any);
                          }
                        }}
                        className="w-full max-w-xs px-3 py-2 border border-blue-200 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Pending">Pending - Заказ создан, водитель не назначен</option>
                        <option value="Scheduled">Scheduled - Водитель назначен</option>
                        <option value="InProgress">InProgress - Поездка выполняется</option>
                        <option value="Completed">Completed - Поездка завершена</option>
                        <option value="Cancelled">Cancelled - Заказ отменен</option>
                        <option value="Expired">Expired - Истекло время ожидания</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </CardContent>
        </Card>
      </div>

      {/* Дополнительная информация */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Дополнительная информация
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="notes">Заметки к заказу</Label>
            <Textarea
              id="notes"
              placeholder="Добавьте любые дополнительные заметки или инструкции для водителя..."
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
                if (methods) {
                  methods.setValue('notes', e.target.value);
                }
              }}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

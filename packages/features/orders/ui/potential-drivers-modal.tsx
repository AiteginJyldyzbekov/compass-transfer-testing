'use client';

import { X, User, CheckCircle, XCircle, Clock, MapPin, Star, Car, Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { orderService, type PotentialDriverResponse } from '@shared/api/orders';
import { Button } from '@shared/ui/forms/button';

interface PotentialDriversModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  orderNumber?: string;
}

export function PotentialDriversModal({ 
  isOpen, 
  onClose, 
  orderId, 
  orderNumber 
}: PotentialDriversModalProps) {
  const [drivers, setDrivers] = useState<PotentialDriverResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Загрузка данных о потенциальных водителях
  useEffect(() => {
    if (isOpen && orderId) {
      loadPotentialDrivers();
    }
  }, [isOpen, orderId]);

  const loadPotentialDrivers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await orderService.getPotentialDrivers(orderId);

      setDrivers(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки водителей';

      setError(errorMessage);
      toast.error('Ошибка загрузки потенциальных водителей');
    } finally {
      setIsLoading(false);
    }
  };

  // Функция для получения иконки и цвета для критерия
  const getCriteriaIcon = (value: boolean) => {
    return value ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  // Функция для получения описания критерия
  const getCriteriaLabel = (key: string): string => {
    const labels: Record<string, string> = {
      isOnline: 'Водитель онлайн',
      activeCarStatus: 'Активная машина',
      activeCarPassengerCapacity: 'Подходящая вместимость',
      activeCarServiceClass: 'Подходящий класс обслуживания',
      distancePredicate: 'В радиусе поиска',
      driverMinRating: 'Минимальный рейтинг',
      driverHasNoActiveRides: 'Нет активных поездок',
      driverHasNotBeenRequested: 'Не получал запрос',
      driverQueuePresent: 'В очереди водителей'
    };
    
    return labels[key] || key;
  };

  // Функция для получения иконки критерия
  const getCriteriaIconComponent = (key: string) => {
    const icons: Record<string, React.ReactNode> = {
      isOnline: <Clock className="h-4 w-4" />,
      activeCarStatus: <Car className="h-4 w-4" />,
      activeCarPassengerCapacity: <Users className="h-4 w-4" />,
      activeCarServiceClass: <Star className="h-4 w-4" />,
      distancePredicate: <MapPin className="h-4 w-4" />,
      driverMinRating: <Star className="h-4 w-4" />,
      driverHasNoActiveRides: <Car className="h-4 w-4" />,
      driverHasNotBeenRequested: <Clock className="h-4 w-4" />,
      driverQueuePresent: <Users className="h-4 w-4" />
    };

    return icons[key] || <User className="h-4 w-4" />;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Заголовок */}
        <div className="bg-blue-600 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Подходящие водители</h2>
            <p className="text-blue-100 text-sm mt-1">
              {orderNumber ? `Заказ #${orderNumber}` : `ID: ${orderId}`}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-blue-700"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Содержимое */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Загрузка водителей...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <div className="text-red-600 mb-4">
                <XCircle className="h-12 w-12 mx-auto mb-2" />
                <p className="font-semibold">Ошибка загрузки</p>
                <p className="text-sm">{error}</p>
              </div>
              <Button onClick={loadPotentialDrivers} variant="outline">
                Попробовать снова
              </Button>
            </div>
          )}

          {!isLoading && !error && drivers.length === 0 && (
            <div className="text-center py-12">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-semibold">Подходящие водители не найдены</p>
              <p className="text-gray-500 text-sm mt-1">
                Возможно, все водители заняты или находятся вне радиуса поиска
              </p>
            </div>
          )}

          {!isLoading && !error && drivers.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Найдено водителей: {drivers.length}
                </h3>
                <div className="text-sm text-gray-500">
                  Отсортированы по рангу
                </div>
              </div>

              {drivers.map((driver, index) => (
                <div
                  key={driver.id}
                  className={`border rounded-lg p-4 ${
                    driver.allTrue 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        driver.allTrue 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-400 text-white'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{driver.fullName}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>Ранг: {driver.rank}</span>
                          {driver.allTrue && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                              <CheckCircle className="h-3 w-3" />
                              Все критерии выполнены
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Критерии ранжирования */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.entries(driver)
                      .filter(([key]) => 
                        key !== 'id' && 
                        key !== 'fullName' && 
                        key !== 'rank' && 
                        key !== 'allTrue' &&
                        typeof driver[key as keyof PotentialDriverResponse] === 'boolean'
                      )
                      .map(([key, value]) => (
                        <div
                          key={key}
                          className={`flex items-center gap-2 p-2 rounded-md text-sm ${
                            value 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          <div className="flex items-center gap-1">
                            {getCriteriaIconComponent(key)}
                            {getCriteriaIcon(value as boolean)}
                          </div>
                          <span className="text-xs">{getCriteriaLabel(key)}</span>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Футер */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {drivers.length > 0 && (
              <span>
                Подходящих водителей: {drivers.filter(d => d.allTrue).length} из {drivers.length}
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <Button onClick={loadPotentialDrivers} variant="outline" disabled={isLoading}>
              Обновить
            </Button>
            <Button onClick={onClose}>
              Закрыть
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

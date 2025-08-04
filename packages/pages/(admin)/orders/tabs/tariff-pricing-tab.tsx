'use client';

import { DollarSign, Clock, Car, Filter, ExternalLink, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import type { GetTariffDTOWithArchived } from '@shared/api/tariffs';
import { useUserRole } from '@shared/contexts';
import { Badge } from '@shared/ui/data-display/badge';
import { Button } from '@shared/ui/forms/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/layout/card';
import { ServiceClassValues, ServiceClassColors, CarTypeValues, type ServiceClass, type CarType } from '@entities/tariffs/enums';
import { Role } from '@entities/users/enums';

interface TariffPricingTabProps {
  tariffs: GetTariffDTOWithArchived[];
  selectedTariff: GetTariffDTOWithArchived | null;
  setSelectedTariff: (tariff: GetTariffDTOWithArchived | null) => void;
  onRefreshTariffs?: () => void;
  isRefreshingTariffs?: boolean;
  initialTariffId?: string; // ID тарифа для предварительного выбора
}

export function TariffPricingTab({
  tariffs,
  selectedTariff,
  setSelectedTariff,
  onRefreshTariffs,
  isRefreshingTariffs = false,
  initialTariffId
}: TariffPricingTabProps) {
  const [showArchived, setShowArchived] = useState(false);
  const { userRole } = useUserRole();

  // Автоматически выбираем тариф при загрузке, если передан initialTariffId
  useEffect(() => {
    if (initialTariffId && !selectedTariff && tariffs.length > 0) {
      const initialTariff = tariffs.find(t => t.id === initialTariffId && !t.archived);
      if (initialTariff) {
        setSelectedTariff(initialTariff);
      }
    }
  }, [initialTariffId, selectedTariff, tariffs, setSelectedTariff]);

  // Проверяем, может ли пользователь просматривать детали тарифа
  const canViewTariffDetails = userRole === Role.Admin || userRole === Role.Operator;

  const handleTariffSelect = (tariff: GetTariffDTOWithArchived) => {
    // Не позволяем выбирать архивные тарифы
    if (tariff.archived) return;
    setSelectedTariff(tariff);
  };

  const handleViewTariffDetails = (tariffId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Предотвращаем выбор тарифа при клике на иконку
    window.open(`/tariffs/edit/${tariffId}`, '_blank');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'KGS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };

  // Используем готовый объект с переводами
  const getServiceClassLabel = (serviceClass: ServiceClass): string => {
    return ServiceClassValues[serviceClass] || serviceClass;
  };

  // Используем готовый объект с переводами
  const getCarTypeLabel = (carType: CarType): string => {
    return CarTypeValues[carType] || carType;
  };

  const getTariffBadgeColor = (serviceClass: ServiceClass | undefined) => {
    if (!serviceClass) return 'bg-gray-500 text-white';

    return ServiceClassColors[serviceClass] || 'bg-gray-500 text-white';
  };

  // Фильтруем и сортируем тарифы (архивные в конце)
  const filteredTariffs = tariffs
    .filter(tariff => {
      if (showArchived) return true; // Показываем все

      return !tariff.archived; // Показываем только активные
    })
    .sort((a, b) => {
      // Сначала активные, потом архивные
      if (a.archived === b.archived) return 0;

      return a.archived ? 1 : -1;
    });




  if (!tariffs || tariffs.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">Тарифы не найдены</p>
      </div>
    );
  }

  if (filteredTariffs.length === 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Выбор тарифа ({filteredTariffs.length} из {tariffs.length})
              </CardTitle>
              <div className="flex items-center gap-2">
                {/* Кнопка обновления тарифов */}
                {onRefreshTariffs && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onRefreshTariffs}
                    disabled={isRefreshingTariffs}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className={`h-4 w-4 ${isRefreshingTariffs ? 'animate-spin' : ''}`} />
                    {isRefreshingTariffs ? 'Обновление...' : 'Обновить'}
                  </Button>
                )}

                {/* Кнопка фильтра архивных */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowArchived(!showArchived)}
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  {showArchived ? 'Скрыть архивные' : 'Показать архивные'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className='px-0'>
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {showArchived
                  ? 'Нет тарифов для отображения'
                  : 'Нет активных тарифов. Попробуйте показать архивные тарифы.'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Выбор тарифа */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Выбор тарифа ({filteredTariffs.length} из {tariffs.length})
            </CardTitle>
            <div className="flex items-center gap-2">
              {/* Кнопка обновления тарифов */}
              {onRefreshTariffs && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRefreshTariffs}
                  disabled={isRefreshingTariffs}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshingTariffs ? 'animate-spin' : ''}`} />
                  {isRefreshingTariffs ? 'Обновление...' : 'Обновить'}
                </Button>
              )}

              {/* Кнопка фильтра архивных */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowArchived(!showArchived)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                {showArchived ? 'Скрыть архивные' : 'Показать архивные'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 transition-opacity duration-300 ${
            isRefreshingTariffs ? 'opacity-50 pointer-events-none' : 'opacity-100'
          }`}>
            {filteredTariffs.map((tariff) => (
              <div
                key={tariff.id}
                className={`border rounded-lg overflow-hidden transition-all ${
                  tariff.archived
                    ? 'opacity-60 cursor-not-allowed bg-gray-50'
                    : 'cursor-pointer hover:shadow-md'
                } ${
                  selectedTariff?.id === tariff.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}
                onClick={() => handleTariffSelect(tariff)}
              >
                {/* Изображение автомобиля */}
                <div className="relative h-32 w-full">
                  <Image
                    src="/auto/eqm5_banner_1.jpg"
                    alt={`Автомобиль ${tariff.name}`}
                    fill
                    className="object-cover"
                  />
                  {/* Ленточка с типом тарифа */}
                  <div className="absolute top-2 left-2">
                    <Badge className={`${getTariffBadgeColor(tariff.serviceClass)} font-semibold`}>
                      {getServiceClassLabel(tariff.serviceClass)}
                    </Badge>
                  </div>
                  {/* Индикатор выбора */}
                  {selectedTariff?.id === tariff.id && (
                    <div className="absolute top-2 right-2">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>

                {/* Информация о тарифе */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">{tariff.name}</h3>

                    {/* Иконка детального просмотра - только для Admin и Operator */}
                    {canViewTariffDetails && (
                      <button
                        onClick={(e) => handleViewTariffDetails(tariff.id, e)}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                        title="Открыть детали тарифа в новой вкладке"
                      >
                        <ExternalLink className="h-4 w-4 text-gray-500 hover:text-blue-500" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Car className="h-4 w-4" />
                      <span>{getCarTypeLabel(tariff.carType)}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground block">Базовая цена:</span>
                        <p className="font-semibold text-primary">{formatPrice(tariff.basePrice)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">За км:</span>
                        <p className="font-semibold">{formatPrice(tariff.perKmPrice)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Бесплатное ожидание:</span>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="font-semibold">{tariff.freeWaitingTimeMinutes} мин</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">За минуту:</span>
                        <p className="font-semibold">{formatPrice(tariff.minutePrice)}</p>
                      </div>
                    </div>

                    <div className="pt-2 space-y-2">
                      {tariff.archived ? (
                        <Badge variant="outline" className="text-red-600 border-red-600">
                          Архивный тариф
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Доступный тариф
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import { AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { RoutePoint } from '@shared/components/map/types';
import { Button } from '@shared/ui/forms/button';
import { Textarea } from '@shared/ui/forms/textarea';
import { Card, CardContent } from '@shared/ui/layout/card';
import type { GetLocationDTO } from '@entities/locations/interface';
import type { GetServiceDTO } from '@entities/services/interface';
import type { GetTariffDTO } from '@entities/tariffs/interface';
import type { GetDriverDTO } from '@entities/users/interface';
import {
  RouteInfoCard,
  PriceInfoCard,
  PassengersInfoCard,
  TariffInfoCard,
  ServicesInfoCard,
  DriverInfoCard,
  type UIPassenger,
  type UISelectedService
} from '@features/orders/summary';



/**
 * Интерфейс для основного компонента сводки заказа
 */
interface SummaryTabProps {
  // Основные данные по заказу
  selectedTariff: GetTariffDTO | null;
  selectedServices: UISelectedService[];
  currentPrice: number;
  passengers: UIPassenger[];
  
  // Данные для построения маршрута
  routeState: {
    startLocation?: GetLocationDTO | null;
    endLocation?: GetLocationDTO | null;
    intermediatePoints?: GetLocationDTO[];
    routePoints?: RoutePoint[];
  };
  routeDistance?: number;
  
  // Методы формы
  methods: {
    setValue: (name: string, value: unknown) => void;
    getValues: (name?: string) => unknown;
    [key: string]: unknown;
  };
  
  // Режим работы компонента
  mode: 'create' | 'edit';
  
  // Управление ценой
  useCustomPrice?: boolean;
  setUseCustomPrice?: (value: boolean) => void;
  _customPrice?: string;
  setCustomPrice?: (value: string) => void;
  
  // Информация о водителе (только для режима редактирования)
  _selectedDriver?: GetDriverDTO | null;
  _onTabChange?: (tab: string) => void;
  _getDriverById?: (id: string) => GetDriverDTO | null;
  _updateDriverCache?: (id: string, data: GetDriverDTO) => void;
  _orderStatus?: string;
  _setOrderStatus?: (status: string) => void;
  
  // Для обратной совместимости с потребителями компонента
  _tariffs?: GetTariffDTO[];
  _services?: GetServiceDTO[];
  _users?: unknown[];
  _routeLocations?: GetLocationDTO[];
  _orderId?: string;
  _isInstantOrder?: boolean;
  _pricing?: {
    basePrice?: number;
    distancePrice?: number;
    totalPrice?: number;
  };
}

/**
 * Компонент сводки заказа по FSD-архитектуре
 */
export function SummaryTab({
  // Основные данные
  selectedTariff,
  selectedServices,
  currentPrice,
  passengers,
  
  // Данные маршрута
  routeState,
  routeDistance,
  
  // Форма и режим
  methods,
  mode,
  
  // Управление ценой
  useCustomPrice = false,
  setUseCustomPrice,
  _customPrice = '',
  setCustomPrice,
  
  // Информация о водителе
  _selectedDriver,
  _onTabChange,
  _getDriverById,
  _updateDriverCache,
  _orderStatus,
  _setOrderStatus,
  
  // Неиспользуемые параметры для обратной совместимости
  _tariffs,
  _services,
  _users,
  _routeLocations,
  _orderId,
  _isInstantOrder,
  _pricing,
}: SummaryTabProps) {
  const [notes, setNotes] = useState('');
  const [showRouteWarningModal, setShowRouteWarningModal] = useState(false);

  // Инициализация заметок
  useEffect(() => {
    const savedNotes = methods.getValues('notes') as string;

    if (savedNotes && savedNotes !== notes) {
      setNotes(savedNotes);
    }
  }, [methods, notes]);

  // Предупреждение о невыбранном маршруте
  useEffect(() => {
    if (!routeDistance || routeDistance === 0) {
      setShowRouteWarningModal(true);
    }
  }, [routeDistance]);

  // Форматирование цены
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Обработчик изменения заметок
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    setNotes(value);
    methods.setValue('notes', value);
  };

  // Обработчик изменения кастомной цены
  const handleCustomPriceToggle = () => {
    if (setUseCustomPrice) {
      setUseCustomPrice(!useCustomPrice);
    }

    // Сброс кастомной цены, если она больше не используется

    if (useCustomPrice && setCustomPrice) {
      setCustomPrice('');
    }
  };

  return (
    <div className="p-4">
      {/* Предупреждение о невыбранном маршруте */}
      {showRouteWarningModal && (
        <Card className="mb-4 bg-yellow-50 border-yellow-100">
          <CardContent className="p-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <div className="flex-1">
              <p className="text-yellow-800">
                Расстояние маршрута не определено. Пожалуйста, выберите корректные начальную и конечную точки в разделе &quot;Маршрут&quot;.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowRouteWarningModal(false)}
            >
              Закрыть
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Левая колонка */}
        <div>
          <RouteInfoCard 
            startLocation={routeState.startLocation?.name || 'Не выбрано'}
            endLocation={routeState.endLocation?.name || 'Не выбрано'}
            intermediatePoints={routeState.intermediatePoints?.map(p => p.name) || []}
            distance={routeDistance ? `${Math.round(routeDistance / 1000)} км` : 'Не определено'}
          />
          
          <PriceInfoCard 
            basePrice={formatPrice(selectedTariff?.basePrice || 0)}
            distancePrice={formatPrice(selectedTariff ? 
              (routeDistance || 0) / 1000 * (selectedTariff.perKmPrice || 0) : 
              0)}
            totalPrice={formatPrice(currentPrice)}
            formattedPrice={formatPrice(currentPrice)}
            isCustomPrice={useCustomPrice || false}
            handleCustomPriceChange={(value) => setCustomPrice && setCustomPrice(value)}
            toggleCustomPrice={handleCustomPriceToggle}
            showCustomPrice={mode === 'edit'}
          />

          {selectedServices.length > 0 && (
            <ServicesInfoCard 
              services={selectedServices.map(service => ({
                ...service,
                quantity: service.quantity || 1,
                totalPrice: (service.price || 0) * (service.quantity || 1)
              }))}
              formatPrice={formatPrice}
            />
          )}

          {/* Заметки */}
          <Card className="mb-4">
            <CardContent className="p-4">
              <Textarea
                placeholder="Заметки к заказу"
                value={notes}
                onChange={handleNotesChange}
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>
        </div>

        {/* Правая колонка */}
        <div>
          <TariffInfoCard tariff={selectedTariff} />

          <PassengersInfoCard passengers={passengers} />
          
          {mode === 'edit' && _selectedDriver && (
            <DriverInfoCard 
              driver={_selectedDriver as GetDriverDTO}
              onDriverChange={() => _onTabChange && _onTabChange('driver')}
            />
          )}
        </div>
      </div>
    </div>
  );
}

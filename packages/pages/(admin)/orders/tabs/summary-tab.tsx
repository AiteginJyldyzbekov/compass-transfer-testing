'use client';

import {
  DollarSign,
  Users,
  MapPin,
  Calendar,
  Clock,
  Plane,
  FileText,
  User,
  Phone,
  Star,
  Car,
  Hash,
  Tag,
  Palette,
  CalendarDays,
  UserCheck,
  Shield,
  X,
  AlertTriangle,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Badge } from '@shared/ui/data-display/badge';
import { Button } from '@shared/ui/forms/button';
import { Checkbox } from '@shared/ui/forms/checkbox';
import { Input } from '@shared/ui/forms/input';
import { Label } from '@shared/ui/forms/label';
import { Textarea } from '@shared/ui/forms/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/layout/card';
import { CarTypeValues, type CarType } from '@entities/tariffs/enums/CarType.enum';
import { ServiceClassValues, type ServiceClass } from '@entities/tariffs/enums/ServiceClass.enum';

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
  // Функции для работы с данными водителей
  getDriverById?: (id: string) => Record<string, unknown> | null;
  updateDriverCache?: (id: string, data: Record<string, unknown>) => void;
  // Кастомная цена
  useCustomPrice?: boolean;
  setUseCustomPrice?: (value: boolean) => void;
  customPrice?: string;
  setCustomPrice?: (value: string) => void;

  // Переключение табов
  onTabChange?: (tab: string) => void;
  // Дополнительные свойства
  orderStatus?: string;
  setOrderStatus?: (status: string) => void;
  // Флаг для моментальных заказов
  isInstantOrder?: boolean;
}

export function SummaryTab({
  selectedTariff,
  selectedServices,
  currentPrice: _currentPrice,
  passengers,
  routeLocations: _routeLocations,
  routeState,
  routeDistance,
  methods,
  mode: _mode,
  orderId: _orderId,
  selectedDriver,
  getDriverById,
  updateDriverCache: _updateDriverCache,
  useCustomPrice = false,
  setUseCustomPrice,
  customPrice = '',
  setCustomPrice,
  orderStatus: _orderStatus,
  setOrderStatus: _setOrderStatus,
  onTabChange,
  isInstantOrder = false,
}: SummaryTabProps) {
  // Убираем API запросы - используем только routeDistance из пропсов
  const [notes, setNotes] = useState('');
  // Состояние для модального окна предупреждения
  const [showRouteWarningModal, setShowRouteWarningModal] = useState(false);

  // Инициализируем заметки из сохраненных данных
  useEffect(() => {
    const savedNotes = methods.getValues('notes');

    if (savedNotes && savedNotes !== notes) {
      setNotes(savedNotes);
    }
  }, [methods, notes]);

  // Показываем модальное окно предупреждения при входе на таб без расстояния
  useEffect(() => {
    if (!routeDistance || routeDistance === 0) {
      setShowRouteWarningModal(true);
    }
  }, []); // Запускаем только при монтировании компонента

  // Функции для получения переводов
  const getServiceClassTranslation = (serviceClass: string): string => {
    const translation = ServiceClassValues[serviceClass as ServiceClass] || serviceClass;

    // eslint-disable-next-line no-console
    console.log('🎯 Перевод класса обслуживания:', { serviceClass, translation });

    return translation;
  };

  const getCarTypeTranslation = (carType: string): string => {
    const translation = CarTypeValues[carType as CarType] || carType;

    // eslint-disable-next-line no-console
    console.log('🚗 Перевод типа авто:', { carType, translation });

    return translation;
  };

  // Функция для изменения основного пассажира
  const handleMainPassengerChange = (selectedIndex: number) => {
    const updatedPassengers = passengers.map((passenger, index) => ({
      ...passenger,
      isMainPassenger: index === selectedIndex,
    }));

    // Обновляем данные через methods
    if (methods) {
      methods.setValue('passengers', updatedPassengers);
    }
  };

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

  // Убираем API запросы - используем только routeDistance из map-tab

  // Убираем компонент SegmentDistance - не делаем API запросы

  // Функция для получения расстояния маршрута в километрах
  const getRouteDistanceKm = () => {
    // eslint-disable-next-line no-console
    console.log('🔍 getRouteDistanceKm вызвана, routeDistance:', routeDistance);

    // Используем только расстояние из map-tab (уже рассчитанное через routingService)
    if (routeDistance && routeDistance > 0) {
      const apiDistanceKm = routeDistance / 1000;

      // eslint-disable-next-line no-console
      console.log('📏 Используем расстояние из map-tab:', apiDistanceKm);

      return Math.round(apiDistanceKm * 10) / 10;
    }

    // НЕ ИСПОЛЬЗУЕМ ПРЯМОЕ РАССТОЯНИЕ! НИКОГДА! СУКА!
    // eslint-disable-next-line no-console
    console.error('❌ Расстояние не может быть рассчитано - API недоступен');

    return 0;
  };

  // Расчет общей стоимости с учетом расстояния
  const calculateTotalPrice = () => {
    if (!selectedTariff) return 0;

    const distance = getRouteDistanceKm();
    const perKmPrice = selectedTariff.perKmPrice || 0;
    const basePrice = selectedTariff.basePrice || 0;

    const distancePrice = distance * perKmPrice;
    const servicesPrice = selectedServices.reduce(
      (sum, service) => sum + (service.price || 0) * (service.quantity || 1),
      0,
    );

    return Math.round(basePrice + distancePrice + servicesPrice);
  };

  return (
    <div className='space-y-6'>
      {/* Сводка заказа */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Маршрут */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <MapPin className='h-5 w-5' />
              Маршрут
            </CardTitle>
          </CardHeader>
          <CardContent>
            {routeState?.routePoints?.filter((point: any) => point.location).length > 0 ? (
              <div className='space-y-1'>
                {routeState.routePoints
                  .filter((point: any) => point.location)
                  .map((point: any, index: number, filteredPoints: any[]) => {
                    return (
                      <div key={point.id}>
                        {/* Точка маршрута */}
                        <div className='flex items-start gap-3 py-2'>
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                              index === 0
                                ? 'bg-green-500'
                                : index === filteredPoints.length - 1
                                  ? 'bg-red-500'
                                  : 'bg-blue-500'
                            }`}
                          >
                            {String.fromCharCode(65 + index)}
                          </div>
                          <div className='flex-1'>
                            <p className='font-medium text-sm'>{point.location.name}</p>
                            <p className='text-xs text-gray-500'>{point.location.address}</p>
                          </div>
                        </div>

                        {/* Линия между точками (без расстояния - используем общее из map-tab) */}
                        {index < filteredPoints.length - 1 && (
                          <div className='flex items-center gap-3 py-1 ml-3'>
                            <div className='w-6 flex justify-center'>
                              <div className='w-px h-4 bg-gray-300' />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                {/* Общее расстояние */}
                <div className='mt-4 pt-3 border-t border-gray-200'>
                  <div className='flex items-center justify-between text-sm'>
                    <span className='text-gray-600'>Общее расстояние:</span>
                    <span className='font-medium'>{getRouteDistanceKm()} км</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className='text-muted-foreground'>Маршрут не задан</p>
            )}
          </CardContent>
        </Card>

        {/* Пассажиры */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <Users className='h-5 w-5' />
                Пассажиры
              </div>
              <Badge variant='secondary' className='bg-blue-100 text-blue-800'>
                {passengers.length}{' '}
                {passengers.length === 1
                  ? 'пассажир'
                  : passengers.length < 5
                    ? 'пассажира'
                    : 'пассажиров'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {passengers.length > 0 ? (
              <div className='space-y-4'>
                {/* Скроллируемый список пассажиров */}
                <div
                  className={`space-y-3 ${passengers.length > 4 ? 'max-h-96 overflow-y-auto pr-2' : ''}`}
                >
                  {passengers.map((passenger, index) => (
                    <div
                      key={index}
                      className='group relative overflow-hidden rounded-lg border bg-card p-4 transition-all hover:shadow-md'
                    >
                      <div className='flex items-start gap-4'>
                        {/* Аватар */}
                        <div className='relative'>
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-semibold text-white ${
                              passenger.isMainPassenger
                                ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                                : 'bg-gradient-to-br from-slate-400 to-slate-500'
                            }`}
                          >
                            {(passenger.firstName?.[0] || '?').toUpperCase()}
                          </div>
                          {passenger.isMainPassenger && (
                            <div className='absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white'>
                              <UserCheck className='h-3 w-3' />
                            </div>
                          )}
                        </div>

                        {/* Информация о пассажире */}
                        <div className='flex-1 space-y-2'>
                          <div className='flex items-center gap-2'>
                            <h4 className='font-semibold text-foreground'>
                              {passenger.firstName} {passenger.lastName || ''}
                            </h4>
                            {passenger.isMainPassenger && (
                              <Badge
                                variant='secondary'
                                className='bg-blue-100 text-blue-700 text-xs'
                              >
                                Основной
                              </Badge>
                            )}
                          </div>

                          {/* Контактная информация */}
                          <div className='flex flex-wrap gap-4 text-sm text-muted-foreground'>
                            {passenger.phoneNumber && (
                              <div className='flex items-center gap-1'>
                                <Phone className='h-3 w-3' />
                                {passenger.phoneNumber}
                              </div>
                            )}
                            {passenger.email && (
                              <div className='flex items-center gap-1'>
                                <span className='text-xs'>✉️</span>
                                {passenger.email}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Выбор основного пассажира */}
                        <div className='flex items-center gap-2'>
                          <input
                            type='radio'
                            id={`main-passenger-${index}`}
                            name='mainPassenger'
                            checked={passenger.isMainPassenger}
                            onChange={() => handleMainPassengerChange(index)}
                            className='h-4 w-4 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500'
                          />
                          <label
                            htmlFor={`main-passenger-${index}`}
                            className='cursor-pointer text-xs text-muted-foreground'
                          >
                            Основной
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center py-12 text-center'>
                <div className='rounded-full bg-muted p-3'>
                  <Users className='h-8 w-8 text-muted-foreground' />
                </div>
                <h3 className='mt-4 text-sm font-semibold text-foreground'>
                  Пассажиры не добавлены
                </h3>
                <p className='mt-2 text-sm text-muted-foreground'>
                  Добавьте пассажиров в соответствующем табе
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Расписание */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Calendar className='h-5 w-5' />
              Расписание поездки
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {/* Информация о рейсах */}
              {(methods.getValues('airFlight') || methods.getValues('flyReis')) && (
                <div className='flex flex-row gap-4'>
                  {methods.getValues('airFlight') && (
                    <div className='w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
                      <Plane className='h-5 w-5 text-blue-600' />
                      <div>
                        <p className='text-sm text-gray-600'>Рейс вылета</p>
                        <p className='font-medium'>{methods.getValues('airFlight')}</p>
                      </div>
                    </div>
                  )}
                  {methods.getValues('flyReis') && (
                    <div className='w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
                      <Plane className='h-5 w-5 text-green-600' />
                      <div>
                        <p className='text-sm text-gray-600'>Рейс прилета</p>
                        <p className='font-medium'>{methods.getValues('flyReis')}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Заметки к рейсам - скрыто для моментальных заказов */}
              {!isInstantOrder && methods.getValues('description') && (
                <div className='bg-amber-50 border border-amber-200 rounded-lg p-4'>
                  <div className='flex items-start gap-3'>
                    <div className='w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0'>
                      <FileText className='h-5 w-5 text-white' />
                    </div>
                    <div className='flex-1'>
                      <p className='text-sm text-amber-700 font-medium mb-1'>
                        Комментарии к поездке
                      </p>
                      <p className='text-sm text-amber-800 leading-relaxed whitespace-pre-wrap'>
                        {methods.getValues('description')}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Основная информация о времени */}
              <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {methods.getValues('scheduledTime') && (
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center'>
                        <Calendar className='h-5 w-5 text-white' />
                      </div>
                      <div>
                        <p className='text-sm text-gray-600'>Дата поездки</p>
                        <p className='font-medium'>
                          {formatDate(new Date(methods.getValues('scheduledTime')))}
                        </p>
                      </div>
                    </div>
                  )}
                  {methods.getValues('departureTime') && (
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 bg-green-500 rounded-full flex items-center justify-center'>
                        <Clock className='h-5 w-5 text-white' />
                      </div>
                      <div>
                        <p className='text-sm text-gray-600'>Время подачи</p>
                        <p className='font-medium'>{methods.getValues('departureTime')}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Информация о водителе - скрыто для моментальных заказов */}
              {!isInstantOrder && selectedDriver ? (
                (() => {
                  // Получаем полные данные водителя из кэша
                  const fullDriverData = getDriverById ? getDriverById(selectedDriver.id) : null;
                  const driverInfo = fullDriverData || selectedDriver;

                  return (
                    <div className='rounded-lg border bg-card p-4'>
                      <div className='flex flex-col items-start gap-3'>
                        <div className='w-full flex flex-row gap-2'>
                          {/* Аватар водителя */}
                          <div className='relative'>
                            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-lg font-bold text-white'>
                              {driverInfo.fullName
                                ? String(driverInfo.fullName).charAt(0).toUpperCase()
                                : 'В'}
                            </div>
                            <div className='absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white'>
                              <Shield className='h-2.5 w-2.5' />
                            </div>
                          </div>

                          {/* Основная информация */}
                          <div className='flex-1 space-y-2'>
                            <div className='flex items-start justify-between'>
                              <div>
                                <div className='flex items-center gap-1.5'>
                                  <User className='h-3.5 w-3.5 text-emerald-600' />
                                  <span className='text-xs font-medium text-emerald-700'>
                                    Назначенный водитель
                                  </span>
                                </div>
                                <h3 className='text-base font-semibold text-foreground'>
                                  {driverInfo.fullName || `Водитель ${selectedDriver.id}`}
                                </h3>
                              </div>
                              <div className='inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800'>
                                <UserCheck className='h-3 w-3' />
                                Назначен
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Детальная информация в компактной сетке */}
                        <div className='grid grid-cols-2 gap-2 text-sm sm:grid-cols-4'>
                          {/* Контактная информация */}
                          {driverInfo.phoneNumber && (
                            <div className='flex items-center gap-2 rounded-md bg-muted/30 p-2'>
                              <Phone className='h-3.5 w-3.5 text-emerald-600' />
                              <div className='min-w-0 flex-1'>
                                <p className='truncate text-xs text-muted-foreground'>Телефон</p>
                                <p className='truncate text-xs font-medium'>
                                  {String(driverInfo.phoneNumber)}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Класс обслуживания из activeCar */}
                          {driverInfo.activeCar?.serviceClass && (
                            <div className='flex items-center gap-2 rounded-md bg-muted/30 p-2'>
                              <Star className='h-3.5 w-3.5 text-amber-600' />
                              <div className='min-w-0 flex-1'>
                                <p className='truncate text-xs text-muted-foreground'>Класс</p>
                                <p className='truncate text-xs font-medium'>
                                  {getServiceClassTranslation(String(driverInfo.activeCar.serviceClass))}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Тип автомобиля из activeCar */}
                          {driverInfo.activeCar?.type && (
                            <div className='flex items-center gap-2 rounded-md bg-muted/30 p-2'>
                              <Car className='h-3.5 w-3.5 text-blue-600' />
                              <div className='min-w-0 flex-1'>
                                <p className='truncate text-xs text-muted-foreground'>Тип</p>
                                <p className='truncate text-xs font-medium'>
                                  {getCarTypeTranslation(String(driverInfo.activeCar.type))}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Гос номер из activeCar */}
                          {driverInfo.activeCar?.licensePlate && (
                            <div className='flex items-center gap-2 rounded-md bg-muted/30 p-2'>
                              <Hash className='h-3.5 w-3.5 text-slate-600' />
                              <div className='min-w-0 flex-1'>
                                <p className='truncate text-xs text-muted-foreground'>Номер</p>
                                <p className='truncate font-mono text-xs font-medium'>
                                  {String(driverInfo.activeCar.licensePlate)}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Марка и модель автомобиля из activeCar */}
                          {(driverInfo.activeCar?.make || driverInfo.activeCar?.model) && (
                            <div className='flex items-center gap-2 rounded-md bg-muted/30 p-2'>
                              <Tag className='h-3.5 w-3.5 text-purple-600' />
                              <div className='min-w-0 flex-1'>
                                <p className='truncate text-xs text-muted-foreground'>Авто</p>
                                <p className='truncate text-xs font-medium'>
                                  {[driverInfo.activeCar?.make, driverInfo.activeCar?.model]
                                    .filter(Boolean)
                                    .join(' ')}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Цвет автомобиля из activeCar */}
                          {driverInfo.activeCar?.color && (
                            <div className='flex items-center gap-2 rounded-md bg-muted/30 p-2'>
                              <Palette className='h-3.5 w-3.5 text-pink-600' />
                              <div className='min-w-0 flex-1'>
                                <p className='truncate text-xs text-muted-foreground'>Цвет</p>
                                <p className='truncate text-xs font-medium'>
                                  {String(driverInfo.activeCar.color)}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Год выпуска из activeCar */}
                          {driverInfo.activeCar?.year && (
                            <div className='flex items-center gap-2 rounded-md bg-muted/30 p-2'>
                              <CalendarDays className='h-3.5 w-3.5 text-orange-600' />
                              <div className='min-w-0 flex-1'>
                                <p className='truncate text-xs text-muted-foreground'>Год</p>
                                <p className='truncate text-xs font-medium'>
                                  {String(driverInfo.activeCar.year)}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Вместимость пассажиров из activeCar */}
                          {driverInfo.activeCar?.passengerCapacity && (
                            <div className='flex items-center gap-2 rounded-md bg-muted/30 p-2'>
                              <Users className='h-3.5 w-3.5 text-indigo-600' />
                              <div className='min-w-0 flex-1'>
                                <p className='truncate text-xs text-muted-foreground'>Мест</p>
                                <p className='truncate text-xs font-medium'>
                                  {String(driverInfo.activeCar.passengerCapacity)}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()
              ) : !isInstantOrder ? (
                <div className='bg-gray-50 border border-gray-200 rounded-lg p-4'>
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center'>
                      <User className='h-5 w-5 text-white' />
                    </div>
                    <div className='flex-1'>
                      <p className='text-sm text-gray-600'>Водитель</p>
                      <p className='font-medium text-gray-500'>Водитель не выбран</p>
                      <p className='text-xs text-gray-400'>
                        Назначьте водителя для выполнения заказа
                      </p>
                    </div>
                    <div className='text-right'>
                      <button
                        onClick={() => onTabChange && onTabChange('map')}
                        className='inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors'
                      >
                        Назначить водителя
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>

        {/* Стоимость */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <DollarSign className='h-5 w-5' />
              Стоимость
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {/* Расчетная стоимость */}
              <div className='space-y-2'>
                <div className='flex justify-between'>
                  <span>Базовая стоимость:</span>
                  <span className='font-medium'>
                    {selectedTariff ? formatPrice(selectedTariff.basePrice || 0) : formatPrice(0)}
                  </span>
                </div>
                <div className='flex justify-between text-sm text-gray-600'>
                  <span>
                    За расстояние ({getRouteDistanceKm()} км × {selectedTariff?.perKmPrice || 0}{' '}
                    сом):
                  </span>
                  <span>
                    {formatPrice(getRouteDistanceKm() * (selectedTariff?.perKmPrice || 0))}
                  </span>
                </div>
                <div className='flex justify-between text-sm text-gray-600'>
                  <span>Дополнительные услуги:</span>
                  <span>
                    {formatPrice(
                      selectedServices.reduce(
                        (total, service) => total + (service.price || 0) * (service.quantity || 1),
                        0,
                      ),
                    )}
                  </span>
                </div>
                <hr />
                <div className='flex justify-between font-medium text-lg'>
                  <span>Итого к оплате:</span>
                  <div className='flex flex-col items-end'>
                    {useCustomPrice &&
                    customPrice &&
                    parseFloat(customPrice) !== calculateTotalPrice() ? (
                      <>
                        {/* Зачеркнутая автоматическая цена */}
                        <span className='text-gray-400 line-through text-sm'>
                          {formatPrice(calculateTotalPrice())}
                        </span>
                        {/* Кастомная цена */}
                        <span className='text-orange-600 font-bold'>
                          {formatPrice(parseFloat(customPrice) || 0)}
                        </span>
                      </>
                    ) : (
                      <span className='text-green-600'>{formatPrice(calculateTotalPrice())}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Кастомная цена */}
              <div className='p-4 border rounded-lg bg-gray-50'>
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id='custom-final-price'
                    checked={useCustomPrice}
                    onCheckedChange={checked => {
                      if (setUseCustomPrice) {
                        setUseCustomPrice(checked as boolean);
                      }
                    }}
                  />
                  <Label htmlFor='custom-final-price' className='font-medium'>
                    Использовать кастомную итоговую цену
                  </Label>
                </div>
                {useCustomPrice && (
                  <div className='space-y-3'>
                    <div className='space-y-2'>
                      <Label htmlFor='custom-final-price-input'>Итоговая цена (сом)</Label>
                      <Input
                        id='custom-final-price-input'
                        type='number'
                        placeholder='Введите итоговую цену'
                        value={customPrice}
                        onChange={e => {
                          if (setCustomPrice) {
                            setCustomPrice(e.target.value);
                          }
                        }}
                        className='max-w-xs'
                      />
                    </div>

                    {/* Предупреждение о разнице в цене */}
                    {customPrice && parseFloat(customPrice) !== calculateTotalPrice() && (
                      <div className='p-3 bg-yellow-50 border border-yellow-200 rounded-lg'>
                        <div className='flex items-start gap-2'>
                          <div className='w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5'>
                            <span className='text-white text-xs font-bold'>!</span>
                          </div>
                          <div className='text-sm'>
                            <p className='font-medium text-yellow-800 mb-1'>
                              Внимание: цена изменена вручную
                            </p>
                            <p className='text-yellow-700'>
                              Автоматически рассчитанная цена:{' '}
                              <span className='font-medium'>
                                {formatPrice(calculateTotalPrice())}
                              </span>
                            </p>
                            <p className='text-yellow-700'>
                              Установленная цена:{' '}
                              <span className='font-medium'>
                                {formatPrice(parseFloat(customPrice) || 0)}
                              </span>
                            </p>
                            <p className='text-yellow-700 mt-1'>
                              Разница:{' '}
                              <span
                                className={`font-medium ${
                                  parseFloat(customPrice) > calculateTotalPrice()
                                    ? 'text-green-600'
                                    : 'text-red-600'
                                }`}
                              >
                                {parseFloat(customPrice) > calculateTotalPrice() ? '+' : ''}
                                {formatPrice(
                                  (parseFloat(customPrice) || 0) - calculateTotalPrice(),
                                )}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>


            </div>
          </CardContent>
        </Card>
      </div>

      {/* Дополнительная информация - скрыто для моментальных заказов */}
      {!isInstantOrder && (
        <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <FileText className='h-5 w-5' />
            Дополнительная информация
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {/* Поле для редактирования заметок */}
            <div className='space-y-2'>
              <Label htmlFor='notes'>
                {methods.getValues('notes') ? 'Редактировать заметки' : 'Заметки к заказу'}
              </Label>
              <Textarea
                id='notes'
                placeholder='Добавьте любые дополнительные заметки или инструкции для водителя...'
                value={notes}
                onChange={e => {
                  setNotes(e.target.value);
                  if (methods) {
                    methods.setValue('notes', e.target.value);
                  }
                }}
                rows={4}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      )}

      {/* Модальное окно предупреждения о расстоянии */}
      {showRouteWarningModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 max-w-md mx-4'>
            <div className='flex items-center gap-3 mb-4'>
              <AlertTriangle className='h-6 w-6 text-amber-500' />
              <h3 className='text-lg font-semibold'>Внимание: Расстояние не рассчитано</h3>
            </div>

            <div className='mb-6 space-y-3'>
              <p className='text-gray-600'>
                Не удалось автоматически рассчитать расстояние маршрута из-за недоступности API роутинга.
              </p>
              <p className='text-gray-600'>
                Стоимость поездки будет рассчитана по базовому тарифу без учета расстояния.
              </p>
              <p className='text-sm text-amber-600 bg-amber-50 p-3 rounded'>
                <strong>Рекомендация:</strong> Используйте кастомную цену для точного расчета стоимости.
              </p>
            </div>

            <div className='flex gap-3 justify-end'>
              <Button
                variant='outline'
                onClick={() => setShowRouteWarningModal(false)}
              >
                Понятно
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

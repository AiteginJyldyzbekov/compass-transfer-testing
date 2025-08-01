'use client';

import { ArrowLeft, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useMemo, useCallback, useEffect } from 'react';
import type { GetTariffDTOWithArchived } from '@shared/api/tariffs';
import { useOrderData } from '@shared/hooks/useOrderData';
import { Button } from '@shared/ui/forms/button';
import { Card, CardContent} from '@shared/ui/layout/card';
import { SidebarHeader } from '@shared/ui/layout/sidebar';
import { useScheduledOrderSubmit, useGetScheduledOrder, useUpdateScheduledOrder } from '@entities/orders/hooks';
import {
  TariffPricingTab,
  ScheduleTab,
  PassengersTab,
  MapTab,
  ServicesTab,
  SummaryTab
} from './tabs';

interface OrderPageProps {
  mode: 'create' | 'edit';
  id?: string;
}

export function OrderPage({ mode, id }: OrderPageProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('pricing');
  const [visitedTabs, setVisitedTabs] = useState<Set<string>>(new Set(['pricing'])); // Отслеживаем посещенные табы

  // Определяем, находимся ли мы в режиме редактирования
  const isEditMode = mode === 'edit' && !!id;

  // Функция для проверки валидности таба
  const isTabValid = (tabId: string): boolean => {
    switch (tabId) {
      case 'pricing':
        return !!selectedTariff;
      case 'schedule':
        // Проверяем что заполнены дата и время
        const scheduledTime = methods.getValues('scheduledTime');

        return !!scheduledTime && scheduledTime.trim() !== '';
      case 'passengers':
        // Проверяем что есть хотя бы один пассажир
        const passengers = methods.getValues('passengers');

        return Array.isArray(passengers) && passengers.length > 0;
      case 'map':
        // Проверяем что выбраны точки маршрута
        const startLocation = methods.getValues('startLocationId');
        const endLocation = methods.getValues('endLocationId');

        return !!startLocation && !!endLocation;
      case 'services':
        return true; // Услуги опциональны
      case 'summary':
        return true; // Сводка всегда доступна
      default:
        return false;
    }
  };

  // Функция для перехода к следующему табу
  const goToNextTab = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);

    if (currentIndex < tabs.length - 1) {
      const nextTab = tabs[currentIndex + 1];

      setActiveTab(nextTab.id);
      setVisitedTabs(prev => new Set([...prev, nextTab.id]));
    }
  };

  // Функция для перехода к предыдущему табу
  const goToPreviousTab = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);

    if (currentIndex > 0) {
      const previousTab = tabs[currentIndex - 1];

      setActiveTab(previousTab.id);
      // Не добавляем в visitedTabs при возврате назад
    }
  };

  // Функция для перехода к конкретному табу
  const goToTab = (tabId: string) => {
    setActiveTab(tabId);
    setVisitedTabs(prev => new Set([...prev, tabId]));
  };

  // Проверяем можно ли перейти к следующему табу
  const canGoNext = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);

    return currentIndex < tabs.length - 1 && isTabValid(activeTab);
  };

  // Проверяем можно ли перейти к предыдущему табу
  const canGoPrevious = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    
    return currentIndex > 0;
  };

  // Загружаем реальные данные
  const {
    tariffs,
    services,
    users,
    isLoading: dataLoading,
    isRefreshingTariffs,
    error: dataError,
    refetch,
    refetchTariffs
  } = useOrderData();
  // Создаем состояние для хранения данных формы
  const [formData, setFormData] = useState({
    scheduledTime: '',
    departureTime: '14:30',
    airFlight: '',
    flyReis: '',
    description: '',
    notes: '',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    passengers: [] as any[],
    startLocationId: '',
    endLocationId: '',
    additionalStops: [] as string[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    routePoints: [] as any[]
  });

  // Состояние для карты и водителя (сохраняется между шагами)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedDriver, setSelectedDriver] = useState<any>(null);
  const [dynamicMapCenter, setDynamicMapCenter] = useState<{ latitude: number; longitude: number } | null>(null);
  const [openDriverPopupId, setOpenDriverPopupId] = useState<string | null>(null);

  // Состояние маршрута (сохраняется между шагами)
  const [routePoints, setRoutePoints] = useState([
    { id: '1', location: null, type: 'start', label: 'Откуда' },
    { id: '2', location: null, type: 'end', label: 'Куда' },
  ]);

  // Состояние расстояния маршрута (в метрах)
  const [routeDistance, setRouteDistance] = useState<number>(0);

  // Состояние для кастомной цены
  const [useCustomPrice, setUseCustomPrice] = useState<boolean>(false);
  const [customPrice, setCustomPrice] = useState<string>('');

  // Состояние для статуса заказа (для редактирования)
  const [orderStatus, setOrderStatus] = useState<'Pending' | 'Scheduled' | 'InProgress' | 'Completed' | 'Cancelled' | 'Expired'>('Pending');

  const methods = useMemo(() => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getValues: (key?: string): any => {
      if (key) {
        return formData[key as keyof typeof formData];
      }

      return formData;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue: (key: string, value: any) => {
      setFormData(prev => ({ ...prev, [key]: value }));
    }
  }), [formData]);

  const routeLocations = useMemo(() => [
    { id: '1', name: 'Аэропорт Манас', address: 'Аэропорт Манас, Бишкек' },
    { id: '2', name: 'Центр города', address: 'пр. Чуй, Бишкек' }
  ], []);

  // Создаем объект routeState для совместимости с существующими компонентами
  const routeState = useMemo(() => ({
    routeLocations: routeLocations || [],
    flatLocations: routeLocations || [],
    routePoints: routePoints, // Используем реальные точки маршрута
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addLocationSmart: (_location: any) => {
      // Функция для добавления локации
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    selectLocationForPoint: (_location: any, _pointIndex: number) => {
      // Функция для выбора локации для точки
    },
    removeRoutePoint: (_index: number) => {
      // Функция для удаления точки маршрута
    },
  }), [routeLocations, routePoints]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [currentPrice, setCurrentPrice] = useState(200);
  const [selectedTariff, setSelectedTariff] = useState<GetTariffDTOWithArchived | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePassengersChange = (newPassengers: any[]) => {
    // Обновляем форму с новыми пассажирами
    methods.setValue('passengers', newPassengers);
    // Принудительно обновляем состояние для перерендера
    setFormData(prev => ({ ...prev, passengers: newPassengers }));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleRoutePointsChange = useCallback((startLocationId: string, endLocationId: string, routePoints: any[]) => {
    // Проверяем, изменились ли данные
    const currentData = methods.getValues();
    
    if (
      currentData.startLocationId === startLocationId &&
      currentData.endLocationId === endLocationId &&
      JSON.stringify(currentData.routePoints) === JSON.stringify(routePoints)
    ) {

      return; // Данные не изменились, не обновляем
    }

    // Обновляем форму с новыми точками маршрута
    setFormData(prev => ({
      ...prev,
      startLocationId,
      endLocationId,
      routePoints
    }));
  }, [methods]);

  // Мемоизируем callback для MapTab
  const mapTabRoutePointsChange = useMemo(() =>
    activeTab === 'map' ? handleRoutePointsChange : undefined,
    [activeTab, handleRoutePointsChange]
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleServicesChange = (newServices: any[]) => {
    setSelectedServices(newServices);
  };

  const handlePriceChange = (newPrice: number) => {
    setCurrentPrice(newPrice);
  };

  // Состояние для отслеживания, что данные уже загружены
  const [isOrderDataLoaded, setIsOrderDataLoaded] = useState(false);

  // Хук для загрузки заказа при редактировании
  const { order: existingOrder, isLoading: isLoadingOrder } = useGetScheduledOrder(
    isEditMode ? id : null,
    {
      enabled: isEditMode,
    }
  );

  // Получаем номер заказа для отображения в заголовке
  const orderNumber = existingOrder?.orderNumber || '';

  // Заполняем данные заказа при загрузке (только один раз)
  useEffect(() => {
    if (existingOrder && !isOrderDataLoaded && tariffs.length > 0 && services.length > 0) {

      // 1. Заполняем основные поля
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setOrderStatus(existingOrder.status as any);
      setCustomPrice(existingOrder.initialPrice?.toString() || '');
      setUseCustomPrice(true); // Включаем кастомную цену, так как цена уже установлена

      // 2. Устанавливаем выбранный тариф
      if (existingOrder.tariffId) {
        const foundTariff = tariffs.find(t => t.id === existingOrder.tariffId);

        if (foundTariff) {
          setSelectedTariff(foundTariff);
        }
      }

      // 3. Заполняем данные формы через methods
      if (methods) {
        // Время и дата
        if (existingOrder.scheduledTime) {
          methods.setValue('scheduledTime', existingOrder.scheduledTime);
        }

        // Поля рейсов и описания
        methods.setValue('description', existingOrder.description || '');
        methods.setValue('airFlight', existingOrder.airFlight || '');
        methods.setValue('flyReis', existingOrder.flyReis || '');
        methods.setValue('notes', existingOrder.notes || '');

        // Локации маршрута
        if (existingOrder.startLocationId) {
          methods.setValue('startLocationId', existingOrder.startLocationId);
        }
        if (existingOrder.endLocationId) {
          methods.setValue('endLocationId', existingOrder.endLocationId);
        }
        if (existingOrder.additionalStops && existingOrder.additionalStops.length > 0) {
          methods.setValue('additionalStops', existingOrder.additionalStops);
        }

        // Пассажиры - дополняем недостающие поля
        if (existingOrder.passengers && existingOrder.passengers.length > 0) {
          const enhancedPassengers = existingOrder.passengers.map(passenger => ({
            ...passenger,
            lastName: passenger.lastName || '',
            phone: '', // Будет заполнено из userData при загрузке
            email: '', // Будет заполнено из userData при загрузке
          }));

          methods.setValue('passengers', enhancedPassengers);
        }
      }

      // 4. Устанавливаем выбранные услуги
      if (existingOrder.services && existingOrder.services.length > 0) {
        const selectedServicesFromOrder = existingOrder.services.map(orderService => {
          const foundService = services.find(s => s.id === orderService.serviceId);

          if (foundService) {
            return {
              ...foundService,
              quantity: orderService.quantity
            };
          }

          return null;
        }).filter(Boolean);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setSelectedServices(selectedServicesFromOrder as any[]);
      }

      // Отмечаем, что данные загружены
      setIsOrderDataLoaded(true);

      // TODO: 5. Загрузить и установить локации по ID
      // TODO: 6. Загрузить и установить водителя (если есть)
    }
  }, [existingOrder, isOrderDataLoaded, tariffs, services, methods]);

  // Хук для отправки/обновления заказа
  const { submitOrder, isLoading: isSubmittingOrder, error: submitError } = useScheduledOrderSubmit({
    onSuccess: (_order) => {
      router.push('/orders');
    },
    onError: (_error) => {
      // Обработка ошибки создания заказа
    }
  });

  // Хук для обновления заказа
  const { updateOrder, isLoading: isUpdatingOrder } = useUpdateScheduledOrder({
    onSuccess: (_order) => {
      router.push('/orders');
    },
    onError: (_error) => {
      // Обработка ошибки обновления заказа
    }
  });

  // Показываем ошибку отправки если есть
  if (submitError) {
    // Ошибка отправки обрабатывается в UI
  }

  const handleBack = () => {
    router.push('/orders');
  };

  const handleSave = async () => {
    try {
      // Получаем реальные точки маршрута с локациями
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const routePointsWithLocations = routePoints.filter((point: any) => point.location);

      // Формируем данные для отправки согласно API
      const orderData = {
        tariffId: selectedTariff?.id || '',
        routeId: null,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        startLocationId: (routePointsWithLocations[0] as any)?.location?.id || null,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        endLocationId: (routePointsWithLocations[routePointsWithLocations.length - 1] as any)?.location?.id || null,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        additionalStops: routePointsWithLocations.slice(1, -1).map((point: any) => point.location.id),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        services: selectedServices.map((service: any) => ({
          serviceId: service.id,
          quantity: service.quantity || 1,
          notes: null
        })),
        initialPrice: (() => {
          // Если используется кастомная цена, отправляем её
          if (useCustomPrice && customPrice) {
            const customPriceNum = parseFloat(customPrice);
            
            return isNaN(customPriceNum) ? 0 : customPriceNum;
          }

          // Иначе рассчитываем автоматически
          if (!selectedTariff) return 0;
          const distance = routeDistance ? Math.round((routeDistance / 1000) * 10) / 10 : 0;
          const basePrice = selectedTariff.basePrice || 0;
          const perKmPrice = selectedTariff.perKmPrice || 0;
          const distancePrice = distance * perKmPrice;
          const servicesPrice = selectedServices.reduce((sum, service) => sum + ((service.price || 0) * (service.quantity || 1)), 0);
          
          return basePrice + distancePrice + servicesPrice;
        })(),
        scheduledTime: (() => {
          const dateValue = methods.getValues('scheduledTime');

          if (dateValue) {
            // Конвертируем в UTC формат для PostgreSQL
            const date = new Date(dateValue);

            return date.toISOString(); // Всегда возвращает UTC
          }

          return new Date().toISOString(); // Текущая дата в UTC
        })(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        passengers: (Array.isArray(methods.getValues('passengers')) ? methods.getValues('passengers') : []).map((passenger: any) => ({
          customerId: passenger.customerId || null,
          firstName: passenger.firstName,
          lastName: passenger.lastName || null,
          isMainPassenger: passenger.isMainPassenger
        })),
        description: methods.getValues('description') || null,
        airFlight: (() => {
          const value = methods.getValues('airFlight');

          return value ? value.toUpperCase().replace(/[^A-Z0-9\s-]/g, '') : null;
        })(),
        flyReis: (() => {
          const value = methods.getValues('flyReis');

          return value ? value.toUpperCase().replace(/[^A-Z0-9\s-]/g, '') : null;
        })(),
        notes: methods.getValues('notes') || null
      };

      // Отправляем или обновляем заказ в зависимости от режима
      if (isEditMode && id) {
        // Добавляем статус для редактирования
        const updateData = {
          ...orderData,
          status: orderStatus
        };
        
        await updateOrder(id, updateData);
      } else {
        // Создаем новый заказ
        await submitOrder(orderData);
      }
    } catch {
      // Ошибка сохранения заказа обрабатывается в хуках
    }
  };

  // routeState уже определен выше

  // Создаем объект pricing для совместимости
  const pricing = {
    selectedServices,
    currentPrice,
    handleServicesChange,
    handlePriceChange,
  };

  const tabs = [
    { id: 'pricing', label: 'Тарифы/Цены', component: TariffPricingTab },
    { id: 'schedule', label: 'Календарь/Даты', component: ScheduleTab },
    { id: 'passengers', label: 'Пассажиры', component: PassengersTab },
    { id: 'map', label: 'Карта', component: MapTab },
    { id: 'services', label: 'Доп. услуги', component: ServicesTab },
    { id: 'summary', label: 'Итоги', component: SummaryTab },
  ];

  // Блокируем рендер до загрузки всех необходимых данных
  const isDataLoading = dataLoading || (isEditMode && isLoadingOrder);

  if (isDataLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-muted-foreground">
            {isEditMode ? 'Загрузка заказа...' : 'Загрузка данных...'}
          </p>
        </div>
      </div>
    );
  }

  if (dataError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Ошибка загрузки данных: {dataError}</p>
          <Button onClick={refetch} variant="outline">
            Попробовать снова
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col border rounded-2xl h-full overflow-hidden bg-white">
      
       {/* Header */}
        <SidebarHeader className="sticky top-0 z-10 bg-gray-50 border-b flex items-start justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Назад
            </Button>
            <div className="text-left">
              <h1 className="text-3xl font-bold tracking-tight text-left">
                {mode === 'create' ? 'Создать' : 'Редактировать'} запланированный заказ
                {mode === 'edit' && orderNumber && (
                  <span className="text-blue-600 ml-2">#{orderNumber}</span>
                )}
              </h1>
              <p className="text-muted-foreground text-left">
                {mode === 'create'
                  ? 'Создание нового запланированного заказа'
                  : `Редактирование заказа ${id}`
                }
              </p>
            </div>
          </div>
        </SidebarHeader>


      <div className="flex flex-col overflow-y-auto pl-4 pr-2 h-full">
       
        {/* Tabs */}
        <Card className="flex-1 h-full">
          <CardContent className='px-0'>
            <div className="w-full h-full">
              <>
                {(() => {
                  const activeTabData = tabs.find(tab => tab.id === activeTab);
                  
                  if (!activeTabData) return null;

                  const TabComponent = activeTabData.component;

                  return (
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    <TabComponent {...({} as any)}
                      // Данные
                      tariffs={tariffs}
                      services={services}
                      users={users}
                      // Состояние маршрута
                      routeState={routeState}
                      routeLocations={routeLocations}
                      routeDistance={routeDistance}
                      // Ценообразование
                      pricing={pricing}
                      selectedServices={selectedServices}
                      currentPrice={currentPrice}
                      // Пассажиры
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      passengers={methods.getValues('passengers') as any[]}
                      handlePassengersChange={handlePassengersChange}
                      // Тариф
                      selectedTariff={activeTab === 'passengers'
                        ? (selectedTariff ? { id: selectedTariff.id, carType: selectedTariff.carType } : undefined)
                        : selectedTariff
                      }
                      setSelectedTariff={setSelectedTariff}
                      onRefreshTariffs={refetchTariffs}
                      isRefreshingTariffs={isRefreshingTariffs}
                      // Обработчики
                      handleServicesChange={handleServicesChange}
                      handlePriceChange={handlePriceChange}
                      // Форма (только для ScheduleTab)
                      onScheduleChange={activeTab === 'schedule' ? (scheduledTime: string) => methods.setValue('scheduledTime', scheduledTime) : undefined}
                      initialScheduledTime={activeTab === 'schedule' ? methods.getValues('scheduledTime') : undefined}
                      // Обработчики для MapTab
                      onRoutePointsChange={mapTabRoutePointsChange}
                      // Состояние водителя для MapTab
                      selectedDriver={selectedDriver}
                      setSelectedDriver={setSelectedDriver}
                      dynamicMapCenter={dynamicMapCenter}
                      setDynamicMapCenter={setDynamicMapCenter}
                      openDriverPopupId={openDriverPopupId}
                      setOpenDriverPopupId={setOpenDriverPopupId}
                      // Состояние маршрута для MapTab
                      routePoints={routePoints}
                      setRoutePoints={setRoutePoints}
                      onRouteDistanceChange={setRouteDistance}
                      // Данные локаций заказа для MapTab
                      startLocationId={methods.getValues('startLocationId')}
                      endLocationId={methods.getValues('endLocationId')}
                      additionalStops={methods.getValues('additionalStops') || []}
                      rides={existingOrder?.rides} // Передаем rides для режима редактирования
                      methods={methods}
                      // Кастомная цена
                      useCustomPrice={useCustomPrice}
                      setUseCustomPrice={setUseCustomPrice}
                      customPrice={customPrice}
                      setCustomPrice={setCustomPrice}
                      // Статус заказа
                      orderStatus={orderStatus}
                      setOrderStatus={setOrderStatus}
                      // Мета
                      mode={mode}
                      orderId={id}
                    />
                  );
                })()}
              </>
            </div>
          </CardContent>
        </Card>
        
      </div>

          {/* Табы и навигация внизу */}
          <div className="border-t bg-gray-50 p-6 overflow-hidden overflow-x-auto">
            <div className="flex items-center justify-between">
              {/* Прогресс и табы слева */}
              <div className="flex items-center gap-6">
                {/* Прогресс бар */}
                <div className="flex items-center gap-3">
                  {tabs.map((tab, index) => {
                    const isActive = activeTab === tab.id;
                    const isCompleted = visitedTabs.has(tab.id) && isTabValid(tab.id) && !isActive;
                    const isAccessible = index <= tabs.findIndex(t => t.id === activeTab);

                    return (
                      <div key={tab.id} className="flex items-center">
                        {/* Кружок с номером или галочкой */}
                        <button
                          onClick={() => isAccessible && goToTab(tab.id)}
                          disabled={!isAccessible}
                          className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                            isActive
                              ? 'bg-primary border-primary text-primary-foreground shadow-sm'
                              : isCompleted
                              ? 'bg-green-500 border-green-500 text-white'
                              : isAccessible
                              ? 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                              : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {isCompleted ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <span className="text-xs font-medium">{index + 1}</span>
                          )}
                        </button>

                        {/* Линия между кружками */}
                        {index < tabs.length - 1 && (
                          <div className={`w-12 h-0.5 mx-2 transition-colors ${
                            index < tabs.findIndex(t => t.id === activeTab)
                              ? 'bg-green-500'
                              : 'bg-gray-200'
                          }`} />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Название текущего шага */}
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">
                    Шаг {tabs.findIndex(t => t.id === activeTab) + 1} из {tabs.length}
                  </p>
                  <p className="text-xs text-gray-500">
                    {tabs.find(t => t.id === activeTab)?.label}
                  </p>
                </div>
              </div>

              {/* Кнопки навигации справа */}
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={goToPreviousTab}
                  disabled={!canGoPrevious()}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Назад
                </Button>

                {activeTab === 'summary' ? (
                  <Button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                    disabled={isSubmittingOrder || isUpdatingOrder}
                  >
                    <Check className="h-4 w-4" />
                    {isEditMode ? 'Обновить заказ' : 'Создать заказ'}
                  </Button>
                ) : (
                  <Button
                    onClick={goToNextTab}
                    disabled={!canGoNext()}
                    className="flex items-center gap-2"
                  >
                    Вперед
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

    </div>
  );
}

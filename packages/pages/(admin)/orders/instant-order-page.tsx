'use client';

import { ArrowLeft, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useCallback, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { GetTariffDTOWithArchived } from '@shared/api/tariffs';
import type { GetLocationDTO } from '@entities/locations/interface';

// Интерфейс для точки маршрута в заказе
interface RoutePoint {
  id: string;
  location: GetLocationDTO | null;
  type: 'start' | 'end' | 'intermediate';
  label: string;
}
import { useOrderData } from '@shared/hooks/useOrderData';
import { Button } from '@shared/ui/forms/button';
import { Card, CardContent } from '@shared/ui/layout/card';
import { SidebarHeader } from '@shared/ui/layout/sidebar';
import { useInstantOrderSubmit, useInstantOrderById } from '@entities/orders/hooks';
import type { PassengerDTO } from '@entities/orders/interface';
import {
  TariffPricingTab,
  MapTab,
} from './tabs';
import { SummaryTab } from './tabs/summary-tab';

// Интерфейс для выбранного сервиса
interface SelectedService {
  serviceId?: string;
  id?: string;
  quantity: number;
  notes?: string | null;
  name?: string;
  price?: number;
}

interface InstantOrderPageProps {
  mode: 'create' | 'edit';
  id?: string; // ID заказа для режима редактирования
}

export function InstantOrderPage({ mode, id }: InstantOrderPageProps) {
  const router = useRouter();

  // React Hook Form для совместимости с MapTab (как в order-page.tsx)
  const methods = useForm<{
    startLocationId: string;
    endLocationId: string;
    additionalStops: string[];
  }>({
    defaultValues: {
      startLocationId: '',
      endLocationId: '',
      additionalStops: [],
    }
  });

  // Загрузка данных заказа для режима редактирования
  const {
    order: orderData,
    isLoading: isLoadingOrder,
    error: orderError
  } = useInstantOrderById(id, { enabled: mode === 'edit' });

  // Состояние активной вкладки
  const [activeTab, setActiveTab] = useState('pricing');

  // Состояние для отслеживания посещенных вкладок
  const [visitedTabs, setVisitedTabs] = useState<Set<string>>(new Set(['pricing']));

  // Состояние для отслеживания выбранных данных
  const [selectedTariff, setSelectedTariff] = useState<GetTariffDTOWithArchived | null>(null);
  const [selectedServices, _setSelectedServices] = useState<SelectedService[]>([]);
  // Убираем состояние passengers - используем дефолтного пассажира
  const [routePoints, setRoutePoints] = useState<RoutePoint[]>([
    { id: '1', location: null, type: 'start', label: 'Откуда' },
    { id: '2', location: null, type: 'end', label: 'Куда' },
  ]);
  const [currentPrice, setCurrentPrice] = useState<number>(0);

  // Состояние для кастомной цены
  const [useCustomPrice, setUseCustomPrice] = useState<boolean>(false);
  const [customPrice, setCustomPrice] = useState<string>('');

  // Состояние для данных маршрута
  const [startLocationId, setStartLocationId] = useState<string | null>(null);
  const [endLocationId, setEndLocationId] = useState<string | null>(null);
  const [additionalStops, setAdditionalStops] = useState<string[]>([]);
  const [routeDistance, setRouteDistance] = useState<number>(0);
  // Состояние загрузки маршрута
  const [routeLoading, setRouteLoading] = useState<boolean>(false);

  // Логируем изменения расстояния
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('🛣️ RouteDistance изменилось:', routeDistance);
  }, [routeDistance]);

  // Убираем useEffect отсюда - переместим после useOrderData

  // Хук для создания заказа
  const { createOrder, isLoading: isCreatingOrder } = useInstantOrderSubmit({
    onSuccess: (order) => {
      // eslint-disable-next-line no-console
      console.log('✅ Моментальный заказ создан успешно:', order);
      
      // Переходим к списку заказов (не админ-панель!)
      router.push('/orders');
    },
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.error('❌ Ошибка создания моментального заказа:', error);
      alert(`Ошибка создания заказа: ${error.message}`);
    },
  });

  // Загружаем данные для заказа
  const {
    tariffs,
    services,
    users,
    isLoading,
    error,
  } = useOrderData();

  // Инициализация состояний из данных заказа при загрузке
  useEffect(() => {
    if (mode === 'edit' && orderData && tariffs.length > 0) {
      // eslint-disable-next-line no-console
      console.log('🔄 Инициализируем состояния из данных заказа:', orderData);

      // 1. Устанавливаем выбранный тариф
      if (orderData.tariffId) {
        const foundTariff = tariffs.find(t => t.id === orderData.tariffId);

        if (foundTariff) {
          setSelectedTariff(foundTariff);
        }
      }

      // 2. Пассажиры теперь дефолтные - не инициализируем

      // 3. Устанавливаем цену
      if (orderData.initialPrice) {
        setCurrentPrice(orderData.initialPrice);
      }

      // 4. Устанавливаем локации маршрута (КАК В order-page.tsx!)
      if (orderData.startLocationId) {
        setStartLocationId(orderData.startLocationId);
        methods.setValue('startLocationId', orderData.startLocationId); // ДЛЯ MapTab!
      }

      if (orderData.endLocationId) {
        setEndLocationId(orderData.endLocationId);
        methods.setValue('endLocationId', orderData.endLocationId); // ДЛЯ MapTab!
      }

      if (orderData.additionalStops) {
        setAdditionalStops(orderData.additionalStops);
        methods.setValue('additionalStops', orderData.additionalStops); // ДЛЯ MapTab!
      }

      // 5. Принудительно обновляем routePoints для инициализации в MapTab
      // Это заставит useOrderLocations перезапустить инициализацию
      if (routePoints.length === 0) {
        // eslint-disable-next-line no-console
        console.log('🗺️ Принудительно сбрасываем routePoints для инициализации:', {
          startLocationId: orderData.startLocationId,
          endLocationId: orderData.endLocationId,
          additionalStops: orderData.additionalStops,
          mode
        });

        // Сбрасываем routePoints, чтобы useOrderLocations заново их инициализировал
        setRoutePoints([]);
      }
    }
  }, [mode, orderData, tariffs, routePoints.length, methods]);

  // Определяем доступные вкладки для моментального заказа (без расписания, пассажиров и доп. услуг)
  const tabs = [
    { id: 'pricing', label: 'Тарифы/Цены', component: TariffPricingTab },
    { id: 'map', label: 'Карта', component: MapTab },
    { id: 'summary', label: 'Итоги', component: SummaryTab },
  ];

  // Обработчики изменения данных
  const handleTariffChange = useCallback((tariff: GetTariffDTOWithArchived | null) => {
    setSelectedTariff(tariff);
  }, []);



  // Убираем handlePassengersChange - пассажиры теперь дефолтные

  const handleRouteChange = useCallback((newRoutePoints: RoutePoint[]) => {
    setRoutePoints(newRoutePoints);

    // Обновляем состояния локаций для сохранения между табами
    const startPoint = newRoutePoints.find(p => p.type === 'start');
    const endPoint = newRoutePoints.find(p => p.type === 'end');
    const intermediatePoints = newRoutePoints.filter(p => p.type === 'intermediate');

    setStartLocationId(startPoint?.location?.id || null);
    setEndLocationId(endPoint?.location?.id || null);
    setAdditionalStops(intermediatePoints.map(p => p.location?.id).filter(Boolean) as string[]);
  }, []);



  // Функции валидации табов
  const isTabValid = (tabId: string): boolean => {
    switch (tabId) {
      case 'pricing':
        return !!selectedTariff;
      // Убираем case 'passengers' - пассажиры теперь всегда валидны
      case 'map':
        // Проверяем что выбраны точки маршрута
        // Если маршрут загружается, блокируем переход
        if (routeLoading) {
          return false;
        }

        // Должны быть выбраны точки (расстояние не обязательно - может быть ошибка API)
        return routePoints.length >= 2;
      case 'summary':
        return !!isReadyToCreate;
      default:
        return false;
    }
  };

  // Функции навигации между табами
  const goToTab = (tabId: string) => {
    setActiveTab(tabId);
    setVisitedTabs(prev => new Set([...prev, tabId]));
  };

  const goToNextTab = () => {
    // Специальная обработка для таба map - показываем toast если нет расстояния
    if (activeTab === 'map' && (!routeDistance || routeDistance === 0)) {
      toast.error('Не удалось рассчитать расстояние', {
        description: 'API роутинга недоступен. На следующем шаге потребуется ввести цену вручную.',
        duration: 5000,
      });
    }

    // Проверяем валидность текущего таба перед переходом
    if (!isTabValid(activeTab)) {
      // Показываем специфичные сообщения для каждого таба
      switch (activeTab) {
        case 'pricing':
          toast.error('Выберите тариф', {
            description: 'Для продолжения необходимо выбрать тариф'
          });
          break;
        case 'passengers':
          toast.error('Добавьте пассажиров', {
            description: 'Для продолжения необходимо добавить хотя бы одного пассажира'
          });
          break;
        case 'map':
          if (routeLoading) {
            toast.error('Маршрут загружается', {
              description: 'Дождитесь завершения расчета маршрута'
            });
          } else {
            toast.error('Постройте маршрут', {
              description: 'Для продолжения необходимо выбрать точки отправления и назначения'
            });
          }
          break;
        default:
          toast.error('Заполните обязательные поля', {
            description: 'Для продолжения необходимо заполнить все обязательные поля'
          });
      }

      return;
    }

    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);

    if (currentIndex < tabs.length - 1) {
      const nextTab = tabs[currentIndex + 1];

      goToTab(nextTab.id);
    }
  };

  const goToPreviousTab = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);

    if (currentIndex > 0) {
      const prevTab = tabs[currentIndex - 1];

      goToTab(prevTab.id);
    }
  };

  const canGoNext = (): boolean => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);

    return currentIndex < tabs.length - 1 && isTabValid(activeTab);
  };

  const canGoPrevious = (): boolean => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);

    return currentIndex > 0;
  };

  const handleBack = () => {
    router.push('/orders');
  };

  // Автоматический расчет цены при изменении тарифа или расстояния
  useEffect(() => {
    if (selectedTariff && routeDistance > 0) {
      // Рассчитываем цену ТОЧНО ТАК ЖЕ как в summary-tab.tsx
      const apiDistanceKm = routeDistance / 1000;
      const roundedDistanceKm = Math.round(apiDistanceKm * 10) / 10; // ТАКОЕ ЖЕ ОКРУГЛЕНИЕ!
      const calculatedPrice = selectedTariff.basePrice + (roundedDistanceKm * selectedTariff.perKmPrice);

      setCurrentPrice(Math.round(calculatedPrice));

      // eslint-disable-next-line no-console
      console.log('💰 Рассчитана цена (как в summary-tab):', {
        basePrice: selectedTariff.basePrice,
        rawDistanceKm: apiDistanceKm.toFixed(3),
        roundedDistanceKm: roundedDistanceKm,
        perKmPrice: selectedTariff.perKmPrice,
        totalPrice: Math.round(calculatedPrice)
      });
    } else if (selectedTariff && routeDistance === 0) {
      // Если нет расстояния, используем только базовую цену
      setCurrentPrice(selectedTariff.basePrice);

      // eslint-disable-next-line no-console
      console.log('💰 Используем базовую цену (нет расстояния):', selectedTariff.basePrice);
    } else {
      // Если нет тарифа, цена = 0
      setCurrentPrice(0);
    }
  }, [selectedTariff, routeDistance]);

  // Проверка готовности к созданию заказа (убираем проверку пассажиров)
  const isReadyToCreate = useMemo(() => {
    return (
      selectedTariff &&
      routePoints.length >= 2 &&
      currentPrice > 0
    );
  }, [selectedTariff, routePoints, currentPrice]);

  // Создание заказа
  const handleSave = async () => {
    if (!isReadyToCreate) {
      // eslint-disable-next-line no-console
      console.warn('Не все обязательные поля заполнены');

      return;
    }

    try {
      // Формируем данные для создания заказа
      const orderData = {
        tariffId: selectedTariff!.id,
        routeId: null, // Для моментальных заказов обычно не используется
        startLocationId,
        endLocationId,
        additionalStops,
        services: selectedServices
          .filter((service: SelectedService) => service.serviceId || service.id)
          .map((service: SelectedService) => ({
            serviceId: service.serviceId || service.id!,
            quantity: service.quantity || 1,
            notes: service.notes || null,
          })),
        initialPrice: currentPrice,
        passengers: [
          {
            customerId: null,
            firstName: "",
            lastName: null,
            isMainPassenger: true
          }
        ],
        paymentId: null, // Для мгновенных заказов пока null
      };

      // eslint-disable-next-line no-console
      console.log('📦 Создаем моментальный заказ:', orderData);

      // Создаем заказ
      createOrder(orderData);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('❌ Ошибка при создании заказа:', error);
    }
  };

  if (isLoading || isLoadingOrder) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
          <div>{mode === 'edit' ? 'Загрузка заказа...' : 'Загрузка данных...'}</div>
        </div>
      </div>
    );
  }

  if (error || orderError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-red-600">
          <div className="text-lg font-semibold mb-2">Ошибка загрузки</div>
          <div>{error || orderError?.message}</div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col border rounded-2xl h-full overflow-hidden bg-white'>
      {/* Header */}
      <SidebarHeader className='sticky top-0 z-10 bg-gray-50 border-b flex items-start justify-between px-4 py-4 flex-row'>
        <div className='flex items-center gap-4'>
          <Button variant='ghost' size='sm' onClick={handleBack} className='gap-2'>
            <ArrowLeft className='h-4 w-4' />
            Назад
          </Button>
          <div className='text-left'>
            <h1 className='text-3xl font-bold tracking-tight text-left'>
              {mode === 'edit' ? 'Редактировать мгновенный заказ' : 'Создать моментальный заказ'}
            </h1>
            <p className='text-gray-600 mt-1'>
              {mode === 'edit' ? 'Изменение данных мгновенного заказа' : 'Заказ будет выполнен немедленно'}
            </p>
          </div>
        </div>

        {/* Кнопки действий */}

      </SidebarHeader>

      <div className='flex flex-col overflow-y-auto pl-4 pr-2 h-full'>
        {/* Tabs */}
        <Card className='flex-1 h-full'>
          <CardContent className='px-0'>
            <div className='w-full h-full'>
              {(() => {
                  const activeTabData = tabs.find(tab => tab.id === activeTab);

                  if (!activeTabData) return null;

                  // Специфичные пропсы для каждого компонента
                  switch (activeTab) {
                    case 'pricing':
                      return (
                        <TariffPricingTab
                          tariffs={tariffs}
                          selectedTariff={selectedTariff}
                          setSelectedTariff={handleTariffChange}
                        />
                      );

                    case 'map':
                      return (
                        <MapTab
                          mode={mode}
                          onRouteChange={handleRouteChange}
                          // ИСПОЛЬЗУЕМ methods КАК В order-page.tsx!
                          startLocationId={methods.getValues('startLocationId')}
                          endLocationId={methods.getValues('endLocationId')}
                          additionalStops={methods.getValues('additionalStops')}
                          // Состояние маршрута для сохранения между табами
                          routePoints={routePoints}
                          setRoutePoints={setRoutePoints}
                          onRouteDistanceChange={setRouteDistance}
                          onRouteLoadingChange={setRouteLoading}
                          // Для моментальных заказов показываем всех доступных водителей с радиусом
                          showDriverRadius
                          isInstantOrder
                        />
                      );



                    // Убираем case 'passengers' - пассажиры теперь дефолтные



                    case 'summary':
                      return (
                        <SummaryTab
                          tariffs={tariffs}
                          services={services}
                          users={users}
                          routeState={{
                            routePoints: routePoints
                          }}
                          pricing={{}}
                          selectedTariff={selectedTariff}
                          selectedServices={selectedServices}
                          currentPrice={currentPrice}
                          passengers={[
                            {
                              customerId: null,
                              firstName: "",
                              lastName: null,
                              isMainPassenger: true
                            }
                          ]}
                          routeLocations={[]}
                          routeDistance={routeDistance > 0 ? routeDistance : undefined} // Реальное расстояние маршрута
                          methods={{
                            setValue: () => {},
                            getValues: (key?: string) => {
                              if (key === 'scheduledTime') return new Date(); // Текущее время для моментального заказа
                              if (key === 'departureTime') return 'Немедленно'; // Для моментальных заказов
                              if (key === 'description') return 'Моментальный заказ';

                              return '';
                            }
                          }}
                          mode={mode}
                          orderId={undefined}
                          isInstantOrder
                          useCustomPrice={useCustomPrice}
                          setUseCustomPrice={setUseCustomPrice}
                          customPrice={customPrice}
                          setCustomPrice={setCustomPrice}
                        />
                      );

                    default:
                      return <div>Компонент не найден</div>;
                  }
                })()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Футер с прогресс-баром */}
      <div className='sticky bottom-0 bg-white border-t border-gray-200 px-4 py-3'>
        <div className='flex items-center justify-between'>
          {/* Прогресс бар */}
          <div className='flex items-center gap-3'>
            {tabs.map((tab, index) => {
              const isActive = activeTab === tab.id;
              const isCompleted = visitedTabs.has(tab.id) && isTabValid(tab.id) && !isActive;
              const isAccessible = index <= tabs.findIndex(t => t.id === activeTab);

              return (
                <div key={tab.id} className='flex items-center'>
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
                      <Check className='h-4 w-4' />
                    ) : (
                      <span className='text-xs font-medium'>{index + 1}</span>
                    )}
                  </button>

                  {/* Линия между кружками */}
                  {index < tabs.length - 1 && (
                    <div
                      className={`w-12 h-0.5 mx-2 transition-colors ${
                        index < tabs.findIndex(t => t.id === activeTab)
                          ? 'bg-green-500'
                          : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Название текущего шага */}
          <div className='ml-4'>
            <p className='text-sm font-medium text-gray-900'>
              Шаг {tabs.findIndex(t => t.id === activeTab) + 1} из {tabs.length}
            </p>
            <p className='text-xs text-gray-500'>{tabs.find(t => t.id === activeTab)?.label}</p>
          </div>

          {/* Кнопки навигации справа */}
          <div className='flex items-center gap-3'>
            <Button
              variant='outline'
              onClick={goToPreviousTab}
              disabled={!canGoPrevious()}
              className='flex items-center gap-2'
            >
              <ChevronLeft className='h-4 w-4' />
              Назад
            </Button>

            {activeTab === 'summary' ? (
              <Button
                onClick={handleSave}
                className='flex items-center gap-2 bg-green-600 hover:bg-green-700'
                disabled={isCreatingOrder}
              >
                <Check className='h-4 w-4' />
                {isCreatingOrder
                  ? (mode === 'edit' ? 'Сохранение...' : 'Создание...')
                  : (mode === 'edit' ? 'Сохранить изменения' : 'Создать заказ')
                }
              </Button>
            ) : (
              <Button
                onClick={goToNextTab}
                className={`flex items-center gap-2 ${!canGoNext() ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Вперед
                <ChevronRight className='h-4 w-4' />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

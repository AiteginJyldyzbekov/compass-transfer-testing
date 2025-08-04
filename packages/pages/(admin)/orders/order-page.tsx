'use client';

import { ArrowLeft, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import type { GetTariffDTOWithArchived } from '@shared/api/tariffs';
import type { RoutePoint } from '@shared/components/map/types';
import { useOrderData } from '@shared/hooks/useOrderData';
import { Button } from '@shared/ui/forms/button';
import { Card, CardContent } from '@shared/ui/layout/card';
import { SidebarHeader } from '@shared/ui/layout/sidebar';
import type { GetLocationDTO } from '@entities/locations/interface';
import { orderStatusLabels } from '@entities/orders/constants/order-status-labels';
import {
  useScheduledOrderSubmit,
  useGetScheduledOrder,
  useUpdateScheduledOrder,
  useScheduledRideSubmit,
} from '@entities/orders/hooks';
import type { PassengerDTO } from '@entities/orders/interface';
import type { GetDriverDTO } from '@entities/users/interface';
import {
  TariffPricingTab,
  ScheduleTab,
  PassengersTab,
  MapTab,
  ServicesTab,
  SummaryTab,
} from './tabs';

// Интерфейс для точки маршрута в форме заказа
interface OrderRoutePoint {
  id: string;
  location: GetLocationDTO | null;
  type: 'start' | 'end' | 'intermediate';
  label: string;
}

// Расширенный интерфейс для RoutePoint с location
interface RoutePointWithLocation extends RoutePoint {
  location?: GetLocationDTO;
}

// Тип для сервиса в selectedServices (может быть как GetOrderServiceDTO, так и GetServiceDTO с quantity)
interface SelectedService {
  serviceId?: string;
  id?: string;
  quantity: number;
  notes?: string | null;
  name?: string;
  price?: number;
}

interface OrderPageProps {
  mode: 'create' | 'edit';
  id?: string;
  initialTariffId?: string;
  userRole?: 'admin' | 'operator' | 'partner' | 'driver';
}

export function OrderPage({ mode, id, initialTariffId, userRole = 'operator' }: OrderPageProps) {
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
        // Проверяем что заполнены дата и время И время валидно (не в прошлом)
        const scheduledTime = methods.getValues('scheduledTime');

        return !!scheduledTime && scheduledTime.trim() !== '' && scheduleValid;
      case 'passengers':
        // Проверяем что есть хотя бы один пассажир
        const passengers = methods.getValues('passengers');

        return Array.isArray(passengers) && passengers.length > 0;
      case 'map':
        // Проверяем что выбраны точки маршрута
        const startLocation = methods.getValues('startLocationId');
        const endLocation = methods.getValues('endLocationId');

        // Если маршрут загружается, блокируем переход
        if (routeLoading) {
          return false;
        }

        // Должны быть выбраны точки (расстояние не обязательно - может быть ошибка API)
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
        case 'schedule':
          if (!scheduleValid) {
            toast.error('Время в прошлом', {
              description: 'Выберите время минимум через 5 минут от текущего времени'
            });
          } else {
            toast.error('Заполните расписание', {
              description: 'Для продолжения необходимо указать дату и время поездки'
            });
          }
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
        case 'services':
          // Услуги опциональны, не показываем ошибку
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
    refetchTariffs,
  } = useOrderData();
  // Создаем состояние для хранения данных формы
  const [formData, setFormData] = useState({
    scheduledTime: '',
    departureTime: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    airFlight: '',
    flyReis: '',
    description: '',
    notes: '',
    passengers: [] as any[],
    startLocationId: '',
    endLocationId: '',
    additionalStops: [] as string[],
    routePoints: [] as any[],
  });

  // Состояние для карты и водителя (сохраняется между шагами)
  const [selectedDriver, setSelectedDriver] = useState<any>(null);
  // Изначальный водитель заказа (для отслеживания изменений в режиме редактирования)
  const [originalDriver, setOriginalDriver] = useState<any>(null);
  const [dynamicMapCenter, setDynamicMapCenter] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [openDriverPopupId, setOpenDriverPopupId] = useState<string | null>(null);

  // Кэш данных водителей (сохраняется между табами)
  const [driversDataCache, setDriversDataCache] = useState<Record<string, GetDriverDTO>>({});

  // Функции для работы с кэшем водителей
  const getDriverById = useCallback(
    (id: string): GetDriverDTO | null => {
      return driversDataCache[id] || null;
    },
    [driversDataCache],
  );

  const updateDriverCache = useCallback((id: string, data: GetDriverDTO) => {
    setDriversDataCache(prev => ({
      ...prev,
      [id]: data,
    }));
  }, []);

  // Состояние маршрута (сохраняется между шагами)
  const [routePoints, setRoutePoints] = useState<OrderRoutePoint[]>([
    { id: '1', location: null, type: 'start', label: 'Откуда' },
    { id: '2', location: null, type: 'end', label: 'Куда' },
  ]);

  // Состояние расстояния маршрута (в метрах)
  const [routeDistance, setRouteDistance] = useState<number>(0);
  // Состояние загрузки маршрута
  const [routeLoading, setRouteLoading] = useState<boolean>(false);
  // Состояние валидности времени в schedule-tab
  const [scheduleValid, setScheduleValid] = useState<boolean>(true);

  // Состояние для кастомной цены
  const [useCustomPrice, setUseCustomPrice] = useState<boolean>(false);
  const [customPrice, setCustomPrice] = useState<string>('');

  // Состояние для статуса заказа (для редактирования)
  const [orderStatus, setOrderStatus] = useState<
    'Pending' | 'Scheduled' | 'InProgress' | 'Completed' | 'Cancelled' | 'Expired'
  >('Pending');
  const [originalOrderStatus, setOriginalOrderStatus] = useState<
    'Pending' | 'Scheduled' | 'InProgress' | 'Completed' | 'Cancelled' | 'Expired'
  >('Pending');

  const methods = useMemo(
    () => ({
      getValues: (key?: string): any => {
        if (key) {
          return formData[key as keyof typeof formData];
        }

        return formData;
      },
      setValue: (key: string, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
      },
    }),
    [formData],
  );

  const routeLocations = useMemo(
    () => [
      { id: '1', name: 'Аэропорт Манас', address: 'Аэропорт Манас, Бишкек' },
      { id: '2', name: 'Центр города', address: 'пр. Чуй, Бишкек' },
    ],
    [],
  );

  // Создаем объект routeState для совместимости с существующими компонентами
  const routeState = useMemo(
    () => ({
      routeLocations: routeLocations || [],
      flatLocations: routeLocations || [],
      routePoints: routePoints, // Используем реальные точки маршрута

      addLocationSmart: (_location: any) => {
        // Функция для добавления локации
      },
      selectLocationForPoint: (_location: any, _pointIndex: number) => {
        // Функция для выбора локации для точки
      },
      removeRoutePoint: (_index: number) => {
        // Функция для удаления точки маршрута
      },
    }),
    [routeLocations, routePoints],
  );

  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
  const [currentPrice, setCurrentPrice] = useState(200);
  const [selectedTariff, setSelectedTariff] = useState<GetTariffDTOWithArchived | null>(null);

  // Автоматический выбор тарифа при создании заказа
  useEffect(() => {
    if (mode === 'create' && initialTariffId && tariffs.length > 0 && !selectedTariff) {
      const foundTariff = tariffs.find(t => t.id === initialTariffId);
      if (foundTariff && !foundTariff.archived) {
        setSelectedTariff(foundTariff);
        // Автоматически переключаемся на таб тарифов, чтобы показать выбранный тариф
        setActiveTab('pricing');
        setVisitedTabs(prev => new Set([...prev, 'pricing']));
      }
    }
  }, [mode, initialTariffId, tariffs, selectedTariff]);

  const handlePassengersChange = (newPassengers: any[]) => {
    // Обновляем форму с новыми пассажирами
    methods.setValue('passengers', newPassengers);
    // Принудительно обновляем состояние для перерендера
    setFormData(prev => ({ ...prev, passengers: newPassengers }));
  };

  const handleRoutePointsChange = useCallback(
    (startLocationId: string, endLocationId: string, routePoints: RoutePointWithLocation[]) => {
      // Извлекаем ID промежуточных точек
      const additionalStops = routePoints
        .filter(p => p.type === 'intermediate' && p.location)
        .map(p => p.location!.id);

      // Проверяем, изменились ли данные
      const currentData = methods.getValues();

      if (
        currentData.startLocationId === startLocationId &&
        currentData.endLocationId === endLocationId &&
        JSON.stringify(currentData.additionalStops || []) === JSON.stringify(additionalStops) &&
        JSON.stringify(currentData.routePoints) === JSON.stringify(routePoints)
      ) {
        return; // Данные не изменились, не обновляем
      }

      // Обновляем форму с новыми точками маршрута И additionalStops
      setFormData(prev => ({
        ...prev,
        startLocationId,
        endLocationId,
        additionalStops, // ✅ Теперь обновляем additionalStops!
        routePoints,
      }));

      // Также обновляем форму через methods для синхронизации
      methods.setValue('startLocationId', startLocationId);
      methods.setValue('endLocationId', endLocationId);
      methods.setValue('additionalStops', additionalStops);
    },
    [methods],
  );

  // Мемоизируем callback для MapTab
  const mapTabRoutePointsChange = useMemo(
    () => (activeTab === 'map' ? handleRoutePointsChange : undefined),
    [activeTab, handleRoutePointsChange],
  );

  // Функция для определения, нужно ли назначать водителя в режиме редактирования
  const shouldAssignDriverInEditMode = useCallback(() => {
    if (!isEditMode) {
      return false;
    }

    // Если изначально водителя не было, но теперь выбран
    if (!originalDriver && selectedDriver) {
      return true;
    }

    // Если водитель был изменен на другого
    if (originalDriver && selectedDriver && originalDriver.id !== selectedDriver.id) {
      return true;
    }

    return false;
  }, [isEditMode, originalDriver, selectedDriver]);

  const handleServicesChange = (newServices: SelectedService[]) => {
    setSelectedServices(newServices);
  };

  const handlePriceChange = (newPrice: number) => {
    setCurrentPrice(newPrice);
  };

  // Состояние для отслеживания, что данные уже загружены
  const [isOrderDataLoaded, setIsOrderDataLoaded] = useState(false);

  // Хук для загрузки заказа при редактировании
  const { order: existingOrder, isLoading: isLoadingOrder, refetch: _refetchOrder } = useGetScheduledOrder(
    isEditMode ? id : null,
    {
      enabled: isEditMode,
    },
  );

  // Отладочная информация
  useEffect(() => {
    if (isEditMode) {
      // eslint-disable-next-line no-console
      console.log('📝 OrderPage: Режим редактирования', {
        id,
        isLoadingOrder,
        hasExistingOrder: !!existingOrder,
        orderNumber: existingOrder?.orderNumber
      });
    }
  }, [isEditMode, id, isLoadingOrder, existingOrder]);

  // Получаем номер заказа для отображения в заголовке
  const orderNumber = existingOrder?.orderNumber || '';

  // Заполняем данные заказа при загрузке (только один раз)
  useEffect(() => {
    if (existingOrder && !isOrderDataLoaded && tariffs.length > 0 && services.length > 0) {
      // 1. Заполняем основные поля
      const currentStatus = existingOrder.status as any;

      setOrderStatus(currentStatus);
      setOriginalOrderStatus(currentStatus); // Сохраняем оригинальный статус
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
        const selectedServicesFromOrder = existingOrder.services
          .map(orderService => {
            const foundService = services.find(s => s.id === orderService.serviceId);

            if (foundService) {
              return {
                ...foundService,
                serviceId: foundService.id, // Добавляем serviceId для совместимости
                quantity: orderService.quantity,
                notes: orderService.notes,
              };
            }

            return null;
          })
          .filter(Boolean);

        setSelectedServices(selectedServicesFromOrder as SelectedService[]);
      }

      // Отмечаем, что данные загружены
      setIsOrderDataLoaded(true);

      // 5. Загружаем и устанавливаем водителя (если есть)
      if (existingOrder.rides && existingOrder.rides.length > 0) {
        const firstRide = existingOrder.rides[0];

        if (firstRide.driverId) {
          // Загружаем данные водителя по ID
          const driverData = getDriverById(firstRide.driverId);

          if (driverData) {
            setSelectedDriver(driverData);
            setOriginalDriver(driverData);
          } else {
            // Если данных водителя нет в кэше, загружаем их
          }
        }
      }

      // TODO: 6. Загрузить и установить локации по ID
    }
  }, [existingOrder, isOrderDataLoaded, tariffs, services, methods, getDriverById]);

  // Хук для отправки/обновления заказа
  const {
    submitOrder,
    isLoading: isSubmittingOrder,
    error: submitError,
  } = useScheduledOrderSubmit({
    onSuccess: _order => {
      // Не переходим сразу к списку заказов, если нужно назначить водителя
      // Переход происходит после назначения водителя или если водитель не выбран
      if (!selectedDriver) {
        router.push('/orders');
      }
    },
    onError: _error => {
      // Обработка ошибки создания заказа
    },
  });

  // Хук для обновления заказа
  const { updateOrder, isLoading: isUpdatingOrder } = useUpdateScheduledOrder({
    onSuccess: _order => {
      // Не переходим сразу к списку заказов, если нужно назначить водителя
      if (!shouldAssignDriverInEditMode()) {
        router.push('/orders');
      }
    },
    onError: _error => {
      // Обработка ошибки обновления заказа
    },
  });

  // Хук для назначения водителя на заказ
  const { assignDriver, isLoading: isAssigningDriver } = useScheduledRideSubmit({
    onSuccess: _ride => {
      // Водитель успешно назначен, переходим к списку заказов
      router.push('/orders');
    },
    onError: _error => {
      // Обработка ошибки назначения водителя
    },
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
      const routePointsWithLocations = routePoints.filter(point => point.location);

      // Формируем данные для отправки согласно API
      const orderData = {
        tariffId: selectedTariff?.id || '',
        routeId: null,
        startLocationId: routePointsWithLocations[0]?.location?.id || null,
        endLocationId: routePointsWithLocations[routePointsWithLocations.length - 1]?.location?.id || null,
        additionalStops: routePointsWithLocations
          .slice(1, -1)
          .map(point => point.location!.id),
        services: selectedServices
          .filter((service: SelectedService) => service.serviceId || service.id) // Фильтруем сервисы без ID
          .map((service: SelectedService) => ({
            serviceId: service.serviceId || service.id!, // Используем serviceId или id
            quantity: service.quantity || 1,
            notes: service.notes || null,
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
          const servicesPrice = selectedServices.reduce(
            (sum, service) => sum + (service.price || 0) * (service.quantity || 1),
            0,
          );

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
        passengers: (Array.isArray(methods.getValues('passengers'))
          ? methods.getValues('passengers')
          : []
        ).map((passenger: PassengerDTO) => ({
          customerId: passenger.customerId || null,
          firstName: passenger.firstName,
          lastName: passenger.lastName || null,
          isMainPassenger: passenger.isMainPassenger,
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
        notes: methods.getValues('notes') || null,
      };

      // Отправляем или обновляем заказ в зависимости от режима
      if (isEditMode && id) {
        // Добавляем статус для редактирования
        const updateData = {
          ...orderData,
          status: orderStatus,
        };

        await updateOrder(id, updateData);

        // В режиме редактирования назначаем водителя только если нужно
        if (shouldAssignDriverInEditMode()) {
          const carId = selectedDriver.activeCar?.id || selectedDriver.activeCarId;

          if (!carId) {
            throw new Error('У выбранного водителя нет активного автомобиля');
          }

          const rideData = {
            driverId: selectedDriver.id,
            carId: carId,
            waypoints: [], // Пока waypoints не реализованы
          };

          // Назначаем водителя на обновленный заказ
          await assignDriver(id, rideData);
        }
      } else {
        // Создаем новый заказ
        const createdOrder = await submitOrder(orderData);

        // Если выбран водитель, назначаем его на заказ
        if (selectedDriver && createdOrder?.id) {
          const carId = selectedDriver.activeCar?.id || selectedDriver.activeCarId;

          if (!carId) {
            throw new Error('У выбранного водителя нет активного автомобиля');
          }

          const rideData = {
            driverId: selectedDriver.id,
            carId: carId,
            waypoints: [], // Пока waypoints не реализованы
          };

          // Назначаем водителя на созданный заказ
          await assignDriver(createdOrder.id, rideData);
        }
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
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4' />
          <p className='text-muted-foreground'>
            {isEditMode ? 'Загрузка заказа...' : 'Загрузка данных...'}
          </p>
        </div>
      </div>
    );
  }

  if (dataError) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <p className='text-red-600 mb-4'>Ошибка загрузки данных: {dataError}</p>
          <Button onClick={refetch} variant='outline'>
            Попробовать снова
          </Button>
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
              {mode === 'create' ? 'Создать' : 'Редактировать'} запланированный заказ
              {mode === 'edit' && orderNumber && (
                <span className='text-blue-600 ml-2'>#{orderNumber}</span>
              )}
            </h1>
            <p className='text-muted-foreground text-left'>
              {mode === 'create'
                ? 'Создание нового запланированного заказа'
                : `Редактирование заказа ${id}`}
            </p>
          </div>
        </div>

        {/* Статус заказа справа (только для редактирования) */}
        {mode === 'edit' && (
          <div className='flex flex-col justify-end items-end'>
          <div className='flex flex-row items-end gap-3'>
            <div className='text-sm text-muted-foreground'>Статус заказа</div>
          </div>

          {/* Выбор нового статуса */}
          <div className='flex flex-row items-end gap-3'>
            <div className='flex flex-row gap-2'>
              <div className='flex flex-row items-center gap-3 justify-center'>
                {orderStatus !== originalOrderStatus && (
                  <div className='flex items-center gap-2 text-xs'>
                    <span className='text-muted-foreground'>Изменить на:</span>
                  </div>
                )}
                <select
                  value={orderStatus}
                  onChange={e => {
                    setOrderStatus(
                      e.target.value as
                        | 'Pending'
                        | 'Scheduled'
                        | 'InProgress'
                        | 'Completed'
                        | 'Cancelled'
                        | 'Expired',
                    );
                  }}
                  className='px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[220px]'
                >
                  <option value='Pending'>{orderStatusLabels.Pending}</option>
                  <option value='Scheduled'>{orderStatusLabels.Scheduled}</option>
                  <option value='InProgress'>{orderStatusLabels.InProgress}</option>
                  <option value='Completed'>{orderStatusLabels.Completed}</option>
                  <option value='Cancelled'>{orderStatusLabels.Cancelled}</option>
                  <option value='Expired'>{orderStatusLabels.Expired}</option>
                </select>
              </div>
            </div>
          </div>
          </div>

        )}
      </SidebarHeader>

      <div className='flex flex-col overflow-y-auto pl-4 pr-2 h-full'>
        {/* Tabs */}
        <Card className='flex-1 h-full'>
          <CardContent className='px-0'>
            <div className='w-full h-full'>
              <>
                {(() => {
                  const activeTabData = tabs.find(tab => tab.id === activeTab);

                  if (!activeTabData) return null;

                  const TabComponent = activeTabData.component;

                  return (
                    <TabComponent
                      {...({} as Record<string, unknown>)}
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
                      passengers={methods.getValues('passengers') as any[]}
                      handlePassengersChange={handlePassengersChange}
                      userRole={userRole}
                      // Тариф
                      selectedTariff={
                        activeTab === 'passengers'
                          ? selectedTariff
                            ? { id: selectedTariff.id, carType: selectedTariff.carType }
                            : undefined
                          : selectedTariff
                      }
                      setSelectedTariff={setSelectedTariff}
                      onRefreshTariffs={refetchTariffs}
                      isRefreshingTariffs={isRefreshingTariffs}
                      initialTariffId={initialTariffId}
                      // Обработчики
                      handleServicesChange={handleServicesChange}
                      handlePriceChange={handlePriceChange}
                      // Форма (только для ScheduleTab)
                      onScheduleChange={
                        activeTab === 'schedule'
                          ? (scheduledTime: string) =>
                              methods.setValue('scheduledTime', scheduledTime)
                          : undefined
                      }
                      onValidityChange={
                        activeTab === 'schedule' ? setScheduleValid : undefined
                      }
                      initialScheduledTime={
                        activeTab === 'schedule' ? methods.getValues('scheduledTime') : undefined
                      }
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
                      onRouteLoadingChange={setRouteLoading}
                      // Данные локаций заказа для MapTab
                      startLocationId={methods.getValues('startLocationId')}
                      endLocationId={methods.getValues('endLocationId')}
                      additionalStops={(() => {
                        const stops = isEditMode && existingOrder?.additionalStops
                          ? existingOrder.additionalStops
                          : methods.getValues('additionalStops') || [];

                        // eslint-disable-next-line no-console
                        console.log('🗺️ MapTab additionalStops:', {
                          isEditMode,
                          existingOrderStops: existingOrder?.additionalStops,
                          formStops: methods.getValues('additionalStops'),
                          finalStops: stops
                        });

                        return stops;
                      })()}
                      rides={existingOrder?.rides} // Передаем rides для режима редактирования
                      methods={methods}
                      // Кастомная цена
                      useCustomPrice={useCustomPrice}
                      setUseCustomPrice={setUseCustomPrice}
                      customPrice={customPrice}
                      setCustomPrice={setCustomPrice}
                      // Мета
                      mode={mode}
                      orderId={id}
                      // Переключение табов (только для SummaryTab)
                      onTabChange={activeTab === 'summary' ? setActiveTab : undefined}
                      // Функции для работы с водителями (для MapTab и SummaryTab)
                      getDriverById={getDriverById}
                      updateDriverCache={updateDriverCache}
                    />
                  );
                })()}
              </>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Табы и навигация внизу */}
      <div className='border-t bg-gray-50 p-6 overflow-hidden overflow-x-auto'>
        <div className='flex items-center justify-between'>
          {/* Прогресс и табы слева */}
          <div className='flex items-center gap-6'>
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
                disabled={isSubmittingOrder || isUpdatingOrder || isAssigningDriver}
              >
                <Check className='h-4 w-4' />
                {isAssigningDriver
                  ? 'Назначение водителя...'
                  : isEditMode
                    ? 'Обновить заказ'
                    : 'Создать заказ'}
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

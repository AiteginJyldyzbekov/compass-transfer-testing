'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { driverQueueApi } from '@shared/api/driver-queue';
import { driverOrderApi } from '@shared/api/orders';
import { ridesApi } from '@shared/api/rides/rides-api';
import type { SignalREventData } from '@shared/hooks/signal/types';
import { useSignalR } from '@shared/hooks/signal/useSignalR';
import { Button } from '@shared/ui/forms/button';
import { OrderStatus } from '@entities/orders/enums';
import type { GetOrderDTO } from '@entities/orders/interface/GetOrderDTO';
import { useNotificationSound } from '@features/notifications';

interface IncomingOrderModalProps {
  onOrderAccepted?: () => void; // Callback для обновления dashboard
}

export function IncomingOrderModal({ onOrderAccepted }: IncomingOrderModalProps = {}) {
  // Простое состояние модального окна
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [currentRideId, setCurrentRideId] = useState<string | null>(null);
  const [orderType, setOrderType] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<GetOrderDTO | null>(null);
  const [timeLeft, setTimeLeft] = useState(30); // Таймер на 30 секунд

  // Хуки
  const { on, off } = useSignalR();
  const { playSound, stopSound } = useNotificationSound();

  // SignalR слушатель входящих заказов
  useEffect(() => {
    const handleRideRequest = (notification: SignalREventData) => {

      if (notification && typeof notification === 'object' && 'data' in notification && notification.data && 'orderId' in notification && notification.orderId) {
        // ID заказа находится в notification.orderId, а данные в notification.data!
        const signalRData = notification.data as { waypoints: any[] };
        const orderId = notification.orderId as string;
        const rideId = (notification as any).rideId as string;
        const orderTypeValue = (notification as any).orderType as string;

        // Создаем правильную структуру данных для модального окна
        const waypoints = signalRData.waypoints || [];
        const startLocation = waypoints[0]?.location;
        const endLocation = waypoints[1]?.location;

        const mappedOrderData = {
          id: orderId,
          orderNumber: orderId.slice(-8), // Последние 8 символов ID как номер
          startLocationId: startLocation?.address || startLocation?.name || 'Не указано',
          endLocationId: endLocation?.address || endLocation?.name || 'Не указано',
          startLocationAddress: startLocation?.address || '',
          endLocationAddress: endLocation?.address || '',
          type: orderTypeValue === 'Instant' ? 'Instant' : 'Scheduled',
          status: OrderStatus.Pending,
          additionalStops: waypoints.slice(2)?.map((wp: { location: any }) => wp.location) || [],
          // Добавляем другие поля с дефолтными значениями
          customerId: '',
          driverId: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          scheduledTime: null,
          description: null,
          airFlight: null,
          flyReis: null,
          notes: null,
          totalPrice: 0,
          currency: 'KGS',
          creatorId: '',
          initialPrice: 0,
          services: [],
          passengers: []
        } as unknown as GetOrderDTO;

        setCurrentOrder(mappedOrderData);
        setCurrentOrderId(orderId);
        setCurrentRideId(rideId);
        setOrderType(orderTypeValue);
        setIsModalOpen(true);
        setTimeLeft(30); // Сбрасываем таймер на 30 секунд
        playSound();

        // Проверим состояние через небольшую задержку
        setTimeout(() => { }, 100);
      } else {
        console.log('🚨 НЕПРАВИЛЬНАЯ СТРУКТУРА УВЕДОМЛЕНИЯ:', notification);
      }
    };

    on('RideRequestNotification', handleRideRequest);

    return () => {
      off('RideRequestNotification', handleRideRequest);
      stopSound();
    };
  }, [on, off, playSound, stopSound]);

  // Данные уже есть в SignalR
  // Принятие заказа
  const handleAccept = async () => {
    if (!currentOrderId) return;

    try {
      setIsAccepting(true);

      stopSound();
      
      // Выбираем правильный API в зависимости от типа заказа
      if (orderType === 'Scheduled' && currentRideId) {
        // Для запланированных поездок используем Ride API
        await ridesApi.acceptScheduledRide(currentRideId);
      } else {
        // Для мгновенных заказов используем Order API
        await driverOrderApi.acceptInstantOrder(currentOrderId);
      }
      
      await driverQueueApi.leaveQueue();

      toast.success('✅ Заказ принят!');

      // Закрываем модальное окно
      setIsModalOpen(false);
      setCurrentOrderId(null);
      setCurrentRideId(null);
      setOrderType(null);
      setCurrentOrder(null);

      // Отправляем событие для обновления dashboard
      window.dispatchEvent(new CustomEvent('orderAccepted'));

      // Также вызываем callback если он передан
      if (onOrderAccepted) {
        setTimeout(() => {
          onOrderAccepted();
        }, 500);
      }

    } catch {
      toast.error('Ошибка принятия заказа');
    } finally {
      setIsAccepting(false);
    }
  };

  // Закрытие модального окна
  const handleClose = useCallback(async () => {
    setIsModalOpen(false);
    setCurrentOrderId(null);
    setCurrentRideId(null);
    setOrderType(null);
    setCurrentOrder(null);
    stopSound();

    // Автоматически выходим из очереди при закрытии модального окна
    try {
      await driverQueueApi.leaveQueue();
    } catch {
    }
  }, [stopSound]);

  // Таймер автоматического закрытия через 30 секунд
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isModalOpen && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Время вышло - автоматически закрываем модальное окно
            handleClose();

            return 0;
          }

          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isModalOpen, timeLeft, handleClose]);

  // Не показываем модальное окно если оно закрыто или нет данных заказа
  if (!isModalOpen || !currentOrderId || !currentOrder) {
    return null;
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
      <div className='w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200'>
        {/* Заголовок */}
        <div className='bg-blue-600 text-white p-4 text-center'>
          <h2 className='text-lg font-bold'>Новый заказ</h2>
          <p className='text-blue-100 text-sm'>Заказ #{currentOrder.orderNumber}</p>
          <div className='mt-2 flex items-center justify-center gap-2'>
            <div className='w-2 h-2 bg-red-500 rounded-full animate-pulse' />
            <p className='text-blue-100 text-sm font-medium'>
              Автозакрытие через {timeLeft} сек
            </p>
          </div>
        </div>

        {/* Содержимое */}
        <div className='p-4 space-y-4'>
          {/* Маршрут */}
          <div className='space-y-3'>
            <div className='flex items-start space-x-3'>
              <div className='w-3 h-3 rounded-full bg-green-500 mt-1 flex-shrink-0' />
              <div className='flex-1'>
                <p className='text-sm text-gray-500'>Откуда</p>
                <p className='font-medium text-gray-900'>
                  {currentOrder.startLocationId || 'Не указано'}
                </p>
              </div>
            </div>

            <div className='flex items-start space-x-3'>
              <div className='w-3 h-3 rounded-full bg-red-500 mt-1 flex-shrink-0' />
              <div className='flex-1'>
                <p className='text-sm text-gray-500'>Куда</p>
                <p className='font-medium text-gray-900'>
                  {currentOrder.endLocationId || 'Не указано'}
                </p>
              </div>
            </div>
          </div>

          {/* Дополнительная информация */}
          <div className='grid grid-cols-2 gap-4 pt-2 border-t'>
            <div>
              <p className='text-sm text-gray-500'>Тип заказа</p>
              <p className='font-medium'>{currentOrder.type === 'Instant' ? 'Мгновенный' : 'Запланированный'}</p>
            </div>
            <div>
              <p className='text-sm text-gray-500'>Статус</p>
              <p className='font-medium'>
                {currentOrder.status === OrderStatus.Pending ? 'Поиск водителя' : currentOrder.status}
              </p>
            </div>
          </div>

          {/* Промежуточные точки */}
          {currentOrder.additionalStops && currentOrder.additionalStops.length > 0 && (
            <div className='pt-2 border-t'>
              <p className='text-sm text-gray-500 mb-2'>Промежуточные остановки:</p>
              <div className='space-y-1'>
                {currentOrder.additionalStops.map((stopId: string, _index: number) => (
                  <div key={stopId} className='flex items-center space-x-2'>
                    <div className='w-2 h-2 rounded-full bg-yellow-500' />
                    <p className='text-sm text-gray-700'>
                      Остановка {stopId}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Кнопки */}
        <div className='p-4 bg-gray-50'>
          <div className='flex gap-3'>
            <Button
              onClick={handleClose}
              variant='outline'
              className='flex-1 py-3 rounded-xl'
            >
              Отклонить
            </Button>
            <Button
              onClick={handleAccept}
              disabled={isAccepting}
              className='flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-colors'
            >
              {isAccepting ? 'Принимаю...' : 'Принять'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

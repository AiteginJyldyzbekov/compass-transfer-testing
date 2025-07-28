import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { orderService } from '@shared/api/orders';
import type { DriverCancelledNotificationDTO } from '@shared/hooks/signal/interface';
import type { RideNotificationData } from '@shared/hooks/signal/types';
import { useSignalR } from '@shared/hooks/signal/useSignalR';
import { logger } from '@shared/lib/logger';
import type { GetLocationDTO } from '@entities/locations/interface';
import type { CreateInstantOrderDTOType } from '@entities/orders/schemas';
import type { GetTariffDTO } from '@entities/tariffs/interface';

// Временные типы и заглушки для недостающих модулей
interface GetTerminalDTO {
  id: string;
  locationId: string;
  name: string;
}

// Заглушки для хуков
const useTerminalReceipt = () => ({
  setReceiptData: (_data: unknown) => {},
  setOrderData: (_data: unknown) => {},
});

const useFiscalReceipt = () => ({
  createTaxiReceipt: async (_data: unknown) => true,
  isCreating: false,
});

const showToast = {
  error: (message: string) => toast.error(message),
  success: (message: string) => toast.success(message),
  warn: (message: string) => toast.warning(message),
};

const setCardPaymentHandler = (_handler: () => Promise<void>) => {};
const clearCardPaymentHandler = () => {};

// Тип для метода оплаты
type PaymentMethod = 'card' | 'qr';

interface UseOrderSubmitProps {
  economyTariff: GetTariffDTO | null;
  terminal: GetTerminalDTO | null;
  selectedLocations: GetLocationDTO[];
  calculatedPrice: number;
}

export const useOrderSubmit = ({
  economyTariff,
  terminal,
  selectedLocations,
  calculatedPrice,
}: UseOrderSubmitProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const router = useRouter();
  const signalR = useSignalR();
  const t = useTranslations('Payment');
  const { setReceiptData, setOrderData } = useTerminalReceipt();
  const { createTaxiReceipt, isCreating: isFiscalCreating } = useFiscalReceipt();

  // Обработчик WebSocket уведомлений о заказе (типизированный)
  useEffect(() => {
    if (!signalR.isConnected || !orderId) return;

    const handleRideAccepted = (data: RideNotificationData) => {
      logger.info('🚗 Заказ принят водителем:', data);

      // ✅ ИСПРАВЛЕНИЕ: Сохраняем данные в контекст вместо localStorage
      try {
        // Сохраняем данные чека
        setReceiptData(data);

        // Сохраняем данные заказа
        setOrderData({
          locations: selectedLocations.map(loc => ({
            id: loc.id,
            name: loc.name,
            address: loc.address,
            latitude: loc.latitude,
            longitude: loc.longitude,
          })),
          startLocation: terminal?.locationId
            ? {
                id: terminal.locationId,
                name: 'Терминал',
                address: 'Адрес терминала',
                latitude: 0,
                longitude: 0,
              }
            : undefined,
          tariff: economyTariff
            ? {
                id: economyTariff.id,
                name: economyTariff.name,
                basePrice: economyTariff.basePrice,
                minutePrice: economyTariff.minutePrice || 0,
                minimumPrice: economyTariff.minimumPrice || 0,
                perKmPrice: economyTariff.perKmPrice || 0,
                occupancy: 1, // Значение по умолчанию для occupancy
              }
            : null,
          finalPrice: calculatedPrice,
        });

        logger.info('✅ Данные чека сохранены в контекст');
      } catch (error) {
        logger.error('❌ Ошибка сохранения данных чека:', error);
      }

      setIsLoading(false);
      router.push('/receipt');
    };

    const handleDriverNotFound = () => {
      logger.warn('❌ Водитель не найден');
      setIsLoading(false);
      showToast.error(t('errors.driverNotFound'));
    };

    const handleDriverCancelled = (data: DriverCancelledNotificationDTO) => {
      logger.warn('❌ Водитель отменил заказ:', data);
      setIsLoading(false);
      showToast.error(t('errors.driverCancelled'));
    };

    signalR.on('RideAcceptedNotification', handleRideAccepted);
    signalR.on('DriverNotFoundNotification', handleDriverNotFound);
    signalR.on('OrderCancelledNotification', handleDriverCancelled);

    return () => {
      signalR.off('RideAcceptedNotification', handleRideAccepted);
      signalR.off('DriverNotFoundNotification', handleDriverNotFound);
      signalR.off('OrderCancelledNotification', handleDriverCancelled);
    };
  }, [
    signalR,
    orderId,
    router,
    t,
    setReceiptData,
    setOrderData,
    selectedLocations,
    calculatedPrice,
    economyTariff,
    terminal,
  ]);

  // Функция для создания заказа с поддержкой paymentId
  const createOrder = useCallback(
    async (paymentId?: string) => {
      if (!economyTariff?.id) {
        showToast.error(t('errors.noTariff'));

        return false;
      }

      if (!terminal?.locationId) {
        showToast.error(t('errors.startLocationMissing'));

        return false;
      }

      if (selectedLocations.length === 0) {
        showToast.error(t('errors.noDestination'));

        return false;
      }

      setIsLoading(true);
      try {
        // Получаем конечную локацию (последняя в списке)
        const endLocation = selectedLocations[selectedLocations.length - 1];

        // Дополнительные остановки (все локации между первой и последней)
        const additionalStops =
          selectedLocations.length > 1
            ? selectedLocations
                .slice(0, selectedLocations.length - 1)
                .map((loc: GetLocationDTO) => loc.id)
            : [];

        // Создаем тело запроса согласно схеме CreateInstantOrderDTO
        const requestBody: CreateInstantOrderDTOType = {
          tariffId: economyTariff.id,
          startLocationId: terminal.locationId,
          endLocationId: endLocation.id,
          additionalStops: additionalStops,
          initialPrice: calculatedPrice,
          routeId: null,
          services: [],
          passengers: [
            {
              customerId: null,
              firstName: 'Пассажир',
              lastName: null,
              isMainPassenger: true,
            },
          ],
          // Добавляем paymentId если он передан (для QR-платежей)
          ...(paymentId && { paymentId }),
        };

        // Логируем данные для отладки
        logger.info('🚀 Создание заказа терминалом:', {
          terminalId: terminal.id,
          terminalLocationId: terminal.locationId,
          requestBody,
        });

        const response = await orderService.createInstantOrderByTerminal(requestBody);

        // ✅ НОВОЕ: Создаем фискальный чек после успешного создания заказа
        if (response.id) {
          logger.info('🧾 Создаем фискальный чек для заказа:', response.id);

          const route = `Терминал → ${selectedLocations.map(loc => loc.name).join(' → ')}`;

          const fiscalSuccess = await createTaxiReceipt({
            price: calculatedPrice,
            route,
            paymentMethod: paymentId ? 'QR' : 'CARD', // Используем короткие идентификаторы
            orderId: response.id,
          });

          if (!fiscalSuccess) {
            // Если фискальный чек не создался, логируем ошибку но не отменяем заказ
            logger.error('⚠️ Заказ создан, но фискальный чек не создался');
            showToast.warn('⚠️ Заказ создан, но возникла проблема с фискальным чеком');
          }
        }

        // Сохраняем ID заказа для WebSocket подписки
        setOrderId(response.id || null);

        return true;
      } catch (error: unknown) {
        setIsLoading(false);

        // Логируем ошибку для отладки
        logger.error('❌ Ошибка создания заказа:', error);

        // Проверяем тип ошибки
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorCode = (error as { code?: string })?.code;

        // Проверяем на специфичные ошибки валидации
        if (
          errorMessage.includes('StartLocationNotFound') ||
          errorMessage.includes('Начальная точка не найдена')
        ) {
          showToast.error('Начальная точка терминала не найдена. Обратитесь к администратору.');
        } else if (errorMessage.includes('DriversNotFound') || errorCode === 'DRIVERS_NOT_FOUND') {
          showToast.error(t('errors.driverNotFound'));
        } else {
          showToast.error(t('errors.createOrderFailed'));
        }

        return false;
      }
    },
    [economyTariff, terminal, selectedLocations, calculatedPrice, t, createTaxiReceipt],
  );

  // Обработчик выбора метода оплаты
  const handleMethodSelect = useCallback(
    async (selectedMethod: PaymentMethod) => {
      // Если выбрана оплата картой, открываем модалку, а заказ создаём ПОСЛЕ подтверждения оплаты
      if (selectedMethod === 'card') {
        // Регистрируем handler, который вызовет создание заказа
        setCardPaymentHandler(async () => {
          await createOrder();
          // После выполнения сбрасываем хендлер
          clearCardPaymentHandler();
        });
        // TODO: Открыть модальное окно оплаты картой

        return;
      }

      // Если выбрана оплата QR-кодом, показываем QR-модалку
      // Заказ будет создан ПОСЛЕ успешной оплаты
      if (selectedMethod === 'qr') {
        // TODO: Открыть модальное окно QR-код
      }
    },
    [createOrder],
  );

  // Функция для создания заказа после успешной оплаты (для QR)
  const createOrderWithPayment = useCallback(
    async (paymentId: string) => {
      logger.info('💳 Создание заказа с подтвержденным платежом:', paymentId);

      return await createOrder(paymentId);
    },
    [createOrder],
  );

  return {
    isLoading: isLoading || isFiscalCreating,
    handleMethodSelect,
    createOrderWithPayment,
  };
};

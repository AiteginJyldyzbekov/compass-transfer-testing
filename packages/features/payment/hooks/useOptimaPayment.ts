import { useCallback, useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';
import { useSignalR } from '@shared/hooks/signal/useSignalR';
import { paymentService } from '@entities/payments/api/payment-service';
import type { PaymentReceivedNotificationDTO } from '@entities/payments/interface/PaymentReceivedNotificationDTO';
import { formatSum, validateAndCleanNote } from '@shared/lib/generate-qr';

export type PaymentState =
  | { status: 'idle' }
  | { status: 'generating'; sum: number }
  | { status: 'waiting'; transactionId: string; qrBase64: string; sum: number }
  | { status: 'processing'; paymentId: string; transactionId: string }
  | { status: 'completed'; paymentId: string; transactionId: string; sum: number }
  | { status: 'failed'; error: string }
  | { status: 'expired'; transactionId: string };

interface UseOptimaPaymentResult {
  state: PaymentState;
  generateQR: (sum: number, note: string) => Promise<void>;
  cancelPayment: () => Promise<void>;
  reset: () => void;
}

/**
 * Хук для управления платежами через Optima QR
 * Следует принципу единственной ответственности - только платежи
 *
 * ИСПРАВЛЕНО: Использует правильные поля API (sum, note)
 */
export const useOptimaPayment = (): UseOptimaPaymentResult => {
  const [state, setState] = useState<PaymentState>({ status: 'idle' });
  const signalR = useSignalR();
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Обработчик уведомления о получении платежа
  const handlePaymentReceived = useCallback(
    (notification: PaymentReceivedNotificationDTO) => {
      console.log('💰 Получено уведомление о платеже:', notification);

      // Извлекаем данные из уведомления
      const { paymentId, transactionId } = notification.data;

      if (state.status === 'waiting' && state.transactionId === transactionId) {
        setState({
          status: 'completed',
          paymentId,
          transactionId,
          sum: state.sum, // используем сумму из текущего состояния
        });
      }
    },
    [state],
  );

  // Подписка на WebSocket уведомления
  useEffect(() => {
    if (signalR.isConnected && state.status === 'waiting') {
      signalR.on('PaymentReceivedNotification', handlePaymentReceived);

      return () => {
        signalR.off('PaymentReceivedNotification', handlePaymentReceived);
      };
    }
  }, [signalR.isConnected, state.status, handlePaymentReceived]);

  // Таймаут для истечения QR-кода
  useEffect(() => {
    if (state.status === 'waiting') {
      // Устанавливаем таймаут на 5 минут
      timeoutRef.current = setTimeout(
        () => {
          setState({
            status: 'expired',
            transactionId: state.transactionId,
          });
          toast.error('Время ожидания платежа истекло');
        },
        5 * 60 * 1000,
      );

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [state]);

  const generateQR = useCallback(async (sum: number, note: string) => {
    setState({ status: 'generating', sum });

    try {
      // Валидируем и форматируем данные перед отправкой
      const formattedSum = formatSum(sum);
      const cleanedNote = validateAndCleanNote(note);

      // Дополнительная валидация
      if (formattedSum <= 0) {
        throw new Error('Сумма должна быть больше 0');
      }

      if (!cleanedNote.trim()) {
        throw new Error('Примечание не может быть пустым');
      }

      const response = await paymentService.generateOptimaQR(formattedSum, cleanedNote);

      setState({
        status: 'waiting',
        transactionId: response.transactionId,
        qrBase64: response.qrBase64,
        sum: formattedSum, // используем отформатированную сумму
      });

    } catch (error) {
      toast.error('❌ Ошибка генерации QR:');

      const errorMessage =
        error instanceof Error ? error.message : 'Не удалось сгенерировать QR-код';

      setState({
        status: 'failed',
        error: errorMessage,
      });

      toast.error(errorMessage);
    }
  }, []);

  // Отмена платежа (локально, без API запроса)
  const cancelPayment = useCallback(async () => {
    // API не поддерживает отмену платежей, просто сбрасываем локальное состояние

    // Очищаем таймаут если он есть
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Сбрасываем состояние
    setState({ status: 'idle' });
  }, []);

  // Сброс состояния
  const reset = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setState({ status: 'idle' });
  }, []);

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    state,
    generateQR,
    cancelPayment,
    reset,
  };
};

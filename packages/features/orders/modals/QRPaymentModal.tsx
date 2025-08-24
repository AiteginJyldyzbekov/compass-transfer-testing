'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useOptimaPayment } from '@features/payment/hooks/useOptimaPayment';

interface QRPaymentModalProps {
  isOpen: boolean;
  amount: number;
  onClose: () => void;
  onSuccess: (paymentId: string) => void;
}

export const QRPaymentModal: React.FC<QRPaymentModalProps> = ({
  isOpen,
  amount,
  onClose,
  onSuccess
}) => {
  const { state: paymentState, generateQR, cancelPayment, reset } = useOptimaPayment();
  const [hasStartedPayment, setHasStartedPayment] = useState(false);

  // Автоматически генерируем QR при открытии модалки
  useEffect(() => {
    if (isOpen && !hasStartedPayment && amount > 0) {
      setHasStartedPayment(true);
      generateQR(
        amount,
        `Мгновенный заказ`
      );
    }
  }, [isOpen, hasStartedPayment, amount, generateQR]);

  // Сброс состояния при закрытии модалки
  useEffect(() => {
    if (!isOpen) {
      setHasStartedPayment(false);
      reset();
    }
  }, [isOpen, reset]);

  // Обрабатываем успешную оплату
  useEffect(() => {
    if (paymentState.status === 'completed' && paymentState.paymentId) {
      // Вызываем колбэк успешной оплаты
      onSuccess(paymentState.paymentId);
      
      // Закрываем модалку через небольшую задержку
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  }, [paymentState, onSuccess, onClose]);

  const handleCancel = async () => {
    await cancelPayment();
    onClose();
  };

  const renderContent = () => {
    switch (paymentState.status) {
      case 'generating':
        return (
          <div className="text-center">
            <div className="animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Генерация QR-кода...
            </h3>
            <p className="text-gray-600">
              Подготавливаем платеж на сумму {Math.round(paymentState.sum)} KGS
            </p>
          </div>
        );

      case 'waiting':
        return (
          <div className="text-center">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              Сканируйте QR-код для оплаты
            </h3>
            <div className="bg-white p-6 rounded-2xl shadow-lg mb-6 inline-block">
              <Image
                src={`data:image/png;base64,${paymentState.qrBase64}`}
                alt="QR код для оплаты"
                width={300}
                height={300}
                className="mx-auto"
              />
            </div>
            <div className="bg-blue-50 p-4 rounded-xl mb-4">
              <p className="text-xl font-semibold text-blue-800">
                Сумма к оплате: {Math.round(paymentState.sum)} KGS
              </p>
            </div>
            <p className="text-gray-600 mb-4">
              Откройте приложение банка и отсканируйте QR-код
            </p>
            <div className="flex items-center justify-center text-orange-600">
              <div className="animate-pulse w-3 h-3 bg-orange-500 rounded-full mr-2" />
              Ожидаем подтверждение платежа...
            </div>
          </div>
        );

      case 'completed':
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-green-600 mb-2">
              Платеж успешно завершен!
            </h3>
            <p className="text-gray-600 mb-4">
              Сумма: {Math.round(paymentState.sum)} KGS
            </p>
            <p className="text-sm text-gray-500">
              Создаем ваш заказ...
            </p>
          </div>
        );

      case 'failed':
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-red-600 mb-2">
              Ошибка платежа
            </h3>
            <p className="text-gray-600 mb-4">
              {paymentState.error}
            </p>
          </div>
        );

      case 'expired':
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-yellow-600 mb-2">
              Время истекло
            </h3>
            <p className="text-gray-600 mb-4">
              Время ожидания платежа истекло
            </p>
          </div>
        );

      default:
        return (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Подготовка к оплате...
            </h3>
          </div>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        {renderContent()}
        
        {/* Кнопки управления */}
        <div className="flex gap-4 mt-8">
          {(paymentState.status === 'waiting' || paymentState.status === 'failed' || paymentState.status === 'expired') && (
            <button
              onClick={handleCancel}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Отменить
            </button>
          )}
          
          {paymentState.status === 'failed' && (
            <button
              onClick={() => {
                reset();
                setHasStartedPayment(false);
              }}
              className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
            >
              Попробовать снова
            </button>
          )}
        </div>
      </div>
    </div>
  );
}; 
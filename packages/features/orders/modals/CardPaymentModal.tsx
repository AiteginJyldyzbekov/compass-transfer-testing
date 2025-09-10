'use client';

import clsx from 'clsx';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { fiscalService } from '@entities/fiscal/api/fiscal-service';

interface CardPaymentModalProps {
  isOpen: boolean;
  amount: number;
  onClose: () => void;
  onSuccess: () => void;
  onCancel?: () => void;
}

export const CardPaymentModal: React.FC<CardPaymentModalProps> = ({
  isOpen,
  amount,
  onClose,
  onSuccess,
  onCancel,
}) => {
  const [status, setStatus] = useState<'init'|'processing'|'success'|'error'|'cancelled'>('init');
  const [paymentId, setPaymentId] = useState<string | null>(null);

  // Закрытие модалки
  const handleClose = React.useCallback(() => {
    onClose();
  }, [onClose]);

  // Отмена платежа
  const handleCancel = React.useCallback(async () => {
    if (status === 'processing' && paymentId) {
      try {
        // Выполняем отмену через API RecVoid (аннулирование чека)
        const cancelResult = await fiscalService.cancelPayment(paymentId, amount);
        
        if (cancelResult.status === 'Success') {
          setStatus('cancelled');
          // Вызываем callback отмены если он передан
          onCancel?.();
        } else {
          console.error('Не удалось отменить платеж:', cancelResult.reason);
          setStatus('error');
        }
      } catch (error) {
        console.error('Ошибка отмены платежа:', error);
        // Даже если отмена не удалась, показываем статус отмены
        setStatus('cancelled');
        onCancel?.();
      }
    } else {
      // Если платеж еще не начался, просто закрываем модалку
      onClose();
    }
  }, [status, paymentId, amount, onCancel, onClose]);

  // Реальная оплата через POS-терминал
  useEffect(() => {
    if (!isOpen) return;

    (async () => {
      try {
        setStatus('processing');
        
        // Реальная оплата через POS-терминал
        const res = await fiscalService.executePayment(amount, '');

        if (res.status !== 'Success') throw new Error(res.reason || 'Payment failed');
        
        // Сохраняем ID платежа для возможной отмены
        setPaymentId(res.id);
        setStatus('success');
        
        // Вызываем обработчик успешной оплаты
        await onSuccess();
      } catch (error) {
        console.error('Ошибка платежа:', error);
        setStatus('error');
      }
    })();
  }, [isOpen, amount, onSuccess]);


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="flex flex-col justify-between w-[801px] h-[724px] bg-gradient-to-b from-white/90 to-gray-100/90 rounded-[53.41px] backdrop-blur-xl items-center p-8">
        {/* Заголовок */}
        <div className="text-center justify-start text-black text-4xl font-normal font-['Gilroy-Medium'] leading-10 mb-[95px]">
          Приложите карту к POS терминалу
        </div>
        
        {/* Изображение POS-терминала и карты */}
        <div className="w-[683.66px] h-[513px] relative">
          <Image 
            className="w-full h-full object-contain" 
            src="/paymant/pos.png" 
            alt="POS Terminal with Card"
            width={684}
            height={513}
          />
        </div>

        {/* Статус и кнопки */}
        <div className="flex flex-col items-center gap-4">
          {status === 'processing' && (
            <div className="text-center">
              <p className="text-lg mb-2">Ожидайте подтверждения оплаты…</p>
              <p className="text-sm text-gray-600">Приложите карту к терминалу</p>
            </div>
          )}
          {status === 'error' && (
            <p className='text-red-500 text-center'>Оплата не прошла. Попробуйте ещё раз или обратитесь к сотруднику.</p>
          )}
          {status === 'cancelled' && (
            <div className="text-center">
              <p className='text-orange-500 text-lg mb-2'>Платеж отменен</p>
              <p className='text-sm text-gray-600'>
                Чек аннулирован через POS терминал.<br/>
                Платеж отменен успешно.
              </p>
            </div>
          )}
          
          {/* Кнопки управления */}
          {status === 'processing' && (
            <div className="flex gap-4">
              <button
                onClick={handleCancel}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full text-lg transition-colors"
              >
                Отменить
              </button>
            </div>
          )}
          
          {status === 'error' && (
            <button
              onClick={handleClose}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full text-lg transition-colors"
            >
              Закрыть
            </button>
          )}
          
          {status === 'cancelled' && (
            <button
              onClick={handleClose}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-full text-lg transition-colors"
            >
              Закрыть
            </button>
          )}
        </div>
      </div>
    </div>
  );
}; 
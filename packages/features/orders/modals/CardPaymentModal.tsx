'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { fiscalService } from '@entities/fiscal/api/fiscal-service';

interface CardPaymentModalProps {
  isOpen: boolean;
  amount: number;
  onClose: () => void;
  onSuccess: () => void;
}

export const CardPaymentModal: React.FC<CardPaymentModalProps> = ({
  isOpen,
  amount,
  onClose,
  onSuccess,
}) => {
  const [status, setStatus] = useState<'init'|'processing'|'success'|'error'>('init');

  // Закрытие модалки
  const handleClose = React.useCallback(() => {
    onClose();
  }, [onClose]);

  // Первая попытка оплаты
  useEffect(() => {
    if (!isOpen) return;

    (async () => {
      try {
        setStatus('processing');
        const res = await fiscalService.executePayment(amount, '');

        if (res.status !== 'Success') throw new Error(res.reason || 'Payment failed');
        
        setStatus('success');
        
        // Вызываем обработчик успешной оплаты
        await onSuccess();
        
        // Небольшая задержка перед закрытием для визуального подтверждения
        setTimeout(() => {
          handleClose();
        }, 1000);
      } catch {
        setStatus('error');
      }
    })();
  }, [isOpen, amount, onSuccess, handleClose]);

  // Если произошла ошибка – автоматически закрываем модалку через 5 секунд
  useEffect(() => {
    if (status !== 'error') return;

    const timer = setTimeout(handleClose, 5000);

    return () => clearTimeout(timer);
  }, [status, handleClose]);

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

        {status === 'processing' && <p>Ожидайте подтверждения оплаты…</p>}
        {status === 'error' && (
          <div className="flex flex-col items-center gap-4">
            <p className='text-red-500'>Оплата не прошла. Попробуйте ещё раз или обратитесь к сотруднику.</p>
            <button
              onClick={handleClose}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full text-lg transition-colors"
            >
              Закрыть
            </button>
          </div>
        )}
      </div>
    </div>
  );
}; 
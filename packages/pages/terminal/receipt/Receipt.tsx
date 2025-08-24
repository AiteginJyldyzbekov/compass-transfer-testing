'use client';

import type { NextPage } from 'next';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { captureReceiptImage } from '@shared/utils/receiptCapture';
import { useFiscalReceipt } from '@entities/fiscal';
import { useTerminalReceipt } from '@entities/orders/context';

// 🔄 ПЕРЕКЛЮЧАТЕЛЬ СПОСОБА ПЕЧАТИ
// true - растровая печать (html2canvas -> printRaster)
// false - построчная печать (printReceiptLines)
const USE_RASTER_PRINT = true;

export const Receipt: NextPage = () => {
  const t = useTranslations('Receipt');
  const router = useRouter();
  const { receiptData, orderData, clearReceiptData } = useTerminalReceipt();
  const { printReceiptLines, printReceiptImage } = useFiscalReceipt();

  const hasAutoSavedRef = useRef(false);

  // InfoRow компонент
  const InfoRow: React.FC<{ label: string; value: string | React.ReactNode; className?: string }> = ({ 
    label, 
    value, 
    className = '' 
  }) => (
    <div className={`flex items-center justify-between ${className}`}>
      <span className="text-[24px] text-[#A3A5AE] leading-[34px] font-medium">{label}</span>
      {typeof value === 'string' ? (
        <span className="text-[24px] text-[#0047FF] leading-[33px] font-medium">{value}</span>
      ) : (
        value
      )}
    </div>
  );

  // CountdownButton компонент
  const CountdownButton: React.FC<{
    initialSeconds: number;
    targetPath: string;
    buttonText: string;
    className?: string;
    handleClick?: () => void;
  }> = ({
    initialSeconds = 60,
    targetPath = '/',
    buttonText = 'На главную',
    className = '',
    handleClick,
  }) => {
    const [buttonSeconds, setButtonSeconds] = useState(initialSeconds);

    useEffect(() => {
      if (buttonSeconds <= 0) {
        handleClick?.();
        router.push(targetPath);

        return;
      }

      const timer = setInterval(() => {
        setButtonSeconds(prevSeconds => prevSeconds - 1);
      }, 1000);

      return () => clearInterval(timer);
    }, [buttonSeconds, targetPath, handleClick]);

    const returnToMainPage = () => {
      handleClick?.();
      router.push(targetPath);
    };

    return (
      <button
        className={`w-[610px] m-auto mb-[120px] h-[124px] flex items-center justify-center flex-1 rounded-[100px] bg-gradient-to-r from-[#0053BF] to-[#2F79D8] ${className}`}
        onClick={returnToMainPage}
      >
        <span className="text-[46px] text-[#F5F6F7] font-bold leading-[100%]">
          {buttonText} {buttonSeconds < 10 ? `0:0${buttonSeconds}` : `0:${buttonSeconds}`}
        </span>
      </button>
    );
  };
  
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });

  // Очищаем данные при размонтировании компонента
  useEffect(() => {
    return () => {
      clearReceiptData();
    };
  }, [clearReceiptData]);

  // Автоматическая печать изображения чека после его отображения
  useEffect(() => {
    if (receiptData && orderData && !hasAutoSavedRef.current) {
      // Ждем немного, чтобы компонент полностью отрендерился
      const timeoutId = setTimeout(async () => {
        try {
          // Начинаем автоматическую печать изображения чека
          
          // Проверяем что элемент существует и отрендерился
          const receiptElement = document.getElementById('receipt-container');

          if (!receiptElement) {
            toast.error('Элемент чека не найден');

            return;
          }
          
          let success = false;
          
          if (USE_RASTER_PRINT) {
            // 🖼️ РАСТРОВАЯ ПЕЧАТЬ - через html2canvas
            // 📸 Используется растровая печать чека
            
            // Создаем скриншот чека
            const receiptBase64 = await captureReceiptImage('receipt-container', 384);
            
            // Печатаем растровое изображение
            success = await printReceiptImage(receiptBase64);
          } else {
            // 📄 ПОСТРОЧНАЯ ПЕЧАТЬ - через API строки
            // 📝 Используется построчная печать чека
            
            // Печатаем чек одним запросом
            success = await printReceiptLines({
              price: orderData.tariff?.basePrice || orderData.finalPrice || 0,
              route: orderData.locations?.map((loc: { name: string }) => loc.name).join(' → ') || 'Неизвестный маршрут',
              paymentMethod: 'CARD',
              orderNumber: receiptData.data?.orderNumber || '000000',
              driver: {
                fullName: receiptData.data?.driver?.fullName || 'Неизвестный водитель',
                phoneNumber: receiptData.data?.driver?.phoneNumber
              },
              car: {
                make: receiptData.data?.car?.make || 'Неизвестная марка',
                model: receiptData.data?.car?.model || 'Неизвестная модель',
                licensePlate: receiptData.data?.car?.licensePlate || 'Неизвестный номер',
                color: receiptData.data?.car?.color || 'Неизвестный цвет'
              },
              queueNumber: receiptData.data?.queueNumber
            });
          }
          
          if (success) {
          } else {
            toast.warning('⚠️ Проблема с печатью чека');
          }
        } catch {
          toast.error('❌ Ошибка печати чека');
        } finally {
          hasAutoSavedRef.current = true;
        }
      }, 2000); // Увеличиваем задержку до 2 секунд для полного рендера

      return () => clearTimeout(timeoutId);
    }
  }, [receiptData, orderData, printReceiptLines, printReceiptImage]);

  // Если нет данных чека или заказа, показываем сообщение об ошибке
  if (!receiptData || !orderData) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <h3 className="text-[32px] text-red-600 font-bold">
          Данные чека не найдены
        </h3>
        <p className="text-[24px] text-gray-600">
          Пожалуйста, вернитесь на главную страницу и создайте новый заказ
        </p>
        <CountdownButton
          initialSeconds={10}
          targetPath="/"
          buttonText="На главную"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[50px]">
      {/* Заголовок */}
      <h3 className="max-w-[800px] mx-auto text-[30px] text-orange-500 text-center leading-[120%] font-semibold">
      {t('photoInstruction')}
      </h3>
      
      {/* Чек */}
      <div 
        id="receipt-container" 
        className="max-w-[708px] mx-auto relative"
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: '18px',
          lineHeight: '1.4',
          color: '#000000',
          WebkitFontSmoothing: 'antialiased',
          textRendering: 'optimizeLegibility',
        }}
      >
        <div className="w-full h-[54px] bg-[#0A205747] rounded-[37px] shadow-[0px_9px_6.5px_7px_#0A205747_inset]" />
        <div className="w-[90%] h-[48px] absolute top-[24px] left-[5%] bg-[linear-gradient(0.47deg,#FFFFFF_9.8%,#E1E6F7_91.63%)] rounded-tr-[12px] rounded-tl-[12px]" />

        <div className="w-[90%] mx-auto py-[56px] px-[44px] bg-[#FFFFFF] shadow-xl flex flex-col gap-10">
          {/* Заголовок чека */}
          <div className="flex flex-col items-center gap-[30px]">
            {/* <SuccessIcon /> */}
            <h3 className="text-[50px] text-[#0866FF] text-center leading-[120%] font-semibold">
              {t('transactionSuccess')}
            </h3>
          </div>

          {/* Разделитель */}
          <span className="flex border-wide-dashed h-[2px]" />

          {/* Информация о заказе */}
          <div className="flex flex-col gap-[26px]">
            <InfoRow
              label={t('status')}
              value={
                <div className="py-[11px] px-[19px] flex items-center justify-center rounded-[42px] bg-[#41D1951F]">
                  <span className="text-[18px] text-[#41D195] leading-[30px] font-medium">
                    {t('active')}
                  </span>
                </div>
              }
            />

            <InfoRow
              label={t('date')}
              value={formattedDate}
            />
            <InfoRow
              label={t('name')}
              value={receiptData.data.driver.fullName}
            />
            <InfoRow
              label={t('car')}
              value={receiptData.data.car.model}
            />
            <InfoRow
              label={t('carNumber')}
              value={receiptData.data.car.licensePlate}
            />
            <InfoRow
              label={t('code')}
              value={(receiptData.id || receiptData.orderId || '000000').split('').reverse().slice(0, 6).join('').toUpperCase()}
            />
          </div>

          {/* Разделитель */}
          <span className="flex border-wide-dashed h-[2px]" />

          {/* Итоговая сумма */}
          <div className="flex items-center justify-between">
            <h4 className="text-[30px] text-[#0047FF] leading-[34px] font-medium">
              {t('purchase')}
            </h4>
            <span className="text-[30px] text-[#0047FF] leading-[46px] font-bold">
              {orderData.tariff?.basePrice || orderData.finalPrice}KGS
            </span>
          </div>
        </div>
      </div>

      {/* Кнопка возврата */}
      <div className="flex justify-center">
        <CountdownButton
          initialSeconds={60}
          targetPath="/"
          buttonText={t('toMain')}
        />
      </div>
    </div>
  );
};

export default Receipt;

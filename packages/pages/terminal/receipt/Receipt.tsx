'use client';

import type { NextPage } from 'next';
import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';
import { showToast } from '@shared/toast';
import { captureReceiptImage } from '@shared/utils/receiptCapture';
import { useFiscalReceipt } from '@entities/fiscal';
import { useTerminalReceipt } from '@entities/order/context';
import { InfoRow } from '@pages/terminal/receipt/ui';
import CountdownButton from '@pages/terminal/receipt/ui/CountdownButton';

// 🔄 ПЕРЕКЛЮЧАТЕЛЬ СПОСОБА ПЕЧАТИ
// true - растровая печать (html2canvas -> printRaster)
// false - построчная печать (printReceiptLines)
const USE_RASTER_PRINT = true;

export const Receipt: NextPage = () => {
  const t = useTranslations('Receipt');
  const { receiptData, orderData, clearReceiptData } = useTerminalReceipt();
  const { printReceiptLines, printReceiptImage } = useFiscalReceipt();

  const hasAutoSavedRef = useRef(false);
  
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
            showToast.error('Элемент чека не найден');

            return;
          }
          
          let success = false;
          
          if (USE_RASTER_PRINT) {
            // 🖼️ РАСТРОВАЯ ПЕЧАТЬ - через html2canvas
            console.log('📸 Используется растровая печать чека');
            
            // Создаем скриншот чека
            const receiptBase64 = await captureReceiptImage('receipt-container', 384);
            
            // Печатаем растровое изображение
            success = await printReceiptImage(receiptBase64);
          } else {
            // 📄 ПОСТРОЧНАЯ ПЕЧАТЬ - через API строки
            console.log('📝 Используется построчная печать чека');
            
            // Печатаем чек одним запросом
            success = await printReceiptLines({
              price: orderData.tariff?.basePrice || orderData.finalPrice || 0,
              route: orderData.locations?.map(loc => loc.name).join(' → ') || 'Неизвестный маршрут',
              paymentMethod: 'CARD',
              orderId: receiptData.data?.orderNumber || '000000',
              driver: {
                fullName: receiptData.data?.driver?.fullName || 'Неизвестный водитель'
              },
              car: {
                model: receiptData.data?.car?.model || 'Неизвестная модель',
                licensePlate: receiptData.data?.car?.licensePlate || 'Неизвестный номер'
              }
            });
          }
          
          if (success) {
            // Изображение чека отправлено на печать
            showToast.success('🖨️ Чек напечатан успешно');
          } else {
            showToast.warn('⚠️ Проблема с печатью чека');
          }
        } catch (_error) {
          // Ошибка печати изображения чека
          showToast.error('❌ Ошибка печати чека');
        } finally {
          hasAutoSavedRef.current = true;
        }
      }, 2000); // Увеличиваем задержку до 2 секунд для полного рендера

      return () => clearTimeout(timeoutId);
    }
  }, [receiptData, orderData, printReceiptLines]);

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

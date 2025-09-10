'use client';

import type { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from '@shared/lib/conditional-toast';
import { captureReceiptImage } from '@shared/utils/receiptCapture';
import { getLogoBase64 } from '@shared/utils/logoConverter';
import { generateFullReceiptPNG } from '@shared/utils/receiptGenerator';
import { useFiscalReceipt } from '@entities/fiscal';
import { useTerminalReceipt } from '@entities/orders/context';

// 🔄 ПЕРЕКЛЮЧАТЕЛЬ СПОСОБА ПЕЧАТИ
// true - генерация PNG чека с логотипом и печать одним запросом
// false - построчная печать (printReceiptLines)

// Добавить после всех импортов
const USE_PNG_RECEIPT = true;

const FiscalReceiptPrint: React.FC<{
  receiptData: any;
  orderData: any;
  formattedDate: string;
}> = ({ receiptData, orderData, formattedDate }) => {
  return (
    <div
      id="fiscal-receipt-container"
      className="bg-white text-black"
      style={{
        width: '384px',
        padding: '8px 4px',
        fontSize: '11px',
        lineHeight: '1.2',
        fontFamily: 'Arial, sans-serif',
        fontWeight: 'normal'
      }}
    >
      {/* Header */}
      <div className="text-center mb-3">
        <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '2px' }}>
          COMPASS
        </div>
        <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>
          TRANSFER
        </div>
        <div style={{ fontSize: '10px', marginBottom: '2px' }}>
          Контрольно-кассовый чек
        </div>
      </div>

      <div style={{ borderTop: '1px dashed #000', margin: '6px 0', width: '100%' }}></div>

      <div style={{ fontSize: '10px', lineHeight: '1.3' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
          <span>Дата</span>
          <span>{formattedDate}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
          <span>Водитель</span>
          <span style={{ textAlign: 'right', maxWidth: '200px', wordBreak: 'break-word' }}>
            {receiptData.data.driver.fullName}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
          <span>Телефон службы</span>
          <span>{receiptData.data.driver.phoneNumber || '+996700700700'}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
          <span>Тариф</span>
          <span>Базовый / Седан</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
          <span>Марка</span>
          <span>{receiptData.data.car.make} {receiptData.data.car.model}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
          <span>Цвет авто</span>
          <span>{receiptData.data.car.color}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
          <span>Номер авто</span>
          <span style={{ fontWeight: 'bold' }}>{receiptData.data.car.licensePlate}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
          <span>Код</span>
          <span style={{ fontWeight: 'bold' }}>
            {(receiptData.id || receiptData.orderId || '000000').split('').reverse().slice(0, 6).join('').toUpperCase()}
          </span>
        </div>
      </div>

      <div style={{ borderTop: '1px dashed #000', margin: '8px 0 6px 0', width: '100%' }}></div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '12px',
        fontWeight: 'bold',
        marginBottom: '8px'
      }}>
        <span>Покупка</span>
        <span style={{ fontSize: '14px' }}>
          {orderData.tariff?.basePrice || orderData.finalPrice}KGS
        </span>
      </div>

      <div style={{ textAlign: 'center', fontSize: '9px', marginTop: '8px' }}>
        <div>Спасибо за поездку!</div>
      </div>

      <div style={{ height: '12px' }}></div>
    </div>
  );
};

export const Receipt: NextPage = () => {
  const t = useTranslations('Receipt');
  const router = useRouter();
  const { receiptData, orderData, clearReceiptData } = useTerminalReceipt();
  const { printReceiptLines, printReceiptImage, printReceiptWithLogo, printFullReceiptPNG } = useFiscalReceipt();

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

          if (USE_PNG_RECEIPT) {
            // 🖼️ ГЕНЕРАЦИЯ PNG ЧЕКА - логотип + данные в одном изображении
            // 📸 Генерируем PNG с логотипом и данными, печатаем одним запросом

            try {
              // Форматируем дату и время
              const date = new Date();
              const formattedDate = date.toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit'
              });
              const formattedTime = date.toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit'
              });

              // Генерируем PNG чек
              const receiptPNGBase64 = await generateFullReceiptPNG({
                orderNumber: receiptData.data?.orderNumber || '000000',
                date: formattedDate,
                time: formattedTime,
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
                route: orderData.locations?.map((loc: { name: string }) => loc.name).join(' → ') || 'Неизвестный маршрут',
                price: orderData.tariff?.basePrice || orderData.finalPrice || 0,
                queueNumber: receiptData.data?.queueNumber
              });

              // Печатаем сгенерированный PNG чек
              success = await printFullReceiptPNG(receiptPNGBase64);
            } catch (error) {
              console.error('Ошибка генерации PNG чека, используем построчную печать:', error);
              // Fallback к построчной печати если не удалось сгенерировать PNG
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
      {/* Скрытый чек для физической печати */}
      <div style={{ position: 'absolute', left: '-9999px', top: '0' }}>
        <FiscalReceiptPrint
          receiptData={receiptData}
          orderData={orderData}
          formattedDate={formattedDate}
        />
      </div>

      {/* Заголовок */}
      <h3 className="max-w-[800px] mx-auto text-[50px] text-[#0866FF] text-center leading-[120%] font-bold" style={{ fontFamily: 'Gilroy', fontWeight: 700 }}>
        Получите чек
      </h3>

      {/* Чек в новом дизайне */}
      <div className="flex justify-center">
        <div
          id="receipt-container"
          className="mx-auto relative overflow-hidden rounded-xl"
          style={{
            width: '638px',
            height: '1000px',
            backgroundImage: 'url(/background/Subtract.png)',
            backgroundSize: '638px 1000px',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center top -20px',
          }}
        >
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[708px] h-[54px] bg-[#0A205747] rounded-[37px] shadow-[0px_9px_6.5px_7px_#0A205747_inset]" />
          <div className="w-[638px] h-[48px] absolute top-[20px] left-[50%] transform -translate-x-1/2 bg-[linear-gradient(0.47deg,#FFFFFF_9.8%,#E1E6F7_91.63%)] rounded-tr-[12px] rounded-tl-[12px]" />

          {/* Иконка поверх фонового изображения */}
          <div className="absolute z-20" style={{ top: '60%', left: '114px', transform: 'translateY(-50%)' }}>
            <Image
              src="/logo/checklogo.png"
              alt="Check logo"
              width={410}
              height={520}
              style={{ objectFit: 'fill' }}
            />
          </div>

          <div className="w-[90%] mx-auto py-[56px] px-[44px] flex flex-col gap-10 relative z-10"
            style={{
              fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
              fontWeight: 500,
              fontSize: '24.04px',
              lineHeight: '33.29px',
              letterSpacing: '0%',
            }}>
            {/* Заголовочная секция */}
            <div className="relative p-8">

              {/* Зеленая галочка */}
              <div className="flex justify-center mb-[20px]">
                <div className="w-[103px] h-[103px] bg-[#41D1951F] rounded-full flex items-center justify-center">
                  <div className="w-[49px] h-[49px] bg-[#41D195] rounded-full flex items-center justify-center">
                    <svg width="49" height="49" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M9 12l2 2 4-4"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Заголовок */}
              <h3 className="text-[37px] text-[#4CAF50] text-center font-medium">
                Транзакция успешна
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

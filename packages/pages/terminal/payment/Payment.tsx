'use client';

import clsx from 'clsx';
import Lottie from 'lottie-react';
import type { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React, { useState, Suspense } from 'react';
import rideAnimation from '@shared/animated/lottie/Ride.json';
import { calculateDistance } from '@shared/components/map';
import { ChevronLeftIcon } from '@shared/icons';
import type { GetLocationDTO } from '@entities/locations';
import { useTerminalLocations } from '@entities/locations/context/TerminalLocationsContext';
import { usePaymentMethods, type PaymentMethod } from '@entities/orders/constants/paymentMethods';
import { useTerminalTariff } from '@entities/tariffs/context/TerminalTariffContext';
import { useTerminalData } from '@entities/users/context/TerminalDataContext';
import { useOrderSubmit } from '@features/orders/hooks/terminal-pay/useOrderSubmit';
import LocationContainer from '@widgets/location/ui/LocationContainer';
import LocationItem from '@widgets/location/ui/LocationItem';

export const Payment: NextPage = () => {
  const { economyTariff, isLoading: isTariffLoading } = useTerminalTariff();
  const { 
    profile: terminal, 
    terminalLocation, 
    isLocationLoading: isTerminalLoading,
    isProfileLoading 
  } = useTerminalData();
  const { selectedLocations } = useTerminalLocations();
  const paymentMethods = usePaymentMethods();
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const t = useTranslations('Payment');
  const router = useRouter();

  const handleBack = () => {
    router.push('/locations');
  };

  // Рассчитываем общее расстояние поездки
  const totalDistance = selectedLocations.reduce((total, location, index) => {
    const prevLocation = index === 0 ? terminalLocation : selectedLocations[index - 1];
    
    if (prevLocation && location.latitude && location.longitude && prevLocation.latitude && prevLocation.longitude) {
      return total + calculateDistance(prevLocation.latitude, prevLocation.longitude, location.latitude, location.longitude);
    }
    
    return total;
  }, 0);
  
  // Рассчитываем стоимость поездки
  const calculatedPrice = economyTariff ? 
    economyTariff.basePrice + (totalDistance / 1000) * (economyTariff.perKmPrice || 0) : 0;

  // Используем хук для создания заказа
  const { isLoading, handleMethodSelect, createOrderWithPayment } = useOrderSubmit({
    economyTariff,
    terminal,
    selectedLocations,
    calculatedPrice,
  });

  // Обработчик успешной оплаты (пока не используется, но может понадобиться)
  const _handlePaymentSuccess = async (paymentId: string) => {
    // Платеж успешен, создаем заказ с paymentId
    await createOrderWithPayment(paymentId);
  };

  // Обработчик выбора метода оплаты
  const onMethodSelect = async (selectedMethod: PaymentMethod) => {
    setMethod(selectedMethod);
    await handleMethodSelect(selectedMethod);
  };

  // Функция для получения переведенного названия метода оплаты
  const getTranslatedMethodName = (methodValue: string) => {
    const methodKey = methodValue.toLowerCase();

    return t.has(`paymentMethods.${methodKey}`) ? t(`paymentMethods.${methodKey}`) : methodValue;
  };

  // Показываем загрузку если данные еще загружаются
  if (isTerminalLoading || isTariffLoading || isProfileLoading) {
    return (
      <div className="max-w-[865px] mx-auto">
        <h3 className="text-[50px] text-[#0866FF] text-center leading-[120%] font-semibold">
          Загрузка...
        </h3>
      </div>
    );
  }

  // Проверяем наличие необходимых данных после загрузки
  if (!terminal || !terminal.locationId || !terminalLocation || selectedLocations.length === 0) {
    return (
      <div className="max-w-[865px] mx-auto flex flex-col gap-[50px]">
        <h3 className="text-[50px] text-[#0866FF] text-center leading-[120%] font-semibold">
          {t('errors.noData')}
        </h3>
        {/* Кнопка назад уже добавлена выше */}
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-[55px]">
      <div className="max-w-3xl mx-auto flex flex-col gap-[50px]">
        {/* Анимация ожидания водителя - абсолютное позиционирование */}
        {isLoading && (
          <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-6">
            <div className="w-[600px] h-[600px]">
              <Lottie
                animationData={rideAnimation}
                loop
                autoplay
                style={{ width: '100%', height: '100%' }}
              />
            </div>
            <div className="text-center">
              <h3 className="text-[42px] text-[#0866FF] font-bold mb-2">
                ОЖИДАЙТЕ У ТЕРМИНАЛА, ИДЕТ ПОИСК ВОДИТЕЛЯ
              </h3>
              <p className="text-[24px] text-[#666666]">
                Пожалуйста, подождите. Это займет несколько секунд.
              </p>
            </div>
          </div>
        )}

        {/* Заголовок и описание */}
        <div className="text-center flex flex-col gap-[10px]">
          <h3 className="text-[50px] text-[#090A0B] leading-[150%] font-bold">
            {isLoading ? t('waitingDriver') : t('title')}
          </h3>
        </div>

        {/* Локации */}
        <LocationContainer>
          <LocationItem locationName={terminalLocation.address} />
          {selectedLocations.map((location: GetLocationDTO, i: number) => (
            <React.Fragment key={location.id}>
              {i > 0 && <div className="border-b border-gray-200" />}
              <LocationItem
                location={location}
                disabled
              />
            </React.Fragment>
          ))}
        </LocationContainer>

        {/* Блок с информацией о тарифе */}
        <div className="w-full h-36 bg-white/70 rounded-[36px] flex items-center pl-[50px]">
          <div className="flex items-center gap-[30px] w-full">
            <div className="text-black text-3xl font-semibold font-['Gilroy'] leading-[49.97px]">
              {/* {economyTariff?.name || "Эконом"} - {economyTariff?.serviceClass || "Economy"} */}
            </div>
            <div className="flex-1 flex justify-end">
              <div className="relative w-[302px] h-36">
                <Image 
                  src="/taxi-tariffs/sedan.png" 
                  alt="Sedan" 
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Сумма к оплате */}
        <div className="flex items-center justify-between">
          <h4 className="text-[64px] text-[#1E1E1E] leading-[90px] font-bold">
            {t('paymentAmount')}
          </h4>
          <span className="text-[74px] text-[#0866FF] leading-[90px] font-bold">
            {Math.round(calculatedPrice)}KGS
          </span>
        </div>

        {/* Выбор способа оплаты */}
        <div className="flex justify-center">
          <span className="text-[34px] text-[#1E1E1E] leading-[100%] font-medium">
            {t('selectPaymentMethod')}
          </span>
        </div>

        {/* Методы оплаты */}
        <div className="grid grid-cols-2 gap-[26px] items-center">
          {paymentMethods.map((item: { name: string; icon: React.ComponentType<{ isActive: boolean }>; value: PaymentMethod }) => (
            <button
              key={item.value}
              onClick={() => onMethodSelect(item.value)}
              disabled={isLoading}
              className={`h-[176px] flex items-center gap-3 px-[50px] cursor-pointer rounded-[30px] transition-all duration-200 ${
                method === item.value ? 'bg-[#0866FF]' : 'bg-[#F5F6F7]'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
            >
              <Suspense fallback={<div className="w-8 h-8" />}>
                <item.icon isActive={method === item.value} />
              </Suspense>
              <span
                className={`text-[38px] text-start leading-[100%] font-bold ${
                  item.value === method ? 'text-white bg-[#0866FF]' : 'text-[#0866FF] bg-[#F5F6F7]'
                }`}
              >
                {isLoading && method === item.value 
                  ? t('processing') 
                  : getTranslatedMethodName(item.name)
                }
              </span>
            </button>
          ))}
        </div>
        {/* Кнопка назад */}
        <div className='flex justify-center items-center'>
          <button
            onClick={handleBack}
            className={clsx(
              // Основные стили контейнера
              'w-[500px] h-32 relative rounded-[100px] backdrop-blur-md mx-auto',
              // Цвет фона с прозрачностью #00000059 ≈ bg-black/35
              'bg-black/35',
              // Состояния
              'transition-all duration-200',
              'hover:bg-black/40 active:bg-black/50',
              // Фокус
              'focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-transparent'
            )}
          >
            {/* Иконка стрелки строго слева */}
            <div className="absolute left-16 top-1/2 transform -translate-y-1/2">
              <ChevronLeftIcon 
                size={52} 
                className="text-white" 
              />
            </div>
            
            {/* Текст по центру */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-3xl font-medium font-['Gilroy'] leading-10">
              {t('back')}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

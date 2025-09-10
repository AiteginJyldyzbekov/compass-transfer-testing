'use client';

import clsx from 'clsx';
import Lottie from 'lottie-react';
import type { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React, { useState, useEffect, Suspense } from 'react';
import rideAnimation from '@shared/animated/lottie/Ride.json';
import { calculateDistance } from '@shared/components/map';
import { ChevronLeftIcon } from '@shared/icons';
import type { GetLocationDTO } from '@entities/locations';
import { useTerminalLocations } from '@entities/locations/context/TerminalLocationsContext';
import { usePaymentMethods, type PaymentMethod } from '@entities/orders/constants/paymentMethods';
import { useTerminalTariff } from '@entities/tariffs/context/TerminalTariffContext';
import { useTerminalData } from '@entities/users/context/TerminalDataContext';
import { useOrderSubmit } from '@features/orders/hooks/terminal-pay/useOrderSubmit';
import { CardPaymentModal } from '@features/orders/modals/CardPaymentModal';
import { QRPaymentModal } from '@features/orders/modals/QRPaymentModal';
import LocationContainer from '@widgets/location/ui/LocationContainer';
import LocationItem from '@widgets/location/ui/LocationItem';
import { FixedLanguageButtons } from '@widgets/header';

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

  // Рассчитываем общее расстояние поездки через OSRM API
  const [totalDistance, setTotalDistance] = useState(0);
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);
  
  useEffect(() => {
    if (!selectedLocations.length || !terminalLocation) {
      setTotalDistance(0);
      setIsCalculatingDistance(false);

      return;
    }

    const calculateRouteDistance = async () => {
      setIsCalculatingDistance(true);

      try {
        const routePoints = [
          { latitude: terminalLocation.latitude, longitude: terminalLocation.longitude },
          ...selectedLocations.map(loc => ({ latitude: loc.latitude, longitude: loc.longitude }))
        ];

        const { routingService } = await import('@shared/components/map/services/routingService');
        const { RouteType } = await import('@shared/components/map/types');
        
        const route = await routingService.buildRoute(routePoints, RouteType.FASTEST);

        setTotalDistance(route.distance);
      } catch {
        // Fallback к прямому расстоянию при ошибке OSRM
        const fallbackDistance = selectedLocations.reduce((total, location, index) => {
          const prevLocation = index === 0 ? terminalLocation : selectedLocations[index - 1];
          
          if (prevLocation && location.latitude && location.longitude && prevLocation.latitude && prevLocation.longitude) {
            return total + calculateDistance(prevLocation.latitude, prevLocation.longitude, location.latitude, location.longitude);
          }
          
          return total;
        }, 0);

        setTotalDistance(fallbackDistance);
      } finally {
        setIsCalculatingDistance(false);
      }
    };

    calculateRouteDistance();
  }, [selectedLocations, terminalLocation]);
  
  // Рассчитываем стоимость поездки
  const calculatedPrice = economyTariff ? 
    economyTariff.basePrice + (totalDistance / 1000) * (economyTariff.perKmPrice || 0) : 0;

  // eslint-disable-next-line no-console
  console.log('ТЕРМИНАЛ расчет цены:', {
    basePrice: economyTariff?.basePrice,
    perKmPrice: economyTariff?.perKmPrice,
    totalDistanceKm: (totalDistance / 1000).toFixed(2),
    calculatedPrice: calculatedPrice.toFixed(2),
    tariff: economyTariff?.name
  });

  // Используем хук для создания заказа
  const { 
    isLoading, 
    handleMethodSelect, 
    createOrderWithPayment,
    showCardModal,
    showQRModal,
    closeCardModal,
    closeQRModal,
    handleCardPaymentSuccess,
    handleCardPaymentCancel,
    handleQRPaymentSuccess,
    calculatedPrice: _hookCalculatedPrice
  } = useOrderSubmit({
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
        <div className="text-center">
          <p className="text-[24px] text-[#666666] mb-4">Отсутствуют данные:</p>
          <ul className="text-[20px] text-[#999999] text-left max-w-md mx-auto">
            {!terminal && <li>• Данные терминала</li>}
            {!terminal?.locationId && <li>• ID локации терминала</li>}
            {!terminalLocation && <li>• Локация терминала</li>}
            {selectedLocations.length === 0 && <li>• Выбранные локации</li>}
          </ul>
        </div>
        <button
          onClick={handleBack}
          className="mx-auto px-8 py-4 bg-blue-500 text-white rounded-lg text-[24px]"
        >
          Вернуться к выбору локаций
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col min-h-screen">
      <div className="max-w-3xl mx-auto flex flex-col gap-[50px] flex-1">
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

        {/* Основной контент */}
        <div className="flex flex-col gap-[50px] flex-1">
          {/* Заголовок и описание */}
          <div className="text-center flex flex-col gap-[10px]">
            <h3 className="text-[50px] text-[#090A0B] leading-[150%] font-bold">
              {isLoading ? t('waitingDriver') : t('title')}
            </h3>
          </div>

          {/* Локации с расстоянием */}
          <LocationContainer className="max-h-[403px] overflow-y-auto scrollbar-hide">
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
            
            {/* Блок с общим расстоянием маршрута */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="text-[27px] text-[#A3A5AE] leading-[150%]">
                Общее расстояние:
              </div>
              <div className="text-[27px] text-[#A3A5AE] leading-[150%]">
                {isCalculatingDistance ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#A3A5AE] border-t-transparent" />
                    <span>рассчитывается...</span>
                  </div>
                ) : (
                  `${Math.round(totalDistance / 1000)} км`
                )}
              </div>
            </div>
          </LocationContainer>

          {/* Блок с информацией о тарифе */}
          <div className="w-full h-36 bg-white/70 rounded-[36px] flex items-center pl-[50px]">
            <div className="flex items-center gap-[30px] w-full">
              <div className="text-black text-3xl font-semibold leading-[49.97px]" style={{ fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif' }}>
                {economyTariff?.name || "Эконом-тест"}
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
              {isCalculatingDistance ? (
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#0866FF] border-t-transparent" />
                  <span className="text-[32px]">рассчитывается...</span>
                </div>
              ) : (
                `${Math.round(calculatedPrice)}KGS`
              )}
            </span>
          </div>

        </div>

        {/* Способы оплаты и кнопка назад - прижаты к низу */}
        <div className="mt-auto pt-8 flex flex-col gap-8">
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
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-3xl font-medium leading-10" style={{ fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif' }}>
              {t('back')}
            </div>
          </button>
          </div>
        </div>
      </div>

      {/* Модалки оплаты */}
      <CardPaymentModal
        isOpen={showCardModal}
        amount={calculatedPrice}
        onClose={closeCardModal}
        onSuccess={handleCardPaymentSuccess}
        onCancel={handleCardPaymentCancel}
      />

      <QRPaymentModal
        isOpen={showQRModal}
        amount={calculatedPrice}
        onClose={closeQRModal}
        onSuccess={handleQRPaymentSuccess}
      />

      {/* Фиксированные кнопки языков и FAQ */}
      <FixedLanguageButtons />
    </div>
  );
};

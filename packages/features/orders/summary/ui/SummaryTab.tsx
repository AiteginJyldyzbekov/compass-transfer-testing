'use client';

import type { GetDriverDTO } from '@entities/users/interface';
import { useSummary } from '../hooks/useSummary';
import type { UseSummaryParams } from '../interfaces';
import { DriverInfoCard } from './DriverInfoCard';
import { PassengersInfoCard } from './PassengersInfoCard';
import { PriceInfoCard } from './PriceInfoCard';
import { RouteInfoCard } from './RouteInfoCard';
import { ServicesInfoCard } from './ServicesInfoCard';
import { TariffInfoCard } from './TariffInfoCard';

/**
 * Компонент SummaryTab для отображения всей сводной информации по заказу
 * Использует FSD-архитектуру с разделением на компоненты и хуки
 */
export function SummaryTabContent(props: UseSummaryParams) {
  // Используем хук для обработки всей логики
  const {
    routeInfo,
    priceInfo,
    // passengerInfo не используется в данном компоненте
    formatPrice,
  } = useSummary(props);

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Левая колонка */}
        <div>
          <RouteInfoCard 
            startLocation={routeInfo.startLocation}
            endLocation={routeInfo.endLocation}
            intermediatePoints={routeInfo.intermediatePoints}
            distance={routeInfo.distance}
          />
          
          <PriceInfoCard 
            basePrice={priceInfo.basePrice}
            distancePrice={priceInfo.distancePrice}
            totalPrice={priceInfo.totalPrice}
            formattedPrice={priceInfo.formattedPrice}
            isCustomPrice={priceInfo.isCustomPrice}
            handleCustomPriceChange={priceInfo.handleCustomPriceChange}
            toggleCustomPrice={priceInfo.toggleCustomPrice}
            showCustomPrice={props._mode === 'edit'}
          />

          {props._selectedServices.length > 0 && (
            <ServicesInfoCard 
              services={props._selectedServices}
              formatPrice={formatPrice}
            />
          )}
        </div>

        {/* Правая колонка */}
        <div>
          <TariffInfoCard tariff={props.selectedTariff} />

          <PassengersInfoCard passengers={props.passengers} />
          
          {props._mode === 'edit' && props._selectedDriver && (
            <DriverInfoCard 
              driver={props._selectedDriver as GetDriverDTO}
              onDriverChange={() => props._onTabChange && props._onTabChange('driver')}
            />
          )}
        </div>
      </div>
    </div>
  );
}

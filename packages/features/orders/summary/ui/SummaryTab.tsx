'use client';


import { useSummary } from '../hooks/useSummary';
import type { UseSummaryParams } from '../interfaces';
import { DriverInfoCard } from './DriverInfoCard';
import { PassengersInfoCard } from './PassengersInfoCard';
import { PriceInfoCard } from './PriceInfoCard';
import { RouteInfoCard } from './RouteInfoCard';
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
        </div>

        {/* Правая колонка */}
        <div>
          <TariffInfoCard tariff={props.selectedTariff} />

          <PassengersInfoCard passengers={props.passengers} />
          
          {props._mode === 'edit' && props._selectedDriver && (
            <DriverInfoCard 
              driver={{
                ...props._selectedDriver,
                phoneNumber: props._selectedDriver.phoneNumber || undefined,
                avatarUrl: props._selectedDriver.avatarUrl || undefined
              }}
              onDriverChange={() => props._onTabChange && props._onTabChange('driver')}
            />
          )}
        </div>
      </div>
    </div>
  );
}

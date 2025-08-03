import { DollarSign, Archive, Car, Zap, Crown, Star, Gem, Sparkles, Diamond } from 'lucide-react';
import { Badge } from '@shared/ui/data-display/badge';
import { Card, CardContent } from '@shared/ui/layout';
import type { GetTariffDTOWithArchived } from '@entities/tariffs/interface';
import { ServiceClass, ServiceClassValues, CarType, CarTypeValues } from '@entities/tariffs/enums';

interface TariffViewHeaderProps {
  tariff: GetTariffDTOWithArchived;
}

// Иконки для классов обслуживанияо
const serviceClassIcons: Record<ServiceClass, React.ComponentType<{ className?: string }>> = {
  [ServiceClass.Economy]: Car,
  [ServiceClass.Comfort]: Zap,
  [ServiceClass.ComfortPlus]: Star,
  [ServiceClass.Business]: Crown,
  [ServiceClass.Premium]: Gem,
  [ServiceClass.Vip]: Sparkles,
  [ServiceClass.Luxury]: Diamond,
};

export function TariffViewHeader({ tariff }: TariffViewHeaderProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'KGS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };

  return (
    <Card>
      <CardContent className='p-6'>
        <div className='flex items-start justify-between'>
          <div className='flex items-start gap-4'>
            {/* Иконка класса обслуживания */}
            <div className='flex-shrink-0'>
              <div className='w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center'>
                {(() => {
                  const IconComponent = serviceClassIcons[tariff.serviceClass as ServiceClass];
                  return IconComponent ? <IconComponent className='h-8 w-8 text-blue-600' /> : <Car className='h-8 w-8 text-blue-600' />;
                })()}
              </div>
            </div>

            {/* Основная информация */}
            <div className='flex-1 min-w-0'>
              <div className='flex items-center gap-3 mb-2'>
                <h1 className='text-2xl font-bold text-gray-900 truncate'>
                  {tariff.name}
                </h1>
                <Badge variant={tariff.archived ? 'secondary' : 'default'}>
                  {tariff.archived ? 'Архивирован' : 'Активен'}
                </Badge>
              </div>

              <div className='flex items-center gap-2 text-gray-600 mb-2'>
                <DollarSign className='h-4 w-4 flex-shrink-0' />
                <span className='text-sm'>Базовая цена: {formatPrice(tariff.basePrice)}</span>
              </div>

              <div className='flex items-center gap-4 text-sm text-gray-500'>
                <div className='flex items-center gap-1'>
                  <span className='font-medium'>Класс:</span>
                  <span>{ServiceClassValues[tariff.serviceClass as ServiceClass] || tariff.serviceClass}</span>
                </div>
                <div className='flex items-center gap-1'>
                  <span className='font-medium'>Тип авто:</span>
                  <span>{CarTypeValues[tariff.carType as CarType] || tariff.carType}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}

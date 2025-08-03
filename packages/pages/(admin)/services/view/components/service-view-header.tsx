import { DollarSign, Settings } from 'lucide-react';
import { Badge } from '@shared/ui/data-display/badge';
import { Card, CardContent } from '@shared/ui/layout';
import type { GetServiceDTO } from '@entities/services/interface';

interface ServiceViewHeaderProps {
  service: GetServiceDTO;
}

export function ServiceViewHeader({ service }: ServiceViewHeaderProps) {
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
            {/* Иконка услуги */}
            <div className='flex-shrink-0'>
              <div className='w-16 h-16 rounded-full bg-green-100 flex items-center justify-center'>
                <Settings className='h-8 w-8 text-green-600' />
              </div>
            </div>

            {/* Основная информация */}
            <div className='flex-1 min-w-0'>
              <div className='flex items-center gap-3 mb-2'>
                <h1 className='text-2xl font-bold text-gray-900 truncate'>
                  {service.name}
                </h1>
                <Badge variant='default'>
                  Услуга
                </Badge>
              </div>

              <div className='flex items-center gap-2 text-gray-600 mb-2'>
                <DollarSign className='h-4 w-4 flex-shrink-0' />
                <span className='text-sm'>Цена: {formatPrice(service.price)}</span>
              </div>

              {service.description && (
                <div className='text-sm text-gray-500 max-w-2xl'>
                  {service.description}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

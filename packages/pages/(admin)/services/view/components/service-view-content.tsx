import { DollarSign, FileText, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/layout';
import type { GetServiceDTO } from '@entities/services/interface';

interface ServiceViewContentProps {
  service: GetServiceDTO;
}

export function ServiceViewContent({ service }: ServiceViewContentProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'KGS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };

  return (
    <div className='space-y-6'>
      {/* Основная информация */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Info className='h-5 w-5' />
            Информация об услуге
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Название */}
            <div>
              <label className='text-sm font-medium text-gray-500'>Название услуги</label>
              <p className='text-lg font-semibold text-gray-900 mt-1'>{service.name}</p>
            </div>

            {/* Цена */}
            <div>
              <label className='text-sm font-medium text-gray-500'>Стоимость</label>
              <p className='text-lg font-semibold text-gray-900 mt-1'>{formatPrice(service.price)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Описание */}
      {service.description && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <FileText className='h-5 w-5' />
              Описание
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='prose prose-sm max-w-none'>
              <p className='text-gray-700 leading-relaxed whitespace-pre-wrap'>
                {service.description}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Детали услуги */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <DollarSign className='h-5 w-5' />
            Детали услуги
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
              <div className='flex items-start gap-3'>
                <div className='flex-shrink-0'>
                  <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center'>
                    <DollarSign className='h-4 w-4 text-blue-600' />
                  </div>
                </div>
                <div>
                  <h4 className='font-medium text-blue-900 mb-1'>Стоимость услуги</h4>
                  <p className='text-blue-700 text-sm'>
                    Фиксированная стоимость услуги составляет {formatPrice(service.price)}
                  </p>
                </div>
              </div>
            </div>

            <div className='bg-gray-50 border border-gray-200 rounded-lg p-4'>
              <div className='flex items-start gap-3'>
                <div className='flex-shrink-0'>
                  <div className='w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center'>
                    <Info className='h-4 w-4 text-gray-600' />
                  </div>
                </div>
                <div>
                  <h4 className='font-medium text-gray-900 mb-1'>Дополнительная информация</h4>
                  <p className='text-gray-600 text-sm'>
                    Данная услуга может быть добавлена к заказу и будет включена в общую стоимость поездки.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { Skeleton } from '@shared/ui/data-display/skeleton';
import { Card, CardContent, CardHeader } from '@shared/ui/layout';

export function TariffViewLoading() {
  return (
    <div className='pr-2 border rounded-2xl overflow-hidden shadow-sm h-full bg-white flex flex-col gap-6 p-6'>
      {/* Заголовок */}
      <Card>
        <CardContent className='p-6'>
          <div className='flex items-start gap-4'>
            <Skeleton className='w-16 h-16 rounded-full' />
            <div className='flex-1 space-y-2'>
              <Skeleton className='h-8 w-64' />
              <Skeleton className='h-4 w-48' />
              <Skeleton className='h-4 w-32' />
            </div>
            <div className='space-y-2'>
              <Skeleton className='h-6 w-16' />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Двухколоночный layout */}
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
        {/* Левая колонка */}
        <div className='lg:col-span-3 space-y-6'>
          {/* Ценообразование */}
          <Card>
            <CardHeader>
              <Skeleton className='h-6 w-48' />
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className='space-y-2'>
                    <Skeleton className='h-4 w-24' />
                    <Skeleton className='h-6 w-20' />
                    <Skeleton className='h-3 w-32' />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Время ожидания */}
          <Card>
            <CardHeader>
              <Skeleton className='h-6 w-40' />
            </CardHeader>
            <CardContent className='space-y-2'>
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-6 w-24' />
              <Skeleton className='h-3 w-48' />
            </CardContent>
          </Card>

          {/* Характеристики */}
          <Card>
            <CardHeader>
              <Skeleton className='h-6 w-48' />
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className='space-y-2'>
                    <Skeleton className='h-4 w-24' />
                    <Skeleton className='h-5 w-20' />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Расчет стоимости */}
          <Card>
            <CardHeader>
              <Skeleton className='h-6 w-56' />
            </CardHeader>
            <CardContent className='space-y-3'>
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className='h-4 w-full' />
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Правая колонка */}
        <div className='lg:col-span-1'>
          <Card>
            <CardHeader>
              <Skeleton className='h-6 w-20' />
            </CardHeader>
            <CardContent className='space-y-3'>
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className='h-10 w-full' />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { Skeleton } from '@shared/ui/data-display/skeleton';
import { Card, CardContent, CardHeader } from '@shared/ui/layout';

export function InstantOrderViewLoading() {
  return (
    <div className='pr-2 border rounded-2xl overflow-hidden shadow-sm h-full bg-white flex flex-col gap-6 p-6 overflow-y-auto'>
      {/* Заголовок */}
      <Card>
        <CardContent className='p-6'>
          <div className='flex items-start gap-4'>
            <Skeleton className='w-16 h-16 rounded-full' />
            <div className='flex-1 space-y-2'>
              <Skeleton className='h-8 w-64' />
              <Skeleton className='h-4 w-48' />
              <Skeleton className='h-4 w-80' />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Двухколоночный layout */}
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
        {/* Левая колонка - основная информация (3/4 ширины) */}
        <div className='lg:col-span-3 space-y-6'>
          <Card>
            <CardHeader>
              <Skeleton className='h-6 w-32' />
            </CardHeader>
            <CardContent>
              <Skeleton className='h-32 w-full' />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className='h-6 w-32' />
            </CardHeader>
            <CardContent>
              <Skeleton className='h-24 w-full' />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className='h-6 w-32' />
            </CardHeader>
            <CardContent>
              <Skeleton className='h-40 w-full' />
            </CardContent>
          </Card>
        </div>

        {/* Правая колонка - кнопки действий (1/4 ширины) */}
        <div className='lg:col-span-1'>
          <Card>
            <CardHeader>
              <Skeleton className='h-6 w-20' />
            </CardHeader>
            <CardContent className='space-y-3'>
              <Skeleton className='h-10 w-full' />
              <Skeleton className='h-10 w-full' />
              <Skeleton className='h-10 w-full' />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@shared/ui/data-display/skeleton';

// Динамический импорт LeafletMap для избежания SSR ошибок
const LeafletMapComponent = dynamic(
  () => import('./index').then(mod => ({ default: mod.LeafletMap })),
  {
    ssr: false,
    loading: () => (
      <div className='w-full h-full flex items-center justify-center bg-gray-100 rounded-lg'>
        <div className='flex flex-col items-center gap-2'>
          <Skeleton className='h-8 w-8 rounded-full' />
          <p className='text-sm text-gray-500'>Загрузка карты...</p>
        </div>
      </div>
    ),
  },
);

// Экспортируем как LeafletMap для обратной совместимости
export const LeafletMap = LeafletMapComponent;
export default LeafletMapComponent;

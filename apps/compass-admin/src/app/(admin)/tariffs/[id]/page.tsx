'use client';

import { use } from 'react';

interface ViewTariffPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ViewTariffPage({ params }: ViewTariffPageProps) {
  const { id } = use(params);
  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='text-center'>
        <h1 className='text-2xl font-bold mb-4'>Просмотр тарифа</h1>
        <p className='text-muted-foreground mb-4'>ID тарифа: {id}</p>
        <p className='text-blue-600'>Страница просмотра тарифов находится в разработке</p>
      </div>
    </div>
  );
}

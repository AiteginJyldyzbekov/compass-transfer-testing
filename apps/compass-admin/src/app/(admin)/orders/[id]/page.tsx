'use client';

interface ViewOrderPageProps {
  params: {
    id: string;
  };
}

export default function ViewOrderPage({ params }: ViewOrderPageProps) {
  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='text-center'>
        <h1 className='text-2xl font-bold mb-4'>Просмотр заказа</h1>
        <p className='text-muted-foreground mb-4'>ID заказа: {params.id}</p>
        <p className='text-blue-600'>Страница просмотра заказов находится в разработке</p>
      </div>
    </div>
  );
}

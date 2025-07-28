'use client';

interface EditOrderPageProps {
  params: {
    id: string;
  };
}

export default function EditOrderPage({ params }: EditOrderPageProps) {
  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='text-center'>
        <h1 className='text-2xl font-bold mb-4'>Редактирование заказа</h1>
        <p className='text-muted-foreground mb-4'>ID заказа: {params.id}</p>
        <p className='text-yellow-600'>Страница редактирования заказов находится в разработке</p>
      </div>
    </div>
  );
}

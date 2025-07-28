'use client';

interface ViewCarPageProps {
  params: {
    id: string;
  };
}

export default function ViewCarPage({ params }: ViewCarPageProps) {
  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='text-center'>
        <h1 className='text-2xl font-bold mb-4'>Просмотр автомобиля</h1>
        <p className='text-muted-foreground mb-4'>ID автомобиля: {params.id}</p>
        <p className='text-blue-600'>Страница просмотра автомобилей находится в разработке</p>
      </div>
    </div>
  );
}

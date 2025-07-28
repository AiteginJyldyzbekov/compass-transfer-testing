'use client';

interface ViewServicePageProps {
  params: {
    id: string;
  };
}

export default function ViewServicePage({ params }: ViewServicePageProps) {
  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='text-center'>
        <h1 className='text-2xl font-bold mb-4'>Просмотр услуги</h1>
        <p className='text-muted-foreground mb-4'>ID услуги: {params.id}</p>
        <p className='text-blue-600'>Страница просмотра услуг находится в разработке</p>
      </div>
    </div>
  );
}

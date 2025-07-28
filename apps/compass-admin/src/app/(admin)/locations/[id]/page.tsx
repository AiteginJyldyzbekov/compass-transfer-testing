'use client';

interface ViewLocationPageProps {
  params: {
    id: string;
  };
}

export default function ViewLocationPage({ params }: ViewLocationPageProps) {
  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='text-center'>
        <h1 className='text-2xl font-bold mb-4'>Просмотр локации</h1>
        <p className='text-muted-foreground mb-4'>ID локации: {params.id}</p>
        <p className='text-blue-600'>Страница просмотра локаций находится в разработке</p>
      </div>
    </div>
  );
}

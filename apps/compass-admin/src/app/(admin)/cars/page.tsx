import { CarsTable } from '@features/cars';
import { CreateCarButton } from './create-car-button';

export default async function CarsPage({
  searchParams,
}: {
  searchParams: Promise<{ 
    make?: string;
    model?: string;
    status?: string;
    type?: string;
    serviceClass?: string;
  }>;
}) {
  const params = await searchParams;

  return (
    <div className='flex flex-col border rounded-2xl h-full overflow-hidden pr-2 bg-white'>
      <div className='flex flex-col overflow-y-auto pl-4 pr-2 py-4'>
        <div className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between'>
          <div className='flex flex-col'>
            <h1 className='text-3xl font-bold tracking-tight'>Автомобили</h1>
            <p className='text-muted-foreground'>Управление автопарком системы</p>
          </div>

          <CreateCarButton />
        </div>

        <CarsTable initialFilters={params} />
      </div>
    </div>
  );
}

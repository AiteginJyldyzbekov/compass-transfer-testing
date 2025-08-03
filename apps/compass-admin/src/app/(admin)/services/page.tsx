import { ServicesTable } from '@features/services';
import { CreateServiceButton } from './create-service-button';

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ 
    name?: string;
    priceFrom?: string;
    priceTo?: string;
    isQuantifiable?: string;
  }>;
}) {
  const params = await searchParams;

  return (
    <div className='flex flex-col border rounded-2xl h-full overflow-hidden pr-2 bg-white'>
      <div className='flex flex-col overflow-y-auto pl-4 pr-2 py-4'>
        <div className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between'>
          <div className='flex flex-col'>
            <h1 className='text-3xl font-bold tracking-tight'>Услуги</h1>
            <p className='text-muted-foreground'>Управление услугами системы</p>
          </div>

          <CreateServiceButton />
        </div>

        <ServicesTable initialFilters={params} />
      </div>
    </div>
  );
}

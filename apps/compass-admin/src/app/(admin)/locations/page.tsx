import { LocationsTable } from '@features/locations';
import { CreateLocationButton } from './create-location-button';

export default async function LocationsPage({
  searchParams,
}: {
  searchParams: Promise<{
    type?: string;
    city?: string;
    region?: string;
    isActive?: string;
    popular1?: string;
  }>;
}) {
  const params = await searchParams;

  return (
    <div className='flex flex-col border rounded-2xl h-full overflow-hidden pr-2 bg-white'>
      <div className='flex flex-col overflow-y-auto pl-4 pr-2 py-4'>
        <div className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between'>
          <div className='flex flex-col'>
            <h1 className='text-3xl font-bold tracking-tight'>Локации</h1>
            <p className='text-muted-foreground'>Управление локациями системы</p>
          </div>

          <CreateLocationButton />
        </div>

        <LocationsTable initialFilters={params} />
      </div>
    </div>
  );
}

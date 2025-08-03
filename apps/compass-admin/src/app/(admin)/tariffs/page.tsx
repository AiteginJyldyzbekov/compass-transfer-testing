import { TariffsTable } from '@features/tariffs';
import { CreateTariffButton } from './create-tariff-button';

export default async function TariffsPage({
  searchParams,
}: {
  searchParams: Promise<{ 
    name?: string;
    serviceClass?: string;
    carType?: string;
    archived?: string;
  }>;
}) {
  const params = await searchParams;

  return (
    <div className='flex flex-col border rounded-2xl h-full overflow-hidden pr-2 bg-white'>
      <div className='flex flex-col overflow-y-auto pl-4 pr-2 py-4'>
        <div className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between'>
          <div className='flex flex-col'>
            <h1 className='text-3xl font-bold tracking-tight'>Тарифы</h1>
            <p className='text-muted-foreground'>Управление тарифами системы</p>
          </div>

          <CreateTariffButton />
        </div>

        <TariffsTable initialFilters={params} />
      </div>
    </div>
  );
}

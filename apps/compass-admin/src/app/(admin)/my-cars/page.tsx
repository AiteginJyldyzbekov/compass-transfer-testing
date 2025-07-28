import { Metadata } from 'next';
import { MyCarsView } from '@pages/(admin)/my-cars';

export const metadata: Metadata = {
  title: 'Мои автомобили',
  description: 'Управление автомобилями водителя',
};

export default function MyCarsPage() {
  return (
    <div className='container p-4 pr-2 border rounded-2xl overflow-hidden shadow-sm h-full bg-white'>
      <div className='overflow-y-auto h-full pr-2'>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Мои автомобили</h1>
            <p className='text-muted-foreground'>
              Просмотр и управление назначенными автомобилями
            </p>
          </div>
        </div>

        <MyCarsView />
      </div>
    </div>
  );
}

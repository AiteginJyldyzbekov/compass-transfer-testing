import { SectionCards } from '@features/dashboard/ui/section-cards';
import { ChartAreaInteractive } from '@widgets/charts';

export default function Page() {
  return (
    <div className='h-full flex flex-1 flex-col gap-2 border rounded-2xl overflow-hidden pr-2 bg-white'>
      <div className='flex flex-col gap-4 overflow-y-auto py-4'>
        <SectionCards />
        <div className='pl-4 pr-2'>
          <ChartAreaInteractive />
        </div>
      </div>
    </div>
  );
}

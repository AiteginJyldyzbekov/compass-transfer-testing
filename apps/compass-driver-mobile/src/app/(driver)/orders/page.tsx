import { ScheduledRidesList } from '@features/active-ride';

export default function OrdersPage() {
  return (
    <div className='min-h-full bg-gray-50 p-4'>
      <div className='max-w-md mx-auto'>
        {/* Заголовок */}
        <div className='mb-6'>
          <h1 className='text-2xl font-bold text-gray-900'>
            Мои заказы
          </h1>
          <p className='text-gray-600 mt-1'>
            Запланированные и принятые поездки
          </p>
        </div>

        {/* Список запланированных поездок */}
        <ScheduledRidesList />
      </div>
    </div>
  );
}

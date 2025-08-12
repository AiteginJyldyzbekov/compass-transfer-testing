import { Package } from 'lucide-react';

export default function OrdersPage() {
  return (
    <div className='min-h-full bg-gray-50 p-4'>
      <div className='max-w-md mx-auto'>
        {/* Заголовок */}
        <div className='mb-6'>
          <h1 className='text-2xl font-bold text-gray-900 flex items-center'>
            Мои заказы
          </h1>
        </div>

        {/* Пустое состояние */}
        <div className='bg-white rounded-2xl p-8 text-center shadow-sm'>
          <Package className='w-16 h-16 text-gray-300 mx-auto mb-4' />
          <h2 className='text-lg font-semibold text-gray-900 mb-2'>
            Пока нет заказов
          </h2>
          <p className='text-gray-500'>
            Ваши активные и завершенные заказы будут отображаться здесь
          </p>
        </div>
      </div>
    </div>
  );
}

import { TrendingUp } from 'lucide-react';

export default function StatsPage() {
  return (
    <div className='min-h-full bg-gray-50 p-4'>
      <div className='max-w-md mx-auto'>
        {/* Заголовок */}
        <div className='mb-6'>
          <h1 className='text-2xl font-bold text-gray-900 flex items-center'>
            Статистика
          </h1>
        </div>

        {/* Карточки статистики */}
        <div className='space-y-4'>
          {/* Пустое состояние */}
          <div className='bg-white rounded-2xl p-8 text-center shadow-sm mt-6'>
            <TrendingUp className='w-16 h-16 text-gray-300 mx-auto mb-4' />
            <h2 className='text-lg font-semibold text-gray-900 mb-2'>
              Начните работать
            </h2>
            <p className='text-gray-500'>
              Принимайте заказы, чтобы увидеть подробную статистику
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Users } from 'lucide-react';

export default function ChatPage() {
  return (
    <div className='min-h-full bg-gray-50 p-4'>
      <div className='max-w-md mx-auto'>
        {/* Заголовок */}
        <div className='mb-6'>
          <h1 className='text-2xl font-bold text-gray-900 flex items-center'>
            Чат
          </h1>
        </div>

        {/* Пустое состояние */}
        <div className='bg-white rounded-2xl p-8 text-center shadow-sm'>
          <Users className='w-16 h-16 text-gray-300 mx-auto mb-4' />
          <h2 className='text-lg font-semibold text-gray-900 mb-2'>
            Нет активных чатов
          </h2>
          <p className='text-gray-500'>
            Чаты с диспетчером и клиентами появятся здесь
          </p>
        </div>
      </div>
    </div>
  );
}

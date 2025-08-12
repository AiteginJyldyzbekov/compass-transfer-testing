'use client';

import { useIncomingOrder } from '../context/incoming-order-context';
import type { GetOrderDTO } from '@entities/orders/interface/GetOrderDTO';

export function TestOrderButton() {
  const { showOrder } = useIncomingOrder();

  const handleTestOrder = () => {
    // Создаем тестовый заказ для демонстрации
    const testOrder: GetOrderDTO = {
      id: 'test-order-123',
      orderNumber: '12345',
      type: 'Instant',
      status: 'Searching',
      createdAt: new Date().toISOString(),
      scheduledTime: null,
      customerId: 'customer-123',
      creatorId: 'creator-123',
      services: [],
      // Добавляем базовые поля, которые могут потребоваться
    } as GetOrderDTO;

    showOrder(testOrder);
  };

  // Показываем кнопку только в development режиме
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <button
      onClick={handleTestOrder}
      className='fixed bottom-20 right-4 z-50 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-700 text-sm font-medium'
    >
      🧪 Тест заказа
    </button>
  );
}

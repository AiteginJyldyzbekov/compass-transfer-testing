'use client';

import { useRouter } from 'next/navigation';
import { InstantOrderFormView } from '@pages/(admin)/orders/create/instant-order-form-view';
import { useInstantOrderFormLogic } from '@features/orders/hooks/instant';

export default function CreateInstantOrderPage() {
  const router = useRouter();

  const logic = useInstantOrderFormLogic({
    mode: 'create',
  });

  // Пока новые хуки не полностью готовы, используем заглушку
  if (logic.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Загрузка формы...</p>
        </div>
      </div>
    );
  }

  if (logic.loadingError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Ошибка: {logic.loadingError}</p>
          <button
            onClick={() => router.push('/orders')}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Назад к заказам
          </button>
        </div>
      </div>
    );
  }

  // TODO: Интегрировать новые хуки с InstantOrderFormView
  // Пока возвращаем заглушку
  return (
    <div className="container mx-auto py-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Создание мгновенного заказа</h1>
        <p className="text-muted-foreground mb-6">
          Новые хуки загружены успешно! Интеграция с формой в процессе разработки.
        </p>
        <button
          onClick={() => router.push('/orders')}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          Назад к заказам
        </button>
      </div>
    </div>
  );
}

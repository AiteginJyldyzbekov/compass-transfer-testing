'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { OrderDetailPage } from '@pages/(driver-mobile)/order';
import { orderService } from '@shared/api/orders';
import type { GetOrderDTO } from '@entities/orders/interface/GetOrderDTO';

export default function OrderPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  
  const [order, setOrder] = useState<GetOrderDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Пробуем получить мгновенный заказ
        const orderData = await orderService.getInstantOrder(orderId);
        setOrder(orderData);
      } catch (err) {
        console.error('Ошибка при загрузке заказа:', err);
        setError('Не удалось загрузить данные заказа');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className='min-h-full bg-gray-50 flex items-center justify-center p-4'>
        <div className='text-center'>
          <div className='w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4' />
          <p className='text-gray-600'>Загрузка заказа...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className='min-h-full bg-gray-50 flex items-center justify-center p-4'>
        <div className='text-center'>
          <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
            <span className='text-red-600 text-2xl'>⚠️</span>
          </div>
          <h2 className='text-lg font-semibold text-gray-900 mb-2'>
            Ошибка загрузки
          </h2>
          <p className='text-gray-600 mb-4'>
            {error || 'Заказ не найден'}
          </p>
          <button
            onClick={handleBack}
            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
          >
            Назад
          </button>
        </div>
      </div>
    );
  }

  return <OrderDetailPage order={order} onBack={handleBack} />;
}

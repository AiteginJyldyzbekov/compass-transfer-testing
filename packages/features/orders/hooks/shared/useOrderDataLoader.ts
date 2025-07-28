'use client';

import { useState, useEffect } from 'react';

interface UseOrderDataLoaderReturn<T> {
  orderData: T | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Универсальный хук для загрузки данных заказа
 */
export const useOrderDataLoader = <TSource, TTarget>(
  id?: string,
  mode?: string,
  loadFunction?: (id: string) => Promise<TSource>,
  transformer?: (data: TSource) => TTarget,
): UseOrderDataLoaderReturn<TTarget> => {
  const [orderData, setOrderData] = useState<TTarget | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      // Только в режиме редактирования и если есть ID
      if (mode !== 'edit' || !id || !loadFunction || !transformer) {
        setOrderData(null);

        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const data = await loadFunction(id);
        const transformedData = transformer(data);
        
        setOrderData(transformedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки данных заказа');
        setOrderData(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id, mode, loadFunction, transformer]);

  return {
    orderData,
    isLoading,
    error,
  };
};

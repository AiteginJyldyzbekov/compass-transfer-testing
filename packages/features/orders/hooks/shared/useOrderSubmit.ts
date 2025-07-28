'use client';

import { useState, useCallback } from 'react';

export interface OrderSubmitOptions {
  mode: 'create' | 'edit';
  id?: string;
  onSuccess?: (orderId?: string) => void;
  onCancel?: () => void;
}

interface UseOrderSubmitReturn<T> {
  handleSubmit: (data: T) => Promise<void>;
  handleCancel: () => void;
  isLoading: boolean;
  error: string | null;
}

/**
 * Универсальный хук для отправки данных заказа
 */
export const useOrderSubmit = <T>(
  submitFunction: (data: T, options: OrderSubmitOptions) => Promise<{ id?: string }>,
  options: OrderSubmitOptions,
): UseOrderSubmitReturn<T> => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (data: T) => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await submitFunction(data, options);
        
        if (options.onSuccess) {
          options.onSuccess(result.id);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка при отправке';
        
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [submitFunction, options],
  );

  const handleCancel = useCallback(() => {
    if (options.onCancel) {
      options.onCancel();
    }
  }, [options]);

  return {
    handleSubmit,
    handleCancel,
    isLoading,
    error,
  };
};

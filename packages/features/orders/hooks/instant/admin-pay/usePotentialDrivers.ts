'use client';

import { useState, useCallback } from 'react';
import { orderService } from '@shared/api/orders';
import type { GetPotentialDriverDTO } from '@entities/orders/interface/GetPotentialDriverDTO';

export const usePotentialDrivers = (orderId?: string) => {
  const [drivers, setDrivers] = useState<GetPotentialDriverDTO[]>([]);
  const [isLoading, setLoading] = useState(false);
  const load = useCallback(async () => {
    if (!orderId) return;
    setLoading(true);
    try {
      const data = await orderService.getPotentialDrivers(orderId);

      setDrivers(data);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  return { drivers, isLoading, load };
};

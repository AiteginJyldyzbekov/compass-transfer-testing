'use client';

import { useState } from 'react';
import type { CreatePartnerRouteData } from '@entities/routes/interface/PartnerRouteDTO';

interface UseUpdatePartnerRouteSheetReturn {
  isOpen: boolean;
  routeId: string | null;
  initialPrice: number;
  openSheet: (routeId?: string, initialPrice?: number) => void;
  closeSheet: () => void;
  handleSave: (routeData: CreatePartnerRouteData) => void;
}

/**
 * Хук для управления sheet обновления маршрутов партнера
 */
export const useUpdatePartnerRouteSheet = (): UseUpdatePartnerRouteSheetReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [routeId, setRouteId] = useState<string | null>(null);
  const [initialPrice, setInitialPrice] = useState(0);

  const openSheet = (routeId?: string, initialPrice: number = 0) => {
    setRouteId(routeId || null);
    setInitialPrice(initialPrice);
    setIsOpen(true);
  };

  const closeSheet = () => {
    setIsOpen(false);
    setRouteId(null);
    setInitialPrice(0);
  };

  const handleSave = (routeData: CreatePartnerRouteData) => {
    // Здесь будет вызов API PUT /Route/Partner/self
    console.log('Сохранение маршрута:', {
      routeId,
      routeData,
    });

    // В реальном приложении здесь будет:
    // if (routeId) {
    //   // Обновление существующего маршрута
    //   await updatePartnerRoute(routeId, routeData);
    // } else {
    //   // Создание нового маршрута
    //   await createPartnerRoute(routeData);
    // }

    closeSheet();
  };

  return {
    isOpen,
    routeId,
    initialPrice,
    openSheet,
    closeSheet,
    handleSave,
  };
};

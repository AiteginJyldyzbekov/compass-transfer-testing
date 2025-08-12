'use client';

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { GetOrderDTO } from '@entities/orders/interface/GetOrderDTO';

interface IncomingOrderContextType {
  currentOrder: GetOrderDTO | null;
  isOrderModalOpen: boolean;
  showOrder: (order: GetOrderDTO) => void;
  hideOrder: () => void;
  acceptOrder: (orderId: string) => void;
}

const IncomingOrderContext = createContext<IncomingOrderContextType | undefined>(undefined);

interface IncomingOrderProviderProps {
  children: ReactNode;
  onOrderAccepted?: (orderId: string) => void;
}

export function IncomingOrderProvider({ children, onOrderAccepted }: IncomingOrderProviderProps) {
  const [currentOrder, setCurrentOrder] = useState<GetOrderDTO | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const showOrder = useCallback((order: GetOrderDTO) => {
    setCurrentOrder(order);
    setIsOrderModalOpen(true);
  }, []);

  const hideOrder = useCallback(() => {
    setIsOrderModalOpen(false);
    // Задержка перед очисткой заказа для анимации закрытия
    setTimeout(() => {
      setCurrentOrder(null);
    }, 200);
  }, []);

  const acceptOrder = useCallback((orderId: string) => {
    hideOrder();
    onOrderAccepted?.(orderId);
  }, [hideOrder, onOrderAccepted]);

  // Эффект для автоматического скрытия заказа через определенное время (например, 30 секунд)
  useEffect(() => {
    if (isOrderModalOpen && currentOrder) {
      const timer = setTimeout(() => {
        hideOrder();
      }, 30000); // 30 секунд

      return () => clearTimeout(timer);
    }
  }, [isOrderModalOpen, currentOrder, hideOrder]);

  const value: IncomingOrderContextType = {
    currentOrder,
    isOrderModalOpen,
    showOrder,
    hideOrder,
    acceptOrder,
  };

  return (
    <IncomingOrderContext.Provider value={value}>
      {children}
    </IncomingOrderContext.Provider>
  );
}

export function useIncomingOrder() {
  const context = useContext(IncomingOrderContext);
  if (context === undefined) {
    throw new Error('useIncomingOrder must be used within an IncomingOrderProvider');
  }
  return context;
}

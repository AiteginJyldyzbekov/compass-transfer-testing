'use client';

import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { TerminalOrder } from '@entities/order/interface';
import type { RideAcceptedNotificationDTO } from '@entities/ws/interface/RideAcceptedNotificationDTO';

interface TerminalReceiptContextType {
  receiptData: RideAcceptedNotificationDTO | null;
  orderData: TerminalOrder | null;
  setReceiptData: (data: RideAcceptedNotificationDTO) => void;
  setOrderData: (data: TerminalOrder) => void;
  clearReceiptData: () => void;
}

const TerminalReceiptContext = createContext<TerminalReceiptContextType | null>(null);

interface TerminalReceiptProviderProps {
  children: ReactNode;
}

export const TerminalReceiptProvider: React.FC<TerminalReceiptProviderProps> = ({ children }) => {
  const [receiptData, setReceiptData] = useState<RideAcceptedNotificationDTO | null>(null);
  const [orderData, setOrderData] = useState<TerminalOrder | null>(null);

  const clearReceiptData = () => {
    setReceiptData(null);
    setOrderData(null);
  };

  return (
    <TerminalReceiptContext.Provider
      value={{
        receiptData,
        orderData,
        setReceiptData,
        setOrderData,
        clearReceiptData,
      }}
    >
      {children}
    </TerminalReceiptContext.Provider>
  );
};

export const useTerminalReceipt = (): TerminalReceiptContextType => {
  const context = useContext(TerminalReceiptContext);
  
  if (!context) {
    throw new Error('useTerminalReceipt должен использоваться внутри TerminalReceiptProvider');
  }
  
  return context;
}; 
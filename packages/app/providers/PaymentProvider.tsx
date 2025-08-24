'use client';

import React, { useState, type ReactNode } from 'react';
import { PaymentContext, type PaymentSuccessHandler, type CardPaymentHandler } from '@shared/contexts/PaymentContext';

interface PaymentProviderProps {
  children: ReactNode;
}

export const PaymentProvider: React.FC<PaymentProviderProps> = ({ children }) => {
  const [paymentSuccessHandler, setPaymentSuccessHandler] = useState<PaymentSuccessHandler | null>(null);
  const [cardPaymentHandler, setCardPaymentHandler] = useState<CardPaymentHandler | null>(null);

  const triggerPaymentSuccess = async (paymentId: string) => {
    if (paymentSuccessHandler) {
      await paymentSuccessHandler(paymentId);
    }
  };

  return (
    <PaymentContext.Provider
      value={{
        paymentSuccessHandler,
        setPaymentSuccessHandler,
        cardPaymentHandler,
        setCardPaymentHandler,
        triggerPaymentSuccess,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

import { createContext, useContext } from 'react';

// Типы для обработчиков платежей
export type PaymentSuccessHandler = (paymentId: string) => Promise<void>;
export type CardPaymentHandler = () => Promise<void>;

export interface PaymentContextType {
  // Обработчик успешной QR оплаты
  paymentSuccessHandler: PaymentSuccessHandler | null;
  setPaymentSuccessHandler: (handler: PaymentSuccessHandler | null) => void;
  
  // Обработчик оплаты картой
  cardPaymentHandler: CardPaymentHandler | null;
  setCardPaymentHandler: (handler: CardPaymentHandler | null) => void;
  
  // Событие успешной оплаты
  triggerPaymentSuccess: (paymentId: string) => Promise<void>;
}

export const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const usePaymentContext = () => {
  const context = useContext(PaymentContext);
  
  if (context === undefined) {
    throw new Error('usePaymentContext must be used within a PaymentProvider');
  }

  return context;
};

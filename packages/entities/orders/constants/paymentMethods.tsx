import { useTranslations } from 'next-intl';
import { lazy } from 'react';

// Lazy импорты иконок
const CreditCardIcon = lazy(() => import('@shared/icons/CreditCardIcon'));
const QRCodeIcon = lazy(() => import('@shared/icons/QRCodeIcon'));

export type PaymentMethod = 'qrcode' | 'card';

export const usePaymentMethods = () => {
  const t = useTranslations('Payment');

  return [
    { 
      name: t('paymentMethods.qrcode'), 
      icon: QRCodeIcon, 
      value: 'qrcode' as PaymentMethod 
    },
    { 
      name: t('paymentMethods.card'), 
      icon: CreditCardIcon, 
      value: 'card' as PaymentMethod 
    },
  ];
}; 
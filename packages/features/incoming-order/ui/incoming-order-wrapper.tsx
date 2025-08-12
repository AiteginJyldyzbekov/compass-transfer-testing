'use client';

import { useIncomingOrder } from '../context/incoming-order-context';
import { IncomingOrderModal } from './incoming-order-modal';

export function IncomingOrderWrapper() {
  const { currentOrder, isOrderModalOpen, hideOrder, acceptOrder } = useIncomingOrder();

  if (!currentOrder) {
    return null;
  }

  return (
    <IncomingOrderModal
      order={currentOrder}
      isOpen={isOrderModalOpen}
      onClose={hideOrder}
      onAccept={acceptOrder}
    />
  );
}

import { orderService } from '@shared/api/orders';
import type { GetOrderDTO } from '@entities/orders/interface';
import type { CreateInstantOrderDTOType } from '@entities/orders/schemas';
import { useOrderDataLoader } from '@features/orders/hooks/shared/useOrderDataLoader';

/**
 * Трансформер для преобразования GetOrderDTO в CreateInstantOrderDTOType
 * Вынесен за пределы компонента для стабильности ссылки
 */
const transformGetOrderToCreateInstant = (data: GetOrderDTO): CreateInstantOrderDTOType => {
  return {
    tariffId: data.tariffId || '',
    routeId: data.routeId,
    startLocationId: data.startLocationId,
    endLocationId: data.endLocationId,
    additionalStops: data.additionalStops,
    services: data.services.map(service => ({
      serviceId: service.serviceId,
      quantity: service.quantity,
      notes: service.notes,
    })),
    initialPrice: data.initialPrice,
    passengers: data.passengers.map(passenger => ({
      firstName: passenger.firstName,
      lastName: passenger.lastName ?? null, // Преобразуем undefined в null
      isMainPassenger: passenger.isMainPassenger,
      customerId: passenger.customerId,
    })),
  };
};

/**
 * Хук для загрузки данных мгновенного заказа в режиме редактирования
 */
export const useInstantOrderData = (id?: string, mode?: string) => {
  return useOrderDataLoader<GetOrderDTO, CreateInstantOrderDTOType>(
    id,
    mode,
    orderService.getInstantOrder.bind(orderService),
    transformGetOrderToCreateInstant,
  );
};

import { z } from 'zod';

/**
 * Схема валидации для перечисления OrderSubStatus
 */
export const OrderSubStatusSchema = z.enum(['SearchingDriver', 'DriverAssigned', 'DriverHeading', 'DriverArrived', 'RideStarted', 'RideFinished', 'PaymentPending', 'PaymentCompleted', 'ReviewPending', 'CancelledByClient', 'CancelledByDriver', 'CancelledBySystem', 'CancelledByOperator']);
/**
 * Тип, выведенный из схемы OrderSubStatusSchema
 */
export type OrderSubStatusType = z.infer<typeof OrderSubStatusSchema>;
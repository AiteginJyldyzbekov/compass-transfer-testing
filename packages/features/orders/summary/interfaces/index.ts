import type { RoutePoint } from '@shared/components/map/types';
import type { GetLocationDTO } from '@entities/locations/interface';
import type { GetPassengerDTO } from '@entities/orders/interface';
import type { GetServiceDTO } from '@entities/services/interface';
import type { GetTariffDTO } from '@entities/tariffs/interface';
import type { GetDriverDTO } from '@entities/users/interface';

/**
 * Расширенный пассажир для UI с дополнительными полями
 */
export interface UIPassenger extends GetPassengerDTO {
  phone?: string;
  phoneNumber?: string; // Для совместимости
  email?: string;
  age?: number;
  isFromSystem?: boolean;
}

/**
 * Расширенный сервис для UI с количеством
 */
export interface UISelectedService extends GetServiceDTO {
  quantity: number;
  totalPrice: number; // Цена с учетом количества
}

/**
 * Структура состояния маршрута
 */
export interface RouteState {
  startLocation?: GetLocationDTO | null;
  endLocation?: GetLocationDTO | null;
  intermediatePoints?: GetLocationDTO[];
  routePoints?: RoutePoint[];
}

/**
 * Структура для работы с ценами
 */
export interface PricingState {
  basePrice?: number;
  distancePrice?: number;
  totalPrice?: number;
}

/**
 * Методы формы для обновления данных
 */
export interface FormMethods {
  setValue: (name: string, value: unknown) => void;
  getValues: (name?: string) => unknown;
  [key: string]: unknown;
}

/**
 * Основные параметры хука useSummary
 */
export interface UseSummaryParams {
  selectedTariff: GetTariffDTO | null;
  _selectedServices: UISelectedService[];
  currentPrice: number;
  passengers: UIPassenger[];
  _routeLocations: GetLocationDTO[];
  routeState: RouteState;
  routeDistance?: number;
  _methods: FormMethods;
  _mode: 'create' | 'edit';
  _orderId?: string;
  _selectedDriver?: GetDriverDTO | null;
  _getDriverById?: (id: string) => GetDriverDTO | null;
  _updateDriverCache?: (id: string, data: GetDriverDTO) => void;
  useCustomPrice?: boolean;
  setUseCustomPrice?: (value: boolean) => void;
  customPrice?: string;
  setCustomPrice?: (value: string) => void;
  _onTabChange?: (tab: string) => void;
  _orderStatus?: string;
  _setOrderStatus?: (status: string) => void;
  _isInstantOrder?: boolean;
}

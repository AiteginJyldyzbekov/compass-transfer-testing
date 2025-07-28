/**
 * Интерфейс для маршрута партнера
 * Соответствует API GET /Route/Partner/{partner_id}
 */
export interface PartnerRouteDTO {
  /** ID начальной локации */
  startLocationId: string;
  /** ID конечной локации */
  endLocationId: string;
  /** Название маршрута */
  name: string;
  /** Популярный ли маршрут */
  isPopular: boolean;
  /** ID маршрута */
  id: string;
  /** Цена маршрута */
  price: number;
}

/**
 * Интерфейс для обновления маршрута партнера
 * Соответствует API PUT /Route/Partner/self
 */
export interface UpdatePartnerRouteDTO {
  /** ID маршрута */
  routeId: string;
  /** Цена маршрута */
  price: number;
}

/**
 * Данные для создания нового маршрута партнера
 */
export interface CreatePartnerRouteData {
  /** Начальная локация */
  startLocationId: string;
  /** Конечная локация */
  endLocationId: string;
  /** Цена маршрута */
  price: number;
}

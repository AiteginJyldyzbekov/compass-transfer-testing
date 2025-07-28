/**
 * Mock данные маршрутов партнера
 * Соответствует API GET /Route/Partner/{partner_id}
 */

export interface PartnerRouteDTO {
  startLocationId: string;
  endLocationId: string;
  name: string;
  isPopular: boolean;
  id: string;
  price: number;
}

/**
 * Mock маршруты для партнера
 */
export const mockPartnerRoutes: PartnerRouteDTO[] = [
  {
    id: '123e4567-e89b-12d3-a456-426614174001',
    name: 'Аэропорт - Центр',
    startLocationId: '550e8400-e29b-41d4-a716-446655440101', // Аэропорт Манас
    endLocationId: '550e8400-e29b-41d4-a716-446655440102', // Центр города
    price: 500,
    isPopular: true,
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174002',
    name: 'Центр - Ошский рынок',
    startLocationId: '550e8400-e29b-41d4-a716-446655440102', // Центр города
    endLocationId: '550e8400-e29b-41d4-a716-446655440201', // Ошский рынок
    price: 200,
    isPopular: true,
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174003',
    name: 'Восток - Запад',
    startLocationId: '550e8400-e29b-41d4-a716-446655440104', // Восточный район
    endLocationId: '550e8400-e29b-41d4-a716-446655440105', // Западный район
    price: 300,
    isPopular: false,
  },
];

/**
 * Mock функция для получения маршрутов партнера
 */
export const getMockPartnerRoutes = async (partnerId: string): Promise<PartnerRouteDTO[]> => {
  // Имитируем задержку API
  await new Promise(resolve => setTimeout(resolve, 500));

  // Возвращаем маршруты для любого партнера (в реальности фильтровались бы по partnerId)
  return mockPartnerRoutes;
};

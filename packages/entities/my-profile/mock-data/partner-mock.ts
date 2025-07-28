import { Role, ActivityStatus, BusinessType } from '@entities/users/enums';
import type { GetUserSelfProfilePartnerDTO } from '@entities/users/interface';

export const mockPartnerProfile: GetUserSelfProfilePartnerDTO = {
  id: '123e4567-e89b-12d3-a456-426614174002',
  email: 'partner@company.com',
  role: Role.Partner,
  phoneNumber: '+996 555 321 654',
  fullName: 'Сидоров Петр Александрович',
  avatarUrl: null,
  online: true,
  lastActive: new Date().toISOString(),
  status: ActivityStatus.Active,
  locationId: '550e8400-e29b-41d4-a716-446655440102', // Центр города
  profile: {
    companyName: 'ООО "Партнер Плюс"',
    companyType: BusinessType.LLC,
    registrationNumber: '1234567890123',
    taxIdentifier: '987654321',
    legalAddress: 'г. Бишкек, ул. Чуй 123',
    contactEmail: 'contact@partner-plus.kg',
    contactPhone: '+996 555 111 222',
    website: 'https://www.partner-plus.kg',
    partnerRoutes: [
      '123e4567-e89b-12d3-a456-426614174001', // Маршрут: Аэропорт - Центр
      '123e4567-e89b-12d3-a456-426614174002', // Маршрут: Центр - Ошский рынок
      '123e4567-e89b-12d3-a456-426614174003', // Маршрут: Восток - Запад
    ],
  },
};

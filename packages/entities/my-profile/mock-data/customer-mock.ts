import { Role, ActivityStatus } from '@entities/users/enums';
import type { GetUserSelfProfileCustomerDTO } from '@entities/users/interface';

export const mockCustomerProfile: GetUserSelfProfileCustomerDTO = {
  id: 'customer-001',
  email: 'customer@example.com',
  role: Role.Customer,
  phoneNumber: '+996 555 789 123',
  fullName: 'Кузнецова Мария Петровна',
  avatarUrl: null,
  online: true,
  lastActive: new Date().toISOString(),
  status: ActivityStatus.Active,
  locationId: null,
  profile: {
    registrationDate: '2023-08-15T00:00:00Z',
    totalOrders: 45,
    favoriteAddresses: [
      'г. Бишкек, ул. Чуй 123',
      'г. Бишкек, мкр. Джал 15-25',
    ],
    paymentMethods: ['card', 'cash'],
    rating: 4.9,
  },
};

import { Inbox } from 'lucide-react';
import { BusinessType, Role, ActivityStatus } from '@entities/users/enums';
import type { GetUserSelfProfilePartnerDTO } from '../interface';

/**
 * Mock данные для sidebar
 */
export const sidebarMockData = {
  user: {
    id: '123e4567-e89b-12d3-a456-426614174002',
    email: 'partner@company.com',
    fullName: 'Сидоров Петр Александрович',
    role: Role.Partner,
    phoneNumber: '+996 555 321 654',
    avatarUrl: null,
    online: true,
    lastActive: new Date().toISOString(),
    status: ActivityStatus.Active,
    locationId: null,
    profile: {
      companyName: 'ООО "Партнер Плюс"',
      companyType: BusinessType.LLC,
      registrationNumber: '1234567890123',
      taxIdentifier: '987654321',
      legalAddress: 'г. Бишкек, ул. Чуй 123',
      contactEmail: 'contact@partner-plus.kg',
      contactPhone: '+996 555 111 222',
      website: 'https://www.partner-plus.kg',
      partnerRoutes: [],
      commissionRate: 0.15,
      contractStartDate: '2023-01-01T00:00:00Z',
      contractEndDate: '2024-12-31T23:59:59Z',
      isActive: true,
    },
  } as GetUserSelfProfilePartnerDTO,
  company: {
    name: 'Compass Transfer',
    logo: Inbox,
    plan: 'Enterprise',
  },
};

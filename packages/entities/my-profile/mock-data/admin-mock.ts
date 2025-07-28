import { Role, ActivityStatus } from '@entities/users/enums';
import type { GetUserSelfProfileAdminDTO } from '@entities/users/interface';

export const mockAdminProfile: GetUserSelfProfileAdminDTO = {
  id: 'admin-001',
  email: 'admin@compass.local',
  role: Role.Admin,
  phoneNumber: '+996 555 123 456',
  fullName: 'Администратор Системы',
  avatarUrl: '/logo/LogoSmallBig.png',
  online: true,
  lastActive: new Date().toISOString(),
  status: ActivityStatus.Active,
  locationId: null,
  profile: {
    accessLevel: 'SUPER_ADMIN',
    department: 'IT',
    position: 'Системный администратор',
  },
};
